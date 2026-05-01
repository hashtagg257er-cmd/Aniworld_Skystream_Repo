const domain = "https://aniworld.to";

async function search(q) {
    const r = await fetch(`${domain}/suche?q=${encodeURIComponent(q)}`);
    const h = await r.text();
    const m = [...h.matchAll(/<a href="\/anime\/stream\/(.*?)" title="(.*?)">/g)];
    return m.map(x => ({ name: x[2], url: domain + "/anime/stream/" + x[1] }));
}

async function getEpisodes(u) {
    const r = await fetch(u);
    const h = await r.text();
    const m = [...h.matchAll(/<a title=".*?" href="(.*?)">(\d+)<\/a>/g)];
    return m.map(x => ({ name: "Folge " + x[2], url: domain + x[1] }));
}

async function getStreamUrls(u) {
    const r = await fetch(u);
    const h = await r.text();
    const l = h.match(/data-link-target="(.*?)"/);
    return l ? [{ url: l[1], quality: "720p" }] : [];
}

module.exports = { search, getEpisodes, getStreamUrls };
