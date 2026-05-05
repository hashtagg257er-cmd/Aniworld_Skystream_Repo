export default {
    id: "com.mein.aniworld",
    name: "AniWorld",
    version: "1.0.0",

    async search(query) {
        try {
            if (!query || query.trim() === '') {
                return [];
            }
            const searchUrl = `https://aniworld.to/search?q=${encodeURIComponent(query)}`;
            const res = await fetch(searchUrl);
            
            if (!res.ok) {
                console.error(`Search API error: ${res.status}`);
                return [];
            }
            
            const data = await res.json();
            
            if (!Array.isArray(data)) {
                console.error('Invalid search response');
                return [];
            }
            
            return data.map(item => ({
                title: item.title ? item.title.replace(/<[^>]*>?/gm, '') : 'Unknown',
                url: item.link ? `https://aniworld.to${item.link}` : '',
                poster: item.poster ? `https://aniworld.to${item.poster}` : "https://via.placeholder.com/300x400?text=No+Image",
                type: 'series'
            })).filter(item => item.url); // Filter out invalid entries
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    },

    async getDetails(url) {
        try {
            if (!url) {
                return { title: "Error", episodes: [] };
            }
            
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Details API error: ${res.status}`);
                return { title: "Error", episodes: [] };
            }
            
            const html = await res.text();
            const episodes = [];
            
            // Extract series title from HTML
            const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
            const title = titleMatch ? titleMatch[1].trim() : "Anime Details";
            
            // Better episode extraction - look for season/episode links
            const matches = [...html.matchAll(/href="([^"]*\/staffel-\d+[^"]*)"[^>]*>([^<]+)<\/a>/gi)];
            
            for (const m of matches) {
                if (m[1] && m[2]) {
                    episodes.push({
                        title: m[2].trim(),
                        url: m[1].startsWith('http') ? m[1] : `https://aniworld.to${m[1]}`
                    });
                }
            }
            
            // Remove duplicates
            const uniqueEpisodes = Array.from(new Map(episodes.map(ep => [ep.url, ep])).values());
            
            return { 
                title: title, 
                episodes: uniqueEpisodes.length > 0 ? uniqueEpisodes : []
            };
        } catch (error) {
            console.error('getDetails error:', error);
            return { title: "Error", episodes: [] };
        }
    },

    async getStream(url) {
        try {
            if (!url) {
                return [];
            }
            
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Stream API error: ${res.status}`);
                return [];
            }
            
            const html = await res.text();
            const streams = [];
            
            // VOE Stream
            const voe = html.match(/data-link-target="([^"]+)"[^>]*(?:title="VOE"[^>]*)?>\s*VOE/i) ||
                       html.match(/VOE[^>]*data-link-target="([^"]+)"/i);
            if (voe && voe[1]) {
                streams.push({ 
                    name: "VOE", 
                    url: voe[1], 
                    type: "video",
                    quality: "auto"
                });
            }
            
            // Doodstream
            const dood = html.match(/data-link-target="([^"]+)"[^>]*(?:title="Doodstream"[^>]*)?>\s*Doodstream/i) ||
                        html.match(/Doodstream[^>]*data-link-target="([^"]+)"/i);
            if (dood && dood[1]) {
                streams.push({ 
                    name: "Doodstream", 
                    url: dood[1], 
                    type: "video",
                    quality: "auto"
                });
            }
            
            // Streamtape
            const streamtape = html.match(/data-link-target="([^"]+)"[^>]*(?:title="Streamtape"[^>]*)?>\s*Streamtape/i) ||
                              html.match(/Streamtape[^>]*data-link-target="([^"]+)"/i);
            if (streamtape && streamtape[1]) {
                streams.push({ 
                    name: "Streamtape", 
                    url: streamtape[1], 
                    type: "video",
                    quality: "auto"
                });
            }
            
            return streams.length > 0 ? streams : [];
        } catch (error) {
            console.error('getStream error:', error);
            return [];
        }
    },

    async getHome() {
        try {
            // Return empty array or trending animes if API supports it
            return [];
        } catch (error) {
            console.error('getHome error:', error);
            return [];
        }
    }
};
