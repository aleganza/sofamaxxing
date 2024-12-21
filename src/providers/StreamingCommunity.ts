import axios from "axios";
import { load } from "cheerio";

import Provider from "../models/provider";
import { MediaInfo, MediaResult, Search, Sources } from "../models/types";

class StreamingCommunity extends Provider {
  protected languages = ["it", "en"];
  override readonly name = "StreamingCommunity";
  protected override baseUrl = "https://streamingcommunity.family/";
  protected override logo = "https://www.animeunity.to/favicon-32x32.png";

  async search(query: string): Promise<Search<MediaResult>> {
    const res = await axios.get(this.baseUrl);
    const $ = load(res.data);

    console.log($);

    const mocksearch: Search<MediaResult> = {
      results: [],
    };

    return mocksearch;
  }

  fetchInfo(id: string): Promise<MediaInfo> {
    throw new Error("Method not implemented.");
  }

  fetchSources(id: string): Promise<Sources> {
    throw new Error("Method not implemented.");
  }
}

export default StreamingCommunity;
