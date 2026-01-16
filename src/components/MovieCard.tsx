import React from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';
import { IMAGE_CDN } from '../api/ophim';
import { Play } from 'lucide-react';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const imageUrl = movie.thumb_url.startsWith('http')
        ? movie.thumb_url
        : `${IMAGE_CDN}${movie.thumb_url}`;

    return (
        <Link
            to={`/phim/${movie.slug}`}
            className="group relative flex flex-col bg-slate-900/50 rounded-2xl overflow-hidden movie-card-shadow transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/20 animate-fade-in"
        >
            <div className="aspect-[2/3] w-full overflow-hidden relative">
                <img
                    src={imageUrl}
                    alt={movie.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Year Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 glass rounded-lg text-[10px] font-bold text-white z-10 flex items-center gap-1">
                    {movie.year}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 shadow-xl shadow-primary/40">
                        <Play fill="white" size={20} className="ml-1" />
                    </div>
                </div>
            </div>

            {/* Info Container */}
            <div className="p-3 flex flex-col flex-grow glass border-0 border-t border-white/5">
                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                    {movie.name}
                </h3>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 uppercase tracking-tight opacity-70">
                    {movie.origin_name}
                </p>
            </div>
        </Link>
    );
};

export default MovieCard;
