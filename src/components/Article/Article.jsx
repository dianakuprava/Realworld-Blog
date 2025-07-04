import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchArticleBySlug,
  deleteArticleBySlug,
  likeArticle,
  unlikeArticle,
  clearCurrentArticle,
} from '@/store/slices/articlesSlice';
import { format } from 'date-fns';
import user from '/src/assets/user.png';
import { Spin, Alert, Modal } from 'antd';
import ReactMarkdown from 'react-markdown';
import styles from './Article.module.scss';
import LikeIcon from '/src/assets/like.svg';
import ActiveLikeIcon from '/src/assets/active-like.svg';

export default function Article() {
  const { slug } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { currentArticle, loading, error, liking } = useSelector((state) => state.articles);
  const { user: currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    dispatch(clearCurrentArticle());
    dispatch(fetchArticleBySlug(slug));

    return () => {
      dispatch(clearCurrentArticle());
    };
  }, [dispatch, slug]);

  const handleEdit = () => {
    history.push(`/articles/${slug}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    dispatch(deleteArticleBySlug(slug)).then(() => {
      history.push('/');
    });
  };

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      history.push('/sign-in');
      return;
    }

    if (currentArticle?.favorited) {
      dispatch(unlikeArticle(slug));
    } else {
      dispatch(likeArticle(slug));
    }
  };

  if (loading && !currentArticle) return <Spin size="large" className={styles.spin} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (!currentArticle) return null;

  const isAuthor = isAuthenticated && currentUser?.username === currentArticle.author.username;

  return (
    <div className={styles['article-open']}>
      <div className={styles.info}>
        <div className={styles['info-left']}>
          <div className={styles.title}>
            <h1 className={styles['title-info']}>{currentArticle.title}</h1>
            <button
              type="button"
              className={currentArticle.favorited ? styles.redLike : styles.like}
              onClick={handleLikeClick}
              disabled={liking}
            >
              <img
                src={currentArticle.favorited ? ActiveLikeIcon : LikeIcon}
                alt="like"
                className={styles.likeIcon}
              />
              {currentArticle.favoritesCount}
            </button>
          </div>
          <div className={styles.tags}>
            {currentArticle.tagList?.map((tag, index) => (
              <div key={`${tag}-${index}`} className={styles.tag}>
                {tag}
              </div>
            ))}
          </div>
          <p className={styles['short-description']}>{currentArticle.description}</p>
        </div>
        <div className={styles['info-right']}>
          <div className={styles.user}>
            <div className={styles['user-info']}>
              <div className={styles.nickname}>{currentArticle.author.username}</div>
              <div className={styles.data}>
                {format(new Date(currentArticle.createdAt), 'MMMM d, yyyy')}
              </div>
            </div>
            <img
              className={styles.profile__picture}
              src={currentArticle.author?.image || user}
              alt={currentArticle.author.username || 'user'}
            />
          </div>
          {isAuthor && (
            <div className={styles.actions}>
              <button className={styles.edit} onClick={handleEdit}>
                Edit
              </button>
              <button className={styles.delete} onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.text}>
        <ReactMarkdown>{currentArticle.body}</ReactMarkdown>
      </div>
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this article?</p>
      </Modal>
    </div>
  );
}
