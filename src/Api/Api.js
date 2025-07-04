import axios from 'axios';

const API_URL = 'https://blog-platform.kata.academy/api';

export const loginUser = async (userData) => {
  const response = await axios
    .post(`${API_URL}/users/login`, {
      user: userData,
    })
    .catch((error) => {
      throw error;
    });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios
    .post(`${API_URL}/users`, {
      user: userData,
    })
    .catch((error) => {
      throw error;
    });
  return response.data;
};

export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUser = async (userData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/user`,
      {
        user: userData,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createArticle = async (articleData, token) => {
  try {
    console.log('Token in createArticle:', token);
    const response = await axios.post(
      `${API_URL}/articles`,
      { article: articleData },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data.article;
  } catch (error) {
    throw error.response.data.article;
  }
};

export const updateArticle = async (slug, articleData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/articles/${slug}`,
      {
        article: articleData,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data.article;
  } catch (error) {
    throw error.response.data.article;
  }
};

export const deleteArticle = async (slug, token) => {
  try {
    await axios.delete(`${API_URL}/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  } catch (error) {
    throw error.response.data.article;
  }
};

export const getArticleBySlug = async (slug, token) => {
  try {
    const config = {
      headers: token ? { Authorization: `Token ${token}` } : {},
    };
    const response = await axios.get(`${API_URL}/articles/${slug}`, config);
    return response.data.article;
  } catch (error) {
    throw error.response.data;
  }
};

export const favoriteArticle = async (slug, token) => {
  const response = await axios.post(
    `${API_URL}/articles/${slug}/favorite`,
    {},
    {
      headers: { Authorization: `Token ${token}` },
    }
  );
  return response.data.article;
};

export const unfavoriteArticle = async (slug, token) => {
  const response = await axios.delete(`${API_URL}/articles/${slug}/favorite`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data.article;
};
