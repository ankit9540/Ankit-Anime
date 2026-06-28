import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Check, Star, ArrowLeft, Download, Film, Eye, Settings2, Globe2, Volume2, Subtitles, HelpCircle } from 'lucide-react';
import { Anime, Episode, AppTranslation, Language, Download as DownloadType } from '../types';
import { EPISODE_DATA, ANIME_DATA } from '../data';

interface DetailScreenProps {
  animeId: string;
  onBack: () => void;
  watchlist: string[];
  downloads: DownloadType[];
  onToggleWatchlist: (animeId: string) => void;
  onStartDownload: (episode: Episode, anime: Anime) => void;
  onAddHistory: (anime: Anime, episode: Episode, progress: number) => void;
  translation: AppTranslation;
  currentLang: Language;
}

export default function DetailScreen({
  animeId,
  onBack,
  watchlist,
  downloads,
  onToggleWatchlist,
  onStartDownload,
  onAddHistory,
  translation,
  currentLang,
}: DetailScreenProps) {
  const [activeTab, setActiveTab] = useState<'episodes' | 'about'>('episodes');
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Custom video simulator states
  const [videoProgress, setVideoProgress] = useState(35); // simulated initial progress
  const [videoAudio, setVideoAudio] = useState<'en' | 'hi'>('en');
  const [videoSubtitles, setVideoSubtitles] = useState<'en' | 'hi' | 'none'>('en');
  const [videoQuality, setVideoQuality] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [showPlayerSettings, setShowPlayerSettings] = useState(false);

  const anime = ANIME_DATA.find(a => a.id === animeId);
  const episodes = EPISODE_DATA[animeId] || [];

  const handleEpisodePlay = (episode: Episode) => {
    setSelectedEpisode(episode);
    setPlayerLoading(true);
    setIsPlaying(false);
    setVideoProgress(0);
    
    // Simulate initial loading buffer
    setTimeout(() => {
      setPlayerLoading(false);
      setIsPlaying(true);
    }, 1500);

    // Track in History
    if (anime) {
      onAddHistory(anime, episode, 0);
    }
  };

  // Video Progress Simulator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !playerLoading) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          const next = prev + 1;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          // Log history incremental updates
          if (anime && selectedEpisode && next % 10 === 0) {
            onAddHistory(anime, selectedEpisode, next);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playerLoading, selectedEpisode, anime, onAddHistory]);

  if (!anime) return <div className="p-10 text-white text-center">Anime not found.</div>;

  const isFavorited = watchlist.includes(anime.id);

  // Check download status for an episode
  const getEpisodeDownloadStatus = (episodeId: string) => {
    const dl = downloads.find(d => d.episodeId === episodeId);
    return dl ? dl.status : null;
  };

  const getEpisodeDownloadProgress = (episodeId: string) => {
    const dl = downloads.find(d => d.episodeId === episodeId);
    return dl ? dl.progress : 0;
  };

  return (
    <div id="detail-screen-wrapper" className="absolute inset-0 bg-zinc-950 text-white flex flex-col overflow-hidden z-30 pb-4">
      {/* Scrollable Detail View (hidden when full screen player is open) */}
      {!selectedEpisode ? (
        <div id="detail-content-scroll" className="flex-1 overflow-y-auto scrollbar-none pb-20">
          {/* Banner Hero Portion */}
          <div id="detail-banner-stage" className="relative w-full h-[260px]">
            <img
              src={anime.banner}
              alt={anime.title}
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
            
            {/* Overlay Back Button */}
            <button
              id="btn-detail-back"
              onClick={onBack}
              className="absolute top-6 left-5 p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 active:scale-90 transition-all"
            >
              <ArrowLeft size={16} />
            </button>
          </div>

          {/* Metadata Block */}
          <div id="detail-metadata" className="px-5 -mt-10 relative z-10 text-left flex gap-4">
            {/* Poster Card */}
            <div id="detail-poster-wrapper" className="w-24 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-2 border-zinc-850 bg-zinc-900 flex-shrink-0">
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info and Titles */}
            <div className="flex-1 flex flex-col justify-end gap-1" id="detail-title-info">
              <h2 id="detail-title-main" className="text-xl font-black tracking-tight leading-snug">
                {currentLang === 'en' ? anime.title : anime.titleHindi}
              </h2>
              <div id="detail-pills-row" className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
                <span className="flex items-center gap-0.5 text-[#FF4D00] font-extrabold">
                  <Star size={11} className="fill-current" />
                  {anime.rating}
                </span>
                <span>•</span>
                <span>{anime.releaseYear}</span>
                <span>•</span>
                <span className="bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase">{anime.type}</span>
              </div>
            </div>
          </div>

          {/* Streaming Actions Toggle Row */}
          <div id="detail-action-buttons" className="flex items-center gap-3 px-5 mt-6">
            <button
              id="btn-detail-play-first"
              onClick={() => handleEpisodePlay(episodes[0])}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[#FF4D00] text-white font-black text-xs shadow-md shadow-[#FF4D00]/10 active:scale-95 transition-all"
            >
              <Play size={14} className="fill-current" />
              {translation.watchNow}
            </button>
            <button
              id="btn-detail-watchlist-toggle"
              onClick={() => onToggleWatchlist(anime.id)}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-full border text-xs font-bold transition-all active:scale-95 ${
                isFavorited
                  ? 'bg-white border-white text-black'
                  : 'bg-white/10 border-white/5 text-white backdrop-blur-md'
              }`}
            >
              {isFavorited ? <Check size={14} /> : <Plus size={14} />}
              {isFavorited ? translation.watchlist : translation.addToWatchlist}
            </button>
          </div>

          {/* Description Block */}
          <div className="px-5 mt-6 text-left">
            <p className="text-xs text-zinc-400 leading-relaxed">
              {currentLang === 'en' ? anime.description : anime.descriptionHindi}
            </p>
          </div>

          {/* Section Divider Tab Headers */}
          <div id="detail-tabs-header" className="flex border-b border-zinc-900 px-5 mt-8 mb-4">
            <button
              id="tab-episodes"
              onClick={() => setActiveTab('episodes')}
              className={`py-2 text-xs font-bold uppercase tracking-wider relative flex items-center gap-1.5 transition-all mr-6 ${
                activeTab === 'episodes' ? 'text-[#FF4D00]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Film size={12} />
              {translation.episodes} ({episodes.length})
              {activeTab === 'episodes' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF4D00] rounded-full"></div>
              )}
            </button>
            <button
              id="tab-about"
              onClick={() => setActiveTab('about')}
              className={`py-2 text-xs font-bold uppercase tracking-wider relative flex items-center gap-1.5 transition-all ${
                activeTab === 'about' ? 'text-[#FF4D00]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Settings2 size={12} />
              About / More
              {activeTab === 'about' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF4D00] rounded-full"></div>
              )}
            </button>
          </div>

          {/* Tab Content Panels */}
          <div id="detail-tab-content-panel" className="px-5 text-left">
            {activeTab === 'episodes' ? (
              /* Episode List Display */
              <div id="episode-list-container" className="flex flex-col gap-3">
                {episodes.map((ep) => {
                  const dlStatus = getEpisodeDownloadStatus(ep.id);
                  const dlProgress = getEpisodeDownloadProgress(ep.id);
                  
                  return (
                    <div
                      key={ep.id}
                      id={`ep-row-${ep.id}`}
                      className="flex items-center gap-3 p-2 bg-zinc-900 border border-zinc-850/60 rounded-2xl"
                    >
                      {/* Image Thumbnail with Overlay Play */}
                      <div
                        onClick={() => handleEpisodePlay(ep)}
                        className="relative w-28 aspect-video rounded-xl overflow-hidden flex-shrink-0 cursor-pointer group"
                      >
                        <img
                          src={ep.thumbnail}
                          alt={ep.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                          <Play size={16} className="text-white fill-white" />
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.2 rounded text-[8px] font-mono font-medium text-zinc-300">{ep.duration}</span>
                      </div>

                      {/* Info & Title */}
                      <div className="flex-1 min-w-0" onClick={() => handleEpisodePlay(ep)}>
                        <h4 className="text-xs font-bold text-zinc-200 truncate cursor-pointer hover:text-[#FF4D00]">
                          {ep.episodeNumber}. {currentLang === 'en' ? ep.title : ep.titleHindi}
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">Free Streaming</p>
                      </div>

                      {/* Download Action Controls */}
                      <div id="episode-actions">
                        {dlStatus === 'downloading' ? (
                          <div className="flex flex-col items-end gap-1.5 pr-2">
                            <span className="text-[9px] font-bold text-[#FF4D00] animate-pulse">
                              {dlProgress}%
                            </span>
                            <div className="w-10 h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-[#FF4D00]" style={{ width: `${dlProgress}%` }}></div>
                            </div>
                          </div>
                        ) : dlStatus === 'completed' ? (
                          <div className="p-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20" title="Downloaded">
                            <Check size={14} />
                          </div>
                        ) : (
                          <button
                            id={`btn-dl-ep-${ep.id}`}
                            onClick={() => onStartDownload(ep, anime)}
                            className="p-2 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white active:scale-90 transition-all"
                            title={translation.downloadEpisode}
                          >
                            <Download size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Extended About Details Drawer */
              <div id="about-details-info" className="space-y-4 text-xs text-zinc-400">
                <div className="grid grid-cols-2 gap-3.5" id="grid-about-meta">
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-850/60 flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold uppercase text-zinc-500 font-mono">Format</span>
                    <span className="text-zinc-200 font-bold">{anime.type}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-850/60 flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold uppercase text-zinc-500 font-mono">Episodes</span>
                    <span className="text-zinc-200 font-bold">{anime.episodesCount} Parts</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-850/60 flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold uppercase text-zinc-500 font-mono">Year</span>
                    <span className="text-zinc-200 font-bold">{anime.releaseYear}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-850/60 flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold uppercase text-zinc-500 font-mono">Status</span>
                    <span className="text-zinc-200 font-bold">{anime.status}</span>
                  </div>
                </div>

                {/* Genres Lists */}
                <div id="about-genres" className="p-4 rounded-2xl bg-zinc-900 border border-zinc-850/60 space-y-2">
                  <span className="text-[9px] font-bold uppercase text-zinc-500 font-mono block">Genre Classification</span>
                  <div className="flex flex-wrap gap-1.5">
                    {anime.genres.map((g, i) => (
                      <span key={g} className="px-2.5 py-1 rounded-full bg-zinc-950 text-zinc-300 text-[10px] font-semibold border border-zinc-850">
                        {g} ({anime.genresHindi[i]})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Cinema Video Player Simulator viewport */
        <div id="cinema-video-player" className="absolute inset-0 bg-black z-50 flex flex-col justify-between">
          
          {/* Top Player Action Navigation */}
          <div id="player-header-bar" className="p-5 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent z-10">
            <button
              id="btn-player-back"
              onClick={() => {
                setIsPlaying(false);
                setSelectedEpisode(null);
              }}
              className="p-2 rounded-full bg-zinc-900/65 text-white hover:bg-zinc-800 transition-colors flex items-center justify-center"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="text-center flex-1 mx-4 min-w-0">
              <span className="text-[9px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold">
                {translation.nowPlaying} • Ep {selectedEpisode.episodeNumber}
              </span>
              <h3 className="text-xs font-bold text-white truncate">
                {currentLang === 'en' ? selectedEpisode.title : selectedEpisode.titleHindi}
              </h3>
            </div>
            <button
              id="btn-player-settings"
              onClick={() => setShowPlayerSettings(!showPlayerSettings)}
              className="p-2 rounded-full bg-zinc-900/65 text-white hover:bg-zinc-800 transition-colors flex items-center justify-center"
            >
              <Settings2 size={16} />
            </button>
          </div>

          {/* Visual Video Stream Simulator screen canvas */}
          <div id="video-stream-box" className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
            
            {/* Animated Canvas Video Stream Graphic Mockup */}
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
              {/* Animated decorative graphics simulating actual video playback content */}
              <div className="absolute inset-0 opacity-20 filter blur-xl scale-125 select-none pointer-events-none">
                <div className={`w-full h-full bg-gradient-to-tr from-purple-800 via-red-900 to-amber-600 transition-transform duration-1000 ${isPlaying ? 'scale-110 rotate-3' : 'scale-100'}`}></div>
              </div>

              {/* Character Illustration Visual Loop placeholder inside screen */}
              <img
                src={selectedEpisode.thumbnail}
                alt="Video Stream visual"
                className={`w-full max-w-[480px] aspect-video object-cover rounded-xl shadow-2xl transition-all duration-700 ${
                  isPlaying ? 'brightness-105 scale-[1.01] ring-1 ring-white/10 shadow-red-950/20' : 'brightness-50 scale-95 border border-zinc-800'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Subtitles Overlay */}
              {videoSubtitles !== 'none' && isPlaying && (
                <div id="subtitles-track" className="absolute bottom-8 left-5 right-5 text-center px-4 py-1 rounded bg-black/60 backdrop-blur-sm text-[11px] font-semibold text-yellow-300 drop-shadow-md border border-white/5 max-w-[340px] mx-auto animate-pulse">
                  {videoSubtitles === 'en' 
                    ? `[Sub] " Kabir! The dark power source is active at Neo-Delhi grid! "`
                    : `[उपशीर्षक] " कबीर! दुष्ट ऊर्जा स्रोत नियो-दिल्ली ग्रिड पर सक्रिय है! "`
                  }
                </div>
              )}
            </div>

            {/* Video Buffering Loader */}
            {playerLoading && (
              <div id="player-buffering" className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 z-20">
                <div className="w-11 h-11 rounded-full border-4 border-[#FF4D00]/20 border-t-[#FF4D00] animate-spin"></div>
                <span className="text-xs font-mono text-zinc-400 tracking-wider">BUFFERING VIDEO STREAM...</span>
              </div>
            )}
          </div>

          {/* Bottom Custom Media HUD Deck Controls */}
          <div id="player-controls-deck" className="p-5 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col gap-4 z-10">
            {/* Scrubber timeline */}
            <div className="flex items-center gap-3 w-full">
              <span className="text-[10px] font-mono text-zinc-400 font-bold">
                {Math.floor((videoProgress * 14.4) / 60)}:{(Math.floor(videoProgress * 14.4) % 60).toString().padStart(2, '0')}
              </span>
              <div className="flex-1 h-1 bg-zinc-800 rounded-full relative cursor-pointer group">
                <div
                  className="h-full bg-[#FF4D00] rounded-full relative"
                  style={{ width: `${videoProgress}%` }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white border border-[#FF4D00] absolute right-0 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform"></div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 font-bold">24:00</span>
            </div>

            {/* Main Action Toggles */}
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-4">
                {/* Audio Track toggle */}
                <button
                  id="btn-player-audio"
                  onClick={() => setVideoAudio(videoAudio === 'en' ? 'hi' : 'en')}
                  className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase border border-zinc-850"
                  title="Toggle Audio Language"
                >
                  <Volume2 size={13} />
                  {videoAudio === 'en' ? 'ENG' : 'HIN DUB'}
                </button>

                {/* Subtitle toggle */}
                <button
                  id="btn-player-subs"
                  onClick={() => {
                    if (videoSubtitles === 'en') setVideoSubtitles('hi');
                    else if (videoSubtitles === 'hi') setVideoSubtitles('none');
                    else setVideoSubtitles('en');
                  }}
                  className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase border border-zinc-850"
                  title="Toggle Subtitle Language"
                >
                  <Subtitles size={13} />
                  CC: {videoSubtitles === 'en' ? 'ENG' : videoSubtitles === 'hi' ? 'HIN' : 'OFF'}
                </button>
              </div>

              {/* Play Pause button */}
              <button
                id="btn-player-play-pause"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center active:scale-90 transition-all hover:bg-zinc-200 shadow-md shadow-white/5"
              >
                {isPlaying ? <span className="font-black text-xs">PAUSE</span> : <Play size={18} className="fill-current translate-x-0.5" />}
              </button>

              {/* Speed & Quality Indicator HUD quick toggle */}
              <button
                id="btn-player-quality"
                onClick={() => setVideoQuality(videoQuality === '1080p' ? '720p' : videoQuality === '720p' ? '480p' : '1080p')}
                className="p-1.5 rounded bg-zinc-900 text-zinc-300 font-mono text-[9px] font-bold tracking-wider uppercase border border-zinc-850"
              >
                {videoQuality}
              </button>
            </div>
          </div>

          {/* Quick overlay options drawer */}
          <AnimatePresence>
            {showPlayerSettings && (
              <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                id="player-settings-overlay"
                className="absolute bottom-0 left-0 right-0 p-5 rounded-t-3xl bg-zinc-950 border-t border-zinc-900 flex flex-col gap-4 z-30 text-left"
              >
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Streaming Configurations</h4>
                  <button onClick={() => setShowPlayerSettings(false)} className="text-xs text-zinc-500 hover:text-white font-bold uppercase">Done</button>
                </div>

                {/* Select Audio */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Audio Track Preference</span>
                  <div className="flex gap-2.5">
                    <button
                      id="opt-audio-en"
                      onClick={() => setVideoAudio('en')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${videoAudio === 'en' ? 'bg-[#FF4D00] text-white' : 'bg-zinc-900 text-zinc-400'}`}
                    >
                      English Original
                    </button>
                    <button
                      id="opt-audio-hi"
                      onClick={() => setVideoAudio('hi')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${videoAudio === 'hi' ? 'bg-[#FF4D00] text-white' : 'bg-zinc-900 text-zinc-400'}`}
                    >
                      Hindi Dubbed (हिंदी डब)
                    </button>
                  </div>
                </div>

                {/* Select Subtitles */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">CC (Subtitles)</span>
                  <div className="flex gap-2">
                    {(['en', 'hi', 'none'] as const).map((s) => (
                      <button
                        key={s}
                        id={`opt-subs-${s}`}
                        onClick={() => setVideoSubtitles(s)}
                        className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-lg ${videoSubtitles === s ? 'bg-zinc-100 text-black' : 'bg-zinc-900 text-zinc-500'}`}
                      >
                        {s === 'en' ? 'English' : s === 'hi' ? 'Hindi' : 'Off'}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
