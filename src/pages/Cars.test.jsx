import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCars } from '../services/cars';
import Cars from './Cars';

vi.mock('../services/cars', () => ({ getCars: vi.fn() }));

const cars = [
  { id: '1', make: 'Toyota', model: 'Corolla', year: 2020, type: 'Sedan', seats: 5, pricePerDay: 4500 },
  { id: '2', make: 'Nissan', model: 'X-Trail', year: 2018, type: 'SUV', seats: 5, pricePerDay: 8500 },
];

const renderCars = () =>
  render(
    <MemoryRouter>
      <Cars />
    </MemoryRouter>
  );

describe('Cars page', () => {
  beforeEach(() => {
    getCars.mockReset();
  });

  it('shows a loading message then the cars', async () => {
    getCars.mockResolvedValue(cars);
    renderCars();
    expect(screen.getByText(/loading cars/i)).toBeInTheDocument();
    expect(await screen.findByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText('Nissan X-Trail')).toBeInTheDocument();
  });

  it('links each car to its booking page', async () => {
    getCars.mockResolvedValue(cars);
    renderCars();
    await screen.findByText('Toyota Corolla');
    const links = screen.getAllByRole('link', { name: 'Book now' });
    expect(links[0]).toHaveAttribute('href', '/cars/1/book');
  });

  it('filters cars by type', async () => {
    getCars.mockResolvedValue(cars);
    renderCars();
    await screen.findByText('Toyota Corolla');
    await userEvent.selectOptions(screen.getByLabelText('Car type'), 'SUV');
    expect(screen.queryByText('Toyota Corolla')).not.toBeInTheDocument();
    expect(screen.getByText('Nissan X-Trail')).toBeInTheDocument();
  });

  it('shows an empty message when there are no cars', async () => {
    getCars.mockResolvedValue([]);
    renderCars();
    expect(await screen.findByText('No cars available.')).toBeInTheDocument();
  });

  it('shows an error when loading fails', async () => {
    getCars.mockRejectedValue(new Error('fail'));
    renderCars();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load cars/i);
  });
});