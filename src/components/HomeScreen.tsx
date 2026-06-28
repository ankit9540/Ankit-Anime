import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Plus, Check, Star, TrendingUp, Sparkles, Film, Clock } from 'lucide-react';
import { Anime, AppTranslation, Language, WatchHistory } from '../types';

interface HomeScreenProps {
  animeList: Anime[];
  watchlist: string[];
  history: WatchHistory[];
  onToggleWatchlist: (animeId: string) => void;
  onSelectAnime: (animeId: string) => void;
  onResumeEpisode: (animeId: string, episodeId: string) => void;
  translation: AppTranslation;
  currentLang: Language;
}

export default function HomeScreen({
  animeList,
  watchlist,
  history,
  onToggleWatchlist,
  onSelectAnime,
  onResumeEpisode,
  translation,
  currentLang,
}: HomeScreenProps) {
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Filter lists based on dataset parameters
  const trendingAnime = animeList.filter(a => a.trending);
  const popularAnime = [...animeList].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  const newReleases = animeList.filter(a => a.newRelease);
  const movies = animeList.filter(a => a.type === 'Movie');

  // Featured rotates every 8 seconds automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % trendingAnime.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [trendingAnime.length]);

  const featured = trendingAnime[featuredIndex] || animeList[0];

  // Continue watching shows items that are partially watched
  const continueWatchingItems = history.filter(h => h.progressPercentage < 98).slice(0, 3);

  const getGenreLabels = (anime: Anime) => {
    return currentLang === 'en' ? anime.genres : anime.genresHindi;
  };

  const isDark = true; // Premium dark is forced on Home view for streaming vibes!

  return (
    <div id="home-screen-scrollable" className="absolute inset-0 bg-zinc-950 text-white overflow-y-auto pb-24 scrollbar-none">
      {/* Dynamic Hero Banner Cover */}
      {featured && (
        <div id="hero-banner-cover" className="relative w-full h-[410px] flex flex-col justify-end">
          {/* Cover image with deep ambient bottom/top vignette */}
          <img
            src={featured.banner}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
            id="hero-cover-img"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/80"></div>

          {/* Featured Content Details */}
          <div className="relative px-5 pb-6 flex flex-col items-start gap-2.5 z-10" id="hero-meta-panel">
            {/* Spotlight label */}
            <div id="spotlight-badge" className="flex items-center gap-1 bg-[#FF4D00] text-black font-mono font-black text-[9px] tracking-widest px-2 py-0.5 rounded uppercase">
              <Sparkles size={10} className="fill-current" />
              SPOTLIGHT
            </div>

            <h1 id="hero-anime-title" className="text-2xl font-black tracking-tight drop-shadow-md text-left leading-tight">
              {currentLang === 'en' ? featured.title : featured.titleHindi}
            </h1>

            {/* Ratings, Year, Format */}
            <div id="hero-substats" className="flex items-center gap-3 text-xs text-zinc-300 font-medium">
              <div id="hero-substats-rating" className="flex items-center gap-0.5 text-[#FF4D00] font-bold">
                <Star size={13} className="fill-current" />
                {featured.rating}
              </div>
              <span className="text-zinc-600">•</span>
              <span id="hero-substats-year">{featured.releaseYear}</span>
              <span className="text-zinc-600">•</span>
              <span id="hero-substats-type" className="bg-zinc-850 px-1.5 py-0.5 rounded text-[10px] font-semibold text-zinc-300 uppercase">
                {featured.type}
              </span>
            </div>

            {/* Genre Tags */}
            <div id="hero-genres-row" className="flex flex-wrap gap-1.5">
              {getGenreLabels(featured).map((genre) => (
                <span
                  key={genre}
                  className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-300 font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Synopsis Brief */}
            <p id="hero-synopsis-snippet" className="text-xs text-zinc-400 text-left line-clamp-2 max-w-[340px] leading-relaxed">
              {currentLang === 'en' ? featured.description : featured.descriptionHindi}
            </p>

            {/* Primary Action Buttons */}
            <div id="hero-actions-container" className="flex items-center gap-3 w-full mt-2">
              <button
                id="btn-hero-play"
                onClick={() => onSelectAnime(featured.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-white text-black font-extrabold text-xs shadow-lg shadow-black/40 active:scale-95 transition-all"
              >
                <Play size={14} className="fill-current" id="hero-play-icon" />
                {translation.watchNow}
              </button>
              <button
                id="btn-hero-watchlist"
                onClick={() => onToggleWatchlist(featured.id)}
                className={`p-2.5 rounded-full border flex items-center justify-center transition-all active:scale-95 ${
                  watchlist.includes(featured.id)
                    ? 'bg-[#FF4D00] border-[#FF4D00] text-white'
                    : 'bg-white/10 border-white/5 text-white backdrop-blur-md'
                }`}
              >
                {watchlist.includes(featured.id) ? <Check size={16} /> : <Plus size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Continue Watching Section */}
      {continueWatchingItems.length > 0 && (
        <div id="section-continue-watching" className="px-5 mt-6">
          <div className="flex items-center gap-1.5 mb-3">
            <Clock size={16} className="text-[#FF4D00]" />
            <h3 id="heading-continue-watching" className="text-sm font-bold tracking-tight uppercase text-zinc-300">
              {translation.continueWatching}
            </h3>
          </div>
          <div className="flex flex-col gap-3" id="continue-watching-list">
            {continueWatchingItems.map((item) => (
              <div
                key={item.id}
                id={`item-continue-${item.episodeId}`}
                onClick={() => onResumeEpisode(item.animeId, item.episodeId)}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all"
              >
                <div className="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={animeList.find(a => a.id === item.animeId)?.poster}
                    alt={item.animeTitle}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay Progress Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
                    <div
                      className="h-full bg-[#FF4D00]"
                      style={{ width: `${item.progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play size={16} className="text-white fill-white animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[10px] text-[#FF4D00] font-mono font-bold uppercase tracking-wider">
                    {translation.episodes} {item.episodeNumber}
                  </div>
                  <h4 className="text-xs font-bold text-zinc-100 truncate">
                    {currentLang === 'en' ? item.animeTitle : item.animeTitleHindi}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                    {currentLang === 'en' ? item.episodeTitle : item.episodeTitleHindi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Horizontal Shelf */}
      <div id="section-trending" className="px-5 mt-8">
        <div className="flex items-center gap-1.5 mb-3.5">
          <TrendingUp size={16} className="text-[#FF4D00]" />
          <h3 id="heading-trending" className="text-sm font-bold tracking-tight uppercase text-zinc-300">
            {translation.trending}
          </h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x" id="trending-shelf-scroll">
          {trendingAnime.map((anime) => (
            <div
              key={anime.id}
              id={`trending-card-${anime.id}`}
              onClick={() => onSelectAnime(anime.id)}
              className="flex-shrink-0 w-28 snap-start flex flex-col gap-1.5 cursor-pointer hover:scale-[1.03] transition-transform duration-250 text-left"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-zinc-900 bg-zinc-900 group">
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 text-[9px] font-black text-[#FF4D00]">
                  <Star size={10} className="fill-current" />
                  {anime.rating}
                </div>
              </div>
              <h4 className="text-xs font-bold text-zinc-200 truncate px-0.5 leading-tight">
                {currentLang === 'en' ? anime.title : anime.titleHindi}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Shelf */}
      <div id="section-popular" className="px-5 mt-8">
        <div className="flex items-center gap-1.5 mb-3.5">
          <Sparkles size={16} className="text-[#FF4D00]" />
          <h3 id="heading-popular" className="text-sm font-bold tracking-tight uppercase text-zinc-300">
            {translation.popular}
          </h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x" id="popular-shelf-scroll">
          {popularAnime.map((anime) => (
            <div
              key={anime.id}
              id={`popular-card-${anime.id}`}
              onClick={() => onSelectAnime(anime.id)}
              className="flex-shrink-0 w-28 snap-start flex flex-col gap-1.5 cursor-pointer hover:scale-[1.03] transition-transform duration-250 text-left"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-zinc-900 bg-zinc-900">
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 text-[9px] font-black text-[#FF4D00]">
                  <Star size={10} className="fill-current" />
                  {anime.rating}
                </div>
              </div>
              <h4 className="text-xs font-bold text-zinc-200 truncate px-0.5 leading-tight">
                {currentLang === 'en' ? anime.title : anime.titleHindi}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* New Releases Shelf */}
      <div id="section-new" className="px-5 mt-8">
        <div className="flex items-center gap-1.5 mb-3.5">
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-ping"></span>
          <h3 id="heading-new-releases" className="text-sm font-bold tracking-tight uppercase text-zinc-300">
            {translation.newReleases}
          </h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x" id="new-shelf-scroll">
          {newReleases.map((anime) => (
            <div
              key={anime.id}
              id={`new-card-${anime.id}`}
              onClick={() => onSelectAnime(anime.id)}
              className="flex-shrink-0 w-28 snap-start flex flex-col gap-1.5 cursor-pointer hover:scale-[1.03] transition-transform duration-250 text-left"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-zinc-900 bg-zinc-900">
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-[#FF4D00] px-1.5 py-0.5 rounded text-[8px] font-bold text-white tracking-wider uppercase">
                  NEW
                </div>
              </div>
              <h4 className="text-xs font-bold text-zinc-200 truncate px-0.5 leading-tight">
                {currentLang === 'en' ? anime.title : anime.titleHindi}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Anime Movies Section */}
      <div id="section-movies" className="px-5 mt-8">
        <div className="flex items-center gap-1.5 mb-3.5">
          <Film size={16} className="text-[#FF4D00]" />
          <h3 id="heading-movies" className="text-sm font-bold tracking-tight uppercase text-zinc-300">
            {translation.movies}
          </h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x" id="movies-shelf-scroll">
          {movies.map((anime) => (
            <div
              key={anime.id}
              id={`movie-card-${anime.id}`}
              onClick={() => onSelectAnime(anime.id)}
              className="flex-shrink-0 w-28 snap-start flex flex-col gap-1.5 cursor-pointer hover:scale-[1.03] transition-transform duration-250 text-left"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-zinc-900 bg-zinc-900">
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold text-zinc-300 uppercase">
                  MOVIE
                </div>
              </div>
              <h4 className="text-xs font-bold text-zinc-200 truncate px-0.5 leading-tight">
                {currentLang === 'en' ? anime.title : anime.titleHindi}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
