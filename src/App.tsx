import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  Search as SearchIcon, 
  Bookmark, 
  Library, 
  User, 
  Settings, 
  Download, 
  Sparkles,
  VolumeX,
  X
} from 'lucide-react';

import PhoneFrame from './components/PhoneFrame';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import SearchScreen from './components/SearchScreen';
import DetailScreen from './components/DetailScreen';
import { 
  WatchlistScreen, 
  HistoryScreen, 
  DownloadsScreen, 
  OfflineScreen, 
  ProfileScreen, 
  SettingsScreen 
} from './components/SecondaryScreens';
import ApkBuildModal from './components/ApkBuildModal';

import { Anime, Episode, AppTranslation, Language, AppTheme, Download as DownloadType, WatchHistory, UserProfile } from './types';
import { ANIME_DATA, TRANSLATIONS } from './data';

// Initial Gamer Profile template
const DEFAULT_USER: UserProfile = {
  username: "Ankit Business",
  email: "ankitbusiness38@gmail.com",
  avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=150&auto=format&fit=crop",
  level: 4,
  exp: 75,
  maxExp: 150,
  episodesWatched: 18,
  hoursWatched: 7,
};

export default function App() {
  // App-level global configurations
  const [isSplashFinished, setIsSplashFinished] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [theme, setTheme] = useState<AppTheme>('dark');

  // Navigation state machine
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [previousScreen, setPreviousScreen] = useState<string>('home');
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);

  // User database lists
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [history, setHistory] = useState<WatchHistory[]>([]);
  const [downloads, setDownloads] = useState<DownloadType[]>([]);

  // HUD and Alert notifications states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isApkManagerOpen, setIsApkManagerOpen] = useState(false);

  // Load configuration from LocalStorage on mount
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('ankits_anime_lang') as Language;
      if (storedLang) setCurrentLang(storedLang);

      const storedTheme = localStorage.getItem('ankits_anime_theme') as AppTheme;
      if (storedTheme) setTheme(storedTheme);

      const storedUser = localStorage.getItem('ankits_anime_user');
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedGuest = localStorage.getItem('ankits_anime_guest');
      if (storedGuest) setIsGuest(storedGuest === 'true');

      const storedWatchlist = localStorage.getItem('ankits_anime_watchlist');
      if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));

      const storedHistory = localStorage.getItem('ankits_anime_history');
      if (storedHistory) setHistory(JSON.parse(storedHistory));

      const storedDownloads = localStorage.getItem('ankits_anime_downloads');
      if (storedDownloads) setDownloads(JSON.parse(storedDownloads));
    } catch (e) {
      console.error("Failed to load local state:", e);
    }
  }, []);

  // Save configurations on updates
  useEffect(() => {
    localStorage.setItem('ankits_anime_lang', currentLang);
  }, [currentLang]);

  useEffect(() => {
    localStorage.setItem('ankits_anime_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) localStorage.setItem('ankits_anime_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ankits_anime_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('ankits_anime_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('ankits_anime_downloads', JSON.stringify(downloads));
  }, [downloads]);

  // Toast auto-clearing helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  /* ==========================================================================
     DYNAMIC DOWNLOAD SPEED SIMULATOR
     ========================================================================== */
  useEffect(() => {
    const downloadLoop = setInterval(() => {
      const hasActiveDownloads = downloads.some(d => d.status === 'downloading');
      if (!hasActiveDownloads) return;

      setDownloads((prevDownloads) => {
        let stateChanged = false;
        const updated = prevDownloads.map((dl) => {
          if (dl.status !== 'downloading') return dl;

          stateChanged = true;
          const nextProgress = dl.progress + Math.floor(Math.random() * 8) + 4; // increment 4-11%
          
          if (nextProgress >= 100) {
            // Completed download callback
            setTimeout(() => {
              triggerToast(`Downloaded: "${currentLang === 'en' ? dl.animeTitle : dl.animeTitleHindi}" Ep ${dl.episodeTitle.split(' ')[0]} is ready offline! +30 XP`);
              
              // Increment gamer experience points XP
              setUser((prevUser) => {
                if (!prevUser) return null;
                let nextExp = prevUser.exp + 30;
                let nextLevel = prevUser.level;
                if (nextExp >= prevUser.maxExp) {
                  nextExp -= prevUser.maxExp;
                  nextLevel += 1;
                  setTimeout(() => {
                    triggerToast(`🎉 OTACU LEVEL UP! You reached Level ${nextLevel}!`);
                  }, 2000);
                }
                return {
                  ...prevUser,
                  level: nextLevel,
                  exp: nextExp,
                  episodesWatched: prevUser.episodesWatched + 1
                };
              });
            }, 100);

            return {
              ...dl,
              progress: 100,
              status: 'completed',
              downloadSpeed: '0 KB/s'
            };
          }

          // Random fluctuating speeds
          const speedOptions = ["3.4 MB/s", "4.8 MB/s", "5.2 MB/s", "2.9 MB/s", "6.1 MB/s"];
          const randomSpeed = speedOptions[Math.floor(Math.random() * speedOptions.length)];

          return {
            ...dl,
            progress: nextProgress,
            downloadSpeed: randomSpeed
          };
        });

        return stateChanged ? updated : prevDownloads;
      });
    }, 1500);

    return () => clearInterval(downloadLoop);
  }, [downloads, currentLang]);

  /* ==========================================================================
     CORE EVENT HANDLERS
     ========================================================================== */
  const handleSplashFinish = () => {
    setIsSplashFinished(true);
    if (user || isGuest) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('login');
    }
  };

  const handleLoginSuccess = (username: string, guest: boolean) => {
    const finalUser: UserProfile = {
      ...DEFAULT_USER,
      username: username,
      email: guest ? "guest@ankitsanime.io" : `${username.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
    };
    setUser(finalUser);
    setIsGuest(guest);
    localStorage.setItem('ankits_anime_guest', guest ? 'true' : 'false');
    setCurrentScreen('home');
    triggerToast(currentLang === 'en' ? `Welcome, ${username}!` : `स्वागत है, ${username}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setIsGuest(false);
    setWatchlist([]);
    setHistory([]);
    setDownloads([]);
    localStorage.removeItem('ankits_anime_user');
    localStorage.removeItem('ankits_anime_guest');
    localStorage.removeItem('ankits_anime_watchlist');
    localStorage.removeItem('ankits_anime_history');
    localStorage.removeItem('ankits_anime_downloads');
    setCurrentScreen('login');
  };

  const handleToggleWatchlist = (animeId: string) => {
    const isFav = watchlist.includes(animeId);
    const anime = ANIME_DATA.find(a => a.id === animeId);
    if (isFav) {
      setWatchlist(prev => prev.filter(id => id !== animeId));
      if (anime) triggerToast(currentLang === 'en' ? `Removed "${anime.title}" from watchlist` : `सूची से "${anime.titleHindi}" हटाया गया`);
    } else {
      setWatchlist(prev => [...prev, animeId]);
      if (anime) triggerToast(currentLang === 'en' ? `Added "${anime.title}" to watchlist!` : `सूची में "${anime.titleHindi}" जोड़ा गया!`);
    }
  };

  const handleSelectAnime = (animeId: string) => {
    setPreviousScreen(currentScreen);
    setSelectedAnimeId(animeId);
    setCurrentScreen('details');
  };

  const handleBackNavigation = () => {
    if (currentScreen === 'details') {
      setCurrentScreen(previousScreen);
      setSelectedAnimeId(null);
    }
  };

  const handleStartDownload = (episode: Episode, anime: Anime) => {
    // Check if already downloading or downloaded
    const existing = downloads.find(d => d.episodeId === episode.id);
    if (existing) {
      if (existing.status === 'completed') {
        triggerToast("Episode already downloaded offline!");
      } else {
        triggerToast("Download is already in progress!");
      }
      return;
    }

    const newDownload: DownloadType = {
      episodeId: episode.id,
      animeId: anime.id,
      episodeTitle: `Episode ${episode.episodeNumber}: ${episode.title}`,
      episodeTitleHindi: `एपिसोड ${episode.episodeNumber}: ${episode.titleHindi}`,
      animeTitle: anime.title,
      animeTitleHindi: anime.titleHindi,
      progress: 0,
      status: 'downloading',
      sizeMb: Math.floor(Math.random() * 40) + 75, // 75 - 115 MB
      downloadSpeed: '3.5 MB/s'
    };

    setDownloads(prev => [...prev, newDownload]);
    triggerToast(currentLang === 'en' ? `Started downloading Episode ${episode.episodeNumber}...` : `एपिसोड ${episode.episodeNumber} डाउनलोड होना शुरू हुआ...`);
  };

  const handlePauseDownload = (episodeId: string) => {
    setDownloads(prev => prev.map(d => d.episodeId === episodeId ? { ...d, status: 'paused', downloadSpeed: 'Paused' } : d));
  };

  const handleResumeDownload = (episodeId: string) => {
    setDownloads(prev => prev.map(d => d.episodeId === episodeId ? { ...d, status: 'downloading', downloadSpeed: '3.0 MB/s' } : d));
  };

  const handleCancelDownload = (episodeId: string) => {
    setDownloads(prev => prev.filter(d => d.episodeId !== episodeId));
    triggerToast("Download cancelled and removed.");
  };

  const handleAddHistory = (anime: Anime, episode: Episode, progress: number) => {
    setHistory((prev) => {
      const filtered = prev.filter(h => h.episodeId !== episode.id);
      const newRecord: WatchHistory = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        animeId: anime.id,
        episodeId: episode.id,
        animeTitle: anime.title,
        animeTitleHindi: anime.titleHindi,
        episodeTitle: episode.title,
        episodeTitleHindi: episode.titleHindi,
        episodeNumber: episode.episodeNumber,
        watchedAt: new Date().toISOString(),
        progressPercentage: progress
      };
      return [newRecord, ...filtered];
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    triggerToast("Viewing history cleared.");
  };

  const activeTranslation = TRANSLATIONS[currentLang];

  // Map bottom tabs to specific screen keys
  const showBottomTabs = isSplashFinished && (user || isGuest) && currentScreen !== 'details';

  return (
    <PhoneFrame
      theme={theme}
      currentScreen={currentScreen}
      onNavigateBack={handleBackNavigation}
      canNavigateBack={currentScreen === 'details'}
    >
      <div id="ankits-anime-application-stage" className="w-full h-full relative select-none flex flex-col font-sans">
        
        {/* Dynamic Toast HUD Alert notifications */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              id="global-hud-toast"
              className="absolute top-6 left-4 right-4 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-xl z-[99] flex items-center justify-between gap-3 text-xs font-semibold leading-relaxed"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#FF4D00] fill-current flex-shrink-0" />
                <span className="text-left">{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-zinc-500 hover:text-white">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Screens Mount */}
        <div id="main-screens-viewport" className="flex-1 w-full relative overflow-hidden">
          {!isSplashFinished && (
            <SplashScreen onFinish={handleSplashFinish} translation={activeTranslation} />
          )}

          {isSplashFinished && currentScreen === 'login' && (
            <LoginScreen
              onLoginSuccess={handleLoginSuccess}
              translation={activeTranslation}
              currentLang={currentLang}
              onLanguageChange={setCurrentLang}
            />
          )}

          {isSplashFinished && currentScreen === 'home' && (
            <HomeScreen
              animeList={ANIME_DATA}
              watchlist={watchlist}
              history={history}
              onToggleWatchlist={handleToggleWatchlist}
              onSelectAnime={handleSelectAnime}
              onResumeEpisode={(animeId, epId) => handleSelectAnime(animeId)}
              translation={activeTranslation}
              currentLang={currentLang}
            />
          )}

          {isSplashFinished && currentScreen === 'search' && (
            <SearchScreen
              animeList={ANIME_DATA}
              onSelectAnime={handleSelectAnime}
              translation={activeTranslation}
              currentLang={currentLang}
            />
          )}

          {isSplashFinished && currentScreen === 'details' && selectedAnimeId && (
            <DetailScreen
              animeId={selectedAnimeId}
              onBack={handleBackNavigation}
              watchlist={watchlist}
              downloads={downloads}
              onToggleWatchlist={handleToggleWatchlist}
              onStartDownload={handleStartDownload}
              onAddHistory={handleAddHistory}
              translation={activeTranslation}
              currentLang={currentLang}
            />
          )}

          {isSplashFinished && currentScreen === 'watchlist' && (
            <WatchlistScreen
              watchlist={watchlist}
              animeList={ANIME_DATA}
              onSelectAnime={handleSelectAnime}
              onRemove={handleToggleWatchlist}
              translation={activeTranslation}
              currentLang={currentLang}
            />
          )}

          {isSplashFinished && currentScreen === 'offline' && (
            <OfflineScreen
              downloads={downloads}
              onPlayEpisode={(epId, animeId) => handleSelectAnime(animeId)}
              translation={activeTranslation}
              currentLang={currentLang}
            />
          )}

          {isSplashFinished && currentScreen === 'downloads' && (
            <DownloadsScreen
              downloads={downloads}
              onPause={handlePauseDownload}
              onResume={handleResumeDownload}
              onCancel={handleCancelDownload}
              translation={activeTranslation}
              currentLang={currentLang}
            />
          )}

          {isSplashFinished && currentScreen === 'profile' && user && (
            <ProfileScreen
              user={user}
              onLogout={handleLogout}
              translation={activeTranslation}
              currentLang={currentLang}
              onOpenApkManager={() => setIsApkManagerOpen(true)}
            />
          )}

          {isSplashFinished && currentScreen === 'settings' && (
            <SettingsScreen
              currentLang={currentLang}
              onLangToggle={setCurrentLang}
              theme={theme}
              onThemeToggle={setTheme}
              translation={activeTranslation}
              onOpenApkManager={() => setIsApkManagerOpen(true)}
            />
          )}
        </div>

        {/* Dynamic M3 Bottom Tab Navigation Rail Bar */}
        {showBottomTabs && (
          <div 
            id="m3-bottom-nav-rail" 
            className={`absolute bottom-0 left-0 right-0 h-[68px] border-t flex justify-around items-center px-2 z-40 shadow-lg select-none ${
              theme === 'dark' 
                ? 'bg-zinc-950/95 border-zinc-900 text-zinc-400' 
                : 'bg-white/95 border-zinc-200 text-zinc-600'
            }`}
          >
            {/* Home tab */}
            <button
              id="tab-btn-home"
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl relative transition-all ${
                currentScreen === 'home' 
                  ? (theme === 'dark' ? 'text-[#FF4D00]' : 'text-zinc-900') 
                  : 'hover:text-zinc-200'
              }`}
            >
              <HomeIcon size={18} id="tab-icon-home" />
              <span className="text-[9px] font-bold tracking-tight">{currentLang === 'en' ? 'Home' : 'होम'}</span>
              {currentScreen === 'home' && (
                <motion.div layoutId="bottom-bar-active-indicator" className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-[#FF4D00]" />
              )}
            </button>

            {/* Search tab */}
            <button
              id="tab-btn-search"
              onClick={() => setCurrentScreen('search')}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl relative transition-all ${
                currentScreen === 'search' 
                  ? (theme === 'dark' ? 'text-[#FF4D00]' : 'text-zinc-900') 
                  : 'hover:text-zinc-200'
              }`}
            >
              <SearchIcon size={18} id="tab-icon-search" />
              <span className="text-[9px] font-bold tracking-tight">{currentLang === 'en' ? 'Search' : 'खोजें'}</span>
              {currentScreen === 'search' && (
                <motion.div layoutId="bottom-bar-active-indicator" className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-[#FF4D00]" />
              )}
            </button>

            {/* Watchlist tab */}
            <button
              id="tab-btn-watchlist"
              onClick={() => setCurrentScreen('watchlist')}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl relative transition-all ${
                currentScreen === 'watchlist' 
                  ? (theme === 'dark' ? 'text-[#FF4D00]' : 'text-zinc-900') 
                  : 'hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Bookmark size={18} id="tab-icon-watchlist" />
                {watchlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FF4D00] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono">
                    {watchlist.length}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold tracking-tight">{currentLang === 'en' ? 'Watchlist' : 'सूची'}</span>
              {currentScreen === 'watchlist' && (
                <motion.div layoutId="bottom-bar-active-indicator" className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-[#FF4D00]" />
              )}
            </button>

            {/* Downloads Queue tab */}
            <button
              id="tab-btn-downloads"
              onClick={() => setCurrentScreen('downloads')}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl relative transition-all ${
                currentScreen === 'downloads' 
                  ? (theme === 'dark' ? 'text-[#FF4D00]' : 'text-zinc-900') 
                  : 'hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Download size={18} id="tab-icon-downloads" />
                {downloads.some(d => d.status === 'downloading') && (
                  <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-[#FF4D00] animate-ping"></span>
                )}
              </div>
              <span className="text-[9px] font-bold tracking-tight">{currentLang === 'en' ? 'Downloads' : 'डाउनलोड'}</span>
              {currentScreen === 'downloads' && (
                <motion.div layoutId="bottom-bar-active-indicator" className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-[#FF4D00]" />
              )}
            </button>

            {/* Offline Library tab */}
            <button
              id="tab-btn-offline"
              onClick={() => setCurrentScreen('offline')}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl relative transition-all ${
                currentScreen === 'offline' 
                  ? (theme === 'dark' ? 'text-[#FF4D00]' : 'text-zinc-900') 
                  : 'hover:text-zinc-200'
              }`}
            >
              <Library size={18} id="tab-icon-offline" />
              <span className="text-[9px] font-bold tracking-tight">{currentLang === 'en' ? 'Offline' : 'ऑफ़लाइन'}</span>
              {currentScreen === 'offline' && (
                <motion.div layoutId="bottom-bar-active-indicator" className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-[#FF4D00]" />
              )}
            </button>

            {/* Profile tab */}
            <button
              id="tab-btn-profile"
              onClick={() => setCurrentScreen('profile')}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl relative transition-all ${
                currentScreen === 'profile' 
                  ? (theme === 'dark' ? 'text-[#FF4D00]' : 'text-zinc-900') 
                  : 'hover:text-zinc-200'
              }`}
            >
              <User size={18} id="tab-icon-profile" />
              <span className="text-[9px] font-bold tracking-tight">{currentLang === 'en' ? 'Profile' : 'प्रोफ़ाइल'}</span>
              {currentScreen === 'profile' && (
                <motion.div layoutId="bottom-bar-active-indicator" className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-[#FF4D00]" />
              )}
            </button>

            {/* Settings tab */}
            <button
              id="tab-btn-settings"
              onClick={() => setCurrentScreen('settings')}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl relative transition-all ${
                currentScreen === 'settings' 
                  ? (theme === 'dark' ? 'text-[#FF4D00]' : 'text-zinc-900') 
                  : 'hover:text-zinc-200'
              }`}
            >
              <Settings size={18} id="tab-icon-settings" />
              <span className="text-[9px] font-bold tracking-tight">{currentLang === 'en' ? 'Settings' : 'सेटिंग'}</span>
              {currentScreen === 'settings' && (
                <motion.div layoutId="bottom-bar-active-indicator" className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-[#FF4D00]" />
              )}
            </button>
          </div>
        )}

        {/* Apk compilation overlay */}
        <AnimatePresence>
          {isApkManagerOpen && (
            <ApkBuildModal
              isOpen={isApkManagerOpen}
              onClose={() => setIsApkManagerOpen(false)}
              userEmail={user?.email || 'ankitbusiness38@gmail.com'}
            />
          )}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}
