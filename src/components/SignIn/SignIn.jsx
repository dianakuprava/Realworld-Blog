import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { login } from '@/store/slices/authSlice';
import styles from './SignIn.module.scss';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    mode: 'onBlur',
  });

  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, isAuthenticated, error: apiError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (apiError?.errors && apiError.errors['email or password']) {
      clearErrors();
      setError('password', {
        type: 'server',
        message: 'Email or password is invalid',
      });
    }
  }, [apiError, setError, clearErrors]);

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, [isAuthenticated, history]);

  const onSubmit = (data) => {
    dispatch(
      login({
        email: data.email,
        password: data.password,
      })
    );
  };

  return (
    <div className={styles.signInForm}>
      <h2 className={styles.title}>Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email address</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Please enter a valid email',
              },
            })}
            className={styles.input}
            placeholder="Email address"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <div className={styles.passwordInputContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
              })}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="Password"
            />
            <span className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOutlined className={styles.eyeIcon} />
              ) : (
                <EyeInvisibleOutlined className={styles.eyeIcon} />
              )}
            </span>
          </div>
          {errors.password && (
            <p className={styles.errorMessage}>
              <span className={styles.errorIcon}>•</span> {errors.password.message}
            </p>
          )}
        </div>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className={styles.signupText}>
          Don't have an account?{' '}
          <Link to="/sign-up" className={styles.link}>
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}