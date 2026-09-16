import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ className = '', compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed standalone PWA, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback modal with instruction for Chrome / Edge / Firefox
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        id="btn-pwa-install"
        type="button"
        onClick={handleInstallClick}
        aria-label="Install QR Maker App"
        title="Install QR Maker as a Progressive Web App"
        className={`inline-flex items-center gap-1.5 font-medium text-xs rounded-full transition-all duration-200 active:scale-95 px-2.5 sm:px-3.5 py-1.5 bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] hover:bg-[var(--md-sys-color-primary-container)]/80 hover:shadow-xs shrink-0 ${className}`}
      >
        {installSuccess ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Installed!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Install App</span>
          </>
        )}
      </button>

      {/* Installation Guidance Dialog (rendered into document.body to avoid backdrop-filter trapping) */}
      {showIOSModal && typeof document !== 'undefined' && createPortal(
        <div
          id="pwa-install-modal-backdrop"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            id="pwa-install-dialog"
            className="w-full max-w-sm my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] p-4 sm:p-5 shadow-2xl border border-[var(--md-sys-color-outline-variant)]/40 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 rounded-full text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3.5 pr-8">
              <div className="w-10 h-10 rounded-2xl bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] flex items-center justify-center shadow-xs shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold truncate">Install QR Maker</h3>
                <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
                  Fast, offline-ready & standalone
                </p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-2.5 py-1 text-xs text-[var(--md-sys-color-on-surface-variant)]">
                <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)]/50">
                  <div className="p-1 rounded bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] mt-0.5 shrink-0">
                    <Share className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--md-sys-color-on-surface)]">Step 1: </span>
                    Tap the <strong>Share</strong> icon in your Safari bottom navigation bar.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)]/50">
                  <div className="p-1 rounded bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] mt-0.5 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--md-sys-color-on-surface)]">Step 2: </span>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 py-1 text-xs text-[var(--md-sys-color-on-surface-variant)]">
                <p className="font-medium text-[var(--md-sys-color-on-surface)]">
                  To install QR Maker on your device:
                </p>
                <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)]/50 space-y-1.5">
                  <div>
                    1. Open the browser menu (<strong>⋮</strong> or <strong>⋯</strong>)
                  </div>
                  <div>
                    2. Select <strong>"Install QR Maker"</strong> or <strong>"Add to Home Screen"</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 sm:mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 px-4 text-xs font-medium rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:opacity-90 active:scale-[0.99] transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
