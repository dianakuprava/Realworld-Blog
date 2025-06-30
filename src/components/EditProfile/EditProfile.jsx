import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateProfile } from '@/store/slices/authSlice';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './EditProfile.module.scss';

export default function EditProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setValue('username', user.username);
      setValue('email', user.email);
      setValue('avatarImage', user.image || '');
    }
  }, [user, setValue]);

  useEffect(() => {
    if (error?.errors) {
      console.error('Form errors:', error.errors);
    }
  }, [error]);

  const onSubmit = (data) => {
    const userData = {
      username: data.username,
      email: data.email,
      image: data.avatarImage || null,
    };

    if (data.newPassword) {
      userData.password = data.newPassword;
    }

    dispatch(updateProfile(userData)).then((action) => {
      if (!action.error) {
        history.push('/');
      }
    });
  };

  return (
    <div className={styles['edit-profile']}>
      <h1 className={styles.title}>Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Username</label>
          <input
            className={styles.input}
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && (
            <p className={styles.errorMessage}>
              <span className={styles.errorIcon}>•</span> {errors.username.message}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email address</label>
          <input
            type="email"
            className={styles.input}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p className={styles.errorMessage}>
              <span className={styles.errorIcon}>•</span> {errors.email.message}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>New password</label>
          <div className={styles.passwordInputContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              {...register('newPassword', {
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="New password"
            />
            <span className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOutlined className={styles.eyeIcon} />
              ) : (
                <EyeInvisibleOutlined className={styles.eyeIcon} />
              )}
            </span>
          </div>
          {errors.newPassword && (
            <p className={styles.errorMessage}>
              <span className={styles.errorIcon}>•</span> {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Avatar image (url)</label>
          <input
            type="url"
            className={styles.input}
            {...register('avatarImage', {
              maxLength: {
                value: 255,
                message: 'URL must be at most 255 characters',
              },
            })}
            placeholder="Avatar image"
          />
          {errors.avatarImage && (
            <p className={styles.errorMessage}>
              <span className={styles.errorIcon}>•</span> {errors.avatarImage.message}
            </p>
          )}
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
