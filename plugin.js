export default {
    id: "aniworld.to.plugin",
    name: "Aniworld",
    version: "1.3.0",
    async search(query) {
        try {
            const response = await fetch(`https://aniworld.to{encodeURIComponent(query)}`);
            const html = await response.text();
            const results = [];
            const regex = /<a href="\/anime\/stream\/(.*?)"[\s\S]*?<h3>(.*?)<\/h3>/g;
            let match;
            while ((match = regex.exec(html)) !== null) {
                results.push({
                    id: match[1],
                    title: match[2].replace(/<[^>]*>/g, '').trim(),
                    poster: `https://aniworld.to{match[1].split('/')[0]}.jpg`
                });
            }
            return results;
        } catch (e) { return []; }
    },

    async getStreams(id) {
        try {
            const response = await fetch(`https://aniworld.to{id}`);
            const html = await response.text();
            const streams = [];

            // Erkennt automatisch verschiedene Hoster wie VOE, Vidoza, Streamtape, Doodstream
            // Wir suchen nach dem data-link-target Attribut der Hoster-Buttons
            const hosterRegex = /data-link-target="(https:\/\/(voe\.sx|vidoza\.net|streamtape\.com|dood|doodstream).*?)"[\s\S]*?<h4.*?>(.*?)<\/h4>/g;
            let match;
            
            while ((match = hosterRegex.exec(html)) !== null) {
                streams.push({
                    name: match[3].trim() || "Unbekannter Hoster",
                    url: match[1],
                    quality: "HD"
                });
            }

            // Falls die obere Suche nichts findet, probieren wir eine alternative Suche für Hoster-Namen
            if (streams.length === 0) {
                 const altRegex = /<li[\s\S]*?data-link-target="(.*?)">[\s\S]*?<i class=".*?">[\s\S]*?<h4>(.*?)<\/h4>/g;
                 while ((match = altRegex.exec(html)) !== null) {
                    streams.push({
                        name: match[2].trim(),
                        url: match[1],
                        quality: "HD"
                    });
                }
            }

            return streams;
        } catch (e) { return []; }
    }
};
