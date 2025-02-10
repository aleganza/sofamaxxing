import HiAnime from "../src/providers/HiAnime";

test("crawl", async () => {
  const api = new HiAnime();

  const search = await api.search("naruto-shippuden");
  const id = search.results[0].id;

  const info = await api.fetchInfo(id);
  const episodeId = info.episodes ? info.episodes[0].id : '';
  
  const sources = await api.fetchSources("naruto-shippuden-355$episode$7882$both")

  console.log(sources);
});
