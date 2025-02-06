import {
  FuzzyDate as CFuzzYDate,
  IAnimeEpisode,
  IAnimeInfo,
  IAnimeResult,
  ISource,
  MediaFormat as CMediaFormat,
  MediaStatus as CMediaStatus,
} from '@consumet/extensions/dist/models';

import { FuzzyDate, MediaEpisode, MediaFormat, MediaInfo, MediaResult, MediaStatus, Sources } from './types';

export type UnifiedMediaStatus = MediaStatus | CMediaStatus;
export type UnifiedMediaFormat = MediaFormat | CMediaFormat;
export type UnifiedFuzzyDate = FuzzyDate & CFuzzYDate;
export type UnifiedMediaEpisode = MediaEpisode & IAnimeEpisode;
export type UnifiedMediaResult = MediaResult & IAnimeResult;
export type UnifiedMediaInfo = MediaInfo & IAnimeInfo;
export type UnifiedSources = Sources & ISource;
