export type Language = 'en' | 'hi';
export type AppTheme = 'light' | 'dark';

export interface Anime {
  id: string;
  title: string;
  titleHindi: string;
  rating: number;
  episodesCount: number;
  genres: string[];
  genresHindi: string[];
  description: string;
  descriptionHindi: string;
  banner: string;
  poster: string;
  status: 'Ongoing' | 'Completed';
  releaseYear: string;
  type: 'Series' | 'Movie';
  popularity: number;
  trending: boolean;
  newRelease: boolean;
}

export interface Episode {
  id: string;
  animeId: string;
  episodeNumber: number;
  title: string;
  titleHindi: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

export interface Download {
  episodeId: string;
  animeId: string;
  episodeTitle: string;
  episodeTitleHindi: string;
  animeTitle: string;
  animeTitleHindi: string;
  progress: number; // 0 to 100
  status: 'downloading' | 'paused' | 'completed';
  sizeMb: number;
  downloadSpeed: string;
}

export interface WatchHistory {
  id: string;
  animeId: string;
  episodeId: string;
  animeTitle: string;
  animeTitleHindi: string;
  episodeTitle: string;
  episodeTitleHindi: string;
  episodeNumber: number;
  watchedAt: string;
  progressPercentage: number; // 0 to 100
}

export interface UserProfile {
  username: string;
  email: string;
  avatar: string;
  level: number;
  exp: number;
  maxExp: number;
  episodesWatched: number;
  hoursWatched: number;
}

export interface AppTranslation {
  appName: string;
  searchPlaceholder: string;
  trending: string;
  popular: string;
  newReleases: string;
  movies: string;
  continueWatching: string;
  episodes: string;
  watchlist: string;
  history: string;
  downloads: string;
  offline: string;
  profile: string;
  settings: string;
  language: string;
  theme: string;
  logout: string;
  guestMode: string;
  login: string;
  search: string;
  genres: string;
  status: string;
  year: string;
  type: string;
  ongoing: string;
  completed: string;
  addToWatchlist: string;
  removeFromWatchlist: string;
  downloadEpisode: string;
  downloading: string;
  downloaded: string;
  paused: string;
  resume: string;
  pause: string;
  offlineLibrary: string;
  level: string;
  xp: string;
  stats: string;
  episodesFinished: string;
  timeWatched: string;
  hours: string;
  noDownloadsYet: string;
  noDownloadsDesc: string;
  noWatchlistYet: string;
  noWatchlistDesc: string;
  noHistoryYet: string;
  noHistoryDesc: string;
  watchNow: string;
  nowPlaying: string;
  audioTrack: string;
  subtitles: string;
  quality: string;
  backToBrowse: string;
  animeDetails: string;
  english: string;
  hindi: string;
  darkTheme: string;
  lightTheme: string;
  guestWarning: string;
  filterBy: string;
  sortBy: string;
  resetFilters: string;
}
