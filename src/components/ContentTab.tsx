import React from 'react';
import { QRContentState, QRContentType } from '../types';
import { 
  Globe, 
  Type, 
  Wifi, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Coins,
  Lock,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

interface ContentTabProps {
  content: QRContentState;
  onChange: (content: QRContentState) => void;
  onOpenTemplates?: () => void;
}

const CONTENT_TYPES: { id: QRContentType; label: string; icon: React.ReactNode }[] = [
  { id: 'url', label: 'URL', icon: <Globe className="w-4 h-4" /> },
  { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
  { id: 'wifi', label: 'Wi-Fi', icon: <Wifi className="w-4 h-4" /> },
  { id: 'vcard', label: 'Contact', icon: <User className="w-4 h-4" /> },
  { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { id: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
  { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'event', label: 'Event', icon: <Calendar className="w-4 h-4" /> },
  { id: 'crypto', label: 'Crypto', icon: <Coins className="w-4 h-4" /> },
];

export const ContentTab: React.FC<ContentTabProps> = ({ content, onChange, onOpenTemplates }) => {
  const [showWifiPassword, setShowWifiPassword] = React.useState(false);

  const setType = (type: QRContentType) => {
    onChange({ ...content, type });
  };

  return (
    <div id="m3-content-tab" className="space-y-6 pb-24 sm:pb-16 lg:pb-8">
      {/* Content Type Selector Header with Prominent Templates Action */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
            Select Content Type
          </label>

          {onOpenTemplates && (
            <button
              id="btn-templates"
              type="button"
              onClick={onOpenTemplates}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)] active:scale-95 shadow-xs transition-all border border-[var(--md-sys-color-primary)]/20 cursor-pointer"
              title="Browse pre-styled QR templates"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>QR Templates</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none sm:flex-wrap -mx-1 px-1 touch-pan-x">
          {CONTENT_TYPES.map(item => {
            const isSelected = content.type === item.id;
            return (
              <button
                key={item.id}
                id={`content-type-${item.id}`}
                onClick={() => setType(item.id)}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] shadow-sm'
                    : 'bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Forms */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/60 space-y-4">
        {/* 1. URL */}
        {content.type === 'url' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1.5">
                Website or Landing Page URL
              </label>
              <div className="relative flex items-center">
                <Globe className="absolute left-3.5 w-4 h-4 text-[var(--md-sys-color-on-surface-variant)]" />
                <input
                  id="input-url"
                  type="url"
                  value={content.url}
                  onChange={(e) => onChange({ ...content, url: e.target.value })}
                  placeholder="https://www.bivzero.in/"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] focus:border-[var(--md-sys-color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-surface)] transition-all"
                />
              </div>
            </div>
            {/* Quick URL helpers */}
            <div className="flex flex-wrap gap-2 pt-1">
              {['https://www.bivzero.in/', 'https://', 'https://github.com/', 'https://linkedin.com/in/'].map(prefix => (
                <button
                  key={prefix}
                  onClick={() => onChange({ ...content, url: prefix })}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-primary)]"
                >
                  {prefix}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. PLAIN TEXT */}
        {content.type === 'text' && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)]">
              Text Content
            </label>
            <textarea
              id="input-text"
              rows={4}
              value={content.text}
              onChange={(e) => onChange({ ...content, text: e.target.value })}
              placeholder="Enter message, instructions, notes, or any plain text..."
              className="w-full p-3 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] focus:border-[var(--md-sys-color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-surface)] transition-all resize-y"
            />
            <div className="text-right text-[11px] text-[var(--md-sys-color-on-surface-variant)]">
              {content.text.length} characters
            </div>
          </div>
        )}

        {/* 3. WI-FI */}
        {content.type === 'wifi' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Network Name (SSID)
              </label>
              <input
                id="input-wifi-ssid"
                type="text"
                value={content.wifi.ssid}
                onChange={(e) => onChange({
                  ...content,
                  wifi: { ...content.wifi, ssid: e.target.value }
                })}
                placeholder="e.g. Office_Guest_WiFi"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] focus:border-[var(--md-sys-color-primary)] focus:outline-none text-[var(--md-sys-color-on-surface)]"
              />
            </div>

            {content.wifi.encryption !== 'nopass' && (
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-[var(--md-sys-color-on-surface-variant)]" />
                  <input
                    id="input-wifi-password"
                    type={showWifiPassword ? 'text' : 'password'}
                    value={content.wifi.password}
                    onChange={(e) => onChange({
                      ...content,
                      wifi: { ...content.wifi, password: e.target.value }
                    })}
                    placeholder="Wi-Fi Password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] focus:border-[var(--md-sys-color-primary)] focus:outline-none text-[var(--md-sys-color-on-surface)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWifiPassword(!showWifiPassword)}
                    className="absolute right-3 text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-primary)]"
                  >
                    {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Security Encryption
                </label>
                <select
                  id="select-wifi-encryption"
                  value={content.wifi.encryption}
                  onChange={(e) => onChange({
                    ...content,
                    wifi: { ...content.wifi, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' }
                  })}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--md-sys-color-on-surface)]">
                  <input
                    type="checkbox"
                    checked={content.wifi.hidden}
                    onChange={(e) => onChange({
                      ...content,
                      wifi: { ...content.wifi, hidden: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-[var(--md-sys-color-primary)] accent-[var(--md-sys-color-primary)]"
                  />
                  <span>Hidden Network (Hidden SSID)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 4. VCARD / CONTACT */}
        {content.type === 'vcard' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={content.vcard.firstName}
                  onChange={(e) => onChange({
                    ...content,
                    vcard: { ...content.vcard, firstName: e.target.value }
                  })}
                  placeholder="Alex"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={content.vcard.lastName}
                  onChange={(e) => onChange({
                    ...content,
                    vcard: { ...content.vcard, lastName: e.target.value }
                  })}
                  placeholder="Morgan"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={content.vcard.phone}
                  onChange={(e) => onChange({
                    ...content,
                    vcard: { ...content.vcard, phone: e.target.value }
                  })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={content.vcard.email}
                  onChange={(e) => onChange({
                    ...content,
                    vcard: { ...content.vcard, email: e.target.value }
                  })}
                  placeholder="alex@company.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Organization / Company
                </label>
                <input
                  type="text"
                  value={content.vcard.organization}
                  onChange={(e) => onChange({
                    ...content,
                    vcard: { ...content.vcard, organization: e.target.value }
                  })}
                  placeholder="Google / Acme Corp"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={content.vcard.title}
                  onChange={(e) => onChange({
                    ...content,
                    vcard: { ...content.vcard, title: e.target.value }
                  })}
                  placeholder="Lead Product Designer"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Website
              </label>
              <input
                type="url"
                value={content.vcard.website}
                onChange={(e) => onChange({
                  ...content,
                  vcard: { ...content.vcard, website: e.target.value }
                })}
                placeholder="https://portfolio.me"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
              />
            </div>
          </div>
        )}

        {/* 5. EMAIL */}
        {content.type === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Recipient Email
              </label>
              <input
                type="email"
                value={content.email.email}
                onChange={(e) => onChange({
                  ...content,
                  email: { ...content.email, email: e.target.value }
                })}
                placeholder="contact@brand.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Subject
              </label>
              <input
                type="text"
                value={content.email.subject}
                onChange={(e) => onChange({
                  ...content,
                  email: { ...content.email, subject: e.target.value }
                })}
                placeholder="Meeting Inquiry"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Body
              </label>
              <textarea
                rows={3}
                value={content.email.body}
                onChange={(e) => onChange({
                  ...content,
                  email: { ...content.email, body: e.target.value }
                })}
                placeholder="Hi, I would like to learn more..."
                className="w-full p-3 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
              />
            </div>
          </div>
        )}

        {/* 6. PHONE */}
        {content.type === 'phone' && (
          <div>
            <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
              Phone Number to Dial
            </label>
            <input
              type="tel"
              value={content.phone}
              onChange={(e) => onChange({ ...content, phone: e.target.value })}
              placeholder="+1 (800) 555-0199"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
            />
          </div>
        )}

        {/* 7. SMS */}
        {content.type === 'sms' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Recipient Phone Number
              </label>
              <input
                type="tel"
                value={content.sms.phone}
                onChange={(e) => onChange({
                  ...content,
                  sms: { ...content.sms, phone: e.target.value }
                })}
                placeholder="+1 555-0199"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Pre-filled SMS Text
              </label>
              <textarea
                rows={2}
                value={content.sms.message}
                onChange={(e) => onChange({
                  ...content,
                  sms: { ...content.sms, message: e.target.value }
                })}
                placeholder="RSVP YES for Saturday's event"
                className="w-full p-3 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
              />
            </div>
          </div>
        )}

        {/* 8. EVENT */}
        {content.type === 'event' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Event Title
              </label>
              <input
                type="text"
                value={content.event.title}
                onChange={(e) => onChange({
                  ...content,
                  event: { ...content.event, title: e.target.value }
                })}
                placeholder="Grand Opening Gala"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={content.event.startDate}
                  onChange={(e) => onChange({
                    ...content,
                    event: { ...content.event, startDate: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={content.event.endDate}
                  onChange={(e) => onChange({
                    ...content,
                    event: { ...content.event, endDate: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Location
              </label>
              <input
                type="text"
                value={content.event.location}
                onChange={(e) => onChange({
                  ...content,
                  event: { ...content.event, location: e.target.value }
                })}
                placeholder="100 Main St, San Francisco, CA"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
              />
            </div>
          </div>
        )}

        {/* 9. CRYPTO / PAYMENT */}
        {content.type === 'crypto' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Payment Type
              </label>
              <select
                value={content.crypto.currency}
                onChange={(e) => onChange({
                  ...content,
                  crypto: { ...content.crypto, currency: e.target.value as 'bitcoin' | 'ethereum' | 'solana' | 'upi' }
                })}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
              >
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="solana">Solana (SOL)</option>
                <option value="upi">UPI / Instant Pay</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                {content.crypto.currency === 'upi' ? 'UPI ID (VPA)' : 'Wallet Public Address'}
              </label>
              <input
                type="text"
                value={content.crypto.address}
                onChange={(e) => onChange({
                  ...content,
                  crypto: { ...content.crypto, address: e.target.value }
                })}
                placeholder={content.crypto.currency === 'upi' ? 'user@upi' : '0x71C... / bc1q...'}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] font-mono text-xs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Requested Amount (Optional)
                </label>
                <input
                  type="text"
                  value={content.crypto.amount}
                  onChange={(e) => onChange({
                    ...content,
                    crypto: { ...content.crypto, amount: e.target.value }
                  })}
                  placeholder="e.g. 0.05"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Recipient Name / Label
                </label>
                <input
                  type="text"
                  value={content.crypto.label}
                  onChange={(e) => onChange({
                    ...content,
                    crypto: { ...content.crypto, label: e.target.value }
                  })}
                  placeholder="Store Checkout"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
