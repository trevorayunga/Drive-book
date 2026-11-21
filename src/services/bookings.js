import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';

const toList = (snapshot) => snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

export async function getBookingsForCar(carId) {
  const q = query(collection(db, 'bookings'), where('carId', '==', carId));
  return toList(await getDocs(q));
}

export async function getUserBookings(userId) {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId));
  return toList(await getDocs(q));
}

export async function getAllBookings() {
  return toList(await getDocs(collection(db, 'bookings')));
}

// Saves the booking and the customer's private contact details together.
export async function createBooking(data, contact) {
  const ref = doc(collection(db, 'bookings'));
  const batch = writeBatch(db);
  batch.set(ref, { ...data, status: 'confirmed', createdAt: serverTimestamp() });
  batch.set(doc(db, 'bookingContacts', ref.id), {
    userId: data.userId,
    phone: contact.phone,
    notes: contact.notes || '',
    createdAt: serverTimestamp(),
  });
  await batch.commit();
  return ref.id;
}

export async function cancelBooking(id) {
  await updateDoc(doc(db, 'bookings', id), { status: 'cancelled' });
}

export async function setBookingStatus(id, status) {
  await updateDoc(doc(db, 'bookings', id), { status });
}

// Admin only: returns { [bookingId]: { phone, notes, ... } }
export async function getAllContacts() {
  const snapshot = await getDocs(collection(db, 'bookingContacts'));
  return Object.fromEntries(snapshot.docs.map((d) => [d.id, d.data()]));
}