import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleBySlug,
  favoriteArticle,
  unfavoriteArticle,
} from '@/Api/Api.js';

/**
 * @typedef {Object} Article
 * @property {string} slug - Unique article identifier
 * @property {string} title - ArticleListItem title
 * @property {boolean} favorited - Favorite status
 * @property {number} favoritesCount - Number of favorites
 * @property {Object} author - ArticleListItem author
 * @property {string} author.username - Author username
 * @property {string} author.image - Author image URL
 * @property {string} description - ArticleListItem description
 * @property {string} body - ArticleListItem content
 * @property {string[]} tagList - ArticleListItem tags
 * @property {string} createdAt - Creation date
 * @property {string} updatedAt - Update date
 */

/**
 * @typedef {Object} ArticlesResponse
 * @property {Article[]} articles - Array of articles
 * @property {number} articlesCount - Total articles count
 */

/**
 * Fetch articles with pagination
 * @param {Object} params
 * @param {number} params.limit - Articles per page
 * @param {number} params.offset - Pagination offset
 */
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ limit, offset }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || null;
      const headers = token ? { Authorization: `Token ${token}` } : {};

      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles?limit=${limit}&offset=${offset}`,
        { headers }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return response.json();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch articles');
    }
  }
);

/**
 * Fetch single article by slug
 * @param {string} slug - ArticleListItem slug
 */
export const fetchArticleBySlug = createAsyncThunk(
  'articles/fetchArticleBySlug',
  async (slug, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || null;
      const article = await getArticleBySlug(slug, token);
      return { article };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Failed to fetch article');
    }
  }
);

/**
 * Create new article
 * @param {Object} articleData - New article data
 */
export const createNewArticle = createAsyncThunk(
  'articles/createNewArticle',
  async (articleData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || null;
      return await createArticle(articleData, token);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Failed to create article');
    }
  }
);

/**
 * Update existing article
 * @param {Object} params
 * @param {string} params.slug - ArticleListItem slug to update
 * @param {Object} params.articleData - Updated article data
 */
export const updateArticleBySlug = createAsyncThunk(
  'articles/updateArticleBySlug',
  async ({ slug, articleData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || null;
      const updated = await updateArticle(slug, articleData, token);
      return { article: updated };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Failed to update article');
    }
  }
);

/**
 * Delete article by slug
 * @param {string} slug - ArticleListItem slug to delete
 */
export const deleteArticleBySlug = createAsyncThunk(
  'articles/deleteArticleBySlug',
  async (slug, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || null;
      await deleteArticle(slug, token);
      return slug;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Failed to delete article');
    }
  }
);

// Helper function for like/unlike actions
const handleFavoriteAction = async (slug, token, action) => {
  if (!token) throw new Error('Authentication required');
  return action(slug, token);
};

/**
 * Like article
 * @param {string} slug - ArticleListItem slug to like
 */
export const likeArticle = createAsyncThunk(
  'articles/likeArticle',
  async (slug, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || null;
      return await handleFavoriteAction(slug, token, favoriteArticle);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Failed to like article');
    }
  }
);

/**
 * Unlike article
 * @param {string} slug - ArticleListItem slug to unlike
 */
export const unlikeArticle = createAsyncThunk(
  'articles/unlikeArticle',
  async (slug, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || null;
      return await handleFavoriteAction(slug, token, unfavoriteArticle);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Failed to unlike article');
    }
  }
);

const updateArticlesCache = (state, updatedArticle) => {
  if (state.currentArticle?.slug === updatedArticle.slug) {
    state.currentArticle = updatedArticle;
  }

  Object.keys(state.articlesByPage).forEach((page) => {
    state.articlesByPage[page] = state.articlesByPage[page].map((article) =>
      article.slug === updatedArticle.slug ? updatedArticle : article
    );
  });
};

const initialState = {
  articlesByPage: {},
  currentArticle: null,
  loading: false,
  error: null,
  articlesCount: 0,
  currentPage: 1,
  submitting: false,
  liking: false,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        const { page = 1 } = action.meta.arg;
        state.articlesByPage[page] = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
        state.loading = false;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.currentArticle = action.payload.article;
        state.loading = false;
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })
      .addCase(createNewArticle.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createNewArticle.fulfilled, (state, action) => {
        state.submitting = false;
        state.currentArticle = action.payload;
        if (state.articlesByPage[1]) {
          state.articlesByPage[1] = [action.payload, ...state.articlesByPage[1]];
          state.articlesCount += 1;
        }
      })
      .addCase(createNewArticle.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.submitting = false;
      })
      .addCase(updateArticleBySlug.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateArticleBySlug.fulfilled, (state, action) => {
        state.currentArticle = action.payload.article;
        state.submitting = false;
      })
      .addCase(updateArticleBySlug.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.submitting = false;
      })
      .addCase(deleteArticleBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticleBySlug.fulfilled, (state, action) => {
        const slug = action.payload;
        state.currentArticle = null;
        state.loading = false;
        Object.keys(state.articlesByPage).forEach((page) => {
          state.articlesByPage[page] = state.articlesByPage[page].filter(
            (article) => article.slug !== slug
          );
        });
        state.articlesCount = Math.max(0, state.articlesCount - 1);
      })
      .addCase(deleteArticleBySlug.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })
      .addCase(likeArticle.pending, (state) => {
        state.liking = true;
      })
      .addCase(likeArticle.fulfilled, (state, action) => {
        state.liking = false;
        updateArticlesCache(state, action.payload);
      })
      .addCase(likeArticle.rejected, (state, action) => {
        state.liking = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(unlikeArticle.pending, (state) => {
        state.liking = true;
      })
      .addCase(unlikeArticle.fulfilled, (state, action) => {
        state.liking = false;
        updateArticlesCache(state, action.payload);
      })
      .addCase(unlikeArticle.rejected, (state, action) => {
        state.liking = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setCurrentPage, clearCurrentArticle } = articlesSlice.actions;
export default articlesSlice.reducer;
