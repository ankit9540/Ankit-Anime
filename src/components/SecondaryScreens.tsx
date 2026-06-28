import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Film, Star, AlertTriangle, Play, Pause, RefreshCw, CheckCircle, Download, Award, Clock, Flame, Shield, HelpCircle, Globe, Palette, ChevronRight, UserCheck } from 'lucide-react';
import { Anime, Episode, AppTranslation, Language, Download as DownloadType, WatchHistory, UserProfile, AppTheme } from '../types';

/* ==========================================================================
   1. FAVORITES (WATCHLIST) SCREEN
   ========================================================================== */
interface WatchlistProps {
  watchlist: string[];
  animeList: Anime[];
  onSelectAnime: (animeId: string) => void;
  onRemove: (animeId: string) => void;
  translation: AppTranslation;
  currentLang: Language;
}

export function WatchlistScreen({
  watchlist,
  animeList,
  onSelectAnime,
  onRemove,
  translation,
  currentLang,
}: WatchlistProps) {
  const favoritedAnime = animeList.filter(a => watchlist.includes(a.id));

  return (
    <div id="watchlist-screen-scroll" className="absolute inset-0 bg-zinc-950 text-white overflow-y-auto p-5 pb-24 scrollbar-none text-left">
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-900 pb-3">
        <Film size={18} className="text-[#FF4D00]" />
        <h2 className="text-base font-extrabold uppercase tracking-wider">{translation.watchlist}</h2>
      </div>

      {favoritedAnime.length > 0 ? (
        <div id="watchlist-grid" className="grid grid-cols-2 gap-4">
          {favoritedAnime.map((anime) => (
            <div
              key={anime.id}
              id={`watchlist-card-${anime.id}`}
              className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-850 shadow-md flex flex-col cursor-pointer group hover:border-zinc-700 transition-all"
            >
              {/* Tap to browse details */}
              <div className="relative aspect-[3/4] flex-1 overflow-hidden" onClick={() => onSelectAnime(anime.id)}>
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-bold text-[#FF4D00] flex items-center gap-0.5">
                  <Star size={10} className="fill-current" />
                  {anime.rating}
                </div>
              </div>

              {/* Title & Delete button */}
              <div className="p-2.5 flex items-center justify-between gap-2 bg-zinc-950">
                <div className="min-w-0" onClick={() => onSelectAnime(anime.id)}>
                  <h4 className="text-xs font-bold text-zinc-200 truncate">
                    {currentLang === 'en' ? anime.title : anime.titleHindi}
                  </h4>
                  <span className="text-[9px] text-zinc-500">{anime.type}</span>
                </div>
                <button
                  id={`btn-remove-watchlist-${anime.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(anime.id);
                  }}
                  className="p-1.5 rounded-lg bg-zinc-900 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                  title="Remove Watchlist"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty watchlist display */
        <div id="watchlist-empty" className="flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500 mb-4">
            <Film size={24} />
          </div>
          <h3 className="text-sm font-bold text-zinc-300">{translation.noWatchlistYet}</h3>
          <p className="text-xs text-zinc-500 max-w-[240px] mt-1 leading-relaxed">{translation.noWatchlistDesc}</p>
        </div>
      )}
    </div>
  );
}


/* ==========================================================================
   2. WATCH HISTORY SCREEN
   ========================================================================== */
interface HistoryProps {
  history: WatchHistory[];
  onSelectAnime: (animeId: string) => void;
  onClear: () => void;
  translation: AppTranslation;
  currentLang: Language;
}

export function HistoryScreen({
  history,
  onSelectAnime,
  onClear,
  translation,
  currentLang,
}: HistoryProps) {
  return (
    <div id="history-screen-scroll" className="absolute inset-0 bg-zinc-950 text-white overflow-y-auto p-5 pb-24 scrollbar-none text-left">
      <div className="flex items-center justify-between mb-6 border-b border-zinc-900 pb-3">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-[#FF4D00]" />
          <h2 className="text-base font-extrabold uppercase tracking-wider">{translation.history}</h2>
        </div>
        {history.length > 0 && (
          <button
            id="btn-clear-history"
            onClick={onClear}
            className="text-[10px] font-bold uppercase text-[#FF4D00] border border-[#FF4D00]/10 hover:border-[#FF4D00]/30 px-2.5 py-1 rounded-full bg-[#FF4D00]/5 hover:bg-[#FF4D00]/10 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div id="history-list" className="flex flex-col gap-3">
          {history.map((item) => (
            <div
              key={item.id}
              id={`history-row-${item.id}`}
              onClick={() => onSelectAnime(item.animeId)}
              className="flex items-center gap-3 p-2.5 bg-zinc-900 border border-zinc-850/60 rounded-2xl hover:border-zinc-750 cursor-pointer transition-colors"
            >
              {/* Poster frame */}
              <div className="relative w-20 aspect-video rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                {/* Overlay completion label */}
                {item.progressPercentage >= 98 && (
                  <div className="absolute top-1 left-1 bg-green-500 text-[8px] font-extrabold text-black px-1.5 py-0.2 rounded font-mono uppercase tracking-wide">
                    Finished
                  </div>
                )}
                {/* Simulated completion bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
                  <div className="h-full bg-red-600" style={{ width: `${item.progressPercentage}%` }}></div>
                </div>
              </div>

              {/* Show & Episode Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-zinc-100 truncate leading-tight">
                  {currentLang === 'en' ? item.animeTitle : item.animeTitleHindi}
                </h4>
                <p className="text-[10px] text-zinc-400 mt-0.5 truncate font-medium">
                  Ep {item.episodeNumber} • {currentLang === 'en' ? item.episodeTitle : item.episodeTitleHindi}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[9px] text-zinc-500 font-mono">
                    {new Date(item.watchedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-zinc-700 text-[8px]">•</span>
                  <span className="text-[9px] font-extrabold text-[#FF4D00] uppercase tracking-wider font-mono">
                    {item.progressPercentage}% Completed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty history display */
        <div id="history-empty" className="flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500 mb-4">
            <Clock size={24} />
          </div>
          <h3 className="text-sm font-bold text-zinc-300">{translation.noHistoryYet}</h3>
          <p className="text-xs text-zinc-500 max-w-[240px] mt-1 leading-relaxed">{translation.noHistoryDesc}</p>
        </div>
      )}
    </div>
  );
}


/* ==========================================================================
   3. DOWNLOAD MANAGER SCREEN
   ========================================================================== */
interface DownloadsProps {
  downloads: DownloadType[];
  onPause: (episodeId: string) => void;
  onResume: (episodeId: string) => void;
  onCancel: (episodeId: string) => void;
  translation: AppTranslation;
  currentLang: Language;
}

export function DownloadsScreen({
  downloads,
  onPause,
  onResume,
  onCancel,
  translation,
  currentLang,
}: DownloadsProps) {
  const activeDl = downloads.filter(d => d.status !== 'completed');
  const finishedDl = downloads.filter(d => d.status === 'completed');

  return (
    <div id="downloads-screen-scroll" className="absolute inset-0 bg-zinc-950 text-white overflow-y-auto p-5 pb-24 scrollbar-none text-left">
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-900 pb-3">
        <Download size={18} className="text-[#FF4D00]" />
        <h2 className="text-base font-extrabold uppercase tracking-wider">{translation.downloads}</h2>
      </div>

      {downloads.length > 0 ? (
        <div id="downloads-list" className="space-y-6">
          {/* Active Downloading queue */}
          {activeDl.length > 0 && (
            <div id="active-queue-section" className="space-y-3">
              <h3 className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase">ACTIVE QUEUE</h3>
              {activeDl.map((dl) => (
                <div
                  key={dl.episodeId}
                  id={`active-dl-${dl.episodeId}`}
                  className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-850/60 space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <span className="text-[9px] text-[#FF4D00] font-bold uppercase tracking-wider font-mono">
                        {dl.status === 'downloading' ? translation.downloading : translation.paused}
                      </span>
                      <h4 className="text-xs font-extrabold text-zinc-100 truncate leading-snug mt-0.5">
                        {currentLang === 'en' ? dl.animeTitle : dl.animeTitleHindi}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-medium truncate">
                        {currentLang === 'en' ? dl.episodeTitle : dl.episodeTitleHindi}
                      </p>
                    </div>

                    {/* Controls (Pause/Resume, Cancel) */}
                    <div className="flex items-center gap-1.5">
                      {dl.status === 'downloading' ? (
                        <button
                          id={`btn-pause-dl-${dl.episodeId}`}
                          onClick={() => onPause(dl.episodeId)}
                          className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Pause"
                        >
                          <Pause size={12} />
                        </button>
                      ) : (
                        <button
                          id={`btn-resume-dl-${dl.episodeId}`}
                          onClick={() => onResume(dl.episodeId)}
                          className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Resume"
                        >
                          <Play size={12} className="fill-current" />
                        </button>
                      )}
                      <button
                        id={`btn-cancel-dl-${dl.episodeId}`}
                        onClick={() => onCancel(dl.episodeId)}
                        className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Cancel"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Progres tracking */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                      <span>{((dl.sizeMb * dl.progress) / 100).toFixed(1)} MB / {dl.sizeMb} MB</span>
                      <span>{dl.progress}% • {dl.status === 'downloading' ? dl.downloadSpeed : 'Paused'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${dl.status === 'downloading' ? 'bg-[#FF4D00]' : 'bg-zinc-600'}`}
                        style={{ width: `${dl.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed library */}
          {finishedDl.length > 0 && (
            <div id="completed-downloads-section" className="space-y-3">
              <h3 className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase">COMPLETED</h3>
              <div className="flex flex-col gap-2.5">
                {finishedDl.map((dl) => (
                  <div
                    key={dl.episodeId}
                    id={`finished-dl-${dl.episodeId}`}
                    className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-zinc-850/50"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-200 truncate leading-snug">
                        {currentLang === 'en' ? dl.animeTitle : dl.animeTitleHindi}
                      </h4>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {currentLang === 'en' ? dl.episodeTitle : dl.episodeTitleHindi}
                      </p>
                      <span className="text-[9px] text-zinc-500 font-mono mt-0.5 block">{dl.sizeMb} MB • Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-green-500/15 text-green-400 rounded-full border border-green-500/20">
                        <CheckCircle size={14} />
                      </div>
                      <button
                        id={`btn-del-dl-${dl.episodeId}`}
                        onClick={() => onCancel(dl.episodeId)}
                        className="p-1.5 bg-zinc-950 border border-zinc-850 text-zinc-500 hover:text-red-400 rounded-xl hover:bg-zinc-900 transition-colors"
                        title="Delete Download"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty downloads display */
        <div id="downloads-empty" className="flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500 mb-4">
            <Download size={24} />
          </div>
          <h3 className="text-sm font-bold text-zinc-300">{translation.noDownloadsYet}</h3>
          <p className="text-xs text-zinc-500 max-w-[240px] mt-1 leading-relaxed">{translation.noDownloadsDesc}</p>
        </div>
      )}
    </div>
  );
}


/* ==========================================================================
   4. OFFLINE LIBRARY SCREEN
   ========================================================================== */
interface OfflineProps {
  downloads: DownloadType[];
  onPlayEpisode: (episodeId: string, animeId: string) => void;
  translation: AppTranslation;
  currentLang: Language;
}

export function OfflineScreen({
  downloads,
  onPlayEpisode,
  translation,
  currentLang,
}: OfflineProps) {
  const completedDownloads = downloads.filter(d => d.status === 'completed');

  return (
    <div id="offline-screen-scroll" className="absolute inset-0 bg-zinc-950 text-white overflow-y-auto p-5 pb-24 scrollbar-none text-left">
      {/* Network Alert warning of "Offline mode" simulation */}
      <div id="offline-network-alert" className="mb-5 p-3 rounded-2xl bg-[#FF4D00]/10 border border-[#FF4D00]/20 flex items-start gap-2.5">
        <AlertTriangle size={15} className="text-[#FF4D00] mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-[10px] font-bold text-[#FF4D00] uppercase tracking-wide">SIMULATED AIRPLANE MODE</span>
          <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
            {currentLang === 'en'
              ? "You are completely offline. Showing only downloaded files ready for high-quality lag-free local playback."
              : "आप पूरी तरह से ऑफ़लाइन हैं। केवल हाई-क्वालिटी स्थानीय प्लेबैक के लिए तैयार फ़ाइलों को दिखा रहा है।"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-zinc-900 pb-3">
        <Shield size={18} className="text-[#FF4D00]" />
        <h2 className="text-base font-extrabold uppercase tracking-wider">{translation.offlineLibrary}</h2>
      </div>

      {completedDownloads.length > 0 ? (
        <div id="offline-items-list" className="flex flex-col gap-3">
          {completedDownloads.map((dl) => (
            <div
              key={dl.episodeId}
              id={`offline-item-${dl.episodeId}`}
              onClick={() => onPlayEpisode(dl.episodeId, dl.animeId)}
              className="flex items-center gap-3 p-2.5 bg-zinc-900 border border-zinc-850/60 rounded-2xl cursor-pointer hover:border-zinc-700 transition-all group"
            >
              {/* Play symbol on icon hover */}
              <div className="relative w-20 aspect-video rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                  <Play size={16} className="text-white fill-white scale-90 group-hover:scale-100 transition-transform" />
                </div>
              </div>

              {/* Descriptions */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold text-zinc-100 truncate group-hover:text-[#FF4D00] leading-tight">
                  {currentLang === 'en' ? dl.animeTitle : dl.animeTitleHindi}
                </h4>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-medium">
                  {currentLang === 'en' ? dl.episodeTitle : dl.episodeTitleHindi}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-zinc-950 text-[#FF4D00] border border-zinc-850 rounded uppercase tracking-wide">LOCAL HD</span>
                  <span className="text-[9px] text-zinc-500 font-mono">{dl.sizeMb} MB</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty offline list fallback */
        <div id="offline-empty" className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500 mb-4">
            <Shield size={24} />
          </div>
          <h3 className="text-sm font-bold text-zinc-300">{translation.noDownloadsYet}</h3>
          <p className="text-xs text-zinc-500 max-w-[240px] mt-1 leading-relaxed">{translation.noDownloadsDesc}</p>
        </div>
      )}
    </div>
  );
}


/* ==========================================================================
   5. USER PROFILE SCREEN
   ========================================================================== */
interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  translation: AppTranslation;
  currentLang: Language;
  onOpenApkManager?: () => void;
}

export function ProfileScreen({
  user,
  onLogout,
  translation,
  currentLang,
  onOpenApkManager,
}: ProfileProps) {
  return (
    <div id="profile-screen-scroll" className="absolute inset-0 bg-zinc-950 text-white overflow-y-auto p-5 pb-24 scrollbar-none text-left">
      
      {/* Gamified Profile Card */}
      <div id="profile-gamer-card" className="p-5 rounded-3xl bg-zinc-900 border border-zinc-850 shadow-lg relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FF4D00]/10 rounded-full blur-[40px] pointer-events-none"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          {/* Custom generated avatar */}
          <div id="profile-avatar-wrapper" className="w-16 h-16 rounded-2xl border-2 border-[#FF4D00]/80 bg-zinc-800 overflow-hidden flex items-center justify-center shadow-lg shadow-[#FF4D00]/10">
            <img
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=150&auto=format&fit=crop"
              alt="User avatar profile"
              className="w-full h-full object-cover scale-110"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Level Badge, Username, Email */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="bg-[#FF4D00] text-white font-black text-[9px] tracking-widest px-2 py-0.5 rounded-full font-mono uppercase shadow-sm">
                LEVEL {user.level}
              </span>
              <span className="text-[10px] text-[#FF4D00] font-bold uppercase tracking-wider font-mono">Otaku</span>
            </div>
            <h3 id="profile-username" className="text-base font-black tracking-tight text-white mt-1 truncate">{user.username}</h3>
            <p id="profile-email" className="text-[11px] text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Level XP Tracker */}
        <div className="mt-5 space-y-1.5 relative z-10" id="profile-xp-progress">
          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono font-semibold">
            <span>{translation.level} PROGRESS</span>
            <span className="text-[#FF4D00]">{user.exp} / {user.maxExp} XP</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
            <div className="h-full bg-[#FF4D00] rounded-full" style={{ width: `${(user.exp / user.maxExp) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Viewing Statistics Blocks */}
      <div id="profile-stats-panel" className="mt-8 space-y-3">
        <div className="flex items-center gap-1.5">
          <Award size={15} className="text-[#FF4D00]" />
          <h3 className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase">{translation.stats}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-850/60 flex flex-col gap-0.5">
            <span className="text-xs font-black text-white">{user.episodesWatched}</span>
            <span className="text-[10px] text-zinc-500 font-medium">{translation.episodesFinished}</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-850/60 flex flex-col gap-0.5">
            <span className="text-xs font-black text-white">{user.hoursWatched} {translation.hours}</span>
            <span className="text-[10px] text-zinc-500 font-medium">{translation.timeWatched}</span>
          </div>
        </div>
      </div>

      {/* Account Settings Utilities List */}
      <div id="profile-options-list" className="mt-8 space-y-3">
        <h3 className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase">Gamer Pass</h3>
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-850/50 divide-y divide-zinc-850/30 overflow-hidden">
          <div className="p-3.5 flex items-center justify-between text-xs cursor-pointer hover:bg-zinc-850/40">
            <div className="flex items-center gap-3">
              <Flame size={14} className="text-red-500" />
              <span className="font-semibold">Anime Daily Streak: 4 Days</span>
            </div>
            <ChevronRight size={14} className="text-zinc-600" />
          </div>
          <div className="p-3.5 flex items-center justify-between text-xs cursor-pointer hover:bg-zinc-850/40">
            <div className="flex items-center gap-3">
              <UserCheck size={14} className="text-amber-500" />
              <span className="font-semibold">Subscription Status: Premium Otaku</span>
            </div>
            <ChevronRight size={14} className="text-zinc-600" />
          </div>
          {onOpenApkManager && (
            <div 
              onClick={onOpenApkManager}
              className="p-3.5 flex items-center justify-between text-xs cursor-pointer hover:bg-zinc-850/40 bg-[#FF4D00]/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download size={14} className="text-[#FF4D00] animate-pulse" />
                <div>
                  <span className="font-black text-[#FF4D00]">Get Android app-release.apk</span>
                  <p className="text-[9px] text-zinc-500">Build, sign, and install mobile package</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#FF4D00]" />
            </div>
          )}
        </div>
      </div>

      {/* Logout button */}
      <div className="mt-8">
        <button
          id="btn-logout-profile"
          onClick={onLogout}
          className="w-full py-3.5 rounded-2xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/15 text-xs font-bold uppercase active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {translation.logout}
        </button>
      </div>
    </div>
  );
}


/* ==========================================================================
   6. APP CONFIGURATION SETTINGS SCREEN
   ========================================================================== */
interface SettingsProps {
  currentLang: Language;
  onLangToggle: (lang: Language) => void;
  theme: AppTheme;
  onThemeToggle: (theme: AppTheme) => void;
  translation: AppTranslation;
  onOpenApkManager?: () => void;
}

export function SettingsScreen({
  currentLang,
  onLangToggle,
  theme,
  onThemeToggle,
  translation,
  onOpenApkManager,
}: SettingsProps) {
  const [streamQuality, setStreamQuality] = useState<'high' | 'medium' | 'data_saver'>('high');

  return (
    <div id="settings-screen-scroll" className="absolute inset-0 bg-zinc-950 text-white overflow-y-auto p-5 pb-24 scrollbar-none text-left">
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-900 pb-3">
        <HelpCircle size={18} className="text-[#FF4D00]" />
        <h2 className="text-base font-extrabold uppercase tracking-wider">{translation.settings}</h2>
      </div>

      {/* Pref Preferences Group */}
      <div id="settings-preferences-group" className="space-y-4">
        
        {/* Language Selection */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-850/60 space-y-3">
          <div className="flex items-center gap-2 text-zinc-300">
            <Globe size={15} className="text-[#FF4D00]" />
            <span className="text-xs font-bold uppercase tracking-wide font-mono">{translation.language}</span>
          </div>
          <p className="text-[10px] text-zinc-500">Choose your system translation language for titles and subtitles.</p>
          <div className="flex gap-2">
            <button
              id="opt-lang-en"
              onClick={() => onLangToggle('en')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${currentLang === 'en' ? 'bg-[#FF4D00] text-white' : 'bg-zinc-950 text-zinc-400 border border-zinc-850'}`}
            >
              English
            </button>
            <button
              id="opt-lang-hi"
              onClick={() => onLangToggle('hi')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${currentLang === 'hi' ? 'bg-[#FF4D00] text-white' : 'bg-zinc-950 text-zinc-400 border border-zinc-850'}`}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>

        {/* Visual Themes Mode */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-850/60 space-y-3">
          <div className="flex items-center gap-2 text-zinc-300">
            <Palette size={15} className="text-[#FF4D00]" />
            <span className="text-xs font-bold uppercase tracking-wide font-mono">{translation.theme}</span>
          </div>
          <p className="text-[10px] text-zinc-500">Toggle dark streaming mode or bright daytime visibility mode.</p>
          <div className="flex gap-2">
            <button
              id="opt-theme-dark"
              onClick={() => onThemeToggle('dark')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${theme === 'dark' ? 'bg-[#FF4D00] text-white' : 'bg-zinc-950 text-zinc-400 border border-zinc-850'}`}
            >
              {translation.darkTheme}
            </button>
            <button
              id="opt-theme-light"
              onClick={() => onThemeToggle('light')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${theme === 'light' ? 'bg-[#FF4D00] text-white' : 'bg-zinc-950 text-zinc-400 border border-zinc-850'}`}
            >
              {translation.lightTheme}
            </button>
          </div>
        </div>

        {/* Technical Quality Pref */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-850/60 space-y-3">
          <div className="flex items-center gap-2 text-zinc-300">
            <Shield size={15} className="text-[#FF4D00]" />
            <span className="text-xs font-bold uppercase tracking-wide font-mono">Default Stream Speed</span>
          </div>
          <p className="text-[10px] text-zinc-500">Adjust video bitrate automatically based on network speeds.</p>
          <div className="flex flex-col gap-2">
            {(['high', 'medium', 'data_saver'] as const).map((q) => (
              <button
                key={q}
                id={`opt-quality-bitrate-${q}`}
                onClick={() => setStreamQuality(q)}
                className={`w-full py-2 px-3 text-left text-xs font-semibold rounded-xl flex items-center justify-between ${streamQuality === q ? 'bg-zinc-100 text-black' : 'bg-zinc-950 text-zinc-400 border border-zinc-850'}`}
              >
                <span>{q === 'high' ? 'High Fidelity Quality (Full 1080p)' : q === 'medium' ? 'Standard Bitrate (720p)' : 'Low Data Saver (480p)'}</span>
                <span className="text-[9px] font-bold font-mono text-zinc-500">{q === 'high' ? 'HD' : q === 'medium' ? 'SD' : 'LQ'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Android Build Option */}
        {onOpenApkManager && (
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-850/60 space-y-3">
            <div className="flex items-center gap-2 text-zinc-300">
              <Download size={15} className="text-[#FF4D00]" />
              <span className="text-xs font-bold uppercase tracking-wide font-mono">Android Release Package</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Generate, sign, and download the native production Android APK package (`app-release.apk`) for side-loading installation.
            </p>
            <button
              onClick={onOpenApkManager}
              className="w-full py-2.5 rounded-xl bg-[#FF4D00] hover:bg-[#FF4D00]/90 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-[#FF4D00]/10 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Download size={13} className="animate-bounce" />
              Build app-release.apk
            </button>
          </div>
        )}

        {/* Help Center details */}
        <div className="p-4 rounded-2xl bg-zinc-900/55 border border-zinc-850/50 space-y-2">
          <h4 className="text-xs font-bold text-zinc-200 uppercase font-mono">App Info</h4>
          <div className="text-[11px] text-zinc-500 space-y-1">
            <p>Ankit's Anime • Flutter Mobile UI Simulator</p>
            <p>Developer: ankitbusiness38@gmail.com</p>
            <p>Version: 2.4.0 (Material 3 Dark)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
