import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createNewArticle } from '@/store/slices/articlesSlice.js';
import ArticleForm from '../ArticleForm.jsx';

export default function CreateArticle() {
  const [tags, setTags] = React.useState(['']);
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

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
      await dispatch(createNewArticle(articleData)).unwrap();
      history.push('/');
    } catch (error) {
      console.error('Article submission error:', error);
    }
  };

  return (
    <ArticleForm
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      tags={tags}
      handleTagChange={handleTagChange}
      handleAddTag={handleAddTag}
      handleDeleteTag={handleDeleteTag}
      onSubmit={onSubmit}
      isEdit={false}
    />
  );
}
