import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  currentScreen: string;
  onNavigateBack?: () => void;
  canNavigateBack: boolean;
}

export default function PhoneFrame({
  children,
  theme,
  currentScreen,
  onNavigateBack,
  canNavigateBack,
}: PhoneFrameProps) {
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div id="phone-frame-wrapper" className={`flex flex-col items-center justify-center min-h-screen p-2 md:p-6 transition-colors duration-500 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'
    }`}>
      {/* View Toggle Bar */}
      <div id="view-toggle-bar" className={`flex items-center gap-3 px-4 py-2 mb-4 rounded-full border shadow-sm ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'
      }`}>
        <button
          id="btn-phone-view"
          onClick={() => setIsMobileFrame(true)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            isMobileFrame 
              ? 'bg-[#FF4D00] text-white' 
              : 'hover:text-zinc-100'
          }`}
        >
          <Smartphone size={14} id="icon-phone" />
          Android Mobile View
        </button>
        <button
          id="btn-web-view"
          onClick={() => setIsMobileFrame(false)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            !isMobileFrame 
              ? 'bg-[#FF4D00] text-white' 
              : 'hover:text-zinc-100'
          }`}
        >
          <Monitor size={14} id="icon-monitor" />
          Fullscreen Web View
        </button>
      </div>

      {isMobileFrame ? (
        /* Smartphone Device Container */
        <div 
          id="android-device-bezel" 
          className={`relative w-full max-w-[410px] h-[820px] rounded-[48px] border-8 shadow-2xl transition-all duration-300 overflow-hidden flex flex-col ${
            isDark 
              ? 'border-zinc-800 bg-black ring-1 ring-zinc-700/50 shadow-amber-950/20' 
              : 'border-zinc-300 bg-white ring-1 ring-zinc-400/30 shadow-zinc-400/50'
          }`}
        >
          {/* Dynamic Speaker grill and notch camera */}
          <div id="notch-container" className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl z-50 flex items-center justify-center gap-3">
            <div id="speaker-grill" className="w-12 h-1 bg-zinc-800 rounded-full"></div>
            <div id="camera-lens" className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-800"></div>
          </div>

          {/* Device Status Bar */}
          <div 
            id="android-status-bar" 
            className={`flex justify-between items-center px-6 pt-7 pb-2 text-[11px] font-medium z-40 relative select-none ${
              isDark ? 'bg-zinc-950/80 text-zinc-300' : 'bg-zinc-50/85 text-zinc-700'
            }`}
          >
            <div id="status-bar-time" className="font-semibold tracking-tight">{time}</div>
            
            {/* Mock Android Notification Area */}
            <div id="notification-icons-area" className="flex items-center gap-2 text-xs">
              <span id="label-5g" className="text-[10px] font-bold opacity-80">5G</span>
              <Signal size={12} id="icon-signal" />
              <Wifi size={12} id="icon-wifi" />
              <div id="battery-status-container" className="flex items-center gap-0.5">
                <span id="label-battery" className="text-[9px]">98%</span>
                <Battery size={13} className="rotate-90 origin-center text-current" id="icon-battery" />
              </div>
            </div>
          </div>

          {/* Main Display Viewport */}
          <div id="display-viewport" className="flex-1 overflow-hidden relative flex flex-col">
            {children}
          </div>

          {/* Android Navigation Bar Bar */}
          <div 
            id="android-bottom-bar" 
            className={`h-11 flex justify-around items-center px-12 pb-2 relative z-40 ${
              isDark ? 'bg-zinc-950 border-t border-zinc-900' : 'bg-zinc-50 border-t border-zinc-200'
            }`}
          >
            {/* Back button */}
            <button 
              id="android-nav-back"
              disabled={!canNavigateBack}
              onClick={onNavigateBack}
              className={`p-2 rounded-full transition-colors ${
                canNavigateBack 
                  ? 'active:scale-95 text-current opacity-100 hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50' 
                  : 'opacity-25 pointer-events-none'
              }`}
              title="Android Back"
            >
              <ArrowLeft size={16} id="android-nav-back-icon" />
            </button>
            {/* Home Pill */}
            <div 
              id="android-nav-home" 
              className={`w-28 h-1.5 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-zinc-400'}`}
            ></div>
            {/* Recents Button */}
            <div 
              id="android-nav-recents" 
              className={`w-3.5 h-3.5 rounded-sm border-2 ${isDark ? 'border-zinc-700' : 'border-zinc-400'}`}
            ></div>
          </div>
        </div>
      ) : (
        /* Expanded Full Screen Web view */
        <div id="fullscreen-app-container" className={`w-full max-w-7xl min-h-[820px] rounded-3xl shadow-xl overflow-hidden border flex flex-col ${
          isDark ? 'bg-zinc-950 border-zinc-800 shadow-amber-950/10' : 'bg-white border-zinc-200 shadow-zinc-300'
        }`}>
          <div id="fullscreen-viewport" className="flex-1 flex flex-col relative">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
