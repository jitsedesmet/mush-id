import * as sitemap from 'super-sitemap';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    return await sitemap.response({
        origin: 'https://mush-id.jitsedesmet.be',
        excludeRoutePatterns: [
            '^/9789050117548'
        ]
    });
};
