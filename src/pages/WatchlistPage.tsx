import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import { Bookmark, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

const WatchlistPage: React.FC = () => {
    const { watchlist } = useWatchlist();

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Bookmark className="text-primary" size={32} /> Danh Sách Của Tôi
                </h1>
                <span className="bg-white/10 px-4 py-1.5 rounded-full text-sm text-gray-400">
                    {watchlist.length} phim đã lưu
                </span>
            </div>

            {watchlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center glass rounded-3xl border border-white/5">
                    <Film className="text-gray-600 mb-6 opacity-20" size={80} />
                    <h2 className="text-2xl font-semibold text-gray-400 mb-2">Danh sách của bạn đang trống</h2>
                    <p className="text-gray-500 mb-8 max-w-md">Hãy thêm những bộ phim yêu thích để xem lại sau bất cứ lúc nào.</p>
                    <Link
                        to="/"
                        className="px-8 py-3 bg-primary hover:bg-red-700 text-white font-bold rounded-xl transition-all"
                    >
                        KHÁM PHÁ NGAY
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {watchlist.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WatchlistPage;
