import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { isAdmin } from '../services/admin';

export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const [checked, setChecked] = useState({ uid: null, ok: false });

  useEffect(() => {
    if (!user) return;
    let active = true;
    isAdmin(user.uid)
      .then((ok) => active && setChecked({ uid: user.uid, ok }))
      .catch(() => active && setChecked({ uid: user.uid, ok: false }));
    return () => {
      active = false;
    };
  }, [user]);

  if (loading) return <p className="p-6 text-center">Checking access...</p>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (checked.uid !== user.uid) return <p className="p-6 text-center">Checking access...</p>;
  return checked.ok ? children : <Navigate to="/admin/login" replace />;
}