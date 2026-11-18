import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export async function getCars() {
  const snapshot = await getDocs(collection(db, 'cars'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}