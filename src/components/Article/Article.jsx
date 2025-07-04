import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import user from '/src/assets/user.png';
import styles from './Article.module.scss';
import React from 'react';
import LikeIcon from '/src/assets/like.svg';
import ActiveLikeIcon from '/src/assets/active-like.svg';
import { truncateText } from '@/Utils/truncateText.js';

export default function Article({ article, onLikeClick }) {
  if (!article) return null;

  const isFavorited = article.favorited || false;

  return (
    <div className={styles.article}>
      <div className={styles.article__left}>
        <div className={styles.tile}>
          <Link to={`/articles/${article.slug}`} className={styles['tile-info']}>
            {truncateText(article.title)}
          </Link>
          <button
            type="button"
            className={article.favorited ? styles.redLike : styles.like}
            onClick={(e) => {
              e.preventDefault();
              onLikeClick(article.slug, article.favorited);
            }}
          >
            <img
              src={isFavorited ? ActiveLikeIcon : LikeIcon}
              alt="like"
              className={styles.likeIcon}
            />
            {article.favoritesCount}
          </button>
        </div>
        <div className={styles.tags}>
          {article.tagList?.map((tag, index) => (
            <div key={`${article.slug}-${tag}-${index}`} className={styles.tag}>
              {tag}
            </div>
          ))}
        </div>
        <p className={styles.description}>{article.description}</p>
      </div>
      <div className={styles.article__right}>
        <div className={styles['user-info']}>
          <div className={styles.nickname}>{article.author.username}</div>
          <div className={styles.data}>{format(new Date(article.createdAt), 'MMMM d, yyyy')}</div>
        </div>
        <img
          className={styles.profile__picture}
          src={article.author?.image || user}
          alt={article.author.username}
        />
      </div>
    </div>
  );
}