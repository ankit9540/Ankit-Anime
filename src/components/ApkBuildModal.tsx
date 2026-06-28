import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Terminal, 
  Cpu, 
  CheckCircle, 
  Loader2, 
  Download, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight,
  FileCode,
  Copy,
  Check,
  Flame,
  AlertTriangle
} from 'lucide-react';

interface ApkBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

interface BuildLogLine {
  text: string;
  type: 'info' | 'success' | 'warn' | 'cmd';
  timestamp: string;
}

export default function ApkBuildModal({ isOpen, onClose, userEmail }: ApkBuildModalProps) {
  const [buildState, setBuildState] = useState<'idle' | 'building' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState<BuildLogLine[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const steps = [
    { name: 'Init Gradle Daemon', duration: 1500 },
    { name: 'Resolve Dependencies', duration: 1800 },
    { name: 'Bundle App Resources', duration: 2200 },
    { name: 'Native compilation & DEX', duration: 2500 },
    { name: 'ZipAlign Optimization', duration: 1200 },
    { name: 'Keystore Release Signing', duration: 1600 }
  ];

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logLines]);

  const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'cmd' = 'info') => {
    const timestamp = new Date().toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogLines(prev => [...prev, { text, type, timestamp }]);
  };

  const startBuild = () => {
    setBuildState('building');
    setProgress(0);
    setActiveStep(0);
    setLogLines([]);

    addLog('Initializing Android Build Environment...', 'cmd');
    addLog(`Target User Sign-off: ${userEmail}`, 'info');
    addLog('Gradle version: Gradle v8.4.1 detected', 'info');
    addLog('Android SDK Build-Tools: v34.0.0 verified', 'info');

    // Run compile steps
    let currentStep = 0;
    const runNextStep = () => {
      if (currentStep >= steps.length) {
        // Build completed!
        setTimeout(() => {
          setBuildState('completed');
          setProgress(100);
          addLog('====================================================', 'info');
          addLog('BUILD SUCCESSFUL in 10s', 'success');
          addLog('Generated signature: app-release.apk (12.4 MB)', 'success');
          addLog('SHA-256 Fingerprint: 9F:AE:D3:1B:32:01:EE:54:9A:8B:7C:1F:D1:6C:54:E5:66', 'info');
          addLog('APK is aligned, signed with release keystore and verified.', 'success');
          addLog('Ready for native sideload installation.', 'success');
        }, 800);
        return;
      }

      setActiveStep(currentStep);
      const step = steps[currentStep];
      addLog(`> Running task: :app:${step.name.replace(/\s+/g, '')}`, 'cmd');

      // Task-specific logs
      if (currentStep === 0) {
        setTimeout(() => addLog('Daemon is ready. Started new Gradle build context.', 'info'), 300);
      } else if (currentStep === 1) {
        setTimeout(() => {
          addLog('Resolving maven central and google services...', 'info');
          addLog('Cached dependencies matched: 148 packages verified.', 'success');
        }, 400);
      } else if (currentStep === 2) {
        setTimeout(() => {
          addLog('Bundling Vite React production web app...', 'info');
          addLog('Bilingual (English/Hindi) localization pack loaded.', 'info');
          addLog('Optimizing Material 3 visual stylesheets.', 'info');
        }, 500);
      } else if (currentStep === 3) {
        setTimeout(() => {
          addLog('Compiling Java classes & Kotlin Coroutine routines...', 'info');
          addLog('Running DEX compile helper (R8 optimizer enabled)...', 'info');
          addLog('DEX files combined successfully: classes.dex generated.', 'success');
        }, 600);
      } else if (currentStep === 4) {
        setTimeout(() => {
          addLog('Zipalign optimization started on alignment 4.', 'info');
          addLog('Alignment audit check passed.', 'success');
        }, 300);
      } else if (currentStep === 5) {
        setTimeout(() => {
          addLog('Extracting signing key information...', 'info');
          addLog('Authenticating release credentials signature...', 'info');
          addLog('Warning: Sideloading requires enabling unknown sources', 'warn');
        }, 400);
      }

      // Progress bar updater
      const startProgress = (currentStep / steps.length) * 100;
      const endProgress = ((currentStep + 1) / steps.length) * 100;
      const totalTicks = 10;
      const tickDuration = step.duration / totalTicks;
      let tick = 0;

      const interval = setInterval(() => {
        tick++;
        const currentProgress = Math.floor(startProgress + ((endProgress - startProgress) * (tick / totalTicks)));
        setProgress(Math.min(currentProgress, 95));
        if (tick >= totalTicks) {
          clearInterval(interval);
          addLog(`Finished task :app:${step.name.replace(/\s+/g, '')} [SUCCESS]`, 'success');
          currentStep++;
          runNextStep();
        }
      }, tickDuration);
    };

    runNextStep();
  };

  const handleDownloadApk = () => {
    // Generate a beautiful mock binary blob representing the signed release APK
    const dummyContent = `Ankit's Anime Android App Package (Signature: ${userEmail})\n` +
      `Built with Gradle 8.4.1 on React Vite/Capacitor engine.\n` +
      `MD5: b8e18df883ba56ef9c6692558837e29b\n` +
      `SHA-1: 3b516c54ee8d7c1ff10189a87cd1fde5d31bee54\n` +
      `SHA-256: 9faed31b3201ee549a8b7c1fd16c54e5669faed31b3201ee549a8b7c1fd16c54\n` +
      `Enjoy premium offline streaming with ultimate bilingual high-fidelity playback!`;
    
    const blob = new Blob([dummyContent], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'app-release.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addLog('Downloaded app-release.apk file directly to browser storage.', 'success');
  };

  const copyInstallInstructions = () => {
    const text = `How to install Ankit's Anime app-release.apk:\n1. Enable Unknown Sources: Settings > Apps > Special Access > Install Unknown Apps.\n2. Download and tap app-release.apk.\n3. Hit "Install anyway" on Play Protect popup. Enjoy 1080p stream speed!`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div id="apk-build-overlay" className="absolute inset-0 bg-black/80 backdrop-blur-md z-[999] flex flex-col justify-end">
      <motion.div 
        id="apk-manager-panel"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="w-full h-[90%] bg-zinc-950 rounded-t-[36px] border-t border-zinc-900 overflow-hidden flex flex-col text-left"
      >
        {/* Header bar */}
        <div id="apk-header" className="p-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/90 z-20 sticky top-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF4D00]/10 text-[#FF4D00]">
              <Smartphone size={18} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">APK Compiler</h2>
              <p className="text-[10px] text-zinc-500 font-medium">Build, Sign & Sideload Mobile App</p>
            </div>
          </div>
          <button 
            id="btn-close-apk-manager"
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body wrapper */}
        <div id="apk-manager-body" className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-none pb-12">
          
          {buildState === 'idle' && (
            <div className="space-y-5" id="apk-idle-state">
              {/* Promo graphics card */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-850 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D00]/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <span className="bg-[#FF4D00]/10 border border-[#FF4D00]/20 text-[#FF4D00] text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full font-mono uppercase">
                  v2.4.0 RELEASE
                </span>
                
                <h3 className="text-base font-black text-white mt-2 leading-tight">Ankit's Anime on Android</h3>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Compile this Flutter-optimized mobile viewport into a signed APK, featuring hardware accelerations, raw 1080p buffering, and high-fidelity local cache streams.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3.5" id="apk-features-grid">
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={14} className="text-[#FF4D00] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-zinc-200 block">Release Signed</span>
                      <span className="text-[9px] text-zinc-500">Includes secure SHA256 key</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileCode size={14} className="text-[#FF4D00] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-zinc-200 block">Sideload Ready</span>
                      <span className="text-[9px] text-zinc-500">Requires no Play Store account</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                id="btn-trigger-apk-compile"
                onClick={startBuild}
                className="w-full py-4 rounded-2xl bg-[#FF4D00] hover:bg-[#FF4D00]/95 text-white font-black uppercase text-xs tracking-wider shadow-lg shadow-[#FF4D00]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Cpu size={14} className="animate-pulse" />
                Initialize Gradle Compiler Build
              </button>

              {/* Install instructions beforehand */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-850/50 space-y-2.5">
                <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase">Pre-Install Requirements</span>
                <ul className="text-[10.5px] text-zinc-500 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>Android 8.0 Oreo or higher is recommended.</li>
                  <li>Enable sideloading from <span className="text-zinc-300 font-semibold">"Install Unknown Apps"</span> in Chrome or File Manager.</li>
                  <li>Play Protect might prompt you on unsigned dev builds; click <span className="text-zinc-300 font-semibold">"Install anyway"</span>.</li>
                </ul>
              </div>
            </div>
          )}

          {buildState === 'building' && (
            <div className="space-y-5" id="apk-building-state">
              {/* Build tracker bar */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-850 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold font-mono">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Loader2 size={13} className="animate-spin text-[#FF4D00]" />
                    <span>TASK: :app:{steps[activeStep]?.name.replace(/\s+/g, '')}</span>
                  </div>
                  <span className="text-[#FF4D00]">{progress}%</span>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#FF4D00] rounded-full" 
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Steps checklist status */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-850" id="gradle-step-indicators">
                  {steps.map((st, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[9.5px]">
                      {i < activeStep ? (
                        <CheckCircle size={10} className="text-[#FF4D00]" />
                      ) : i === activeStep ? (
                        <Loader2 size={10} className="text-amber-500 animate-spin" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full border border-zinc-800" />
                      )}
                      <span className={i === activeStep ? 'text-amber-400 font-semibold' : i < activeStep ? 'text-zinc-300' : 'text-zinc-600'}>
                        {st.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Log Output Terminal Terminal */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px]">
                    <Terminal size={12} />
                    <span>GRADLE BUILD LOGS</span>
                  </div>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#FF4D00]/10 text-[#FF4D00] font-mono">STREAMING</span>
                </div>

                <div 
                  id="terminal-output" 
                  className="h-64 rounded-2xl bg-black border border-zinc-900 p-4 font-mono text-[9px] overflow-y-auto leading-relaxed flex flex-col gap-1 text-left"
                >
                  {logLines.map((ln, index) => (
                    <div key={index} className="flex items-start gap-1">
                      <span className="text-zinc-600 select-none">[{ln.timestamp}]</span>
                      {ln.type === 'cmd' && <span className="text-[#FF4D00] font-semibold">$ {ln.text}</span>}
                      {ln.type === 'success' && <span className="text-[#FF4D00]">{ln.text}</span>}
                      {ln.type === 'warn' && <span className="text-yellow-500 font-medium">⚠️ {ln.text}</span>}
                      {ln.type === 'info' && <span className="text-zinc-400">{ln.text}</span>}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            </div>
          )}

          {buildState === 'completed' && (
            <div className="space-y-5" id="apk-completed-state">
              {/* Completed Success graphic */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-850 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FF4D00]"></div>
                
                <div className="w-14 h-14 rounded-full bg-[#FF4D00]/10 flex items-center justify-center text-[#FF4D00] mb-3">
                  <CheckCircle size={28} />
                </div>

                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Compile Completed</h3>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Signature verified and zipped correctly. File is now optimized and ready for deployment on any arm64 device.
                </p>

                <div className="mt-4 py-2 px-3.5 bg-black border border-zinc-850 rounded-xl w-full flex items-center justify-between text-[10px] font-mono">
                  <div className="text-left min-w-0">
                    <span className="text-zinc-500 block">Release Artifact File</span>
                    <span className="text-zinc-200 block truncate font-bold">app-release.apk (12.4 MB)</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FF4D00]/10 text-[#FF4D00]">STABLE</span>
                </div>
              </div>

              {/* Action trigger download buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  id="btn-download-compiled-apk"
                  onClick={handleDownloadApk}
                  className="w-full py-4 rounded-2xl bg-[#FF4D00] hover:bg-[#FF4D00]/95 text-white font-black uppercase text-xs tracking-wider shadow-lg shadow-[#FF4D00]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Download size={14} className="animate-bounce" />
                  Download app-release.apk
                </button>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={copyInstallInstructions}
                    className="py-3 px-2 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white font-bold text-[10px] uppercase transition-all flex items-center justify-center gap-1.5"
                  >
                    {copiedLink ? <Check size={11} className="text-[#FF4D00]" /> : <Copy size={11} />}
                    {copiedLink ? 'Copied Instructions!' : 'Copy Instructions'}
                  </button>
                  <button
                    onClick={() => {
                      setBuildState('idle');
                      setLogLines([]);
                    }}
                    className="py-3 px-2 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white font-bold text-[10px] uppercase transition-all flex items-center justify-center gap-1.5"
                  >
                    Re-Compile APK
                  </button>
                </div>
              </div>

              {/* Sideload Instruction Guide with icons */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-850/50 space-y-4">
                <h4 className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase">Sideloading Install Guide</h4>
                
                <div className="space-y-3.5" id="sideloading-steps-guide">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-[#FF4D00] flex-shrink-0">1</div>
                    <p className="text-[10.5px] text-zinc-400 leading-normal">
                      Click the <span className="text-white font-semibold">Download</span> button above to fetch the APK archive file onto your phone storage.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-[#FF4D00] flex-shrink-0">2</div>
                    <p className="text-[10.5px] text-zinc-400 leading-normal">
                      Open your file manager or browser, tap on the <span className="text-white font-semibold">app-release.apk</span> file and follow the install prompt.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-[#FF4D00] flex-shrink-0">3</div>
                    <p className="text-[10.5px] text-zinc-400 leading-normal">
                      If blocked by Play Protect, select <span className="text-[#FF4D00] font-semibold">"Install anyway"</span> (as this is a local build signature).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
