import jsQR from 'jsqr';
import { QRStyleConfig, ErrorCorrectionLevel } from '../types';

export interface ScanValidationReport {
  isScannable: boolean;
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'F';
  decodedData: string | null;
  tests: {
    name: string;
    description: string;
    passed: boolean;
  }[];
  contrast: {
    ratio: number;
    score: number;
    passed: boolean;
    rating: 'Optimal' | 'Good' | 'Poor' | 'Critical';
    foregroundLuminance: number;
    backgroundLuminance: number;
  };
  logoHealth: {
    enabled: boolean;
    areaPercent: number;
    ecCapacityPercent: number;
    marginRemainingPercent: number;
    passed: boolean;
    rating: 'Safe' | 'Tight' | 'Overloaded' | 'N/A';
  };
  quietZone: {
    margin: number;
    passed: boolean;
    rating: 'Standard (4+)' | 'Compact (2-3)' | 'Minimal (<2)';
  };
  recommendations: string[];
}

/**
 * Parses Hex, RGB, or named colors into RGB [0-255]
 */
function parseColorToRgb(color: string): [number, number, number] {
  if (!color || color === 'transparent') {
    return [255, 255, 255];
  }
  const clean = color.trim().toLowerCase();

  // Hex format #RRGGBB or #RGB
  if (clean.startsWith('#')) {
    let hex = clean.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex.slice(0, 6), 16);
    if (!isNaN(num)) {
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }
  }

  // rgb/rgba format rgb(r, g, b)
  const rgbMatch = clean.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [parseInt(rgbMatch[1], 10), parseInt(rgbMatch[2], 10), parseInt(rgbMatch[3], 10)];
  }

  return [0, 0, 0];
}

/**
 * Calculates relative luminance per WCAG 2.1
 */
function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(val => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Computes contrast ratio (1:1 to 21:1)
 */
function getContrastRatio(color1: string, color2: string): {
  ratio: number;
  lum1: number;
  lum2: number;
} {
  const lum1 = getRelativeLuminance(parseColorToRgb(color1));
  const lum2 = getRelativeLuminance(parseColorToRgb(color2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return { ratio: Math.round(ratio * 10) / 10, lum1, lum2 };
}

/**
 * Error correction level capacity percentages
 */
const EC_CAPACITY: Record<ErrorCorrectionLevel, number> = {
  L: 7,
  M: 15,
  Q: 25,
  H: 30
};

/**
 * Comprehensive Multi-Condition Scannability and Validity Check
 */
export async function runComplexScanabilityCheck(
  canvas: HTMLCanvasElement,
  style: QRStyleConfig,
  expectedPayload: string
): Promise<ScanValidationReport> {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  const width = canvas.width;
  const height = canvas.height;
  const originalImageData = ctx.getImageData(0, 0, width, height);

  // 1. Standard jsQR decode
  const standardCode = jsQR(originalImageData.data, width, height, {
    inversionAttempts: 'attemptBoth'
  });
  const standardPass = !!(standardCode && standardCode.data);
  const decodedData = standardCode?.data || null;

  // 2. Low Light / Dim Camera Simulation (Luminance scaling 0.45x)
  let lowLightPass = false;
  try {
    const lowLightData = ctx.createImageData(width, height);
    for (let i = 0; i < originalImageData.data.length; i += 4) {
      lowLightData.data[i] = originalImageData.data[i] * 0.45;     // R
      lowLightData.data[i + 1] = originalImageData.data[i + 1] * 0.45; // G
      lowLightData.data[i + 2] = originalImageData.data[i + 2] * 0.45; // B
      lowLightData.data[i + 3] = originalImageData.data[i + 3];
    }
    const lowCode = jsQR(lowLightData.data, width, height, { inversionAttempts: 'attemptBoth' });
    lowLightPass = !!(lowCode && lowCode.data);
  } catch {
    lowLightPass = standardPass;
  }

  // 3. Glare / High-Exposure Simulation (Luminance blend with 0.35 white overlay)
  let glarePass = false;
  try {
    const glareData = ctx.createImageData(width, height);
    for (let i = 0; i < originalImageData.data.length; i += 4) {
      glareData.data[i] = Math.min(255, originalImageData.data[i] + 90);
      glareData.data[i + 1] = Math.min(255, originalImageData.data[i + 1] + 90);
      glareData.data[i + 2] = Math.min(255, originalImageData.data[i + 2] + 90);
      glareData.data[i + 3] = originalImageData.data[i + 3];
    }
    const glareCode = jsQR(glareData.data, width, height, { inversionAttempts: 'attemptBoth' });
    glarePass = !!(glareCode && glareCode.data);
  } catch {
    glarePass = standardPass;
  }

  // 4. Distance / Low-Resolution Simulation (downscale to 180x180)
  let distancePass = false;
  try {
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = 180;
    smallCanvas.height = 180;
    const smallCtx = smallCanvas.getContext('2d');
    if (smallCtx) {
      smallCtx.drawImage(canvas, 0, 0, 180, 180);
      const smallImg = smallCtx.getImageData(0, 0, 180, 180);
      const distCode = jsQR(smallImg.data, 180, 180, { inversionAttempts: 'attemptBoth' });
      distancePass = !!(distCode && distCode.data);
    }
  } catch {
    distancePass = standardPass;
  }

  // 5. Inversion / Dark Mode Scan check
  let inversionPass = false;
  try {
    const invCode = jsQR(originalImageData.data, width, height, {
      inversionAttempts: 'invertFirst'
    });
    inversionPass = !!(invCode && invCode.data);
  } catch {
    inversionPass = standardPass;
  }

  // Calculate Contrast Metrics
  const fgColor = style.gradient.type !== 'none' ? style.gradient.colorStart : style.foregroundColor;
  const bgColor = style.transparentBackground ? '#FFFFFF' : style.backgroundColor;
  const { ratio: contrastRatio, lum1, lum2 } = getContrastRatio(fgColor, bgColor);

  let contrastRating: 'Optimal' | 'Good' | 'Poor' | 'Critical' = 'Critical';
  let contrastScore = 0;
  if (contrastRatio >= 7.0) {
    contrastRating = 'Optimal';
    contrastScore = 25;
  } else if (contrastRatio >= 4.5) {
    contrastRating = 'Good';
    contrastScore = 20;
  } else if (contrastRatio >= 3.0) {
    contrastRating = 'Poor';
    contrastScore = 10;
  } else {
    contrastRating = 'Critical';
    contrastScore = 0;
  }

  // Calculate Logo & Error Correction Health
  const ecLevel = style.errorCorrection || 'M';
  const ecCapacity = EC_CAPACITY[ecLevel];
  let logoAreaPercent = 0;
  let logoPassed = true;
  let logoRating: 'Safe' | 'Tight' | 'Overloaded' | 'N/A' = 'N/A';
  let logoScore = 15;

  if (style.logo.enabled && style.logo.src) {
    // Area approximated as (sizePercent / 100)^2 * 100
    const rawRatio = style.logo.sizePercent / 100;
    logoAreaPercent = Math.round(rawRatio * rawRatio * 100);
    const marginRemaining = ecCapacity - logoAreaPercent;

    if (marginRemaining >= 8) {
      logoRating = 'Safe';
      logoScore = 15;
    } else if (marginRemaining >= 0) {
      logoRating = 'Tight';
      logoScore = 10;
    } else {
      logoRating = 'Overloaded';
      logoPassed = false;
      logoScore = 0;
    }
  }

  // Quiet Zone Assessment
  const margin = style.margin ?? 3;
  let quietScore = 10;
  let quietRating: 'Standard (4+)' | 'Compact (2-3)' | 'Minimal (<2)' = 'Compact (2-3)';
  if (margin >= 4) {
    quietRating = 'Standard (4+)';
    quietScore = 10;
  } else if (margin >= 2) {
    quietRating = 'Compact (2-3)';
    quietScore = 8;
  } else {
    quietRating = 'Minimal (<2)';
    quietScore = 4;
  }

  // Multi-Decoder Test Weighting (Total 50 points)
  let decoderScore = 0;
  if (standardPass) decoderScore += 20;
  if (distancePass) decoderScore += 10;
  if (lowLightPass) decoderScore += 10;
  if (glarePass) decoderScore += 5;
  if (inversionPass) decoderScore += 5;

  // Composite Scannability Score (0 - 100)
  const totalScore = Math.min(100, Math.max(0, decoderScore + contrastScore + logoScore + quietScore));

  // Determine Overall Pass / Fail
  // Must pass standard decode AND contrast ratio >= 3.0
  const isScannable = standardPass && contrastRatio >= 3.0 && logoPassed;

  // Grade Assignment
  let grade: 'A+' | 'A' | 'B' | 'C' | 'F' = 'F';
  if (totalScore >= 92 && isScannable) grade = 'A+';
  else if (totalScore >= 80 && isScannable) grade = 'A';
  else if (totalScore >= 65 && isScannable) grade = 'B';
  else if (totalScore >= 45) grade = 'C';
  else grade = 'F';

  // Actionable Recommendations
  const recommendations: string[] = [];
  if (contrastRatio < 4.5) {
    recommendations.push(
      `Contrast ratio (${contrastRatio}:1) is low. Choose a darker foreground or lighter background for instantaneous scanning.`
    );
  }
  if (style.logo.enabled && logoRating === 'Overloaded') {
    recommendations.push(
      `Logo occupies ~${logoAreaPercent}% of code area exceeding the '${ecLevel}' error correction capacity (${ecCapacity}%). Switch Error Correction to 'H' (High 30%) or decrease logo size.`
    );
  } else if (style.logo.enabled && ecLevel !== 'H' && ecLevel !== 'Q') {
    recommendations.push(
      `When using a logo, recommend setting Error Correction to 'Q' or 'H' to withstand wear, dirt, and camera noise.`
    );
  }
  if (!distancePass) {
    recommendations.push(
      `Distance simulation test failed. Dot scale may be too small or payload is crowded for low-res cameras.`
    );
  }
  if (margin < 2) {
    recommendations.push(
      `Quiet zone margin is minimal (${margin} modules). Certain physical scanners require at least 2-4 modules white border.`
    );
  }
  if (style.transparentBackground) {
    recommendations.push(
      `Transparent background enabled. Ensure the QR is placed over a light, high-contrast surface in production.`
    );
  }

  return {
    isScannable,
    score: totalScore,
    grade,
    decodedData,
    tests: [
      {
        name: 'Native Baseline Scanner',
        description: 'Standard optical camera decoder test',
        passed: standardPass
      },
      {
        name: 'Long-Distance Readability',
        description: 'Low-resolution 180px distance simulation',
        passed: distancePass
      },
      {
        name: 'Low-Light & Dim Exposure',
        description: '0.45x illumination threshold test',
        passed: lowLightPass
      },
      {
        name: 'Bright Glare & Sunlight',
        description: 'Overexposed highlight glare simulation',
        passed: glarePass
      },
      {
        name: 'Polarity & Inversion Resilience',
        description: 'Color polarity & dark-surface reading',
        passed: inversionPass
      }
    ],
    contrast: {
      ratio: contrastRatio,
      score: contrastScore,
      passed: contrastRatio >= 4.5,
      rating: contrastRating,
      foregroundLuminance: Math.round(lum1 * 100) / 100,
      backgroundLuminance: Math.round(lum2 * 100) / 100
    },
    logoHealth: {
      enabled: style.logo.enabled && !!style.logo.src,
      areaPercent: logoAreaPercent,
      ecCapacityPercent: ecCapacity,
      marginRemainingPercent: ecCapacity - logoAreaPercent,
      passed: logoPassed,
      rating: logoRating
    },
    quietZone: {
      margin,
      passed: margin >= 2,
      rating: quietRating
    },
    recommendations
  };
}
