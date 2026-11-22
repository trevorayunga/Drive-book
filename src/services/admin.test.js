import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { adminLogin, isAdmin } from './admin';

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'admin-ref'),
  getDoc: vi.fn(),
}));
vi.mock('../firebase', () => ({ auth: {}, db: {} }));

beforeEach(() => {
  vi.resetAllMocks();
});

describe('isAdmin', () => {
  it('is true when an admin document exists', async () => {
    getDoc.mockResolvedValue({ exists: () => true });
    expect(await isAdmin('u1')).toBe(true);
  });

  it('is false when there is no admin document', async () => {
    getDoc.mockResolvedValue({ exists: () => false });
    expect(await isAdmin('u1')).toBe(false);
  });
});

describe('adminLogin', () => {
  it('returns the user when they are an admin', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'a1' } });
    getDoc.mockResolvedValue({ exists: () => true });
    expect(await adminLogin('a@b.com', 'pw')).toEqual({ uid: 'a1' });
    expect(signOut).not.toHaveBeenCalled();
  });

  it('signs out and rejects when the account is not an admin', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u9' } });
    getDoc.mockResolvedValue({ exists: () => false });
    await expect(adminLogin('a@b.com', 'pw')).rejects.toThrow('not-admin');
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('passes on sign in errors such as a wrong password', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('auth/wrong-password'));
    await expect(adminLogin('a@b.com', 'bad')).rejects.toThrow('auth/wrong-password');
  });
});