import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGenres, getMoviesByCategory, getMoviesByGenre } from '../api/ophim';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { Loader2 } from 'lucide-react';
import MovieFilters from '../components/MovieFilters';
import type { MovieFilters as Filters } from '../api/ophim';

const categoryMap: Record<string, string> = {
    'phim-bo': 'Phim Bộ',
    'phim-le': 'Phim Lẻ',
    'hoat-hinh': 'Hoạt Hình',
};

const CategoryPage: React.FC<{ genre?: boolean }> = ({ genre = false }) => {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedPage = Number(searchParams.get('page') || '1');
    const currentPage = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = Number(searchParams.get('limit') || 20);
    const year = searchParams.get('year') || '';
    const filters: Filters = {
        limit: [20, 24, 40, 60].includes(limit) ? limit : 20,
        year: /^\d{4}$/.test(year) && Number(year) >= 1900 && Number(year) <= new Date().getFullYear() ? year : '',
        country: searchParams.get('country') || '',
        type: ['single', 'series'].includes(searchParams.get('type') || '') ? searchParams.get('type')! : '',
        status: ['completed', 'ongoing', 'trailer'].includes(searchParams.get('status') || '') ? searchParams.get('status')! : '',
    };
    const updateFilter = (key: keyof Filters, value: string) => {
        setSearchParams(previous => {
            const next = new URLSearchParams(previous);
            if (value) next.set(key, value);
            else next.delete(key);
            next.delete('page');
            return next;
        });
    };

    const { data: genres } = useQuery({
        queryKey: ['genres'],
        queryFn: getGenres,
        enabled: genre,
        staleTime: 60 * 60 * 1000,
    });

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [genre ? 'moviesByGenre' : 'moviesByCategory', slug, currentPage, genre ? filters : null],
        queryFn: () => genre ? getMoviesByGenre(slug!, currentPage, filters) : getMoviesByCategory(slug!, currentPage),
        enabled: !!slug,
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, slug]);

    const categoryTitle = genre
        ? genres?.find(item => item.slug === slug)?.name || slug?.replaceAll('-', ' ') || 'Thể loại'
        : categoryMap[slug || ''] || 'Danh mục';
    const pagination = data?.data.params.pagination;
    const totalPages = pagination ? Math.max(1, Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)) : 1;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-l-4 border-primary pl-4">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                    {categoryTitle}
                </h1>
                {data && <span className="text-gray-400 text-sm">Trang {currentPage} / {totalPages}</span>}
            </div>

            {genre && <MovieFilters filters={filters} onChange={updateFilter} onReset={() => {
                setSearchParams(previous => {
                    const next = new URLSearchParams(previous);
                    ['limit', 'year', 'country', 'type', 'status', 'page'].forEach(key => next.delete(key));
                    return next;
                });
            }} />}

            {isLoading ? <div role="status" aria-label="Đang tải phim" className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={48} /></div>
                : error || !data ? <div role="alert" className="text-center py-20 text-red-500">Đã có lỗi xảy ra khi tải danh sách phim. <button onClick={() => void refetch()} className="underline">Thử lại</button></div>
                : <>
            {data.data.items.length === 0 && <p className="py-12 text-center text-gray-400">Không tìm thấy phim phù hợp.</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {data.data.items.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setSearchParams(previous => {
                    const next = new URLSearchParams(previous);
                    next.set('page', page.toString());
                    return next;
                })}
            />
            </>}
        </div>
    );
};

export default CategoryPage;
