import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllBookings, getAllContacts, setBookingStatus } from '../../services/bookings';
import ManageBookings from './ManageBookings';

vi.mock('../../services/bookings', () => ({
  getAllBookings: vi.fn(),
  getAllContacts: vi.fn(),
  setBookingStatus: vi.fn(),
}));

const bookings = [
  { id: 'b1', carId: 'c1', carName: 'Toyota Corolla', userName: 'Trevor', startDate: '2099-01-01', endDate: '2099-01-03', totalPrice: 9000, status: 'confirmed' },
  { id: 'b2', carId: 'c1', carName: 'Toyota Corolla', userName: 'Amina', startDate: '2099-01-02', endDate: '2099-01-04', totalPrice: 6000, status: 'cancelled' },
  { id: 'b3', carId: 'c2', carName: 'Nissan X-Trail', userName: 'Joseph', startDate: '2099-02-01', endDate: '2099-02-03', totalPrice: 17000, status: 'cancelled' },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <ManageBookings />
    </MemoryRouter>
  );

beforeEach(() => {
  vi.resetAllMocks();
  getAllBookings.mockResolvedValue(bookings);
  getAllContacts.mockResolvedValue({
    b1: { phone: '+254712345678', notes: 'Airport pickup' },
  });
});

describe('ManageBookings', () => {
  it('lists bookings with the newest first', async () => {
    renderPage();
    expect(screen.getByText('Loading bookings...')).toBeInTheDocument();
    const items = await screen.findAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Joseph');
    expect(items[2]).toHaveTextContent('Trevor');
  });

  it('shows the customer phone number and note when there are contact details', async () => {
    renderPage();
    const link = await screen.findByRole('link', { name: '+254712345678' });
    expect(link).toHaveAttribute('href', 'tel:+254712345678');
    expect(screen.getByText(/Note: Airport pickup/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^\+254/ })).toHaveLength(1);
  });

  it('shows a phone number without a note when the note is empty', async () => {
    getAllContacts.mockResolvedValue({ b3: { phone: '+254722000111', notes: '' } });
    renderPage();
    expect(await screen.findByRole('link', { name: '+254722000111' })).toBeInTheDocument();
    expect(screen.queryByText(/Note:/)).not.toBeInTheDocument();
  });

  it('still lists the bookings when the contact details cannot be loaded', async () => {
    getAllContacts.mockRejectedValue(new Error('denied'));
    renderPage();
    expect(await screen.findAllByRole('listitem')).toHaveLength(3);
    expect(screen.queryByRole('link', { name: /^\+254/ })).not.toBeInTheDocument();
  });

  it('cancels a confirmed booking', async () => {
    setBookingStatus.mockResolvedValue();
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel booking for Trevor' }));
    expect(setBookingStatus).toHaveBeenCalledWith('b1', 'cancelled');
    expect(await screen.findByRole('button', { name: 'Confirm booking for Trevor' })).toBeInTheDocument();
  });

  it('confirms a cancelled booking when the dates are free', async () => {
    setBookingStatus.mockResolvedValue();
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Confirm booking for Joseph' }));
    expect(setBookingStatus).toHaveBeenCalledWith('b3', 'confirmed');
    expect(await screen.findByRole('button', { name: 'Cancel booking for Joseph' })).toBeInTheDocument();
  });

  it('refuses to confirm a booking that overlaps another one', async () => {
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Confirm booking for Amina' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/already booked/i);
    expect(setBookingStatus).not.toHaveBeenCalled();
  });

  it('filters by status', async () => {
    renderPage();
    await screen.findAllByRole('listitem');
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'confirmed');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Trevor');
  });

  it('shows an error when an update fails', async () => {
    setBookingStatus.mockRejectedValue(new Error('fail'));
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel booking for Trevor' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not update/i);
  });

  it('shows an error when bookings cannot be loaded', async () => {
    getAllBookings.mockRejectedValue(new Error('fail'));
    renderPage();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load bookings/i);
  });

  it('shows an empty message when there are no bookings', async () => {
    getAllBookings.mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText('No bookings found.')).toBeInTheDocument();
  });
});