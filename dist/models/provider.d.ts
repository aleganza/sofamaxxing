import { UnifiedMediaInfo, UnifiedMediaResult, UnifiedSearch, UnifiedSources } from "./unifiedTypes";
declare abstract class Provider {
    abstract readonly name: string;
    baseUrl: string;
    readonly CDNUrl: string | null;
    abstract readonly languages: string | string[];
    readonly colorHEX: string | null;
    readonly logo: string;
    /**
     * means that this provider uses react-native-cheerio,
     * so that can work for React Native projects
     */
    abstract readonly forRN: boolean;
    constructor(customBaseURL?: string);
    abstract search(query: string, ...args: any): Promise<UnifiedSearch<UnifiedMediaResult>>;
    abstract fetchInfo(id: string | number, ...args: any): Promise<UnifiedMediaInfo>;
    abstract fetchSources(id: string | number, ...args: any): Promise<UnifiedSources>;
}
export default Provider;
//# sourceMappingURL=provider.d.ts.map