import React, { useState, useEffect } from 'react';
import { 
  QRContentState, 
  QRStyleConfig, 
  M3ColorTheme, 
  PresetStyleTemplate 
} from './types';
import { formatQRContent } from './utils/qrEncoder';
import { PRESET_LOGOS } from './utils/qrPresets';
import { getCookie, setCookie } from './utils/cookies';
import { M3Header } from './components/M3Header';
import { ContentTab } from './components/ContentTab';
import { CustomizationTab } from './components/CustomizationTab';
import { LogoFixingTab } from './components/LogoFixingTab';
import { PreviewExportCard } from './components/PreviewExportCard';
import { TemplateDialog } from './components/TemplateDialog';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  FileText, 
  Paintbrush, 
  Image as ImageIcon,
  Sliders,
  Eye,
  ArrowLeft,
  Download,
  ShieldCheck,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

const INITIAL_CONTENT: QRContentState = {
  type: 'url',
  url: 'https://www.bivzero.in/',
  text: '',
  wifi: {
    ssid: 'Guest_WiFi',
    password: 'securepassword123',
    encryption: 'WPA',
    hidden: false
  },
  vcard: {
    firstName: 'Alex',
    lastName: 'Chen',
    organization: 'Studio Creative',
    title: 'Lead Architect',
    phone: '+1 (555) 234-5678',
    email: 'alex.chen@design.co',
    website: 'https://design.co',
    address: '100 Silicon Ave, San Jose, CA'
  },
  email: {
    email: 'hello@brand.org',
    subject: 'Collaboration Request',
    body: 'Hello, I came across your work and would love to connect.'
  },
  phone: '+1 (800) 555-0199',
  sms: {
    phone: '+1 (800) 555-0199',
    message: 'Hello! I am confirming my appointment.'
  },
  event: {
    title: 'Tech Summit 2026',
    location: 'Moscone Center, San Francisco',
    startDate: '2026-10-15T09:00',
    endDate: '2026-10-15T17:00',
    description: 'Annual keynotes and interactive showcases.'
  },
  crypto: {
    currency: 'bitcoin',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    amount: '0.005',
    label: 'Studio Tip Jar'
  }
};

const INITIAL_STYLE: QRStyleConfig = {
  dotPattern: 'rounded',
  dotScale: 0.9,
  foregroundColor: '#1D70B8',
  gradient: {
    type: 'linear',
    colorStart: '#1D70B8',
    colorEnd: '#00589B',
    angle: 45
  },
  backgroundColor: '#FFFFFF',
  transparentBackground: false,
  eyes: {
    customColor: true,
    frameColor: '#004A85',
    pupilColor: '#1D70B8',
    frameStyle: 'rounded',
    pupilStyle: 'rounded'
  },
  logo: {
    enabled: true,
    src: PRESET_LOGOS[0].svgDataUri, // Bivzero preset logo
    name: 'Bivzero',
    sizePercent: 24,
    paddingRatio: 0.2,
    shape: 'circle',
    bgColor: '#FFFFFF',
    bgOpacity: 1.0,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  errorCorrection: 'H',
  margin: 2
};

const M3_THEME_COLORS: Record<M3ColorTheme, {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
}> = {
  blue: {
    primary: '#1D70B8',
    onPrimary: '#FFFFFF',
    primaryContainer: '#D8E9F8',
    onPrimaryContainer: '#001D36'
  },
  purple: {
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D'
  },
  green: {
    primary: '#006D44',
    onPrimary: '#FFFFFF',
    primaryContainer: '#90F8BF',
    onPrimaryContainer: '#002111'
  },
  amber: {
    primary: '#B3261E',
    onPrimary: '#FFFFFF',
    primaryContainer: '#F9DEDC',
    onPrimaryContainer: '#410E0B'
  },
  rose: {
    primary: '#984061',
    onPrimary: '#FFFFFF',
    primaryContainer: '#FFD9E2',
    onPrimaryContainer: '#3E001D'
  }
};

const VALID_THEMES: M3ColorTheme[] = ['blue', 'purple', 'green', 'amber', 'rose'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'content' | 'custom' | 'logo'>('content');
  const [content, setContent] = useState<QRContentState>(INITIAL_CONTENT);
  const [style, setStyle] = useState<QRStyleConfig>(INITIAL_STYLE);

  // Initialize theme from cookies
  const [theme, setTheme] = useState<M3ColorTheme>(() => {
    const saved = getCookie('theme_color') as M3ColorTheme;
    if (saved && VALID_THEMES.includes(saved)) {
      return saved;
    }
    return 'blue';
  });

  // Initialize dark mode from cookies
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = getCookie('theme_mode');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState<boolean>(false);
  const [isScannable, setIsScannable] = useState<boolean>(true);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // Apply dynamic M3 theme tokens and save preference to cookie
  useEffect(() => {
    const root = document.documentElement;
    const colors = M3_THEME_COLORS[theme];
    if (colors) {
      root.style.setProperty('--md-sys-color-primary', colors.primary);
      root.style.setProperty('--md-sys-color-on-primary', colors.onPrimary);
      root.style.setProperty('--md-sys-color-primary-container', colors.primaryContainer);
      root.style.setProperty('--md-sys-color-on-primary-container', colors.onPrimaryContainer);
    }
    setCookie('theme_color', theme);
  }, [theme]);

  // Apply dark mode class and save preference to cookie
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      setCookie('theme_mode', 'dark');
    } else {
      root.classList.remove('dark');
      setCookie('theme_mode', 'light');
    }
  }, [isDarkMode]);

  // Handle template selection
  const handleSelectTemplate = (template: PresetStyleTemplate) => {
    setStyle((prev) => ({
      ...prev,
      ...template.config,
      eyes: {
        ...prev.eyes,
        ...(template.config.eyes || {})
      },
      gradient: {
        ...prev.gradient,
        ...(template.config.gradient || {})
      }
    }));
  };

  const payloadText = formatQRContent(content);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] transition-colors">
      {/* M3 Top App Bar */}
      <M3Header
        currentTheme={theme}
        onSelectTheme={setTheme}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenTemplates={() => setIsTemplateDialogOpen(true)}
        isScannable={isScannable}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8">
        {/* Mobile View Switcher (M3 Segmented Control) */}
        <div 
          id="m3-mobile-view-switcher"
          className="lg:hidden mb-3 p-1 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/60 flex items-center gap-1 shadow-xs"
        >
          <button
            id="btn-mobile-switch-editor"
            onClick={() => setMobileView('editor')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              mobileView === 'editor'
                ? 'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-primary)] shadow-xs'
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Design & Elements</span>
          </button>
          <button
            id="btn-mobile-switch-preview"
            onClick={() => setMobileView('preview')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              mobileView === 'preview'
                ? 'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-primary)] shadow-xs'
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live QR & Export</span>
            <span className={`w-2 h-2 rounded-full ${isScannable ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
          
          {/* LEFT / CENTER CONFIGURATION PANEL (Tabs & Controls) */}
          <div className={`lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5 ${mobileView === 'preview' ? 'hidden lg:block' : 'block'}`}>
            
            {/* Material 3 Segmented Primary Tabs */}
            <div 
              id="m3-main-tabs"
              className="p-1 sm:p-1.5 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/60 flex items-center gap-1 sm:gap-1.5 shadow-xs"
            >
              <button
                id="tab-btn-content"
                onClick={() => setActiveTab('content')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'content'
                    ? 'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-primary)] shadow-sm'
                    : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-high)]/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">1. </span>
                <span>Content</span>
              </button>

              <button
                id="tab-btn-custom"
                onClick={() => setActiveTab('custom')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'custom'
                    ? 'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-primary)] shadow-sm'
                    : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-high)]/50'
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">2. </span>
                <span className="hidden xs:inline">Style & </span>
                <span>Design</span>
              </button>

              <button
                id="tab-btn-logo"
                onClick={() => setActiveTab('logo')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'logo'
                    ? 'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-primary)] shadow-sm'
                    : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-high)]/50'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">3. </span>
                <span>Logo</span>
                <span className="hidden xs:inline"> & Fix</span>
                {style.logo.enabled && (
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--md-sys-color-primary)] shrink-0"></span>
                )}
              </button>
            </div>

            {/* Tab Views */}
            <div className="transition-all">
              {activeTab === 'content' && (
                <ContentTab
                  content={content}
                  onChange={setContent}
                  onOpenTemplates={() => setIsTemplateDialogOpen(true)}
                />
              )}

              {activeTab === 'custom' && (
                <CustomizationTab style={style} onChange={setStyle} />
              )}

              {activeTab === 'logo' && (
                <LogoFixingTab
                  style={style}
                  onChange={setStyle}
                  isScannable={isScannable}
                />
              )}
            </div>
          </div>

          {/* RIGHT PREVIEW & EXPORT PANEL */}
          <div className={`lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20 space-y-3 ${mobileView === 'editor' ? 'hidden lg:block' : 'block'}`}>
            {/* Mobile Return to Editor Button */}
            <div className="lg:hidden">
              <button
                id="btn-mobile-back-to-editor"
                onClick={() => setMobileView('editor')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-primary)] font-medium text-xs sm:text-sm hover:bg-[var(--md-sys-color-surface-container-highest)] active:scale-98 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Design & Elements</span>
              </button>
            </div>

            <PreviewExportCard
              payloadText={payloadText}
              style={style}
              onScanStatusChange={setIsScannable}
            />
          </div>

        </div>
      </main>

      {/* Footer - Below all padding */}
      <footer id="app-footer" className="w-full border-t border-[var(--md-sys-color-outline-variant)]/40 py-6 px-4 text-center text-xs text-[var(--md-sys-color-on-surface-variant)] pb-24 lg:pb-8">
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span>Made in India By</span>
          <a
            id="link-footer-bivzero"
            href="https://www.bivzero.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--md-sys-color-primary)] hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Bivzero</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Floating Action Dock */}
      {mobileView === 'editor' && (
        <div 
          id="m3-mobile-floating-bar"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--md-sys-color-surface)]/95 backdrop-blur-md border-t border-[var(--md-sys-color-outline-variant)]/60 px-4 py-2.5 shadow-xl flex items-center justify-between gap-3"
        >
          {/* Scannability status */}
          <div className="flex items-center gap-2">
            {isScannable ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            )}
            <span className="text-xs font-medium text-[var(--md-sys-color-on-surface)]">
              {isScannable ? 'Verified Scannable' : 'Check Scannability'}
            </span>
          </div>

          {/* Quick Action Button to Open Preview */}
          <button
            id="btn-mobile-quick-preview"
            onClick={() => {
              setMobileView('preview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] font-medium text-xs shadow-sm active:scale-95 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview & Export</span>
            <Download className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      )}

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Preset Style Templates Dialog */}
      <TemplateDialog
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        currentStyle={style}
      />
    </div>
  );
}
