import React from 'react';
import styles from './ArticleForm.module.scss';

export default function ArticleForm({
  register,
  handleSubmit,
  errors,
  tags,
  handleTagChange,
  handleAddTag,
  handleDeleteTag,
  onSubmit,
  submitting,
  isEdit,
}) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['create-new-article']}>
      <h1 className={styles.title}>{isEdit ? 'Edit Article' : 'Create new article'}</h1>
      <div className={styles['title-create']}>
        <label htmlFor="title-input">Title</label>
        <input
          id="title-input"
          type="text"
          placeholder="Title"
          className={`${styles['title-input']} ${errors.title ? styles.inputError : ''}`}
          {...register('title', {
            required: 'Title is required',
          })}
        />
        {errors.title && <span className={styles.errorMessage}>{errors.title.message}</span>}
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
          })}
        />
        {errors.body && <span className={styles.errorMessage}>{errors.body.message}</span>}
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
        {submitting ? 'Submitting...' : isEdit ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
