import { QRContentState } from '../types';

export function formatQRContent(content: QRContentState): string {
  switch (content.type) {
    case 'url': {
      let url = content.url.trim();
      if (!url) return 'https://example.com';
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url;
    }

    case 'text':
      return content.text || 'Hello World';

    case 'wifi': {
      const { ssid, password, encryption, hidden } = content.wifi;
      const cleanSSID = (ssid || 'MyWiFi').replace(/([\\;,:"])/g, '\\$1');
      const cleanPass = (password || '').replace(/([\\;,:"])/g, '\\$1');
      return `WIFI:T:${encryption};S:${cleanSSID};P:${cleanPass};H:${hidden ? 'true' : 'false'};;`;
    }

    case 'vcard': {
      const { firstName, lastName, organization, title, phone, email, website, address } = content.vcard;
      const fn = `${firstName} ${lastName}`.trim() || 'Contact Name';
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName};${firstName};;;`,
        `FN:${fn}`,
      ];
      if (organization) lines.push(`ORG:${organization}`);
      if (title) lines.push(`TITLE:${title}`);
      if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
      if (email) lines.push(`EMAIL:${email}`);
      if (website) lines.push(`URL:${website}`);
      if (address) lines.push(`ADR:;;${address};;;;`);
      lines.push('END:VCARD');
      return lines.join('\n');
    }

    case 'email': {
      const { email, subject, body } = content.email;
      const queryParams: string[] = [];
      if (subject) queryParams.push(`subject=${encodeURIComponent(subject)}`);
      if (body) queryParams.push(`body=${encodeURIComponent(body)}`);
      const qs = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      return `mailto:${email || 'info@example.com'}${qs}`;
    }

    case 'phone': {
      const phone = content.phone.trim() || '+1234567890';
      return `tel:${phone}`;
    }

    case 'sms': {
      const { phone, message } = content.sms;
      const cleanPhone = phone.trim() || '+1234567890';
      return `smsto:${cleanPhone}:${message}`;
    }

    case 'event': {
      const { title, location, startDate, endDate, description } = content.event;
      const formatDT = (dStr: string) => {
        if (!dStr) return '';
        const d = new Date(dStr);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      const dtStart = formatDT(startDate) || '20260916T120000Z';
      const dtEnd = formatDT(endDate) || '20260916T130000Z';
      return [
        'BEGIN:VEVENT',
        `SUMMARY:${title || 'Calendar Event'}`,
        `LOCATION:${location || ''}`,
        `DESCRIPTION:${description || ''}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        'END:VEVENT'
      ].join('\n');
    }

    case 'crypto': {
      const { currency, address, amount } = content.crypto;
      const cleanAddr = address.trim() || '0x0000000000000000000000000000000000000000';
      if (currency === 'upi') {
        const amtPart = amount ? `&am=${encodeURIComponent(amount)}` : '';
        return `upi://pay?pa=${encodeURIComponent(cleanAddr)}&pn=${encodeURIComponent(content.crypto.label || 'Recipient')}${amtPart}&cu=INR`;
      }
      const amtPart = amount ? `?amount=${encodeURIComponent(amount)}` : '';
      return `${currency}:${cleanAddr}${amtPart}`;
    }

    default:
      return 'https://example.com';
  }
}
