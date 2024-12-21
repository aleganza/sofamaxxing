export enum MediaStatus {
  FINISHED = "Finished",
  RELEASING = "Releasing",
  NOT_YET_RELEASED = "Not Yet Released",
  CANCELLED = "Cancelled",
  HIATUS = "Hiatus",
}

export enum MediaFormat {
  TV = "TV",
  TV_SHORT = "TV Short",
  MOVIE = "Movie",
  SPECIAL = "Special",
  OVA = "OVA",
  ONA = "ONA",
  MUSIC = "Music",
}

export enum SubOrSub {
  SUB = "Sub",
  DUB = "Dub",
  BOTH = "Both",
}

export interface FuzzyDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface Subtitle {
  url: string;
  lang: string;
  [x: string]: unknown;
}

export interface Video {
  url: string;
  /**
   * should include the `p` suffix
   */
  quality?: string;
  isM3U8?: boolean;
  isDASH?: boolean;
  /**
   * in bytes
   */
  size?: number;
  [x: string]: unknown;
}

export interface MediaEpisode {
  id: string;
  number: number;
  title?: string;
  description?: string;
  isFiller?: boolean;
  image?: string;
  releaseDate?: FuzzyDate;
  [x: string]: unknown;
}

export interface Search<MediaResult> {
  currentPage?: number;
  hasNextPage?: boolean;
  totalPages?: number;
  totalResults?: number;
  results: MediaResult[];
  [x: string]: unknown;
}

export interface MediaResult {
  id: string;
  title: string;
  image?: string;
  cover?: string;
  status?: MediaStatus;
  rating?: number;
  format?: MediaFormat;
  releaseDate?: FuzzyDate;
  [x: string]: unknown;
}

export interface MediaInfo extends MediaResult {
  genres?: string[];
  description?: string;
  totalEpisodes?: number;
  subOrDub?: SubOrSub;
  synonyms?: string[];
  season?: string;
  color?: string;
  isAnime?: boolean;
  episodes?: MediaEpisode[];
  [x: string]: unknown;
}

export interface Sources {
  subtitles?: Subtitle[];
  sources: Video[];
  download?: string;
  [x: string]: unknown;
}
