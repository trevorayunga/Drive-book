import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export async function getCars() {
  const snapshot = await getDocs(collection(db, 'cars'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getCar(id) {
  const snap = await getDoc(doc(db, 'cars', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}