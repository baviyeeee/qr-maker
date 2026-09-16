import React from 'react';
import { PRESET_TEMPLATES } from '../utils/qrPresets';
import { PresetStyleTemplate, QRStyleConfig } from '../types';
import { Sparkles, X, Check } from 'lucide-react';

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PresetStyleTemplate) => void;
  currentStyle: QRStyleConfig;
}

export const TemplateDialog: React.FC<TemplateDialogProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-3xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] shadow-2xl p-5 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-[var(--md-sys-color-outline-variant)]/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--md-sys-color-primary)]" />
            <h3 className="text-base font-semibold text-[var(--md-sys-color-on-surface)]">
              Curated Style Templates
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
          Instantly apply coordinated Material Design 3 dot geometries, corner eye accents, and gradients.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
          {PRESET_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              className="flex flex-col text-left p-3.5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] hover:border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface-container-low)] hover:bg-[var(--md-sys-color-surface-container)] transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full shadow-xs"
                    style={{ backgroundColor: tpl.themeColor }}
                  />
                  <span className="text-xs font-semibold text-[var(--md-sys-color-on-surface)] group-hover:text-[var(--md-sys-color-primary)]">
                    {tpl.name}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] leading-snug">
                {tpl.description}
              </p>
            </button>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-full bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-highest)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
