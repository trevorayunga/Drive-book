import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { business } from '../config/business';
import { getCar } from '../services/cars';
import CarDetails from './CarDetails';

vi.mock('../services/cars', () => ({ getCar: vi.fn() }));

const car = {
  id: 'c1',
  make: 'Toyota',
  model: 'Vitz',
  year: 2018,
  type: 'Hatchback',
  seats: 4,
  pricePerDay: 3000,
  description: 'Compact city car, easy to park.',
  images: ['/cars/vitz-1.jpg', '/cars/vitz-2.jpg'],
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/cars/c1']}>
      <Routes>
        <Route path="/cars/:id" element={<CarDetails />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.resetAllMocks();
});

describe('CarDetails', () => {
  it('shows the car details, description and photos', async () => {
    getCar.mockResolvedValue(car);
    renderPage();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Toyota Vitz' })).toBeInTheDocument();
    expect(screen.getByText('2018 · Hatchback · 4 seats')).toBeInTheDocument();
    expect(screen.getByText('KES 3,000')).toBeInTheDocument();
    expect(screen.getByText('Compact city car, easy to park.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Toyota Vitz photo 1' })).toBeInTheDocument();
  });

  it('shows the deposit note, contact and booking links', async () => {
    getCar.mockResolvedValue(car);
    renderPage();
    await screen.findByRole('heading', { name: 'Toyota Vitz' });
    expect(screen.getByText(/security deposit of 30%/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read the rental policy' })).toHaveAttribute('href', '/policy');
    expect(screen.getByRole('link', { name: business.phone })).toHaveAttribute(
      'href',
      `tel:${business.phone.replace(/\s/g, '')}`
    );
    expect(screen.getByRole('link', { name: 'Book now' })).toHaveAttribute('href', '/cars/c1/book');
  });

  it('shows a fallback when there is no description or photo', async () => {
    getCar.mockResolvedValue({ ...car, description: '', images: [] });
    renderPage();
    expect(await screen.findByText('No description yet.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'No photos available' })).toBeInTheDocument();
  });

  it('shows a message when the car is not found', async () => {
    getCar.mockResolvedValue(null);
    renderPage();
    expect(await screen.findByRole('alert')).toHaveTextContent('Car not found.');
    expect(screen.getByRole('link', { name: 'Back to cars' })).toHaveAttribute('href', '/cars');
  });

  it('shows a message when the car cannot be loaded', async () => {
    getCar.mockRejectedValue(new Error('fail'));
    renderPage();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load the car/i);
  });
});