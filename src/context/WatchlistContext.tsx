import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Movie } from '../types';

interface WatchlistContextType {
    watchlist: Movie[];
    addToWatchlist: (movie: Movie) => void;
    removeFromWatchlist: (movieId: Movie['_id']) => void;
    isInWatchlist: (movieId: Movie['_id']) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [watchlist, setWatchlist] = useState<Movie[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('watchlist');
        if (stored) {
            try {
                setWatchlist(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse watchlist from localStorage', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    const addToWatchlist = (movie: Movie) => {
        setWatchlist((prev) => {
            if (prev.find(m => m._id === movie._id)) return prev;
            return [...prev, movie];
        });
    };

    const removeFromWatchlist = (movieId: Movie['_id']) => {
        setWatchlist((prev) => prev.filter(m => m._id !== movieId));
    };

    const isInWatchlist = (movieId: Movie['_id']) => {
        return !!watchlist.find(m => m._id === movieId);
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};

export const useWatchlist = () => {
    const context = useContext(WatchlistContext);
    if (context === undefined) {
        throw new Error('useWatchlist must be used within a WatchlistProvider');
    }
    return context;
};
