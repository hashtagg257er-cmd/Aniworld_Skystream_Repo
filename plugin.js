export default {
    id: "com.mein.aniworld",
    name: "AniWorld",
    version: "1.0.0",

    async search(query) {
        const res = await fetch(`https://aniworld.to{encodeURIComponent(query)}`);
        const data = await res.json();
        return data.map(item => ({
            title: item.title.replace(/<[^>]*>?/gm, ''),
            url: `https://aniworld.to${item.link}`,
            poster: `https://aniworld.to{item.link.split('/').pop()}.jpg`,
            type: 'series'
        }));
    },

    async getDetails(url) {
        const res = await fetch(url);
        const html = await res.text();
        const episodes = [];
        const matches = [...html.matchAll(/href="([^"]+)" title="([^"]+)"/g)];
        
        for (const m of matches) {
            if (m[1].includes("/staffel-")) {
                episodes.push({
                    title: m[2],
                    url: `https://aniworld.to${m[1]}`
                });
            }
        }
        return { title: "Anime Details", episodes };
    },

    async getStream(url) {
        const res = await fetch(url);
        const html = await res.text();
        const streams = [];
        const voe = html.match(/data-link-target="([^"]+)"[^>]*VOE/i);
        if (voe) streams.push({ name: "VOE", url: voe[1], type: "video" });
        const dood = html.match(/data-link-target="([^"]+)"[^>]*Doodstream/i);
        if (dood) streams.push({ name: "Doodstream", url: dood[1], type: "video" });
        return streams;
    },

    async getHome() {
        return [];
    }
};
