import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchArticleBySlug,
  createNewArticle,
  updateArticleBySlug,
  clearCurrentArticle,
} from '@/store/slices/articlesSlice.js';
import styles from './CreateNewArticle.module.scss';

export default function CreateNewArticle() {
  const { slug } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { currentArticle, loading, submitting, error } = useSelector((state) => state.articles);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [tags, setTags] = useState(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      history.replace('/sign-in');
      return;
    }
    if (slug) {
      dispatch(fetchArticleBySlug(slug));
    }
    return () => {
      dispatch(clearCurrentArticle());
    };
  }, [slug, isAuthenticated, history, dispatch]);

  useEffect(() => {
    if (slug && currentArticle) {
      setValue('title', currentArticle.title);
      setValue('description', currentArticle.description);
      setValue('body', currentArticle.body);
      setTags(currentArticle.tagList.length > 0 ? [...currentArticle.tagList, ''] : ['']);
    }
  }, [currentArticle, slug, setValue]);

  // Обработка ошибок с сервера
  useEffect(() => {
    if (error?.errors) {
      clearErrors();
      Object.entries(error.errors).forEach(([field, messages]) => {
        setError(field.toLowerCase(), {
          type: 'server',
          message: Array.isArray(messages) ? messages.join(' ') : messages,
        });
      });
    }
  }, [error, setError, clearErrors]);

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleAddTag = () => {
    if (tags[tags.length - 1].trim() !== '') {
      setTags([...tags, '']);
    }
  };

  const handleDeleteTag = (index) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data) => {
    const nonEmptyTags = tags.filter((tag) => tag.trim() !== '');
    const articleData = {
      ...data,
      tagList: nonEmptyTags,
    };

    try {
      if (slug) {
        await dispatch(updateArticleBySlug({ slug, articleData })).unwrap();
        history.push(`/articles/${slug}`);
      } else {
        await dispatch(createNewArticle(articleData)).unwrap();
        history.push('/');
      }
    } catch (error) {
      console.error('Article submission error:', error);
    }
  };

  if (loading || !isAuthenticated) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['create-new-article']}>
      <h1 className={styles.title}>{slug ? 'Edit Article' : 'Create new article'}</h1>

      <div className={styles['title-create']}>
        <label htmlFor="title-input">Title</label>
        <input
          id="title-input"
          type="text"
          placeholder="Title"
          className={`${styles['title-input']} ${errors.title ? styles.inputError : ''}`}
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters',
            },
            maxLength: {
              value: 100,
              message: 'Title must be at most 100 characters',
            },
          })}
        />
        {errors.title && (
          <span className={styles.errorMessage}>{errors.title.message}</span>
        )}
      </div>

      <div className={styles['create-short-description']}>
        <label htmlFor="short-description">Short description</label>
        <input
          id="short-description"
          type="text"
          placeholder="Short description"
          className={`${styles['short-description']} ${errors.description ? styles.inputError : ''}`}
          {...register('description', {
            required: 'Short description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters',
            },
            maxLength: {
              value: 200,
              message: 'Description must be at most 200 characters',
            },
          })}
        />
        {errors.description && (
          <span className={styles.errorMessage}>{errors.description.message}</span>
        )}
      </div>

      <div className={styles['text-create']}>
        <label htmlFor="text">Text</label>
        <textarea
          id="text"
          placeholder="Text (markdown supported)"
          className={`${styles.text} ${errors.body ? styles.inputError : ''}`}
          {...register('body', {
            required: 'Text is required',
            minLength: {
              value: 20,
              message: 'Text must be at least 20 characters',
            },
          })}
        />
        {errors.body && (
          <span className={styles.errorMessage}>{errors.body.message}</span>
        )}
      </div>

      <div className={styles['create-tags']}>
        <label>Tags</label>
        <div className={styles['tags-container']}>
          {tags.map((tag, index) => (
            <div key={index} className={styles['tags-main']}>
              <input
                type="text"
                placeholder="Tag"
                value={tag}
                className={styles.tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
              />
              {tags.length > 1 && (
                <button
                  type="button"
                  className={styles['delete-tag']}
                  onClick={() => handleDeleteTag(index)}
                >
                  Delete
                </button>
              )}
              {index === tags.length - 1 && (
                <button
                  type="button"
                  className={styles['create-tag']}
                  onClick={handleAddTag}
                  disabled={tag.trim() === ''}
                >
                  Add tag
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className={styles['send-button']} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Send'}
      </button>
    </form>
  );
}