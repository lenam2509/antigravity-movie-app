import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNewMovies } from '../api/ophim';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import HeroCarousel from '../components/HeroCarousel';
import { Loader2 } from 'lucide-react';

const HomePage: React.FC = () => {
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useQuery({
        queryKey: ['newMovies', page],
        queryFn: () => getNewMovies(page),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                Đã có lỗi xảy ra khi tải dữ liệu.
            </div>
        );
    }

    const movies = data?.data.items || [];
    const pagination = data?.data.params?.pagination;
    const totalPages = pagination ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) : 1;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            {page === 1 && movies.length > 0 && (
                <HeroCarousel movies={movies.slice(0, 6)} />
            )}

            <section className="mb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold border-l-4 border-primary pl-4 uppercase tracking-wider">
                        Phim Mới Cập Nhật
                    </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                    {movies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </section>
        </div>
    );
};

export default HomePage;
