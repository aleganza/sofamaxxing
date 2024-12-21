import { Search, MediaResult, MediaInfo, Sources } from "./types";

abstract class Provider {
  abstract readonly name: string;

  protected abstract readonly baseUrl: string;

  protected readonly CDNUrl: string | null = null;

  protected abstract readonly languages: string | string[];

  protected readonly colorHEX: string | null = null;

  protected readonly logo: string =
    "https://png.pngtree.com/png-vector/20210221/ourmid/pngtree-error-404-not-found-neon-effect-png-image_2928214.jpg";

  abstract search(query: string, ...args: any): Promise<Search<MediaResult>>;

  abstract fetchInfo(id: string | number, ...args: any): Promise<MediaInfo>;

  abstract fetchSources(id: string | number, ...args: any): Promise<Sources>;
}

export default Provider;
