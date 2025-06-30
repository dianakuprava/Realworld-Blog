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

  const { currentArticle, loading, submitting } = useSelector((state) => state.articles);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [tags, setTags] = useState(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

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

  const onSubmit = (data) => {
    const nonEmptyTags = tags.filter((tag) => tag.trim() !== '');
    const articleData = {
      ...data,
      tagList: nonEmptyTags,
    };

    if (slug) {
      dispatch(updateArticleBySlug({ slug, articleData })).then(() =>
        history.push(`/articles/${slug}`)
      );
    } else {
      dispatch(createNewArticle(articleData)).then(() => history.push('/'));
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
          className={styles['title-input']}
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}
      </div>

      <div className={styles['create-short-description']}>
        <label htmlFor="short-description">Short description</label>
        <input
          id="short-description"
          type="text"
          placeholder="Short description"
          className={styles['short-description']}
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && <span className={styles.error}>{errors.description.message}</span>}
      </div>

      <div className={styles['text-create']}>
        <label htmlFor="text">Text</label>
        <textarea
          id="text"
          placeholder="Text (markdown supported)"
          className={styles.text}
          {...register('body', { required: 'Text is required' })}
        />
        {errors.body && <span className={styles.error}>{errors.body.message}</span>}
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
