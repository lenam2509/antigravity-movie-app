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
  if (data?.status !== true || !Array.isArray(data.items) ||
      !Number.isFinite(data.pagination?.totalItems) || data.pagination.totalItems < 0 ||
      !Number.isFinite(data.pagination?.totalItemsPerPage) || data.pagination.totalItemsPerPage <= 0) {
    throw new Error('Invalid movie list response');
  }
  return { data: { items: data.items, params: { pagination: data.pagination } } };
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
