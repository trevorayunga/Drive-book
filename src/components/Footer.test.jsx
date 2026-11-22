import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { business } from '../config/business';
import Footer from './Footer';

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

describe('Footer', () => {
  it('shows the contact details as working links', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: business.phone })).toHaveAttribute(
      'href',
      `tel:${business.phone.replace(/\s/g, '')}`
    );
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      `https://wa.me/${business.whatsapp}`
    );
    expect(screen.getByRole('link', { name: business.email })).toHaveAttribute(
      'href',
      `mailto:${business.email}`
    );
    expect(screen.getByText(business.address)).toBeInTheDocument();
  });

  it('links to the policy and the main pages', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'Rental policy' })).toHaveAttribute('href', '/policy');
    expect(screen.getByRole('link', { name: 'Cars' })).toHaveAttribute('href', '/cars');
    expect(screen.getByRole('link', { name: 'My bookings' })).toHaveAttribute('href', '/bookings');
  });

  it('shows the current year', () => {
    renderFooter();
    expect(screen.getByRole('contentinfo')).toHaveTextContent(String(new Date().getFullYear()));
  });
});