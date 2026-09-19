import axios from "axios";
import type { Movie, MovieDetail, MovieListResponse, Episode } from "../types";

const BASE_URL = "https://vsmov.com/api";
export const IMAGE_CDN = "https://img.vsmov.com/uploads/movies/";

const api = axios.create({
  baseURL: BASE_URL,
});

interface ListPayload {
  status: boolean;
  items: Movie[];
  pagination: MovieListResponse['data']['params']['pagination'];
}

const getMovieList = async (path: string, params: Record<string, string | number>): Promise<MovieListResponse> => {
  const { data } = await api.get<ListPayload>(path, { params });
  const totalItems = Number(data?.pagination?.totalItems);
  const totalItemsPerPage = Number(data?.pagination?.totalItemsPerPage);
  if (data?.status !== true || !Array.isArray(data.items) ||
      !Number.isFinite(totalItems) || totalItems < 0 ||
      !Number.isFinite(totalItemsPerPage) || totalItemsPerPage <= 0) {
    throw new Error('Invalid movie list response');
  }
  return { data: { items: data.items, params: { pagination: { ...data.pagination, totalItems, totalItemsPerPage } } } };
};

export const getNewMovies = async (page = 1) => {
  return getMovieList('/danh-sach/phim-moi-cap-nhat', { page });
};

export const getMovieDetail = async (slug: string) => {
  const { data } = await api.get<{ status: boolean; movie: MovieDetail; episodes: Episode[] }>(`/phim/${encodeURIComponent(slug)}`);
  if (data?.status !== true || !data.movie || !Array.isArray(data.episodes)) {
    throw new Error('Invalid movie detail response');
  }
  return { data: { item: { ...data.movie, episodes: data.episodes } } };
};

export const searchMovies = async (keyword: string, page = 1) => {
  return getMovieList('/tim-kiem', { keyword, page });
};

export const getMoviesByCategory = async (category: string, page = 1) => {
  return getMovieList(`/danh-sach/${encodeURIComponent(category)}`, { page });
};

export interface Genre {
  _id: string | number;
  name: string;
  slug: string;
}

export const getGenres = async (): Promise<Genre[]> => {
  const { data } = await api.get<{ status: string; data: { items: Genre[] } }>('/the-loai');
  if (data?.status !== 'success' || !Array.isArray(data.data?.items) ||
      !data.data.items.every(genre => genre && typeof genre.name === 'string' && typeof genre.slug === 'string')) {
    throw new Error('Invalid genre list response');
  }
  return data.data.items;
};

export interface MovieFilters {
  limit?: number;
  year?: string;
  country?: string;
  type?: string;
  status?: string;
}

export const getMoviesByGenre = async (slug: string, page = 1, filters: MovieFilters = {}) => {
  const params: Record<string, string | number> = { page };
  for (const key of ['limit', 'year', 'country', 'type', 'status'] as const) {
    const value = filters[key];
    if (value !== undefined && value !== '') params[key] = value;
  }
  return getMovieList(`/the-loai/${encodeURIComponent(slug)}`, params);
};

export const getCountries = async (): Promise<Genre[]> => {
  const { data } = await api.get<{ status: string; data: { items: Genre[] } }>('/quoc-gia');
  if (data?.status !== 'success' || !Array.isArray(data.data?.items) ||
      !data.data.items.every(item => item && typeof item.name === 'string' && typeof item.slug === 'string')) {
    throw new Error('Invalid country list response');
  }
  return data.data.items;
};
