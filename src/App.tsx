/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCw,
  Maximize2,
  Minimize2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function App() {
  const targetUrl = 'https://vimosai.ai.studio';
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Monitor fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Timeout guard in case cross-origin iframe hangs or is blocked
  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);

    const timer = setTimeout(() => {
      // If still not loaded after 8 seconds, show fallback assist option
      setIsLoading(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [reloadKey]);

  const handleReload = () => {
    setIsLoading(true);
    setLoadError(false);
    setReloadKey((prev) => prev + 1);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen rejection
    }
  };

  const openInNewTab = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Full Body Iframe */}
      <iframe
        key={reloadKey}
        ref={iframeRef}
        src={targetUrl}
        title="VimosAI Studio"
        onLoad={() => {
          setIsLoading(false);
        }}
        onError={() => {
          setIsLoading(false);
          setLoadError(true);
        }}
        className="w-full h-full border-0 m-0 p-0 block bg-slate-900"
        allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; picture-in-picture; screen-wake-lock; web-share"
        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-downloads"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md transition-opacity duration-300">
          <div className="relative flex items-center justify-center mb-5">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-lg font-medium text-slate-100 tracking-wide">
            Memuat VimosAI Studio...
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Menghubungkan ke layanan full body
          </p>
        </div>
      )}

      {/* Error / Fallback Banner if embedding is blocked by CORS/CSP */}
      {loadError && (
        <div className="absolute inset-x-4 top-4 z-40 max-w-lg mx-auto bg-slate-900/95 border border-amber-500/30 shadow-2xl rounded-2xl p-4 text-slate-200 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-slate-100">
                Pemberitahuan Tampilan
              </p>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                Jika halaman tidak muncul karena pembatasan keamanan browser (X-Frame-Options), Anda dapat membukanya secara langsung.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={openInNewTab}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Langsung
                </button>
                <button
                  type="button"
                  onClick={handleReload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Muat Ulang
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLoadError(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Minimal Discreet Floating Action Dock (Tanpa link search, hanya tool minimal) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end pointer-events-auto">
        {showControls && (
          <div className="mb-2 p-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-xl flex items-center gap-1 text-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              type="button"
              onClick={handleReload}
              title="Muat ulang halaman"
              className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
              className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={openInNewTab}
              title="Buka tab baru"
              className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Small Discreet Floating Toggle Button */}
        <button
          type="button"
          onClick={() => setShowControls((prev) => !prev)}
          className="group flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-700/40 backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer"
          title={showControls ? 'Sembunyikan menu' : 'Menu layar'}
        >
          {showControls ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4 opacity-70 group-hover:opacity-100" />
          )}
        </button>
      </div>
    </div>
  );
}
