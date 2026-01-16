import axios from 'axios';
import type { Movie, MovieDetail, APIResponse } from '../types';

const BASE_URL = 'https://ophim1.com/v1/api';
export const IMAGE_CDN = 'https://img.ophim.live/uploads/movies/';

const api = axios.create({
    baseURL: BASE_URL,
});

export const getNewMovies = async (page = 1) => {
    const response = await api.get<APIResponse<Movie>>(`/danh-sach/phim-moi-cap-nhat?page=${page}`);
    return response.data;
};

export const getMovieDetail = async (slug: string) => {
    const response = await api.get<APIResponse<MovieDetail>>(`/phim/${slug}`);
    return response.data;
};

export const searchMovies = async (keyword: string, page = 1) => {
    const response = await api.get<APIResponse<Movie>>(`/tim-kiem?keyword=${keyword}&page=${page}`);
    return response.data;
};

export const getMoviesByCategory = async (category: string, page = 1) => {
    const response = await api.get<APIResponse<Movie>>(`/danh-sach/${category}?page=${page}`);
    return response.data;
};
