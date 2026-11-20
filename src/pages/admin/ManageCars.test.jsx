import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addCar, deleteCar, getCars, updateCar } from '../../services/cars';
import ManageCars from './ManageCars';

vi.mock('../../services/cars', () => ({
  getCars: vi.fn(),
  addCar: vi.fn(),
  updateCar: vi.fn(),
  deleteCar: vi.fn(),
}));

const newData = {
  make: 'Toyota',
  model: 'Axio',
  year: 2019,
  type: 'Sedan',
  pricePerDay: 4000,
  seats: 5,
  image: '',
};

vi.mock('../../components/CarForm', () => ({
  default: ({ car, onSubmit, onCancel, serverError }) => (
    <div>
      <p>{car ? `Editing ${car.model}` : 'New car form'}</p>
      {serverError && <p>{serverError}</p>}
      <button onClick={() => onSubmit(newData)}>Save</button>
      <button onClick={onCancel}>Cancel form</button>
    </div>
  ),
}));

const cars = [
  { id: 'c1', make: 'Toyota', model: 'Vitz', year: 2018, type: 'Hatchback', seats: 4, pricePerDay: 3000 },
  { id: 'c2', make: 'Nissan', model: 'X-Trail', year: 2018, type: 'SUV', seats: 5, pricePerDay: 8500 },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <ManageCars />
    </MemoryRouter>
  );

beforeEach(() => {
  vi.resetAllMocks();
  getCars.mockResolvedValue(cars);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ManageCars', () => {
  it('lists the cars', async () => {
    renderPage();
    expect(screen.getByText('Loading cars...')).toBeInTheDocument();
    expect(await screen.findByText('Toyota Vitz')).toBeInTheDocument();
    expect(screen.getByText('KES 8,500')).toBeInTheDocument();
  });

  it('shows an empty message when there are no cars', async () => {
    getCars.mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText('No cars yet.')).toBeInTheDocument();
  });

  it('shows an error when the cars cannot be loaded', async () => {
    getCars.mockRejectedValue(new Error('fail'));
    renderPage();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load cars/i);
  });

  it('adds a car', async () => {
    addCar.mockResolvedValue('new1');
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Add car' }));
    expect(screen.getByText('New car form')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(addCar).toHaveBeenCalledWith(newData);
    expect(await screen.findByText('Toyota Axio')).toBeInTheDocument();
    expect(screen.queryByText('New car form')).not.toBeInTheDocument();
  });

  it('edits a car', async () => {
    updateCar.mockResolvedValue();
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Edit Toyota Vitz' }));
    expect(screen.getByText('Editing Vitz')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(updateCar).toHaveBeenCalledWith('c1', newData);
    expect(await screen.findByText('Toyota Axio')).toBeInTheDocument();
    expect(screen.queryByText('Toyota Vitz')).not.toBeInTheDocument();
  });

  it('shows an error when saving fails', async () => {
    addCar.mockRejectedValue(new Error('fail'));
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Add car' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText(/could not save the car/i)).toBeInTheDocument();
  });

  it('closes the form on cancel', async () => {
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Add car' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel form' }));
    expect(screen.queryByText('New car form')).not.toBeInTheDocument();
  });

  it('deletes a car after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    deleteCar.mockResolvedValue();
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Delete Toyota Vitz' }));
    expect(deleteCar).toHaveBeenCalledWith('c1');
    await waitFor(() => expect(screen.queryByText('Toyota Vitz')).not.toBeInTheDocument());
  });

  it('does not delete when the admin declines', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Delete Toyota Vitz' }));
    expect(deleteCar).not.toHaveBeenCalled();
  });

  it('shows an error when deleting fails', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    deleteCar.mockRejectedValue(new Error('fail'));
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Delete Toyota Vitz' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not delete/i);
  });
});