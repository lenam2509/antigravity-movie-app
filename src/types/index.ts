export interface Movie {
    _id: string;
    name: string;
    slug: string;
    thumb_url: string;
    poster_url: string;
    year: number;
    origin_name: string;
}

export interface Episode {
    server_name: string;
    server_data: {
        name: string;
        slug: string;
        link_embed: string;
        link_m3u8: string;
    }[];
}

export interface MovieDetail extends Movie {
    content: string;
    status: string;
    time: string;
    episode_current: string;
    quality: string;
    lang: string;
    actor: string[];
    director: string[];
    category: { name: string; slug: string }[];
    country: { name: string; slug: string }[];
    episodes: Episode[];
}

export interface APIResponse<T> {
    status: string;
    data: {
        items?: T[];
        item?: T;
        params?: {
            pagination: {
                totalItems: number;
                totalItemsPerPage: number;
                currentPage: number;
            };
        };
        APP_DOMAIN_CDN_IMAGE: string;
    };
}
