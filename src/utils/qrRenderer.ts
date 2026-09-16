import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { QRStyleConfig, EyeFrameStyle, EyePupilStyle, DotPattern } from '../types';

export interface QRRenderResult {
  svgString: string;
  isScannable: boolean;
  decodedData: string | null;
  moduleCount: number;
}

interface EyeBounds {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  type: 'topLeft' | 'topRight' | 'bottomLeft';
}

/**
 * Checks if a module coordinate falls inside one of the three 7x7 finder patterns
 */
export function isInsideFinderPattern(row: number, col: number, size: number): boolean {
  // Top-Left 7x7
  if (row < 7 && col < 7) return true;
  // Top-Right 7x7
  if (row < 7 && col >= size - 7) return true;
  // Bottom-Left 7x7
  if (row >= size - 7 && col < 7) return true;
  return false;
}

/**
 * Checks if a module is covered by the logo and its safety margin pad
 */
export function isInsideLogoPad(
  row: number,
  col: number,
  size: number,
  logoConfig: QRStyleConfig['logo']
): boolean {
  if (!logoConfig.enabled || !logoConfig.src) return false;

  const center = (size - 1) / 2;
  // Module radius of logo + safety padding
  const logoModules = size * (logoConfig.sizePercent / 100);
  const totalClearModules = logoModules * (1 + logoConfig.paddingRatio * 1.2);
  const halfClear = totalClearModules / 2;

  if (logoConfig.shape === 'circle') {
    const distSq = (row - center) ** 2 + (col - center) ** 2;
    return distSq <= halfClear ** 2;
  } else {
    return (
      row >= center - halfClear &&
      row <= center + halfClear &&
      col >= center - halfClear &&
      col <= center + halfClear
    );
  }
}

/**
 * Generate SVG Path for a single module dot based on DotPattern
 */
export function getDotPath(
  pattern: DotPattern,
  x: number,
  y: number,
  size: number,
  scale: number
): string {
  const w = size * scale;
  const h = size * scale;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const offset = (size - w) / 2;
  const rx = x + offset;
  const ry = y + offset;

  switch (pattern) {
    case 'dots': {
      const r = w / 2;
      return `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${r} ${r} 0 1 0 ${cx} ${cy - r} Z`;
    }

    case 'rounded': {
      const r = w * 0.25;
      return `M ${rx + r} ${ry} h ${w - 2 * r} a ${r} ${r} 0 0 1 ${r} ${r} v ${h - 2 * r} a ${r} ${r} 0 0 1 -${r} ${r} h -${w - 2 * r} a ${r} ${r} 0 0 1 -${r} -${r} v -${h - 2 * r} a ${r} ${r} 0 0 1 ${r} -${r} Z`;
    }

    case 'extra-rounded': {
      const r = w * 0.45;
      return `M ${rx + r} ${ry} h ${w - 2 * r} a ${r} ${r} 0 0 1 ${r} ${r} v ${h - 2 * r} a ${r} ${r} 0 0 1 -${r} ${r} h -${w - 2 * r} a ${r} ${r} 0 0 1 -${r} -${r} v -${h - 2 * r} a ${r} ${r} 0 0 1 ${r} -${r} Z`;
    }

    case 'classy': {
      // Alternating rounded corners
      const r = w * 0.4;
      return `M ${rx + r} ${ry} h ${w - r} v ${h - r} a ${r} ${r} 0 0 1 -${r} ${r} h -${w - r} v -${h - r} a ${r} ${r} 0 0 1 ${r} -${r} Z`;
    }

    case 'diamond': {
      return `M ${cx} ${ry} L ${rx + w} ${cy} L ${cx} ${ry + h} L ${rx} ${cy} Z`;
    }

    case 'star': {
      const arm = w * 0.22;
      return `M ${cx} ${ry} L ${cx + arm} ${cy - arm} L ${rx + w} ${cy} L ${cx + arm} ${cy + arm} L ${cx} ${ry + h} L ${cx - arm} ${cy + arm} L ${rx} ${cy} L ${cx - arm} ${cy - arm} Z`;
    }

    case 'vertical-line': {
      const barW = w * 0.55;
      const barX = cx - barW / 2;
      const r = barW / 2;
      return `M ${barX + r} ${ry} h ${barW - 2 * r} a ${r} ${r} 0 0 1 ${r} ${r} v ${h - 2 * r} a ${r} ${r} 0 0 1 -${r} ${r} h -${barW - 2 * r} a ${r} ${r} 0 0 1 -${r} -${r} v -${h - 2 * r} a ${r} ${r} 0 0 1 ${r} -${r} Z`;
    }

    case 'horizontal-line': {
      const barH = h * 0.55;
      const barY = cy - barH / 2;
      const r = barH / 2;
      return `M ${rx + r} ${barY} h ${w - 2 * r} a ${r} ${r} 0 0 1 ${r} ${r} v ${barH - 2 * r} a ${r} ${r} 0 0 1 -${r} ${r} h -${w - 2 * r} a ${r} ${r} 0 0 1 -${r} -${r} v -${barH - 2 * r} a ${r} ${r} 0 0 1 ${r} -${r} Z`;
    }

    case 'square':
    default:
      return `M ${rx} ${ry} h ${w} v ${h} h -${w} Z`;
  }
}

/**
 * Generate SVG Path for Corner Eye Outer Frame (7x7 module boundary)
 */
/**
 * Helper to generate a precise SVG path for a rectangle with individual corner radii.
 * Strictly bounded within [x, x + w] horizontally and [y, y + h] vertically.
 * Eliminates distortion, coordinate overshooting, or stretching.
 */
function getCustomCornerRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  rTL: number,
  rTR: number,
  rBR: number,
  rBL: number
): string {
  const maxR = Math.min(w, h) / 2;
  const cTL = Math.max(0, Math.min(rTL, maxR));
  const cTR = Math.max(0, Math.min(rTR, maxR));
  const cBR = Math.max(0, Math.min(rBR, maxR));
  const cBL = Math.max(0, Math.min(rBL, maxR));

  return [
    `M ${x + cTL} ${y}`,
    `L ${x + w - cTR} ${y}`,
    cTR > 0 ? `A ${cTR} ${cTR} 0 0 1 ${x + w} ${y + cTR}` : `L ${x + w} ${y}`,
    `L ${x + w} ${y + h - cBR}`,
    cBR > 0 ? `A ${cBR} ${cBR} 0 0 1 ${x + w - cBR} ${y + h}` : `L ${x + w} ${y + h}`,
    `L ${x + cBL} ${y + h}`,
    cBL > 0 ? `A ${cBL} ${cBL} 0 0 1 ${x} ${y + h - cBL}` : `L ${x} ${y + h}`,
    `L ${x} ${y + cTL}`,
    cTL > 0 ? `A ${cTL} ${cTL} 0 0 1 ${x + cTL} ${y}` : `L ${x} ${y}`,
    'Z'
  ].join(' ');
}

/**
 * Generate SVG Path for Corner Eye Outer Frame (7x7 module boundary with 5x5 hollow cutout)
 */
export function getEyeFramePath(
  style: EyeFrameStyle,
  x: number,
  y: number,
  moduleSize: number,
  eyeType: 'topLeft' | 'topRight' | 'bottomLeft'
): string {
  const total = 7 * moduleSize;
  const innerOffset = moduleSize;
  const ix = x + innerOffset;
  const iy = y + innerOffset;
  const iw = 5 * moduleSize;
  const ih = 5 * moduleSize;

  // Outer frame is formed by outer shape minus inner 5x5 hollow shape
  switch (style) {
    case 'circle': {
      const cx = x + total / 2;
      const cy = y + total / 2;
      const rOut = total / 2;
      const rIn = iw / 2;
      return `M ${cx} ${cy - rOut} A ${rOut} ${rOut} 0 1 0 ${cx} ${cy + rOut} A ${rOut} ${rOut} 0 1 0 ${cx} ${cy - rOut} Z ` +
             `M ${cx} ${cy - rIn} A ${rIn} ${rIn} 0 1 1 ${cx} ${cy + rIn} A ${rIn} ${rIn} 0 1 1 ${cx} ${cy - rIn} Z`;
    }

    case 'rounded': {
      const rO = moduleSize * 2.2;
      const rI = Math.max(0, rO - moduleSize);
      const outer = getCustomCornerRectPath(x, y, total, total, rO, rO, rO, rO);
      const inner = getCustomCornerRectPath(ix, iy, iw, ih, rI, rI, rI, rI);
      return `${outer} ${inner}`;
    }

    case 'leaf': {
      // Leaf has 2 opposing sharp corners (0 radius) and 2 rounded corners
      const rO = moduleSize * 3.2;
      const rI = Math.max(0, rO - moduleSize);

      let outer = '';
      let inner = '';

      if (eyeType === 'topRight') {
        // Pointed at Top-Right and Bottom-Left
        outer = getCustomCornerRectPath(x, y, total, total, rO, 0, rO, 0);
        inner = getCustomCornerRectPath(ix, iy, iw, ih, rI, 0, rI, 0);
      } else if (eyeType === 'bottomLeft') {
        // Pointed at Bottom-Left and Top-Right
        outer = getCustomCornerRectPath(x, y, total, total, rO, 0, rO, 0);
        inner = getCustomCornerRectPath(ix, iy, iw, ih, rI, 0, rI, 0);
      } else {
        // Top-Left: Pointed at Top-Left and Bottom-Right
        outer = getCustomCornerRectPath(x, y, total, total, 0, rO, 0, rO);
        inner = getCustomCornerRectPath(ix, iy, iw, ih, 0, rI, 0, rI);
      }
      return `${outer} ${inner}`;
    }

    case 'teardrop': {
      // Teardrop has 1 sharp corner (the tip pointing outward) and 3 rounded corners
      const rO = moduleSize * 3.2;
      const rI = Math.max(0, rO - moduleSize);

      let outer = '';
      let inner = '';

      if (eyeType === 'topLeft') {
        // Point pointing top-left outward
        outer = getCustomCornerRectPath(x, y, total, total, 0, rO, rO, rO);
        inner = getCustomCornerRectPath(ix, iy, iw, ih, 0, rI, rI, rI);
      } else if (eyeType === 'topRight') {
        // Point pointing top-right outward
        outer = getCustomCornerRectPath(x, y, total, total, rO, 0, rO, rO);
        inner = getCustomCornerRectPath(ix, iy, iw, ih, rI, 0, rI, rI);
      } else {
        // Bottom-Left: Point pointing bottom-left outward
        outer = getCustomCornerRectPath(x, y, total, total, rO, rO, rO, 0);
        inner = getCustomCornerRectPath(ix, iy, iw, ih, rI, rI, rI, 0);
      }
      return `${outer} ${inner}`;
    }

    case 'square':
    default: {
      const outer = getCustomCornerRectPath(x, y, total, total, 0, 0, 0, 0);
      const inner = getCustomCornerRectPath(ix, iy, iw, ih, 0, 0, 0, 0);
      return `${outer} ${inner}`;
    }
  }
}

/**
 * Generate SVG Path for Corner Eye Inner Pupil (3x3 module block)
 */
export function getEyePupilPath(
  style: EyePupilStyle,
  x: number,
  y: number,
  moduleSize: number,
  eyeType: 'topLeft' | 'topRight' | 'bottomLeft'
): string {
  const px = x + 2 * moduleSize;
  const py = y + 2 * moduleSize;
  const pw = 3 * moduleSize;
  const ph = 3 * moduleSize;
  const cx = px + pw / 2;
  const cy = py + ph / 2;

  switch (style) {
    case 'dot': {
      const r = pw / 2;
      return `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${r} ${r} 0 1 0 ${cx} ${cy - r} Z`;
    }

    case 'rounded': {
      const r = moduleSize * 0.9;
      return getCustomCornerRectPath(px, py, pw, ph, r, r, r, r);
    }

    case 'diamond': {
      return `M ${cx} ${py} L ${px + pw} ${cy} L ${cx} ${py + ph} L ${px} ${cy} Z`;
    }

    case 'leaf': {
      const r = moduleSize * 1.35;
      if (eyeType === 'topRight' || eyeType === 'bottomLeft') {
        return getCustomCornerRectPath(px, py, pw, ph, r, 0, r, 0);
      } else {
        // Top-Left
        return getCustomCornerRectPath(px, py, pw, ph, 0, r, 0, r);
      }
    }

    case 'teardrop': {
      const r = moduleSize * 1.35;
      if (eyeType === 'topLeft') {
        return getCustomCornerRectPath(px, py, pw, ph, 0, r, r, r);
      } else if (eyeType === 'topRight') {
        return getCustomCornerRectPath(px, py, pw, ph, r, 0, r, r);
      } else {
        // Bottom-Left
        return getCustomCornerRectPath(px, py, pw, ph, r, r, r, 0);
      }
    }

    case 'square':
    default:
      return getCustomCornerRectPath(px, py, pw, ph, 0, 0, 0, 0);
  }
}

function sanitizeLogoSrc(src: string): string {
  if (!src) return '';
  const trimmed = src.trim();
  // If raw SVG markup was provided directly
  if (trimmed.startsWith('<svg') || trimmed.startsWith('<?xml')) {
    try {
      const base64 = typeof window !== 'undefined' && typeof window.btoa === 'function'
        ? window.btoa(unescape(encodeURIComponent(trimmed)))
        : Buffer.from(trimmed).toString('base64');
      return `data:image/svg+xml;base64,${base64}`;
    } catch {
      return '';
    }
  }
  // If data:image/svg+xml without base64 (which contains double quotes)
  if (trimmed.startsWith('data:image/svg+xml') && !trimmed.includes(';base64,')) {
    try {
      const comma = trimmed.indexOf(',');
      if (comma !== -1) {
        const raw = decodeURIComponent(trimmed.slice(comma + 1));
        const base64 = typeof window !== 'undefined' && typeof window.btoa === 'function'
          ? window.btoa(unescape(encodeURIComponent(raw)))
          : Buffer.from(raw).toString('base64');
        return `data:image/svg+xml;base64,${base64}`;
      }
    } catch {
      // fallback
    }
  }
  return trimmed.replace(/"/g, '&quot;');
}

/**
 * Core function to generate SVG string for a QR code with full custom elements & logo fixing
 */
export function generateQRSVG(
  text: string,
  style: QRStyleConfig,
  targetSize: number = 800
): { svg: string; moduleCount: number } {
  // 1. Create QR matrix via QRCode library
  const qr = QRCode.create(text || 'https://example.com', {
    errorCorrectionLevel: style.logo.enabled ? 'H' : style.errorCorrection
  });

  const moduleCount = qr.modules.size;
  const marginModules = Math.max(0, style.margin);
  const totalModules = moduleCount + 2 * marginModules;
  const moduleSize = targetSize / totalModules;
  const offset = marginModules * moduleSize;

  // Eye locations in pixels
  const eyes: EyeBounds[] = [
    { rowStart: 0, rowEnd: 6, colStart: 0, colEnd: 6, type: 'topLeft' },
    { rowStart: 0, rowEnd: 6, colStart: moduleCount - 7, colEnd: moduleCount - 1, type: 'topRight' },
    { rowStart: moduleCount - 7, rowEnd: moduleCount - 1, colStart: 0, colEnd: 6, type: 'bottomLeft' }
  ];

  // Prepare Gradients & Defs
  const gradId = 'qr-body-grad';
  let defs = '';
  let bodyFill = style.foregroundColor;

  if (style.gradient.type === 'linear') {
    const angleRad = (style.gradient.angle * Math.PI) / 180;
    const x1 = Math.round(50 - Math.cos(angleRad) * 50);
    const y1 = Math.round(50 - Math.sin(angleRad) * 50);
    const x2 = Math.round(50 + Math.cos(angleRad) * 50);
    const y2 = Math.round(50 + Math.sin(angleRad) * 50);

    defs += `
      <linearGradient id="${gradId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="0%" stop-color="${style.gradient.colorStart}" />
        <stop offset="100%" stop-color="${style.gradient.colorEnd}" />
      </linearGradient>
    `;
    bodyFill = `url(#${gradId})`;
  } else if (style.gradient.type === 'radial') {
    defs += `
      <radialGradient id="${gradId}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${style.gradient.colorStart}" />
        <stop offset="100%" stop-color="${style.gradient.colorEnd}" />
      </radialGradient>
    `;
    bodyFill = `url(#${gradId})`;
  }

  // Eye fill colors
  const eyeFrameFill = style.eyes.customColor ? style.eyes.frameColor : bodyFill;
  const eyePupilFill = style.eyes.customColor ? style.eyes.pupilColor : bodyFill;

  // Background rect
  let bgElement = '';
  if (!style.transparentBackground) {
    bgElement = `<rect width="${targetSize}" height="${targetSize}" fill="${style.backgroundColor}" />`;
  }

  // 2. Generate Body Dots Path
  const bodyPathParts: string[] = [];

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      // Check if module is dark
      if (!qr.modules.get(r, c)) continue;

      // Skip finder patterns
      if (isInsideFinderPattern(r, c, moduleCount)) continue;

      // Skip logo clear zone (logo fixing feature)
      if (isInsideLogoPad(r, c, moduleCount, style.logo)) continue;

      const px = offset + c * moduleSize;
      const py = offset + r * moduleSize;
      const dotD = getDotPath(style.dotPattern, px, py, moduleSize, style.dotScale);
      bodyPathParts.push(dotD);
    }
  }

  const bodyPathSvg = bodyPathParts.length > 0
    ? `<path d="${bodyPathParts.join(' ')}" fill="${bodyFill}" fill-rule="evenodd" />`
    : '';

  // 3. Generate 3 Corner Eyes
  const eyeElements: string[] = [];
  eyes.forEach(eye => {
    const eyeX = offset + eye.colStart * moduleSize;
    const eyeY = offset + eye.rowStart * moduleSize;

    const framePath = getEyeFramePath(style.eyes.frameStyle, eyeX, eyeY, moduleSize, eye.type);
    const pupilPath = getEyePupilPath(style.eyes.pupilStyle, eyeX, eyeY, moduleSize, eye.type);

    eyeElements.push(`
      <path d="${framePath}" fill="${eyeFrameFill}" fill-rule="evenodd" />
      <path d="${pupilPath}" fill="${eyePupilFill}" fill-rule="evenodd" />
    `);
  });

  // 4. Generate Logo & Logo Fixing Safe Zone Pad
  let logoElement = '';
  if (style.logo.enabled && style.logo.src) {
    const center = targetSize / 2;
    const logoPx = targetSize * (style.logo.sizePercent / 100);
    const padPx = logoPx * (1 + style.logo.paddingRatio * 1.2);
    const padHalf = padPx / 2;
    const padX = center - padHalf;
    const padY = center - padHalf;

    let padShape = '';
    const padFill = style.logo.bgColor;
    const padOpacity = style.logo.bgOpacity;
    const borderAttr = style.logo.borderWidth > 0 
      ? `stroke="${style.logo.borderColor}" stroke-width="${style.logo.borderWidth}"` 
      : '';

    if (style.logo.shape === 'circle') {
      padShape = `<circle cx="${center}" cy="${center}" r="${padHalf}" fill="${padFill}" fill-opacity="${padOpacity}" ${borderAttr} />`;
    } else if (style.logo.shape === 'rounded') {
      const rx = padPx * 0.22;
      padShape = `<rect x="${padX}" y="${padY}" width="${padPx}" height="${padPx}" rx="${rx}" fill="${padFill}" fill-opacity="${padOpacity}" ${borderAttr} />`;
    } else if (style.logo.shape === 'square') {
      padShape = `<rect x="${padX}" y="${padY}" width="${padPx}" height="${padPx}" fill="${padFill}" fill-opacity="${padOpacity}" ${borderAttr} />`;
    }

    const imgX = center - logoPx / 2;
    const imgY = center - logoPx / 2;

    const safeLogoSrc = sanitizeLogoSrc(style.logo.src);
    logoElement = `
      <g id="qr-logo-layer">
        ${padShape}
        <image 
          href="${safeLogoSrc}" 
          xlink:href="${safeLogoSrc}" 
          x="${imgX}" 
          y="${imgY}" 
          width="${logoPx}" 
          height="${logoPx}" 
          preserveAspectRatio="xMidYMid meet" 
        />
      </g>
    `;
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${targetSize} ${targetSize}" width="100%" height="100%">
  <defs>
    ${defs}
  </defs>
  ${bgElement}
  <g id="qr-modules">
    ${bodyPathSvg}
  </g>
  <g id="qr-eyes">
    ${eyeElements.join('\n')}
  </g>
  ${logoElement}
</svg>
  `.trim();

  return { svg, moduleCount };
}

/**
 * Render QR code onto an HTML Canvas at specific pixel dimensions (e.g. 512, 1024, 2048)
 */
export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  svgString: string,
  pixelSize: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    canvas.width = pixelSize;
    canvas.height = pixelSize;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      reject(new Error('Canvas 2D context unavailable'));
      return;
    }

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.clearRect(0, 0, pixelSize, pixelSize);
      ctx.drawImage(img, 0, 0, pixelSize, pixelSize);
      URL.revokeObjectURL(url);
      resolve();
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

/**
 * Validate QR code scannability using jsQR
 */
export function validateQRScannability(canvas: HTMLCanvasElement): {
  scannable: boolean;
  data: string | null;
} {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return { scannable: false, data: null };

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth'
    });

    if (code && code.data) {
      return { scannable: true, data: code.data };
    }
    return { scannable: false, data: null };
  } catch {
    return { scannable: false, data: null };
  }
}
