export type QRContentType = 
  | 'url' 
  | 'text' 
  | 'wifi' 
  | 'vcard' 
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'event' 
  | 'crypto';

export type DotPattern = 
  | 'square' 
  | 'dots' 
  | 'rounded' 
  | 'extra-rounded' 
  | 'classy' 
  | 'diamond' 
  | 'star' 
  | 'vertical-line' 
  | 'horizontal-line';

export type EyeFrameStyle = 
  | 'square' 
  | 'rounded' 
  | 'circle' 
  | 'leaf' 
  | 'teardrop';

export type EyePupilStyle = 
  | 'square' 
  | 'dot' 
  | 'rounded' 
  | 'diamond' 
  | 'leaf'
  | 'teardrop';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type GradientType = 'none' | 'linear' | 'radial';

export interface GradientConfig {
  type: GradientType;
  colorStart: string;
  colorEnd: string;
  angle: number; // in degrees
}

export interface EyeConfig {
  customColor: boolean;
  frameColor: string;
  pupilColor: string;
  frameStyle: EyeFrameStyle;
  pupilStyle: EyePupilStyle;
}

export interface LogoConfig {
  enabled: boolean;
  src: string | null;
  name: string;
  sizePercent: number; // 10 to 35
  paddingRatio: number; // 0 to 0.4
  shape: 'circle' | 'rounded' | 'square' | 'none';
  bgColor: string;
  bgOpacity: number;
  borderWidth: number;
  borderColor: string;
}

export interface QRStyleConfig {
  dotPattern: DotPattern;
  dotScale: number; // 0.6 to 1.0
  foregroundColor: string;
  gradient: GradientConfig;
  backgroundColor: string;
  transparentBackground: boolean;
  eyes: EyeConfig;
  logo: LogoConfig;
  errorCorrection: ErrorCorrectionLevel;
  margin: number; // quiet zone in module units, e.g. 1 to 5
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface SMSData {
  phone: string;
  message: string;
}

export interface EventData {
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CryptoData {
  currency: 'bitcoin' | 'ethereum' | 'solana' | 'upi';
  address: string;
  amount: string;
  label: string;
}

export interface QRContentState {
  type: QRContentType;
  url: string;
  text: string;
  wifi: WifiData;
  vcard: VCardData;
  email: EmailData;
  phone: string;
  sms: SMSData;
  event: EventData;
  crypto: CryptoData;
}

export interface PresetStyleTemplate {
  id: string;
  name: string;
  description: string;
  themeColor: string;
  config: Partial<QRStyleConfig>;
}

export type M3ColorTheme = 'purple' | 'blue' | 'green' | 'amber' | 'rose';
