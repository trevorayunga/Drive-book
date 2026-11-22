import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export async function isAdmin(uid) {
  const snap = await getDoc(doc(db, 'admins', uid));
  return snap.exists();
}

// Signs in with email and password, then makes sure the account is an admin.
export async function adminLogin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (!(await isAdmin(cred.user.uid))) {
    await signOut(auth);
    throw new Error('not-admin');
  }
  return cred.user;
}