export default {
    id: "aniworld.to.plugin",
    name: "Aniworld",
    version: "1.0.0",
    async search(query) {
        // Test-Eintrag um zu sehen, ob das Repo funktioniert
        return [{
            id: "test",
            title: "Aniworld Test - Suche nach: " + query,
            poster: "https://aniworld.to"
        }];
    }
};
