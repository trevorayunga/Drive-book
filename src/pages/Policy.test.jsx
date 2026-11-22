import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { business } from '../config/business';
import { policySections } from '../config/policy';
import { DEPOSIT_PERCENT } from '../lib/deposit';
import Policy from './Policy';

describe('Policy page', () => {
  it('shows a heading and every policy section', () => {
    render(<Policy />);
    expect(screen.getByRole('heading', { name: 'Rental policy' })).toBeInTheDocument();
    policySections.forEach((section) => {
      expect(screen.getByRole('heading', { name: section.title })).toBeInTheDocument();
    });
  });

  it('explains the security deposit', () => {
    render(<Policy />);
    expect(
      screen.getByText(new RegExp(`refundable security deposit of ${DEPOSIT_PERCENT}%`, 'i'))
    ).toBeInTheDocument();
  });

  it('shows how to get in touch', () => {
    render(<Policy />);
    expect(screen.getByText(new RegExp(business.email.replace('.', '\\.')))).toBeInTheDocument();
  });
});