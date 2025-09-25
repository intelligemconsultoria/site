import { useState, useEffect } from 'react';
import { blogService, BlogArticle } from '../services/blogService';

export function useBlog() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await blogService.getPublishedArticles();
      setArticles(data);
    } catch (err) {
      setError('Erro ao carregar artigos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchArticles = async (query: string) => {
    try {
      setLoading(true);
      const results = await blogService.searchArticles(query);
      setArticles(results);
    } catch (err) {
      setError('Erro na pesquisa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (category: string) => {
    try {
      setLoading(true);
      const results = await blogService.getArticlesByCategory(category);
      setArticles(results);
    } catch (err) {
      setError('Erro ao filtrar por categoria');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNewsletter = async (email: string) => {
    try {
      const success = await blogService.subscribeToNewsletter(email);
      if (!success) {
        throw new Error('Falha ao inscrever no newsletter');
      }
      return { success: true, message: 'Inscrição realizada com sucesso!' };
    } catch (err) {
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'Erro ao inscrever no newsletter' 
      };
    }
  };

  return {
    articles,
    loading,
    error,
    loadArticles,
    searchArticles,
    filterByCategory,
    subscribeToNewsletter
  };
}

export function useArticle(slug: string) {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadArticle(slug);
    }
  }, [slug]);

  const loadArticle = async (articleSlug: string) => {
    try {
      setLoading(true);
      const data = await blogService.getArticleBySlug(articleSlug);
      setArticle(data);
    } catch (err) {
      setError('Erro ao carregar artigo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    article,
    loading,
    error
  };
}