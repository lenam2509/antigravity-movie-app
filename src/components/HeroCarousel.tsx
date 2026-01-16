import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { IMAGE_CDN } from '../api/ophim';
import type { Movie } from '../types';

interface HeroCarouselProps {
    movies: Movie[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ movies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [movies.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
    };

    if (!movies.length) return null;

    const movie = movies[currentIndex];

    return (
        <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden rounded-3xl mb-12 group">
            {/* Background Image */}
            <div
                className="absolute inset-0 transition-all duration-1000 ease-in-out scale-105"
                style={{
                    backgroundImage: `url(${movie.poster_url.startsWith('http') ? movie.poster_url : `${IMAGE_CDN}${movie.poster_url}`})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 20%',
                }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
                <div className="space-y-4 animate-in fade-in slide-in-from-left duration-700">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                        Nổi bật
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-md cursor-default">
                        {movie.name}
                    </h1>
                    <p className="text-lg text-gray-300 italic mb-4 cursor-default">
                        {movie.origin_name} ({movie.year})
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate(`/phim/${movie.slug}`)}
                            className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-red-700 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-xl shadow-primary/20"
                        >
                            <Play fill="white" size={20} /> XEM NGAY
                        </button>
                        <button
                            onClick={() => navigate(`/phim/${movie.slug}`)}
                            className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl backdrop-blur-md transition-all"
                        >
                            <Info size={20} /> CHI TIẾT
                        </button>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 right-8 flex gap-2">
                {movies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 transition-all duration-300 rounded-full ${index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
