import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, Globe, Sparkles } from 'lucide-react';
import { AppTranslation, Language } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (username: string, isGuest: boolean) => void;
  translation: AppTranslation;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LoginScreen({
  onLoginSuccess,
  translation,
  currentLang,
  onLanguageChange,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering && !username.trim()) {
      setError(currentLang === 'en' ? 'Username is required' : 'यूज़रनेम आवश्यक है');
      return;
    }
    if (!email.includes('@')) {
      setError(currentLang === 'en' ? 'Enter a valid email' : 'मान्य ईमेल दर्ज करें');
      return;
    }
    if (password.length < 4) {
      setError(currentLang === 'en' ? 'Password must be at least 4 characters' : 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए');
      return;
    }

    const finalUsername = isRegistering ? username : email.split('@')[0];
    onLoginSuccess(finalUsername, false);
  };

  const handleGuestLogin = () => {
    onLoginSuccess(currentLang === 'en' ? 'Guest Otaku' : 'अतिथि ओटाकू', true);
  };

  return (
    <div 
      id="login-screen-scroll" 
      className="absolute inset-0 bg-zinc-950 flex flex-col justify-between p-6 overflow-y-auto"
    >
      {/* Header Language Switcher */}
      <div id="login-header-controls" className="flex justify-between items-center z-10">
        <div id="badge-version" className="flex items-center gap-1 bg-[#FF4D00]/10 border border-[#FF4D00]/20 px-2.5 py-0.5 rounded-full text-[10px] text-[#FF4D00] font-mono">
          <Sparkles size={10} />
          M3 DESIGN
        </div>
        
        {/* Language Selection Quick Toggle */}
        <button
          id="btn-lang-toggle"
          onClick={() => onLanguageChange(currentLang === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
        >
          <Globe size={13} id="lang-globe-icon" />
          <span className="font-medium">{currentLang === 'en' ? 'हिंदी' : 'English'}</span>
        </button>
      </div>

      {/* Main Card with Form */}
      <div id="login-form-card" className="w-full my-auto py-6 relative z-10">
        {/* App Title & Subtitle */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 rounded-2xl bg-[#FF4D00] mx-auto flex items-center justify-center shadow-lg shadow-[#FF4D00]/10 mb-4"
          >
            <span className="text-white text-xl font-black">A</span>
          </motion.div>
          <h2 id="login-title" className="text-2xl font-bold tracking-tight text-white">{translation.appName}</h2>
          <p id="login-subtitle" className="text-xs text-zinc-400 mt-1">
            {isRegistering 
              ? (currentLang === 'en' ? 'Create an Otaku Profile' : 'एक ओटाकू प्रोफ़ाइल बनाएं')
              : (currentLang === 'en' ? 'Access your customized anime experience' : 'अपने व्यक्तिगत एनीमे अनुभव तक पहुंचें')
            }
          </p>
        </div>

        {/* Inputs */}
        <form id="form-login" onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium"
              id="login-error-alert"
            >
              {error}
            </motion.div>
          )}

          {isRegistering && (
            <div className="space-y-1.5" id="input-group-username">
              <label className="text-[11px] font-semibold text-zinc-400 font-mono uppercase tracking-wider">
                {currentLang === 'en' ? 'Username' : 'यूज़रनेम'}
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={currentLang === 'en' ? 'e.g. AnkitSlayer' : 'उदा. अंकितस्लेयर'}
                  className="w-full pl-11 pr-4 py-3 text-sm bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00] transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5" id="input-group-email">
            <label className="text-[11px] font-semibold text-zinc-400 font-mono uppercase tracking-wider">
              {currentLang === 'en' ? 'Email Address' : 'ईमेल पता'}
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-11 pr-4 py-3 text-sm bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5" id="input-group-password">
            <label className="text-[11px] font-semibold text-zinc-400 font-mono uppercase tracking-wider">
              {currentLang === 'en' ? 'Password' : 'पासवर्ड'}
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 text-sm bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00] transition-colors"
              />
              <button
                type="button"
                id="btn-password-visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="btn-login-submit"
            className="w-full py-3.5 mt-2 rounded-full bg-[#FF4D00] text-white font-semibold text-sm shadow-md shadow-[#FF4D00]/10 hover:shadow-[#FF4D00]/20 active:scale-[0.98] transition-all"
          >
            {isRegistering ? translation.login : translation.login}
          </button>
        </form>

        {/* Register or Login Swap */}
        <div className="text-center mt-5" id="register-swap-text">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-zinc-400 hover:text-[#FF4D00] transition-colors"
          >
            {isRegistering
              ? (currentLang === 'en' ? 'Already have an account? Log In' : 'क्या आपके पास पहले से खाता है? लॉग इन करें')
              : (currentLang === 'en' ? "Don't have an account? Sign Up" : 'खाता नहीं है? साइन अप करें')
            }
          </button>
        </div>
      </div>

      {/* Guest Login Area at Bottom */}
      <div id="guest-login-footer" className="w-full pt-4 border-t border-zinc-900 z-10">
        <button
          type="button"
          id="btn-guest-mode"
          onClick={handleGuestLogin}
          className="w-full py-3.5 rounded-full bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white hover:bg-zinc-800/50 hover:border-zinc-700 font-semibold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {translation.guestMode}
        </button>
      </div>
    </div>
  );
}
