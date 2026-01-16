import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovieDetail, IMAGE_CDN } from '../api/ophim';
import { Loader2, Play, Calendar, Film, Clock, Plus, Check } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import SimilarMovies from '../components/SimilarMovies';

const MovieDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [activeEpisode, setActiveEpisode] = useState<{ name: string; link: string } | null>(null);
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

    const { data, isLoading, error } = useQuery({
        queryKey: ['movieDetail', slug],
        queryFn: () => getMovieDetail(slug!),
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (error || !data?.data.item) {
        return (
            <div className="text-center py-20 text-red-500">
                Không tìm thấy thông tin phim.
            </div>
        );
    }

    const movie = data.data.item;
    const episodes = movie.episodes[0]?.server_data || [];

    const handleSelectEpisode = (epName: string, epLink: string) => {
        setActiveEpisode({ name: epName, link: epLink });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Player Section */}
            {activeEpisode && (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black movie-card-shadow">
                    <iframe
                        src={activeEpisode.link}
                        className="w-full h-full border-none"
                        allowFullScreen
                    />
                </div>
            )}

            {/* Movie Info Section */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Poster */}
                <div className="w-2/3 max-w-[300px] mx-auto md:mx-0 md:w-1/3 lg:w-1/4 shrink-0">
                    <div className="rounded-2xl overflow-hidden movie-card-shadow aspect-[2/3]">
                        <img
                            src={movie.thumb_url.startsWith('http') ? movie.thumb_url : `${IMAGE_CDN}${movie.thumb_url}`}
                            alt={movie.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {!activeEpisode && episodes.length > 0 && (
                        <button
                            onClick={() => handleSelectEpisode(episodes[0].name, episodes[0].link_embed)}
                            className="w-full mt-6 py-4 bg-primary hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                        >
                            <Play fill="white" size={20} /> XEM PHIM NGAY
                        </button>
                    )}

                    <div className="mt-4">
                        {isInWatchlist(movie._id) ? (
                            <button
                                onClick={() => removeFromWatchlist(movie._id)}
                                className="w-full py-3 bg-white/10 hover:bg-red-500/20 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10 hover:border-red-500/50"
                            >
                                <Check size={18} className="text-green-500" /> ĐÃ THÊM VÀO DANH SÁCH
                            </button>
                        ) : (
                            <button
                                onClick={() => addToWatchlist(movie)}
                                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10"
                            >
                                <Plus size={18} /> THÊM VÀO DANH SÁCH
                            </button>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="flex-grow">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{movie.name}</h1>
                    <h2 className="text-xl text-gray-400 mb-6 italic">{movie.origin_name}</h2>

                    <div className="flex flex-wrap gap-4 mb-8 text-sm">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full">
                            <Calendar size={14} className="text-primary" /> {movie.year}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full">
                            <Clock size={14} className="text-primary" /> {movie.time}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full">
                            {movie.quality} | {movie.lang}
                        </span>
                    </div>

                    <div className="space-y-4 text-gray-300 leading-relaxed">
                        <p className="border-l-4 border-primary pl-4 py-1 font-semibold text-white">Nội dung phim</p>
                        <div dangerouslySetInnerHTML={{ __html: movie.content }} className="text-sm md:text-base opacity-80" />
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 glass rounded-xl">
                            <span className="text-gray-400 block mb-1">Đạo diễn</span>
                            <span className="text-white">{movie.director.join(', ') || 'Đang cập nhật'}</span>
                        </div>
                        <div className="p-4 glass rounded-xl">
                            <span className="text-gray-400 block mb-1">Diễn viên</span>
                            <span className="text-white line-clamp-2">{movie.actor.join(', ') || 'Đang cập nhật'}</span>
                        </div>
                        <div className="p-4 glass rounded-xl">
                            <span className="text-gray-400 block mb-1">Thể loại</span>
                            <span className="text-white">{movie.category.map(c => c.name).join(', ')}</span>
                        </div>
                        <div className="p-4 glass rounded-xl">
                            <span className="text-gray-400 block mb-1">Quốc gia</span>
                            <span className="text-white">{movie.country.map(c => c.name).join(', ')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Episode Selection */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Film className="text-primary" /> Danh sách tập phim
                </h3>
                <div className="flex flex-wrap gap-3">
                    {episodes.map((ep) => (
                        <button
                            key={ep.slug}
                            onClick={() => handleSelectEpisode(ep.name, ep.link_embed)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeEpisode?.name === ep.name
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'bg-white/10 hover:bg-white/20 text-gray-300'
                                }`}
                        >
                            Tập {ep.name}
                        </button>
                    ))}
                </div>
            </div>

            {movie.category.length > 0 && (
                <SimilarMovies
                    categorySlug={movie.category[0].slug}
                    currentMovieId={movie._id}
                />
            )}
        </div>
    );
};

export default MovieDetailPage;
