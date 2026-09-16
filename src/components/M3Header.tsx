import React from 'react';
import { M3ColorTheme } from '../types';
import { 
  Palette, 
  Sun, 
  Moon, 
  Check
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface M3HeaderProps {
  currentTheme: M3ColorTheme;
  onSelectTheme: (theme: M3ColorTheme) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenTemplates: () => void;
  isScannable?: boolean;
}

const THEMES: { id: M3ColorTheme; name: string; color: string }[] = [
  { id: 'blue', name: 'Bivzero Blue', color: '#1D70B8' },
  { id: 'purple', name: 'M3 Purple', color: '#6750A4' },
  { id: 'green', name: 'Emerald Jade', color: '#006D44' },
  { id: 'amber', name: 'Terracotta Amber', color: '#B3261E' },
  { id: 'rose', name: 'Rose Quartz', color: '#984061' },
];

export const M3Header: React.FC<M3HeaderProps> = ({
  currentTheme,
  onSelectTheme,
  isDarkMode,
  onToggleDarkMode,
  onOpenTemplates
}) => {
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);

  return (
    <header 
      id="m3-app-bar"
      className="sticky top-0 z-30 w-full border-b border-[var(--md-sys-color-surface-container-high)] bg-[var(--md-sys-color-surface)]/90 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div 
            id="app-logo-badge"
            className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-white dark:bg-[var(--md-sys-color-surface-container-low)] border border-slate-200/80 dark:border-[var(--md-sys-color-outline-variant)]/40 shadow-xs dark:shadow-none flex items-center justify-center p-1 sm:p-1.5 overflow-hidden shrink-0 transition-colors duration-200"
          >
            <img 
              src="/Bivzero Main Colored.svg" 
              alt="Bivzero Logo" 
              className="w-full h-full object-contain select-none"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.endsWith('/bivzero-mark.svg')) {
                  target.src = '/bivzero-mark.svg';
                }
              }}
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--md-sys-color-on-surface)] leading-tight">
              Qr Maker
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Dynamic Theme Color Selector */}
          <div className="relative">
            <button
              id="btn-theme-picker"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-1.5 sm:p-2 rounded-full text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] active:scale-95 transition-all"
              title="Change Material 3 Theme Color"
            >
              <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {showThemeMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowThemeMenu(false)} 
                />
                <div 
                  id="theme-dropdown-menu"
                  className="absolute right-0 mt-2 z-50 w-48 rounded-2xl p-2 bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)] shadow-xl animate-in fade-in zoom-in-95 duration-100"
                >
                  <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
                    M3 Dynamic Theme
                  </p>
                  <div className="space-y-1">
                    {THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          onSelectTheme(theme.id);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors ${
                          currentTheme === theme.id 
                            ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]' 
                            : 'hover:bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3.5 h-3.5 rounded-full ring-1 ring-black/10" 
                            style={{ backgroundColor: theme.color }}
                          />
                          <span>{theme.name}</span>
                        </div>
                        {currentTheme === theme.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            id="btn-toggle-dark-mode"
            onClick={onToggleDarkMode}
            className="p-1.5 sm:p-2 rounded-full text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] active:scale-95 transition-all"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
