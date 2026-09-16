import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  XCircle, 
  Contrast, 
  Camera, 
  Layers, 
  Sparkles, 
  Info,
  Maximize2
} from 'lucide-react';
import { ScanValidationReport } from '../utils/qrValidator';

interface ScanDiagnosticDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: ScanValidationReport | null;
  payloadText: string;
}

export const ScanDiagnosticDialog: React.FC<ScanDiagnosticDialogProps> = ({
  isOpen,
  onClose,
  report,
  payloadText
}) => {
  if (!isOpen || !report) return null;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800';
      case 'A':
        return 'text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/60 border-teal-300 dark:border-teal-800';
      case 'B':
        return 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800';
      case 'C':
        return 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800';
      default:
        return 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800';
    }
  };

  return (
    <div 
      id="scan-diagnostic-dialog-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="scan-diagnostic-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--md-sys-color-outline-variant)]/60 bg-[var(--md-sys-color-surface-container)]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${
              report.isScannable 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {report.isScannable ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--md-sys-color-on-surface)]">
                QR Scannability & Validity Analysis
              </h3>
              <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
                ISO/IEC 18004 Optical Health & Decoder Simulation
              </p>
            </div>
          </div>

          <button
            id="btn-close-diagnostic"
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-highest)] active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Score Hero Card */}
          <div className="p-4 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-[var(--md-sys-color-on-surface)]">
                  {report.score}
                </span>
                <span className="text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)]">/ 100</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getGradeColor(report.grade)}`}>
                  Grade {report.grade}
                </span>
              </div>
              <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
                {report.isScannable 
                  ? 'Excellent optical reliability. High confidence for physical cameras, print, and mobile screens.'
                  : 'Scannability risks detected. Check recommendations below to avoid scanning failures.'}
              </p>
            </div>

            {/* Score visual ring */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[var(--md-sys-color-surface-container-high)]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={report.isScannable ? 'text-emerald-500' : 'text-amber-500'}
                  strokeDasharray={`${report.score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-[var(--md-sys-color-on-surface)]">
                {report.score}%
              </span>
            </div>
          </div>

          {/* Real-World Optical Decoder Simulations */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Camera className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--md-sys-color-on-surface)]">
                Optical Decoder Simulations ({report.tests.filter(t => t.passed).length}/{report.tests.length} Passed)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {report.tests.map((test) => (
                <div 
                  key={test.name}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    test.passed
                      ? 'bg-[var(--md-sys-color-surface-container-lowest)] border-[var(--md-sys-color-outline-variant)]/50'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-[var(--md-sys-color-on-surface)] block">
                      {test.name}
                    </span>
                    <span className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] block">
                      {test.description}
                    </span>
                  </div>
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics Grid: Contrast, Logo Budget, Quiet Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Contrast Ratio */}
            <div className="p-3 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[var(--md-sys-color-on-surface-variant)]">Contrast</span>
                <Contrast className="w-3.5 h-3.5 text-[var(--md-sys-color-primary)]" />
              </div>
              <div className="text-base font-bold text-[var(--md-sys-color-on-surface)]">
                {report.contrast.ratio} : 1
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  report.contrast.passed ? 'bg-emerald-500' : 'bg-rose-500'
                }`} />
                <span className="text-[11px] font-medium text-[var(--md-sys-color-on-surface-variant)]">
                  {report.contrast.rating} (min 4.5:1)
                </span>
              </div>
            </div>

            {/* Error Correction / Logo Budget */}
            <div className="p-3 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[var(--md-sys-color-on-surface-variant)]">EC Tolerance</span>
                <Layers className="w-3.5 h-3.5 text-[var(--md-sys-color-primary)]" />
              </div>
              <div className="text-base font-bold text-[var(--md-sys-color-on-surface)]">
                {report.logoHealth.ecCapacityPercent}% EC Cap
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  report.logoHealth.passed ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <span className="text-[11px] font-medium text-[var(--md-sys-color-on-surface-variant)]">
                  {report.logoHealth.enabled 
                    ? `Logo Area: ${report.logoHealth.areaPercent}%` 
                    : '100% Data Available'}
                </span>
              </div>
            </div>

            {/* Quiet Zone */}
            <div className="p-3 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[var(--md-sys-color-on-surface-variant)]">Quiet Zone</span>
                <Maximize2 className="w-3.5 h-3.5 text-[var(--md-sys-color-primary)]" />
              </div>
              <div className="text-base font-bold text-[var(--md-sys-color-on-surface)]">
                {report.quietZone.margin} Modules
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  report.quietZone.passed ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <span className="text-[11px] font-medium text-[var(--md-sys-color-on-surface-variant)]">
                  {report.quietZone.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations if any */}
          {report.recommendations.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Optimization Advice</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-900/90 dark:text-amber-100/90 pl-1">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Decoded Verification Match */}
          <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container-high)] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--md-sys-color-on-surface)]">
                Payload Decoder Match:
              </span>
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                report.decodedData === payloadText
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
              }`}>
                {report.decodedData === payloadText ? '100% Bit Match' : 'Mismatch / Incomplete'}
              </span>
            </div>
            <p className="font-mono text-[11px] text-[var(--md-sys-color-on-surface-variant)] truncate">
              {report.decodedData || 'No data decoded'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--md-sys-color-outline-variant)]/60 bg-[var(--md-sys-color-surface-container)] flex items-center justify-end">
          <button
            id="btn-close-diagnostic-footer"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-xs font-semibold hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
