const IMAGE_CDN = 'https://img.vsmov.com/uploads/movies/';
export const MOVIE_PLACEHOLDER = '/movie-placeholder.svg';

export function getMovieImageUrl(value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) return MOVIE_PLACEHOLDER;
    const path = value.trim();
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('//')) return `https:${path}`;
    return `${IMAGE_CDN}${path.replace(/^\/+/, '')}`;
}
