import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import CarGallery from './CarGallery';

describe('CarGallery', () => {
  it('shows a placeholder when there are no photos', () => {
    render(<CarGallery images={[]} alt="Toyota Vitz" />);
    expect(screen.getByRole('img', { name: 'No photos available' })).toBeInTheDocument();
  });

  it('shows one photo without thumbnails', () => {
    render(<CarGallery images={['/a.jpg']} alt="Toyota Vitz" />);
    expect(screen.getByRole('img', { name: 'Toyota Vitz photo 1' })).toHaveAttribute('src', '/a.jpg');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('switches the main photo when a thumbnail is clicked', async () => {
    render(<CarGallery images={['/a.jpg', '/b.jpg']} alt="Toyota Vitz" />);
    expect(screen.getByRole('img', { name: 'Toyota Vitz photo 1' })).toHaveAttribute('src', '/a.jpg');

    await userEvent.click(screen.getByRole('button', { name: 'Show photo 2' }));

    expect(screen.getByRole('img', { name: 'Toyota Vitz photo 2' })).toHaveAttribute('src', '/b.jpg');
    expect(screen.getByRole('button', { name: 'Show photo 2' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Show photo 1' })).toHaveAttribute('aria-pressed', 'false');
  });
});