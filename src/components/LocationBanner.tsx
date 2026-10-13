import React from 'react';
import { MapPin, AlertCircle, ShieldCheck } from 'lucide-react';

interface LocationBannerProps {
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unavailable' | 'timeout';
  errorMessage?: string;
  onRequestGps: () => void;
  onSelectHub: (hubCoords: { lat: number; lng: number }) => void;
}

export const LocationBanner: React.FC<LocationBannerProps> = ({
  permissionStatus,
  errorMessage,
  onRequestGps,
  onSelectHub,
}) => {
  if (permissionStatus === 'granted') return null;

  return (
    <div className="bg-amber-50/95 border-b border-amber-200/90 text-amber-950 px-4 py-2.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-inner">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-amber-700 flex-shrink-0" />
        <div>
          <span className="font-bold">
            {permissionStatus === 'denied'
              ? 'GPS Permission Denied: '
              : 'Enable Live GPS: '}
          </span>
          <span className="text-stone-700">
            {errorMessage ||
              'Enable device location to get instant turn-by-turn distance and live routing to North Kolkata pandals.'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
        {permissionStatus !== 'denied' && (
          <button
            onClick={onRequestGps}
            className="px-3 py-1 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 text-xs shadow-sm transition-colors"
          >
            Allow Location
          </button>
        )}
        <button
          onClick={() => onSelectHub({ lat: 22.5971, lng: 88.3675 })}
          className="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 font-semibold rounded-lg hover:bg-amber-100 text-xs transition-colors"
        >
          Use Sovabazar Hub
        </button>
      </div>
    </div>
  );
};
