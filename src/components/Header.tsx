import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Menu, X, Loader2, Bookmark } from 'lucide-react';
import { searchMovies, IMAGE_CDN } from '../api/ophim';
import type { Movie } from '../types';
import { useWatchlist } from '../context/WatchlistContext';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);

    const { watchlist } = useWatchlist();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setShowResults(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const response = await searchMovies(searchQuery);
                    setSearchResults(response.data.items?.slice(0, 8) || []);
                    setShowResults(true);
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleResultClick = (slug: string) => {
        navigate(`/phim/${slug}`);
        setSearchQuery('');
        setShowResults(false);
    };

    return (
        <header className="sticky top-0 z-50 glass">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter">
                    <Film size={32} />
                    <span>Antigravity</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link to="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
                    <Link to="/category/phim-bo" className="hover:text-primary transition-colors">Phim Bộ</Link>
                    <Link to="/category/phim-le" className="hover:text-primary transition-colors">Phim Lẻ</Link>
                    <Link to="/category/hoat-hinh" className="hover:text-primary transition-colors">Hoạt Hình</Link>
                    <Link to="/watchlist" className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Bookmark size={16} />
                        Danh Sách {watchlist.length > 0 && <span className="bg-primary text-white text-[10px] px-1.5 rounded-full">{watchlist.length}</span>}
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block" ref={searchRef}>
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm phim..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
                                className="bg-slate-900/60 border border-white/30 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-hidden focus:ring-1 focus:ring-primary w-48 lg:w-64 transition-all placeholder:text-gray-400"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            {isLoading && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin" size={16} />
                            )}
                        </form>

                        {/* Search Results Dropdown */}
                        {showResults && (searchResults.length > 0 || isLoading) && (
                            <div className="absolute top-full right-0 mt-2 w-72 lg:w-96 glass-dark rounded-xl overflow-hidden shadow-2xl border border-white/10 z-50">
                                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                    {isLoading ? (
                                        <div className="p-4 text-center text-sm text-gray-400">Đang tìm kiếm...</div>
                                    ) : (
                                        searchResults.map((movie) => (
                                            <div
                                                key={movie._id}
                                                onClick={() => handleResultClick(movie.slug)}
                                                className="flex gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                            >
                                                <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0">
                                                    <img
                                                        src={movie.thumb_url.startsWith('http') ? movie.thumb_url : `${IMAGE_CDN}${movie.thumb_url}`}
                                                        alt={movie.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-center overflow-hidden">
                                                    <h4 className="text-sm font-semibold text-white truncate">{movie.name}</h4>
                                                    <p className="text-xs text-gray-400 truncate">{movie.origin_name}</p>
                                                    <p className="text-xs text-primary mt-1">{movie.year}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {!isLoading && searchResults.length === 0 && searchQuery.length >= 2 && (
                                    <div className="p-4 text-center text-sm text-gray-400">Không tìm thấy kết quả</div>
                                )}
                            </div>
                        )}
                    </div>

                    <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden glass border-t border-white/10 animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col p-4 gap-4 text-sm font-medium">
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Trang Chủ</Link>
                        <Link to="/category/phim-bo" onClick={() => setIsMenuOpen(false)}>Phim Bộ</Link>
                        <Link to="/category/phim-le" onClick={() => setIsMenuOpen(false)}>Phim Lẻ</Link>
                        <Link to="/category/hoat-hinh" onClick={() => setIsMenuOpen(false)}>Hoạt Hình</Link>
                        <Link to="/watchlist" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                            <Bookmark size={16} /> Danh Sách ({watchlist.length})
                        </Link>
                        <form onSubmit={handleSearch} className="relative mt-2">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-full pl-10 pr-4 py-2 text-sm"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </form>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
