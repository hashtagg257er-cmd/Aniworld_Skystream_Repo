const domain = "https://aniworld.to";

async function search(query) {
    const res = await fetch(`${domain}/suche?q=${encodeURIComponent(query)}`);
    const html = await res.text();
    const matches = [...html.matchAll(/<a href="\/anime\/stream\/(.*?)" title="(.*?)">/g)];
    return matches.map(m => ({ 
        name: m[2], 
        url: domain + "/anime/stream/" + m[1],
        poster: `https://aniworld.to{m[1]}.jpg`
    }));
}

async function getEpisodes(url) {
    const res = await fetch(url);
    const html = await res.text();
    const matches = [...html.matchAll(/<a title=".*?" href="(.*?)">(\d+)<\/a>/g)];
    return matches.map(m => ({ name: "Folge " + m[2], url: domain + m[1] }));
}

async function getStreamUrls(url) {
    const res = await fetch(url);
    const html = await res.text();
    const link = html.match(/data-link-target="(.*?)"/);
    return link ? [{ url: link[1], quality: "720p" }] : [];
}

module.exports = { search, getEpisodes, getStreamUrls };
