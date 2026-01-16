import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMoviesByCategory } from '../api/ophim';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { Loader2 } from 'lucide-react';

const categoryMap: Record<string, string> = {
    'phim-bo': 'Phim Bộ',
    'phim-le': 'Phim Lẻ',
    'hoat-hinh': 'Hoạt Hình',
};

const CategoryPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1');

    const { data, isLoading, error } = useQuery({
        queryKey: ['moviesByCategory', slug, currentPage],
        queryFn: () => getMoviesByCategory(slug!, currentPage),
        enabled: !!slug,
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, slug]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="text-center py-20 text-red-500">
                Đã có lỗi xảy ra khi tải danh sách phim.
            </div>
        );
    }

    const categoryTitle = categoryMap[slug || ''] || 'Danh mục';
    const totalPages = data.data.params.pagination.totalItems
        ? Math.ceil(data.data.params.pagination.totalItems / data.data.params.pagination.totalItemsPerPage)
        : 1;

    // The API response for categories has a slightly different pagination structure in some cases,
    // but based on ophim.ts, it returns APIResponse<Movie>.
    // Let's assume it matches the structure used in HomePage.

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-l-4 border-primary pl-4">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                    {categoryTitle}
                </h1>
                <span className="text-gray-400 text-sm">
                    Trang {currentPage} / {data.data.params.pagination.totalPages || totalPages}
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {data.data.items.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={data.data.params.pagination.totalPages || totalPages}
                onPageChange={(page) => setSearchParams({ page: page.toString() })}
            />
        </div>
    );
};

export default CategoryPage;
