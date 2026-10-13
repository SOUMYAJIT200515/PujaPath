import React from 'react';
import { Pandal } from '../types';
import {
  Navigation,
  CheckCircle2,
  Star,
  Users,
  Train,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  calculateDistanceKm,
  formatDistance,
  estimateTravelTimeMinutes,
  formatDuration,
  getGoogleMapsNavigationUrl,
} from '../utils/geoUtils';

interface PandalCardProps {
  pandal: Pandal;
  userCoords: { lat: number; lng: number } | null;
  onSelect: (pandal: Pandal) => void;
  onToggleFavorite: (id: string) => void;
  onToggleVisited: (id: string) => void;
  onOpenDetails: (pandal: Pandal) => void;
  onOpenReportCrowd: (pandal: Pandal) => void;
  isInRoute?: boolean;
  stopOrder?: number;
}

export const PandalCard: React.FC<PandalCardProps> = ({
  pandal,
  userCoords,
  onSelect,
  onToggleFavorite,
  onToggleVisited,
  onOpenDetails,
  onOpenReportCrowd,
  isInRoute,
  stopOrder,
}) => {
  const distanceKm = userCoords
    ? calculateDistanceKm(
        userCoords.lat,
        userCoords.lng,
        pandal.coordinates.lat,
        pandal.coordinates.lng
      )
    : null;

  const walkingMinutes = distanceKm !== null
    ? estimateTravelTimeMinutes(distanceKm, 'WALKING')
    : null;

  // Crowd level colors
  const getCrowdBg = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'moderate':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'high':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'very_high':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getRegionBadge = (region: 'NORTH' | 'CENTRAL' | 'SOUTH') => {
    switch (region) {
      case 'NORTH':
        return 'bg-red-700 text-white';
      case 'CENTRAL':
        return 'bg-amber-700 text-white';
      case 'SOUTH':
        return 'bg-teal-700 text-white';
    }
  };

  return (
    <div
      onClick={() => onSelect(pandal)}
      className="group bg-white rounded-2xl border border-stone-200 hover:border-red-600/50 hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Top Banner Image */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-stone-100">
        <img
          src={pandal.photoUrl}
          alt={pandal.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm ${getRegionBadge(
              pandal.region
            )}`}
          >
            {pandal.region} KOLKATA
          </span>
          <span className="bg-white/90 backdrop-blur-md text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm capitalize">
            {pandal.category}
          </span>
          {stopOrder && (
            <span className="bg-red-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              Stop #{stopOrder}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(pandal.id);
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-md text-stone-700 hover:text-amber-500 hover:bg-white shadow transition-colors"
          title="Bookmark"
        >
          <Star
            className={`w-4 h-4 ${
              pandal.isFavorite ? 'fill-amber-500 text-amber-500' : ''
            }`}
          />
        </button>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
          <h3 className="font-serif font-bold text-sm sm:text-base leading-tight drop-shadow-sm">
            {pandal.name}
          </h3>
          <p className="text-[11px] text-amber-200/90 font-medium">
            {pandal.bengaliName}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
            <span className="font-medium text-stone-900 flex items-center gap-1">
              📍 {pandal.neighbourhood}
            </span>
            <span className="text-[11px] text-stone-500">
              Est. {pandal.yearEstablished}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-2 truncate">
            <Train className="w-3 h-3 text-red-700 flex-shrink-0" />
            <span className="truncate">{pandal.nearestMetro}</span>
          </div>

          {/* Crowd & Live Status */}
          <div className="flex items-center justify-between gap-1.5 py-1.5 px-2 bg-stone-50 rounded-xl border border-stone-200/70 text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${getCrowdBg(
                  pandal.crowdLevel
                )}`}
              >
                Crowd: {pandal.crowdLevel.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-stone-400">
                {pandal.crowdFreshnessMinutes}m ago
              </span>
            </div>

            {distanceKm !== null && walkingMinutes !== null && (
              <div className="text-right">
                <span className="font-bold text-stone-900 text-xs">
                  {formatDistance(distanceKm)}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  ~{formatDuration(walkingMinutes)} walk
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-stone-100">
          <a
            href={getGoogleMapsNavigationUrl(
              pandal.coordinates.lat,
              pandal.coordinates.lng,
              pandal.name,
              userCoords?.lat,
              userCoords?.lng
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold py-2 px-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Navigate</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisited(pandal.id);
            }}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
              pandal.isVisited
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
            }`}
            title={pandal.isVisited ? 'Marked Visited' : 'Mark as Visited'}
          >
            <CheckCircle2
              className={`w-4 h-4 ${
                pandal.isVisited ? 'text-emerald-600' : 'text-stone-400'
              }`}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(pandal);
            }}
            className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs transition-colors"
            title="View Details & Timings"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
