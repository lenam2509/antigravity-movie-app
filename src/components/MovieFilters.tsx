import { useQuery } from '@tanstack/react-query';
import { getCountries } from '../api/ophim';
import type { MovieFilters as Filters } from '../api/ophim';

export default function MovieFilters({ filters, onChange, onReset }: {
    filters: Filters;
    onChange: (key: keyof Filters, value: string) => void;
    onReset: () => void;
}) {
    const { data: countries, isLoading, error, refetch } = useQuery({
        queryKey: ['countries'], queryFn: getCountries, staleTime: 60 * 60 * 1000,
    });
    const fieldClass = 'w-full rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-white focus:ring-1 focus:ring-primary';
    return (
        <section aria-label="Bộ lọc phim" className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold">Bộ lọc phim</h2>
                <button type="button" onClick={onReset} className="text-sm text-primary hover:underline">Xóa bộ lọc</button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                <label className="space-y-2"><span>Năm phát hành</span>
                    <select className={fieldClass} value={filters.year || ''} onChange={e => onChange('year', e.target.value)}>
                        <option value="">Tất cả</option>
                        {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i).map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </label>
                <label className="space-y-2"><span>Quốc gia</span>
                    <select className={fieldClass} value={filters.country || ''} onChange={e => onChange('country', e.target.value)}>
                        <option value="">{isLoading ? 'Đang tải...' : 'Tất cả'}</option>
                        {filters.country && !countries?.some(item => item.slug === filters.country) && <option value={filters.country}>{filters.country}</option>}
                        {countries?.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                    </select>
                </label>
                <label className="space-y-2"><span>Loại phim</span>
                    <select className={fieldClass} value={filters.type || ''} onChange={e => onChange('type', e.target.value)}>
                        <option value="">Tất cả</option><option value="single">Phim lẻ</option><option value="series">Phim bộ</option>
                    </select>
                </label>
                <label className="space-y-2"><span>Trạng thái</span>
                    <select className={fieldClass} value={filters.status || ''} onChange={e => onChange('status', e.target.value)}>
                        <option value="">Tất cả</option><option value="completed">Hoàn thành</option><option value="ongoing">Đang chiếu</option><option value="trailer">Sắp chiếu</option>
                    </select>
                </label>
                <label className="space-y-2"><span>Số phim / trang</span>
                    <select className={fieldClass} value={filters.limit || 20} onChange={e => onChange('limit', e.target.value)}>
                        {[20, 24, 40, 60].map(limit => <option key={limit} value={limit}>{limit}</option>)}
                    </select>
                </label>
            </div>
            {error && <p role="alert" className="text-sm text-red-400">Không tải được quốc gia. <button type="button" onClick={() => void refetch()} className="underline">Thử lại</button></p>}
        </section>
    );
}
