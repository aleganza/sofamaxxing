import { StreamingServers } from "@consumet/extensions";
import Zoro from "@consumet/extensions/dist/providers/anime/zoro";

test("crawl", async () => {
  const api = new Zoro();

  const search = await api.search("DanDaDan");
  const id = search.results[0].id;

  const info = await api.fetchAnimeInfo(id);
  const episodeId = info.episodes ? info.episodes[11].id : '';
  
  const sources = await api.fetchEpisodeSources(episodeId);

  console.log(sources);
});
