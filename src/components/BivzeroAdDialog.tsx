import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Download, X, Globe, Sparkles } from 'lucide-react';

interface BivzeroAdDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  actionType?: string;
}

export const BivzeroAdDialog: React.FC<BivzeroAdDialogProps> = ({
  isOpen,
  onClose,
  onProceed,
  actionType = 'Download',
}) => {
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVisitWebsite = () => {
    window.open('https://www.bivzero.in', '_blank', 'noopener,noreferrer');
  };

  const handleProceedDownload = () => {
    onProceed();
  };

  const dialogContent = (
    <div
      id="bivzero-ad-backdrop"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="bivzero-ad-dialog"
        className="w-full max-w-md my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-[var(--md-sys-color-surface-container-highest,#1e1b24)] text-[var(--md-sys-color-on-surface,#f5eff7)] p-6 sm:p-7 shadow-2xl border border-[var(--md-sys-color-outline-variant)]/60 relative flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner / Ad Label */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30">
            <Sparkles className="w-3 h-3" />
            <span>Featured Sponsor</span>
          </div>

          <button
            id="btn-close-ad-dialog"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)] hover:text-[var(--md-sys-color-on-surface)] transition-colors"
            aria-label="Close"
            title="Close popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bivzero Company Logo */}
        <div className="relative mb-4 group cursor-pointer" onClick={handleVisitWebsite}>
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2.5 shadow-md flex items-center justify-center border border-black/10 transition-transform group-hover:scale-105 duration-200">
            <img
              src="/bivzero-logo.svg"
              alt="Bivzero Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/Bivzero Main Colored.png';
              }}
            />
          </div>
        </div>

        {/* Exact Requested Message */}
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--md-sys-color-on-surface)] mb-2">
          Yo Twin, hope you liked this product
        </h3>

        <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] leading-relaxed max-w-sm mb-5">
          We have a Web Development Company Called <span className="font-semibold text-[var(--md-sys-color-primary)]">Bivzero</span>. Please check it out!
        </p>

        {/* Website Card / Link */}
        <a
          id="link-bivzero-website"
          href="https://www.bivzero.in"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleVisitWebsite}
          className="w-full mb-6 p-3.5 rounded-2xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-primary)]/40 hover:border-[var(--md-sys-color-primary)] flex items-center justify-between gap-3 text-left transition-all hover:bg-[var(--md-sys-color-surface-container)] shadow-xs group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[var(--md-sys-color-on-surface)] flex items-center gap-1.5">
                <span>Bivzero Web Development</span>
              </div>
              <div className="text-xs font-mono text-[var(--md-sys-color-primary)] truncate">
                www.bivzero.in
              </div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-[var(--md-sys-color-on-surface-variant)] group-hover:text-[var(--md-sys-color-primary)] group-hover:translate-x-0.5 transition-all shrink-0" />
        </a>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5">
          {/* Primary CTA: Visit Website */}
          <button
            id="btn-ad-visit-bivzero"
            type="button"
            onClick={handleVisitWebsite}
            className="w-full py-3 px-5 rounded-2xl bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] font-semibold text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Bivzero</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Secondary CTA: Continue with Export/Download */}
          <button
            id="btn-ad-proceed-download"
            type="button"
            onClick={handleProceedDownload}
            className="w-full py-2.5 px-5 rounded-2xl bg-[var(--md-sys-color-surface-container)] hover:bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] font-medium text-xs sm:text-sm border border-[var(--md-sys-color-outline-variant)]/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
            <span>
              {countdown > 0 
                ? `Continue to ${actionType} (${countdown}s)` 
                : `Continue to ${actionType}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(dialogContent, document.body) : null;
};
