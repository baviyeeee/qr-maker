import React, { useRef } from 'react';
import { QRStyleConfig, LogoConfig } from '../types';
import { PRESET_LOGOS, PresetLogo } from '../utils/qrPresets';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  Sliders, 
  Circle, 
  Square,
  Wand2,
  Check
} from 'lucide-react';

interface LogoFixingTabProps {
  style: QRStyleConfig;
  onChange: (style: QRStyleConfig) => void;
  isScannable: boolean;
}

export const LogoFixingTab: React.FC<LogoFixingTabProps> = ({
  style,
  onChange,
  isScannable
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logo } = style;

  const updateLogo = (patch: Partial<LogoConfig>) => {
    // When logo is enabled, automatically fix ErrorCorrection to 'H'
    const newLogo = { ...logo, ...patch };
    const updatedStyle: QRStyleConfig = {
      ...style,
      logo: newLogo,
      errorCorrection: newLogo.enabled ? 'H' : style.errorCorrection
    };
    onChange(updatedStyle);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, SVG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const src = loadEvent.target?.result as string;
      updateLogo({
        enabled: true,
        src,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectPreset = (preset: PresetLogo) => {
    updateLogo({
      enabled: true,
      src: preset.svgDataUri,
      name: preset.name
    });
  };

  const handleRemoveLogo = () => {
    updateLogo({
      enabled: false,
      src: null,
      name: ''
    });
  };

  const handleAutoFix = () => {
    updateLogo({
      enabled: true,
      sizePercent: 22,
      paddingRatio: 0.2,
      shape: 'circle',
      bgColor: '#FFFFFF',
      bgOpacity: 1.0,
      borderWidth: 1,
      borderColor: '#CAC4D0'
    });
  };

  return (
    <div id="m3-logo-fixing-tab" className="space-y-6 pb-24 sm:pb-16 lg:pb-8">
      {/* 1. LOGO ENABLE SWITCH & STATUS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--md-sys-color-on-surface)]">
              Logo in QR Center
            </h3>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              Embed brand iconography with automatic scannability protection
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="switch-logo-enabled"
              type="checkbox"
              checked={logo.enabled}
              onChange={(e) => updateLogo({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--md-sys-color-surface-container-highest)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--md-sys-color-primary)]"></div>
          </label>
        </div>

        {/* Scannability Safety Banner */}
        {logo.enabled && (
          <div className={`flex items-start gap-3 p-3 rounded-xl border text-xs transition-colors ${
            isScannable 
              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300'
          }`}>
            {isScannable ? (
              <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            )}
            <div className="flex-1">
              <span className="font-semibold">
                {isScannable ? 'Scannability Protected: ' : 'Scannability Warning: '}
              </span>
              {isScannable ? (
                <span>
                  High error correction (H 30%) and module clearance halo are active. This QR is 100% readable.
                </span>
              ) : (
                <span>
                  Logo may be covering too many modules. Click Auto-Fix to apply the optimal scale and clear pad.
                </span>
              )}
            </div>
            {!isScannable && (
              <button
                onClick={handleAutoFix}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 hover:opacity-90 flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                Auto-Fix
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. UPLOAD OR SELECT PRESET LOGO */}
      {logo.enabled && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--md-sys-color-on-surface)]">
              Choose Logo
            </h3>
            {logo.src && (
              <button
                onClick={handleRemoveLogo}
                className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>

          {/* Upload Area */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/svg+xml, image/jpeg, image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[var(--md-sys-color-outline-variant)] hover:border-[var(--md-sys-color-primary)] rounded-xl p-4 text-center cursor-pointer bg-[var(--md-sys-color-surface)]/50 hover:bg-[var(--md-sys-color-surface-container-high)]/50 transition-all"
          >
            {logo.src ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-black/10 flex items-center justify-center p-2 shadow-sm">
                  <img src={logo.src} alt="Uploaded logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-[var(--md-sys-color-on-surface)] truncate max-w-[200px]">
                    {logo.name || 'Custom Logo'}
                  </div>
                  <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)]">
                    Click to replace with another image
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-6 h-6 mx-auto text-[var(--md-sys-color-primary)]" />
                <div className="text-xs font-medium text-[var(--md-sys-color-on-surface)]">
                  Upload Custom Logo
                </div>
                <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)]">
                  PNG, SVG, JPG, or WebP
                </div>
              </div>
            )}
          </div>

          {/* Popular Presets */}
          <div>
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-2">
              Or Choose from Presets
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {PRESET_LOGOS.map((preset) => {
                const isSelected = logo.src === preset.svgDataUri;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary-container)]/50 ring-2 ring-[var(--md-sys-color-primary)]'
                        : 'border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.svgDataUri} alt={preset.name} className="w-6 h-6 object-contain mb-1" />
                    <span className="text-[10px] font-medium text-[var(--md-sys-color-on-surface-variant)] truncate w-full text-center">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. LOGO FIXING & CLEARANCE ENGINE CONTROLS */}
      {logo.enabled && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 space-y-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
            <h3 className="text-sm font-semibold text-[var(--md-sys-color-on-surface)]">
              Logo Fixing & Clearance Controls
            </h3>
          </div>

          {/* Logo Size Scale */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[var(--md-sys-color-on-surface-variant)]">
                Logo Scale
              </span>
              <span className={`font-mono font-medium ${
                logo.sizePercent > 28 ? 'text-amber-600 dark:text-amber-400' : 'text-[var(--md-sys-color-on-surface)]'
              }`}>
                {logo.sizePercent}% of QR size
              </span>
            </div>
            <input
              id="slider-logo-size"
              type="range"
              min="10"
              max="32"
              step="1"
              value={logo.sizePercent}
              onChange={(e) => updateLogo({ sizePercent: parseInt(e.target.value) })}
              className="w-full accent-[var(--md-sys-color-primary)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
              <span>10% (Minimal)</span>
              <span className="text-emerald-600 dark:text-emerald-400">22% (Recommended)</span>
              <span>32% (Max Safe)</span>
            </div>
          </div>

          {/* Safe Area Padding Ratio (Halo clearance) */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[var(--md-sys-color-on-surface-variant)]">
                Safety Halo / Module Clearance Pad
              </span>
              <span className="font-mono text-[var(--md-sys-color-on-surface)] font-medium">
                {Math.round(logo.paddingRatio * 100)}%
              </span>
            </div>
            <input
              id="slider-logo-padding"
              type="range"
              min="0.0"
              max="0.4"
              step="0.05"
              value={logo.paddingRatio}
              onChange={(e) => updateLogo({ paddingRatio: parseFloat(e.target.value) })}
              className="w-full accent-[var(--md-sys-color-primary)]"
            />
            <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] mt-1">
              Clears conflicting QR modules underneath and around the logo to prevent scanning errors.
            </p>
          </div>

          {/* Pad Mask Shape */}
          <div>
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-2">
              Clear Zone Pad Shape
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'circle', label: 'Circle', icon: <Circle className="w-3.5 h-3.5" /> },
                { id: 'rounded', label: 'Rounded', icon: <Square className="w-3.5 h-3.5 rounded-sm" /> },
                { id: 'square', label: 'Square', icon: <Square className="w-3.5 h-3.5" /> },
                { id: 'none', label: 'None', icon: <span>Ø</span> },
              ].map(shape => {
                const isSelected = logo.shape === shape.id;
                return (
                  <button
                    key={shape.id}
                    onClick={() => updateLogo({ shape: shape.id as any })}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent shadow-sm'
                        : 'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] border-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                    }`}
                  >
                    {shape.icon}
                    <span>{shape.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pad Styling (Background color, border) */}
          {logo.shape !== 'none' && (
            <div className="space-y-3 pt-3 border-t border-[var(--md-sys-color-outline-variant)]/40 pb-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pad Fill Color */}
                <div id="section-pad-fill-color">
                  <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1.5">
                    Pad Fill Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-logo-pad-color"
                      type="color"
                      value={logo.bgColor}
                      onChange={(e) => updateLogo({ bgColor: e.target.value })}
                      className="w-10 h-10 p-0.5 rounded-xl border border-[var(--md-sys-color-outline-variant)] cursor-pointer bg-transparent shrink-0"
                    />
                    <input
                      id="input-logo-pad-hex"
                      type="text"
                      value={logo.bgColor}
                      onChange={(e) => updateLogo({ bgColor: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                    />
                  </div>

                  {/* Quick Preset Colors for Pad */}
                  <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto py-1">
                    {[
                      { label: 'White', color: '#FFFFFF' },
                      { label: 'Light Gray', color: '#F3F4F6' },
                      { label: 'Warm Cream', color: '#FAF8F5' },
                      { label: 'Dark Navy', color: '#1E1E2E' },
                      { label: 'Pitch Black', color: '#000000' }
                    ].map(preset => (
                      <button
                        key={preset.color}
                        type="button"
                        onClick={() => updateLogo({ bgColor: preset.color })}
                        title={preset.label}
                        className={`w-6 h-6 rounded-full border transition-transform active:scale-90 ${
                          logo.bgColor.toLowerCase() === preset.color.toLowerCase()
                            ? 'ring-2 ring-[var(--md-sys-color-primary)] border-transparent scale-105'
                            : 'border-black/15 dark:border-white/20'
                        }`}
                        style={{ backgroundColor: preset.color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Pad Border Width & Color */}
                <div id="section-pad-border">
                  <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1.5">
                    Pad Border Width & Color
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      id="select-logo-pad-border-width"
                      value={logo.borderWidth}
                      onChange={(e) => updateLogo({ borderWidth: parseInt(e.target.value) })}
                      className="w-24 px-3 py-2 text-xs rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] shrink-0"
                    >
                      <option value="0">None</option>
                      <option value="1">1 px</option>
                      <option value="2">2 px</option>
                      <option value="3">3 px</option>
                    </select>
                    <input
                      id="input-logo-pad-border-color"
                      type="color"
                      value={logo.borderColor}
                      onChange={(e) => updateLogo({ borderColor: e.target.value })}
                      className="w-10 h-10 p-0.5 rounded-xl border border-[var(--md-sys-color-outline-variant)] cursor-pointer bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={logo.borderColor}
                      onChange={(e) => updateLogo({ borderColor: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Extra responsive spacer ensuring no collision with mobile floating dock */}
      <div className="h-6 sm:h-4" aria-hidden="true" />
    </div>
  );
};
