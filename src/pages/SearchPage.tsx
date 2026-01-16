import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchMovies } from '../api/ophim';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { Loader2, Search } from 'lucide-react';

const SearchPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const pageParam = parseInt(searchParams.get('page') || '1');
    const [page, setPage] = useState(pageParam);

    // Sync state with URL param if it changes (e.g. from header search)
    useEffect(() => {
        setPage(pageParam);
    }, [pageParam, keyword]);

    const { data, isLoading } = useQuery({
        queryKey: ['searchMovies', keyword, page],
        queryFn: () => searchMovies(keyword, page),
        enabled: !!keyword,
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        setSearchParams({ keyword, page: newPage.toString() });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!keyword) {
        return (
            <div className="text-center py-20 flex flex-col items-center gap-4">
                <Search size={64} className="text-gray-600" />
                <p className="text-xl text-gray-400">Nhập từ khóa để tìm kiếm phim.</p>
            </div>
        );
    }

    const movies = data?.data.items || [];
    const pagination = data?.data.params?.pagination;
    const totalPages = pagination ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) : 1;

    return (
        <div>
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    Kết quả tìm kiếm cho: <span className="text-primary">"{keyword}"</span>
                </h2>

                {movies.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">Không tìm thấy phim nào phù hợp với từ khóa này.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {movies.map((movie) => (
                                <MovieCard key={movie._id} movie={movie} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </section>
        </div>
    );
};

export default SearchPage;
