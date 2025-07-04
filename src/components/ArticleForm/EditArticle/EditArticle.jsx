import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateArticleBySlug, fetchArticleBySlug } from '@/store/slices/articlesSlice.js';
import ArticleForm from '../ArticleForm.jsx';

export default function EditArticle() {
  const { slug } = useParams();
  const [tags, setTags] = React.useState(['']);
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentArticle } = useSelector((state) => state.articles);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ mode: 'onBlur' });

  React.useEffect(() => {
    dispatch(fetchArticleBySlug(slug));
  }, [slug, dispatch]);

  React.useEffect(() => {
    if (currentArticle) {
      setValue('title', currentArticle.title);
      setValue('description', currentArticle.description);
      setValue('body', currentArticle.body);
      setTags(currentArticle.tagList.length > 0 ? [...currentArticle.tagList, ''] : ['']);
    }
  }, [currentArticle, setValue]);

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
      await dispatch(updateArticleBySlug({ slug, articleData })).unwrap();
      history.push(`/articles/${slug}`);
    } catch (error) {
      console.error('Article update error:', error);
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
      isEdit={true}
    />
  );
}
