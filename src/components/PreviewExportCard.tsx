import React, { useEffect, useRef, useState } from 'react';
import { QRStyleConfig } from '../types';
import { generateQRSVG, renderQRToCanvas } from '../utils/qrRenderer';
import { runComplexScanabilityCheck, ScanValidationReport } from '../utils/qrValidator';
import { ScanDiagnosticDialog } from './ScanDiagnosticDialog';
import { BivzeroAdDialog } from './BivzeroAdDialog';
import { 
  Download, 
  Copy, 
  Printer, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  FileCode, 
  Sparkles,
  ExternalLink,
  Activity,
  ChevronRight
} from 'lucide-react';

interface PreviewExportCardProps {
  payloadText: string;
  style: QRStyleConfig;
  onScanStatusChange: (isScannable: boolean) => void;
}

export const PreviewExportCard: React.FC<PreviewExportCardProps> = ({
  payloadText,
  style,
  onScanStatusChange
}) => {
  const [svgCode, setSvgCode] = useState<string>('');
  const [pngResolution, setPngResolution] = useState<number>(1024);
  const [isScannable, setIsScannable] = useState<boolean>(true);
  const [validationReport, setValidationReport] = useState<ScanValidationReport | null>(null);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isAdOpen, setIsAdOpen] = useState<boolean>(false);
  const [adActionType, setAdActionType] = useState<string>('Download');

  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);

  // Trigger Ad Popup before any export/download
  const triggerWithAd = (type: string, action: () => void) => {
    pendingActionRef.current = action;
    setAdActionType(type);
    setIsAdOpen(true);
  };

  const handleProceedAction = () => {
    setIsAdOpen(false);
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action();
    }
  };

  const handleCloseAd = () => {
    setIsAdOpen(false);
    pendingActionRef.current = null;
  };

  // Re-generate SVG and run complex optical scannability & validity check
  useEffect(() => {
    let isMounted = true;
    try {
      const { svg } = generateQRSVG(payloadText, style, 800);
      setSvgCode(svg);

      // Run complex validity & optical scannability engine
      const canvas = document.createElement('canvas');
      offscreenCanvasRef.current = canvas;

      renderQRToCanvas(canvas, svg, 400).then(async () => {
        try {
          const report = await runComplexScanabilityCheck(canvas, style, payloadText);
          if (isMounted) {
            setValidationReport(report);
            setIsScannable(report.isScannable);
            setDecodedData(report.decodedData);
            onScanStatusChange(report.isScannable);
          }
        } catch (checkErr) {
          console.warn('Complex scan validity check error:', checkErr);
        }
      }).catch((err) => {
        console.warn('Canvas render validation error:', err);
      });
    } catch (err) {
      console.error('Error generating QR SVG:', err);
    }

    return () => {
      isMounted = false;
    };
  }, [payloadText, style, onScanStatusChange]);

  // PNG Export Handler
  const handleDownloadPNG = async () => {
    try {
      setIsDownloading(true);
      const canvas = document.createElement('canvas');
      const { svg } = generateQRSVG(payloadText, style, pngResolution);
      await renderQRToCanvas(canvas, svg, pngResolution);

      const link = document.createElement('a');
      link.download = `qr-code-${pngResolution}x${pngResolution}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('PNG download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // SVG Export Handler
  const handleDownloadSVG = () => {
    try {
      const { svg } = generateQRSVG(payloadText, style, 1024);
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-code-vector.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('SVG download error:', err);
    }
  };

  // Copy SVG Code to Clipboard
  const handleCopySVG = async () => {
    try {
      const { svg } = generateQRSVG(payloadText, style, 800);
      await navigator.clipboard.writeText(svg);
      setCopyStatus('svg');
      setTimeout(() => setCopyStatus(null), 2500);
    } catch (err) {
      console.error('Copy SVG failed:', err);
    }
  };

  // Copy PNG to Clipboard
  const handleCopyPNG = async () => {
    try {
      const canvas = document.createElement('canvas');
      const { svg } = generateQRSVG(payloadText, style, 1024);
      await renderQRToCanvas(canvas, svg, 1024);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopyStatus('png');
          setTimeout(() => setCopyStatus(null), 2500);
        } catch {
          // Fallback if clipboard API image/png is blocked in iframe
          setCopyStatus('png-error');
          setTimeout(() => setCopyStatus(null), 3000);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Copy PNG failed:', err);
    }
  };

  // Print Dialog
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .qr-wrap {
              width: 380px;
              height: 380px;
              margin-bottom: 24px;
            }
            .info {
              font-size: 14px;
              color: #444;
              word-break: break-all;
              max-width: 400px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="qr-wrap">${svgCode}</div>
          <div class="info">${payloadText}</div>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div 
      id="m3-preview-export-card"
      className="p-4 sm:p-6 rounded-3xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/60 shadow-md space-y-4 sm:space-y-5"
    >
      {/* Header & Scannability Badge */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm sm:text-base font-semibold text-[var(--md-sys-color-on-surface)] shrink-0">
          Live QR Preview
        </h2>

        <div 
          id="badge-scanability-validity"
          role="button"
          tabIndex={0}
          onClick={() => setIsDiagnosticOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsDiagnosticOpen(true);
            }
          }}
          title="Click to view full ISO/IEC 18004 optical validity report & decoder simulations"
          className={`group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium border cursor-pointer select-none transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 ${
            isScannable
              ? 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border-emerald-300/80 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-700/80'
              : 'bg-amber-50 hover:bg-amber-100/80 text-amber-900 border-amber-300/80 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700/80'
          }`}
        >
          {isScannable ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold">
                {validationReport ? `${validationReport.score}% Valid` : 'Verified Scannable'}
              </span>
              {validationReport && (
                <span className="hidden xs:inline-block px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                  Grade {validationReport.grade}
                </span>
              )}
              <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
              <span className="font-semibold">
                {validationReport ? `${validationReport.score}% Caution` : 'Check Scannability'}
              </span>
              {validationReport && (
                <span className="hidden xs:inline-block px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                  Grade {validationReport.grade}
                </span>
              )}
              <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </div>
      </div>

      {/* QR Code Presentation Box */}
      <div 
        id="qr-presentation-box"
        className="relative mx-auto w-full max-w-[260px] xs:max-w-[280px] sm:max-w-[320px] aspect-square rounded-2xl p-3 sm:p-4 flex items-center justify-center border border-[var(--md-sys-color-outline-variant)]/50 shadow-inner overflow-hidden transition-all"
        style={{
          backgroundColor: style.transparentBackground ? 'transparent' : style.backgroundColor,
          backgroundImage: style.transparentBackground 
            ? 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)' 
            : undefined,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
        }}
      >
        {svgCode ? (
          <div 
            id="qr-svg-wrapper"
            className="w-full h-full flex items-center justify-center overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:block select-none"
            dangerouslySetInnerHTML={{ __html: svgCode }}
          />
        ) : (
          <div className="text-xs text-[var(--md-sys-color-on-surface-variant)]">Generating...</div>
        )}
      </div>

      {/* Payload info teaser */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/40 text-xs text-[var(--md-sys-color-on-surface-variant)] flex items-center justify-between">
        <div className="truncate max-w-[200px] xs:max-w-[240px] sm:max-w-[280px]">
          <span className="font-semibold text-[var(--md-sys-color-on-surface)] mr-1">Payload:</span>
          <span className="font-mono">{payloadText}</span>
        </div>
        {payloadText.startsWith('http') && (
          <a
            href={payloadText}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--md-sys-color-primary)] hover:underline flex items-center gap-0.5 ml-2 flex-shrink-0"
            title="Open test link"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* EXPORT FORMATS SECTION */}
      <div className="pt-2 border-t border-[var(--md-sys-color-outline-variant)]/40 space-y-3 sm:space-y-4">
        {/* PNG Resolution Selector */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 sm:mb-2">
            <span className="font-medium text-[var(--md-sys-color-on-surface)]">
              PNG Resolution
            </span>
            <span className="font-mono text-[var(--md-sys-color-on-surface-variant)]">
              {pngResolution} × {pngResolution} px
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {[
              { res: 512, label: '512 px', sub: 'Standard' },
              { res: 1024, label: '1024 px', sub: 'High Res' },
              { res: 2048, label: '2048 px', sub: 'Ultra HD' },
            ].map((item) => (
              <button
                key={item.res}
                onClick={() => setPngResolution(item.res)}
                className={`py-1.5 sm:py-2 px-1 rounded-xl text-center border transition-all ${
                  pngResolution === item.res
                    ? 'border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] font-semibold'
                    : 'border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                }`}
              >
                <div className="text-xs">{item.label}</div>
                <div className="text-[10px] opacity-75">{item.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Export Action Buttons: PNG & SVG */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* Download PNG Button */}
          <button
            id="btn-download-png"
            onClick={() => triggerWithAd('PNG Download', handleDownloadPNG)}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-2xl bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] font-medium text-xs sm:text-sm shadow-sm hover:opacity-95 active:scale-98 transition-all disabled:opacity-50 cursor-pointer min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>

          {/* Download SVG Button */}
          <button
            id="btn-download-svg"
            onClick={() => triggerWithAd('SVG Download', handleDownloadSVG)}
            className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-2xl bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-medium text-xs sm:text-sm hover:opacity-95 active:scale-98 transition-all cursor-pointer min-h-[44px]"
          >
            <FileCode className="w-4 h-4" />
            <span>Download SVG (Vector)</span>
          </button>
        </div>

        {/* Quick Utilities: Copy SVG, Copy Image, Print */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1">
          {/* Copy SVG */}
          <button
            id="btn-copy-svg"
            onClick={() => triggerWithAd('Copy SVG', handleCopySVG)}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-2 text-xs font-medium rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-high)] transition-all min-h-[38px]"
            title="Copy SVG vector markup to clipboard"
          >
            {copyStatus === 'svg' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SVG</span>
              </>
            )}
          </button>

          {/* Copy Image */}
          <button
            id="btn-copy-png"
            onClick={() => triggerWithAd('Copy Image', handleCopyPNG)}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-2 text-xs font-medium rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-high)] transition-all min-h-[38px]"
            title="Copy PNG image to clipboard"
          >
            {copyStatus === 'png' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : copyStatus === 'png-error' ? (
              <span className="text-[10px] text-amber-600">Use Download</span>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image</span>
              </>
            )}
          </button>

          {/* Print */}
          <button
            id="btn-print"
            onClick={() => triggerWithAd('Print', handlePrint)}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-2 text-xs font-medium rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-high)] transition-all min-h-[38px]"
            title="Print QR code sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Bivzero Ad / Promotion Modal before Download/Export */}
      <BivzeroAdDialog
        isOpen={isAdOpen}
        onClose={handleCloseAd}
        onProceed={handleProceedAction}
        actionType={adActionType}
      />

      {/* Complex Optical Scannability & Validity Analysis Dialog */}
      <ScanDiagnosticDialog
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        report={validationReport}
        payloadText={payloadText}
      />
    </div>
  );
};
