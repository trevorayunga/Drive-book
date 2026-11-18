import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCars } from '../services/cars';
import Cars from './Cars';

vi.mock('../services/cars', () => ({ getCars: vi.fn() }));

const cars = [
  { id: '1', make: 'Toyota', model: 'Corolla', year: 2020, type: 'Sedan', seats: 5, pricePerDay: 4500 },
  { id: '2', make: 'Nissan', model: 'X-Trail', year: 2018, type: 'SUV', seats: 5, pricePerDay: 8500 },
];

describe('Cars page', () => {
  beforeEach(() => {
    getCars.mockReset();
  });

  it('shows a loading message then the cars', async () => {
    getCars.mockResolvedValue(cars);
    render(<Cars />);
    expect(screen.getByText(/loading cars/i)).toBeInTheDocument();
    expect(await screen.findByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText('Nissan X-Trail')).toBeInTheDocument();
  });

  it('filters cars by type', async () => {
    getCars.mockResolvedValue(cars);
    render(<Cars />);
    await screen.findByText('Toyota Corolla');
    await userEvent.selectOptions(screen.getByLabelText('Car type'), 'SUV');
    expect(screen.queryByText('Toyota Corolla')).not.toBeInTheDocument();
    expect(screen.getByText('Nissan X-Trail')).toBeInTheDocument();
  });

  it('shows an empty message when there are no cars', async () => {
    getCars.mockResolvedValue([]);
    render(<Cars />);
    expect(await screen.findByText('No cars available.')).toBeInTheDocument();
  });

  it('shows an error when loading fails', async () => {
    getCars.mockRejectedValue(new Error('fail'));
    render(<Cars />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load cars/i);
  });
});