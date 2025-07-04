import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  fetchArticles,
  setCurrentPage,
  likeArticle,
  unlikeArticle,
} from '@/store/slices/articlesSlice.js';
import { Pagination, Spin, Alert } from 'antd';
import Article from '../Article/Article';
import styles from './ArticleList.module.scss';

export default function ArticleList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const limit = 5;

  const { articlesByPage, articlesCount, loading, error, currentPage } = useSelector(
    (state) => state.articles
  );

  const articles = articlesByPage[currentPage] || [];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(searchParams.get('page'), 10) || 1;
    dispatch(setCurrentPage(pageFromUrl));
  }, [dispatch, location.search]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', currentPage);
    history.replace({ search: searchParams.toString() });

    if (!articlesByPage[currentPage]) {
      dispatch(fetchArticles({ limit, offset: (currentPage - 1) * limit, page: currentPage }));
    }
  }, [currentPage, dispatch, history, location.search, articlesByPage, limit]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleLikeClick = (slug, isFavorited) => {
    if (!isAuthenticated) {
      history.push('/sign-in');
      return;
    }

    if (isFavorited) {
      dispatch(unlikeArticle(slug));
    } else {
      dispatch(likeArticle(slug));
    }
  };

  if (loading && articles.length === 0) return <Spin size="large" className={styles.spin} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div className={styles['article-list']}>
      {articles.map((article) => (
        <Article
          key={article.slug}
          article={article}
          onLikeClick={handleLikeClick}
        />
      ))}
      <div className={styles['pagination-container']}>
        <Pagination
          current={currentPage}
          total={articlesCount}
          onChange={handlePageChange}
          pageSize={limit}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
