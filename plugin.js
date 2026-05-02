export default {
    id: "aniworld.to.plugin",
    name: "Aniworld",
    version: "1.1.0",
    async search(query) {
        try {
            const response = await fetch(`https://aniworld.to{encodeURIComponent(query)}`);
            const html = await response.text();
            const results = [];
            
            // Sucht nach Anime-Links im HTML
            const regex = /<a href="\/anime\/stream\/(.*?)"[\s\S]*?<h3>(.*?)<\/h3>/g;
            let match;
            
            while ((match = regex.exec(html)) !== null) {
                results.push({
                    id: match[1],
                    title: match[2].replace(/<[^>]*>/g, '').trim(),
                    poster: `https://aniworld.to{match[1]}.jpg`
                });
            }
            return results;
        } catch (e) {
            return [];
        }
    },
    async getStreams(id) {
        // Platzhalter für die Stream-Abfrage
        return [];
    }
};
