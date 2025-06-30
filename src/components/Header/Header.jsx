import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import avatar from '@/assets/user.png';
import styles from './Header.module.scss';

export default function Header() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    history.push('/');
  };

  const headerAuthorization = (
    <div className={styles['header-authorization']}>
      <Link to="/sign-in" className={styles['sign-in']}>
        Sign In
      </Link>
      <Link to="/sign-up" className={styles['sign-up']}>
        Sign Up
      </Link>
    </div>
  );

  const headerMenu = (
    <div className={styles['header-menu']}>
      <Link to="/new-article" className={styles['create-article']}>
        Create article
      </Link>
      <Link to="/profile" className={styles.profile}>
        <span className={styles['profile__name']}>{user?.username}</span>
        <img className={styles['profile__picture']} src={user?.image || avatar} alt="Avatar" />
      </Link>
      <button onClick={handleLogout} className={styles['log-out']}>
        Log Out
      </button>
    </div>
  );

  return (
    <div className={styles.header}>
      <Link to="/" className={styles.label}>
        Realworld Blog
      </Link>
      {isAuthenticated ? headerMenu : headerAuthorization}
    </div>
  );
}
