import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMakes, getModels } from '../services/nhtsa';
import CarForm from './CarForm';

vi.mock('../services/nhtsa', () => ({ getMakes: vi.fn(), getModels: vi.fn() }));

const existing = {
  id: 'c1',
  make: 'Toyota',
  model: 'Vitz',
  year: 2018,
  type: 'Hatchback',
  pricePerDay: 3000,
  seats: 4,
  image: 'http://x/vitz.jpg',
};

const fillRest = async (year, type, price, seats) => {
  await userEvent.type(screen.getByLabelText('Year'), year);
  await userEvent.selectOptions(screen.getByLabelText('Car type'), type);
  await userEvent.type(screen.getByLabelText('Price per day (KES)'), price);
  await userEvent.type(screen.getByLabelText('Seats'), seats);
};

beforeEach(() => {
  vi.resetAllMocks();
  getMakes.mockResolvedValue(['TOYOTA', 'HONDA']);
  getModels.mockResolvedValue(['Corolla', 'Camry']);
});

describe('CarForm', () => {
  it('submits a new car using the API dropdowns', async () => {
    const onSubmit = vi.fn();
    render(<CarForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await screen.findByRole('option', { name: 'Toyota' });
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'Toyota');
    await screen.findByRole('option', { name: 'Corolla' });
    await userEvent.selectOptions(screen.getByLabelText('Model'), 'Corolla');
    await fillRest('2021', 'Sedan', '4500', '5');
    await userEvent.click(screen.getByRole('button', { name: 'Add car' }));

    expect(getModels).toHaveBeenCalledWith('Toyota');
    expect(onSubmit).toHaveBeenCalledWith({
      make: 'Toyota',
      model: 'Corolla',
      year: 2021,
      type: 'Sedan',
      pricePerDay: 4500,
      seats: 5,
      image: '',
    });
  });

  it('shows the existing values when editing and keeps a model the API lacks', async () => {
    const onSubmit = vi.fn();
    render(<CarForm car={existing} onSubmit={onSubmit} onCancel={vi.fn()} />);

    await screen.findByRole('option', { name: 'Honda' });
    await screen.findByRole('option', { name: 'Corolla' });
    expect(screen.getByLabelText('Make')).toHaveValue('Toyota');
    expect(screen.getByLabelText('Model')).toHaveValue('Vitz');
    expect(screen.getByLabelText('Year')).toHaveValue(2018);

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(onSubmit).toHaveBeenCalledWith({
      make: 'Toyota',
      model: 'Vitz',
      year: 2018,
      type: 'Hatchback',
      pricePerDay: 3000,
      seats: 4,
      image: 'http://x/vitz.jpg',
    });
  });

  it('shows a validation error and does not submit', async () => {
    const onSubmit = vi.fn();
    render(<CarForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await screen.findByRole('option', { name: 'Toyota' });
    await userEvent.click(screen.getByRole('button', { name: 'Add car' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/make/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('lets the admin type the details when the vehicle list cannot be loaded', async () => {
    getMakes.mockRejectedValue(new Error('down'));
    const onSubmit = vi.fn();
    render(<CarForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    expect(await screen.findByText(/could not load the vehicle list/i)).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Make'), 'Suzuki');
    await userEvent.type(screen.getByLabelText('Model'), 'Swift');
    await fillRest('2019', 'Hatchback', '3500', '5');
    await userEvent.click(screen.getByRole('button', { name: 'Add car' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ make: 'Suzuki', model: 'Swift', year: 2019 })
    );
    expect(getModels).not.toHaveBeenCalled();
  });

  it('falls back to a text input when the models cannot be loaded', async () => {
    getModels.mockRejectedValue(new Error('down'));
    render(<CarForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await screen.findByRole('option', { name: 'Toyota' });
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'Toyota');
    await waitFor(() => expect(screen.getByLabelText('Model').tagName).toBe('INPUT'));
  });

  it('calls onCancel', async () => {
    const onCancel = vi.fn();
    render(<CarForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await screen.findByRole('option', { name: 'Toyota' });
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows a server error and disables the button while saving', async () => {
    render(<CarForm onSubmit={vi.fn()} onCancel={vi.fn()} submitting serverError="Boom" />);
    await screen.findByRole('option', { name: 'Toyota' });
    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  });
});