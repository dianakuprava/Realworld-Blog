import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '@/store/slices/authSlice.js';

export default function AuthSession({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return children;
}
