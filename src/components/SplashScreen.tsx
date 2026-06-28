import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Flame } from 'lucide-react';
import { AppTranslation } from '../types';

interface SplashScreenProps {
  onFinish: () => void;
  translation: AppTranslation;
}

export default function SplashScreen({ onFinish, translation }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      id="splash-screen-container" 
      className="absolute inset-0 bg-[#080808] flex flex-col items-center justify-between py-16 z-50 overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div id="ambient-glow" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#FF4D00]/15 rounded-full blur-[90px]" />

      <div></div>

      {/* Animated Logo Container */}
      <div id="logo-block" className="flex flex-col items-center gap-4 relative z-10">
        <motion.div
          id="logo-circle"
          initial={{ scale: 0.3, opacity: 0, rotate: -45 }}
          animate={{ scale: [1, 1.1, 1], opacity: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-24 h-24 rounded-3xl bg-[#FF4D00] flex items-center justify-center shadow-lg shadow-[#FF4D00]/20 relative"
        >
          {/* Decorative glowing outer ring */}
          <div className="absolute inset-0.5 rounded-3xl border border-white/25"></div>
          {/* Dynamic flame and play icon */}
          <div className="relative">
            <Play className="w-10 h-10 text-white fill-white translate-x-0.5" id="logo-icon-play" />
            <Flame className="w-6 h-6 text-[#FF4D00] absolute -top-5 -right-5 animate-pulse" id="logo-icon-flame" />
          </div>
        </motion.div>

        {/* Brand Name Text Animation */}
        <div className="text-center mt-3">
          <motion.h1
            id="brand-name-header"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent font-sans"
          >
            {translation.appName}
          </motion.h1>
          <motion.p
            id="brand-tagline"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 0.7 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xs tracking-widest text-[#FF4D00] uppercase font-mono font-medium mt-1"
          >
            Ultimate Anime Experience
          </motion.p>
        </div>
      </div>

      {/* Loading Bar and Footnote */}
      <div id="loading-footer" className="w-full max-w-[240px] flex flex-col items-center gap-4 z-10">
        <div id="loading-track" className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            id="loading-bar-fill"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="h-full bg-[#FF4D00]"
          ></motion.div>
        </div>
        <motion.p
          id="loading-version"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2 }}
          className="text-[10px] font-mono tracking-widest text-zinc-400"
        >
          v2.0.1 • POWERED BY FLUTTER M3
        </motion.p>
      </div>
    </div>
  );
}
