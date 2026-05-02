const domain = "https://aniworld.to";

async function search(query) {
    const response = await fetch(`${domain}/suche?q=${encodeURIComponent(query)}`);
    const html = await response.text();
    // Sucht nach Anime-Links und Titeln
    const matches = [...html.matchAll(/<a href="(\/anime\/stream\/.*?)" title="(.*?)">/g)];
    return matches.map(m => ({
        name: m[2],
        url: domain + m[1],
        poster: domain + "/public/img/logo.png" // Platzhalter für das Logo
    }));
}

async function getEpisodes(url) {
    const response = await fetch(url);
    const html = await response.text();
    // Sucht nach den Folgen-Links
    const matches = [...html.matchAll(/<a title=".*?" href="(.*?)">(\d+)<\/a>/g)];
    return matches.map(m => ({
        name: "Folge " + m[2],
        url: domain + m[1]
    }));
}

async function getStreamUrls(url) {
    const response = await fetch(url);
    const html = await response.text();
    // Sucht nach dem Video-Link (Voe, Doodstream etc.)
    const link = html.match(/data-link-target="(.*?)"/);
    return link ? [{ url: link[1], quality: "720p", type: "hls" }] : [];
}

module.exports = { search, getEpisodes, getStreamUrls };
