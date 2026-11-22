import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export async function getCars() {
  const snapshot = await getDocs(collection(db, 'cars'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getCar(id) {
  const snap = await getDoc(doc(db, 'cars', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addCar(data) {
  const ref = await addDoc(collection(db, 'cars'), data);
  return ref.id;
}

export async function updateCar(id, data) {
  await updateDoc(doc(db, 'cars', id), data);
}

export async function deleteCar(id) {
  await deleteDoc(doc(db, 'cars', id));
}