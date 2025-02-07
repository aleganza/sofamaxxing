import Provider from '../models/provider';
import { MediaInfo, MediaResult, Search, Sources } from '../models/types';
declare class AnimeUnity extends Provider {
    readonly name = "AnimeUnity";
    baseUrl: string;
    languages: string;
    colorHEX: string;
    logo: string;
    readonly forRN: boolean;
    constructor(customBaseURL?: string);
    /**
     * @param query Search query
     */
    search: (query: string) => Promise<Search<MediaResult>>;
    /**
     * @param id Anime id
     * @param page Page number
     */
    fetchInfo: (id: string, page?: number) => Promise<MediaInfo>;
    /**
     *
     * @param episodeId Episode id
     */
    fetchSources: (episodeId: string) => Promise<Sources>;
}
export default AnimeUnity;
//# sourceMappingURL=AnimeUnity.d.ts.map