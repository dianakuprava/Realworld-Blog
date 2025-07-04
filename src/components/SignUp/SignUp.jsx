import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser } from '@/store/slices/authSlice';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './SignUp.module.scss';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    mode: 'onBlur',
  });

  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, isAuthenticated, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error?.errors) {
      clearErrors();

      if (error.errors['username']) {
        setError('username', {
          type: 'server',
          message: 'is already taken',
        });
      }

      if (error.errors['email']) {
        setError('email', {
          type: 'server',
          message: 'is already taken',
        });
      }
      Object.entries(error.errors).forEach(([field, messages]) => {
        if (field !== 'username' && field !== 'email') {
          const message = Array.isArray(messages) ? messages.join(' ') : messages;
          setError(field.toLowerCase(), {
            type: 'server',
            message: message,
          });
        }
      });
    }
  }, [error, setError, clearErrors]);

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, [isAuthenticated, history]);

  const onSubmit = (data) => {
    dispatch(
      registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      })
    );
  };

  return (
    <div className={styles.signUp}>
      <h1 className={styles.title}>Create new account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Username</label>
          <input
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
              maxLength: {
                value: 20,
                message: 'Username must be at most 20 characters',
              },
            })}
            placeholder="Username"
            className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
          />
          {errors.username && <p className={styles.errorMessage}>{errors.username.message}</p>}
        </div>

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
            placeholder="Email address"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          />
          {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <div className={styles.passwordInputContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                maxLength: {
                  value: 40,
                  message: 'Password must be at most 40 characters',
                },
              })}
              placeholder="Password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            />
            <span className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOutlined className={styles.eyeIcon} />
              ) : (
                <EyeInvisibleOutlined className={styles.eyeIcon} />
              )}
            </span>
          </div>
          {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Repeat Password</label>
          <div className={styles.passwordInputContainer}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === watch('password') || 'Passwords must match',
              })}
              placeholder="Repeat Password"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
            />
            <span
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOutlined className={styles.eyeIcon} />
              ) : (
                <EyeInvisibleOutlined className={styles.eyeIcon} />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className={styles.errorMessage}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              {...register('agreement', {
                required: 'You must agree to the terms',
              })}
              className={styles.checkbox}
            />
            <span>I agree to the processing of my personal information</span>
          </label>
          {errors.agreement && <p className={styles.errorMessage}>{errors.agreement.message}</p>}
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>

        <div className={styles.loginLink}>
          Already have an account?{' '}
          <Link to="/sign-in" className={styles.link}>
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
