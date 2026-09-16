import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <aside
      id="pwa-offline-indicator"
      aria-label="Offline status"
      className="fixed bottom-20 left-4 sm:left-6 z-40 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] border border-[var(--md-sys-color-outline-variant)] shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-2 duration-300"
    >
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      <WifiOff className="w-4 h-4 text-amber-500" />
      <span className="text-xs font-medium">
        Offline Mode — All QR features work offline
      </span>
    </aside>
  );
};
