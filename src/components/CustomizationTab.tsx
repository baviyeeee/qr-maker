import React from 'react';
import { 
  QRStyleConfig, 
  DotPattern, 
  EyeFrameStyle, 
  EyePupilStyle, 
  GradientType,
  ErrorCorrectionLevel 
} from '../types';
import { 
  Shapes, 
  Eye, 
  Paintbrush, 
  Sliders, 
  Check, 
  Layers
} from 'lucide-react';

interface CustomizationTabProps {
  style: QRStyleConfig;
  onChange: (style: QRStyleConfig) => void;
}

const DOT_PATTERNS: { id: DotPattern; label: string; previewSvg: string }[] = [
  {
    id: 'square',
    label: 'Square',
    previewSvg: '<rect x="4" y="4" width="16" height="16" rx="0" fill="currentColor"/>'
  },
  {
    id: 'dots',
    label: 'Dots',
    previewSvg: '<circle cx="12" cy="12" r="8" fill="currentColor"/>'
  },
  {
    id: 'rounded',
    label: 'Rounded',
    previewSvg: '<rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor"/>'
  },
  {
    id: 'extra-rounded',
    label: 'Squircle',
    previewSvg: '<rect x="4" y="4" width="16" height="16" rx="7" fill="currentColor"/>'
  },
  {
    id: 'classy',
    label: 'Classy',
    previewSvg: '<path d="M4 8a4 4 0 0 1 4-4h12v12a4 4 0 0 1-4 4H4V8z" fill="currentColor"/>'
  },
  {
    id: 'diamond',
    label: 'Diamond',
    previewSvg: '<polygon points="12,3 21,12 12,21 3,12" fill="currentColor"/>'
  },
  {
    id: 'star',
    label: 'Star',
    previewSvg: '<path d="M12 3 L14 9 L20 9 L15 13 L17 19 L12 15 L7 19 L9 13 L4 9 L10 9 Z" fill="currentColor"/>'
  },
  {
    id: 'vertical-line',
    label: 'V-Bar',
    previewSvg: '<rect x="8" y="3" width="8" height="18" rx="4" fill="currentColor"/>'
  },
  {
    id: 'horizontal-line',
    label: 'H-Bar',
    previewSvg: '<rect x="3" y="8" width="18" height="8" rx="4" fill="currentColor"/>'
  },
];

const EYE_FRAME_STYLES: { id: EyeFrameStyle; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'circle', label: 'Circle' },
  { id: 'leaf', label: 'Leaf' },
  { id: 'teardrop', label: 'Teardrop' },
];

const EYE_PUPIL_STYLES: { id: EyePupilStyle; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Circle' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'leaf', label: 'Leaf' },
  { id: 'teardrop', label: 'Teardrop' },
];

const QUICK_COLORS = [
  '#000000',
  '#6750A4',
  '#0061A4',
  '#006D44',
  '#BA1A1A',
  '#E65100',
  '#4A148C',
  '#004D40',
];

export const CustomizationTab: React.FC<CustomizationTabProps> = ({ style, onChange }) => {
  return (
    <div id="m3-customization-tab" className="space-y-6 pb-24 sm:pb-16 lg:pb-8">
      {/* 1. MODULE DOT PATTERNS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shapes className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
            <h3 className="text-sm font-semibold text-[var(--md-sys-color-on-surface)]">
              Dot Pattern & Module Shape
            </h3>
          </div>
          <span className="text-xs text-[var(--md-sys-color-on-surface-variant)] capitalize">
            {style.dotPattern}
          </span>
        </div>

        {/* Pattern grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {DOT_PATTERNS.map((item) => {
            const isSelected = style.dotPattern === item.id;
            return (
              <button
                key={item.id}
                id={`dot-pattern-${item.id}`}
                onClick={() => onChange({ ...style, dotPattern: item.id })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary-container)]/50 text-[var(--md-sys-color-primary)] ring-2 ring-[var(--md-sys-color-primary)]'
                    : 'border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface-variant)] hover:border-[var(--md-sys-color-outline)]'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 mb-1.5"
                  dangerouslySetInnerHTML={{ __html: item.previewSvg }}
                />
                <span className="text-[11px] font-medium tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dot Scale Slider */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[var(--md-sys-color-on-surface-variant)]">Dot Scale / Density</span>
            <span className="font-mono text-[var(--md-sys-color-on-surface)] font-medium">
              {Math.round(style.dotScale * 100)}%
            </span>
          </div>
          <input
            id="slider-dot-scale"
            type="range"
            min="0.6"
            max="1.0"
            step="0.02"
            value={style.dotScale}
            onChange={(e) => onChange({ ...style, dotScale: parseFloat(e.target.value) })}
            className="w-full accent-[var(--md-sys-color-primary)]"
          />
        </div>
      </div>

      {/* 2. CORNER EYES CUSTOMIZATION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
          <h3 className="text-sm font-semibold text-[var(--md-sys-color-on-surface)]">
            Corner Eyes (Finder Patterns)
          </h3>
        </div>

        {/* Outer Frame Shape */}
        <div>
          <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-2">
            Outer Frame Shape
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {EYE_FRAME_STYLES.map(frame => {
              const isSelected = style.eyes.frameStyle === frame.id;
              return (
                <button
                  key={frame.id}
                  onClick={() => onChange({
                    ...style,
                    eyes: { ...style.eyes, frameStyle: frame.id }
                  })}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent shadow-sm'
                      : 'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] border-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                  }`}
                >
                  {frame.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inner Pupil Shape */}
        <div>
          <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-2">
            Inner Pupil Style
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {EYE_PUPIL_STYLES.map(pupil => {
              const isSelected = style.eyes.pupilStyle === pupil.id;
              return (
                <button
                  key={pupil.id}
                  onClick={() => onChange({
                    ...style,
                    eyes: { ...style.eyes, pupilStyle: pupil.id }
                  })}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent shadow-sm'
                      : 'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] border-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                  }`}
                >
                  {pupil.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Eye Colors */}
        <div className="pt-2 border-t border-[var(--md-sys-color-outline-variant)]/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--md-sys-color-on-surface)]">
              Custom Eye Colors
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={style.eyes.customColor}
                onChange={(e) => onChange({
                  ...style,
                  eyes: { ...style.eyes, customColor: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--md-sys-color-surface-container-highest)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--md-sys-color-primary)]"></div>
            </label>
          </div>

          {style.eyes.customColor && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Outer Frame Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.eyes.frameColor}
                    onChange={(e) => onChange({
                      ...style,
                      eyes: { ...style.eyes, frameColor: e.target.value }
                    })}
                    className="w-9 h-9 p-0.5 rounded-lg border border-[var(--md-sys-color-outline-variant)] cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={style.eyes.frameColor}
                    onChange={(e) => onChange({
                      ...style,
                      eyes: { ...style.eyes, frameColor: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Inner Pupil Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.eyes.pupilColor}
                    onChange={(e) => onChange({
                      ...style,
                      eyes: { ...style.eyes, pupilColor: e.target.value }
                    })}
                    className="w-9 h-9 p-0.5 rounded-lg border border-[var(--md-sys-color-outline-variant)] cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={style.eyes.pupilColor}
                    onChange={(e) => onChange({
                      ...style,
                      eyes: { ...style.eyes, pupilColor: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. COLORS & GRADIENT */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 space-y-4">
        <div className="flex items-center gap-2">
          <Paintbrush className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
          <h3 className="text-sm font-semibold text-[var(--md-sys-color-on-surface)]">
            Colors & Gradients
          </h3>
        </div>

        {/* Fill Type */}
        <div>
          <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-2">
            Foreground Fill Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['none', 'linear', 'radial'] as GradientType[]).map(type => {
              const isSelected = style.gradient.type === type;
              const labels: Record<GradientType, string> = {
                none: 'Solid Color',
                linear: 'Linear Gradient',
                radial: 'Radial Gradient'
              };
              return (
                <button
                  key={type}
                  onClick={() => onChange({
                    ...style,
                    gradient: { ...style.gradient, type }
                  })}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent shadow-sm'
                      : 'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] border-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                  }`}
                >
                  {labels[type]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Solid Color vs Gradient Pickers */}
        {style.gradient.type === 'none' ? (
          <div>
            <label className="block text-xs text-[var(--md-sys-color-on-surface-variant)] mb-1.5">
              Foreground Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={style.foregroundColor}
                onChange={(e) => onChange({ ...style, foregroundColor: e.target.value })}
                className="w-10 h-10 p-0.5 rounded-xl border border-[var(--md-sys-color-outline-variant)] cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={style.foregroundColor}
                onChange={(e) => onChange({ ...style, foregroundColor: e.target.value })}
                className="w-32 px-3 py-2 text-xs font-mono rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
              />
              {/* Quick Swatches */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {QUICK_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => onChange({ ...style, foregroundColor: c })}
                    className="w-6 h-6 rounded-full border border-black/10 flex-shrink-0 transition-transform active:scale-90"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Gradient Start
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.gradient.colorStart}
                    onChange={(e) => onChange({
                      ...style,
                      gradient: { ...style.gradient, colorStart: e.target.value }
                    })}
                    className="w-9 h-9 p-0.5 rounded-lg border border-[var(--md-sys-color-outline-variant)] cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={style.gradient.colorStart}
                    onChange={(e) => onChange({
                      ...style,
                      gradient: { ...style.gradient, colorStart: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Gradient End
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.gradient.colorEnd}
                    onChange={(e) => onChange({
                      ...style,
                      gradient: { ...style.gradient, colorEnd: e.target.value }
                    })}
                    className="w-9 h-9 p-0.5 rounded-lg border border-[var(--md-sys-color-outline-variant)] cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={style.gradient.colorEnd}
                    onChange={(e) => onChange({
                      ...style,
                      gradient: { ...style.gradient, colorEnd: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)]"
                  />
                </div>
              </div>
            </div>

            {style.gradient.type === 'linear' && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--md-sys-color-on-surface-variant)]">Gradient Angle</span>
                  <span className="font-mono text-[var(--md-sys-color-on-surface)] font-medium">
                    {style.gradient.angle}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="15"
                  value={style.gradient.angle}
                  onChange={(e) => onChange({
                    ...style,
                    gradient: { ...style.gradient, angle: parseInt(e.target.value) }
                  })}
                  className="w-full accent-[var(--md-sys-color-primary)]"
                />
              </div>
            )}
          </div>
        )}

        {/* Background Settings */}
        <div className="pt-2 border-t border-[var(--md-sys-color-outline-variant)]/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--md-sys-color-on-surface)]">
              Transparent Background (SVG / PNG)
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={style.transparentBackground}
                onChange={(e) => onChange({ ...style, transparentBackground: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--md-sys-color-surface-container-highest)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--md-sys-color-primary)]"></div>
            </label>
          </div>

          {!style.transparentBackground && (
            <div>
              <label className="block text-xs text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={style.backgroundColor}
                  onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
                  className="w-10 h-10 p-0.5 rounded-xl border border-[var(--md-sys-color-outline-variant)] cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={style.backgroundColor}
                  onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
                  className="w-32 px-3 py-2 text-xs font-mono rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                />
                <div className="flex items-center gap-1.5">
                  {['#FFFFFF', '#FDFBFF', '#F4F4F5', '#121212', '#0A0A0A'].map(bg => (
                    <button
                      key={bg}
                      onClick={() => onChange({ ...style, backgroundColor: bg })}
                      className="w-6 h-6 rounded-full border border-black/15 flex-shrink-0"
                      style={{ backgroundColor: bg }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. MARGIN & ERROR CORRECTION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
          <h3 className="text-sm font-semibold text-[var(--md-sys-color-on-surface)]">
            Margin & Error Correction
          </h3>
        </div>

        {/* Quiet Zone Margin */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--md-sys-color-on-surface-variant)]">
              Quiet Zone (Border Margin)
            </span>
            <span className="font-mono text-[var(--md-sys-color-on-surface)] font-medium">
              {style.margin} modules
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="6"
            step="1"
            value={style.margin}
            onChange={(e) => onChange({ ...style, margin: parseInt(e.target.value) })}
            className="w-full accent-[var(--md-sys-color-primary)]"
          />
        </div>

        {/* Error Correction */}
        <div>
          <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-2">
            Error Correction Level
            {style.logo.enabled && (
              <span className="ml-2 text-[11px] font-normal text-amber-600 dark:text-amber-400">
                (Fixed to 'H - 30%' for logo scannability)
              </span>
            )}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map(lvl => {
              const active = style.logo.enabled ? lvl === 'H' : style.errorCorrection === lvl;
              const percentages: Record<ErrorCorrectionLevel, string> = {
                L: '7%',
                M: '15%',
                Q: '25%',
                H: '30%'
              };
              return (
                <button
                  key={lvl}
                  disabled={style.logo.enabled}
                  onClick={() => onChange({ ...style, errorCorrection: lvl })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    active
                      ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent shadow-sm'
                      : 'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] border-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] disabled:opacity-50'
                  }`}
                >
                  <div className="text-xs font-bold">{lvl}</div>
                  <div className="text-[10px] opacity-80">{percentages[lvl]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
