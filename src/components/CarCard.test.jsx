import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CarCard from './CarCard';

const car = {
  make: 'Toyota',
  model: 'Corolla',
  year: 2020,
  type: 'Sedan',
  seats: 5,
  pricePerDay: 4500,
  image: '',
};

describe('CarCard', () => {
  it('shows the car details and price', () => {
    render(<CarCard car={car} />);
    expect(screen.getByRole('heading', { name: 'Toyota Corolla' })).toBeInTheDocument();
    expect(screen.getByText('2020 · Sedan · 5 seats')).toBeInTheDocument();
    expect(screen.getByText('KES 4,500')).toBeInTheDocument();
  });

  it('renders an image when one is provided', () => {
    const { container } = render(<CarCard car={{ ...car, image: 'http://x/y.jpg' }} />);
    expect(container.querySelector('img')).toHaveAttribute('src', 'http://x/y.jpg');
  });

  it('renders extra content when children are provided', () => {
    render(
      <CarCard car={car}>
        <button>Book now</button>
      </CarCard>
    );
    expect(screen.getByRole('button', { name: 'Book now' })).toBeInTheDocument();
  });
});