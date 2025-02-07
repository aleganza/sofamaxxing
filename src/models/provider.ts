import { Search, MediaResult, MediaInfo, Sources } from "./types";
import { UnifiedMediaInfo, UnifiedMediaResult, UnifiedSearch, UnifiedSources } from "./unifiedTypes";

abstract class Provider {
  abstract readonly name: string;

  baseUrl: string = "";

  readonly CDNUrl: string | null = null;

  abstract readonly languages: string | string[];

  readonly colorHEX: string | null = null;

  readonly logo: string =
    "https://png.pngtree.com/png-vector/20210221/ourmid/pngtree-error-404-not-found-neon-effect-png-image_2928214.jpg";

  /**
   * means that this provider uses react-native-cheerio,
   * so that can work for React Native projects
   */
  abstract readonly forRN: boolean

  constructor(customBaseURL?: string) {
    if (customBaseURL) {
      if (!customBaseURL.startsWith("https://")) {
        throw new Error(`Invalid URL: "${customBaseURL}". The base URL must start with "https://".`);
      }
      this.baseUrl = customBaseURL;
    }
  }

  abstract search(query: string, ...args: any): Promise<UnifiedSearch<UnifiedMediaResult>>;

  abstract fetchInfo(id: string | number, ...args: any): Promise<UnifiedMediaInfo>;

  abstract fetchSources(id: string | number, ...args: any): Promise<UnifiedSources>;
}

export default Provider;
