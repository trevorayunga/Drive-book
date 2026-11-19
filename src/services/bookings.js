import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
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

export async function createBooking(data) {
  const ref = await addDoc(collection(db, 'bookings'), {
    ...data,
    status: 'confirmed',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function cancelBooking(id) {
  await updateDoc(doc(db, 'bookings', id), { status: 'cancelled' });
}