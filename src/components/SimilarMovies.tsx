import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMoviesByCategory, getNewMovies } from '../api/ophim';
import MovieCard from './MovieCard';
import { Loader2 } from 'lucide-react';

interface SimilarMoviesProps {
    categorySlug: string;
    currentMovieId: string;
}

const SimilarMovies: React.FC<SimilarMoviesProps> = ({ categorySlug, currentMovieId }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['similarMovies', categorySlug],
        queryFn: async () => {
            try {
                // Try to get by category slug
                const res = await getMoviesByCategory(categorySlug);
                return res.data;
            } catch (err) {
                // Fallback to new movies if category fails
                const res = await getNewMovies();
                return res.data;
            }
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    const movies = data?.items?.filter(m => m._id !== currentMovieId).slice(0, 6) || [];

    if (movies.length === 0) return null;

    return (
        <section className="space-y-6 pt-12 border-t border-white/5">
            <h3 className="text-2xl font-bold border-l-4 border-primary pl-4">PHIM TƯƠNG TỰ</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>
        </section>
    );
};

export default SimilarMovies;
