import { useEffect, useId, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { getGenres } from '../api/ophim';

export default function GenreMenu({ mobile = false, onSelect }: { mobile?: boolean; onSelect?: () => void }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const panelId = useId();
    const { data: genres, isLoading, error, refetch } = useQuery({
        queryKey: ['genres'],
        queryFn: getGenres,
        staleTime: 60 * 60 * 1000,
    });

    useEffect(() => {
        if (!open) return;
        const closeOutside = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener('pointerdown', closeOutside);
        return () => document.removeEventListener('pointerdown', closeOutside);
    }, [open]);

    return (
        <div ref={containerRef} className="relative" onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }} onKeyDown={(event) => {
            if (event.key === 'Escape' && open) {
                event.stopPropagation();
                setOpen(false);
                buttonRef.current?.focus();
            }
        }}>
            <button ref={buttonRef} type="button" aria-expanded={open} aria-controls={panelId}
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 hover:text-primary transition-colors">
                Thể loại <ChevronDown size={16} className={open ? 'rotate-180' : ''} />
            </button>
            {open && (
                <div id={panelId} className={`${mobile ? 'mt-3 w-full' : 'absolute top-full left-0 mt-3 w-96'} rounded-xl border border-white/10 bg-slate-950 p-3 shadow-2xl z-50 max-h-80 overflow-y-auto`}>
                    {isLoading ? <p role="status" className="p-2 text-gray-400">Đang tải thể loại...</p> : error ? (
                        <div className="p-2 text-gray-400">
                            <p role="alert">Không thể tải thể loại.</p>
                            <button type="button" onClick={() => void refetch()} className="mt-2 text-primary">Thử lại</button>
                        </div>
                    ) : genres?.length ? (
                        <div className="grid grid-cols-2 gap-1">
                            {genres.map(genre => (
                                <NavLink key={genre.slug} to={`/the-loai/${encodeURIComponent(genre.slug)}`}
                                    onClick={() => { setOpen(false); onSelect?.(); }}
                                    className={({ isActive }) => `rounded-lg px-3 py-2 hover:bg-white/10 ${isActive ? 'text-primary bg-white/5' : 'text-gray-200'}`}>
                                    {genre.name}
                                </NavLink>
                            ))}
                        </div>
                    ) : <p className="p-2 text-gray-400">Chưa có thể loại.</p>}
                </div>
            )}
        </div>
    );
}
