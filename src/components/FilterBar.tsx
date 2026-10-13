import React from 'react';
import { RegionFilter } from '../types';
import { Filter, Star, CheckCircle2, Flame, MapPin, Compass } from 'lucide-react';

interface FilterBarProps {
  selectedRegion: RegionFilter;
  onSelectRegion: (region: RegionFilter) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  maxDistanceKm: number | null;
  onSelectMaxDistance: (dist: number | null) => void;
  crowdFilter: string;
  onSelectCrowdFilter: (crowd: string) => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  onlyUnvisited: boolean;
  onToggleUnvisited: () => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedRegion,
  onSelectRegion,
  selectedCategory,
  onSelectCategory,
  maxDistanceKm,
  onSelectMaxDistance,
  crowdFilter,
  onSelectCrowdFilter,
  onlyFavorites,
  onToggleFavorites,
  onlyUnvisited,
  onToggleUnvisited,
  totalCount,
}) => {
  const regions: { id: RegionFilter; label: string; bengali: string }[] = [
    { id: 'ALL', label: 'All Kolkata', bengali: 'সমগ্র' },
    { id: 'NORTH', label: 'North', bengali: 'উত্তর' },
    { id: 'CENTRAL', label: 'Central', bengali: 'মধ্য' },
    { id: 'SOUTH', label: 'South', bengali: 'দক্ষিণ' },
  ];

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Themes' },
    { id: 'heritage', label: 'Bonedi Bari' },
    { id: 'traditional', label: 'Sabeki' },
    { id: 'theme', label: 'Art Theme' },
    { id: 'famous', label: 'Famous' },
  ];

  return (
    <div className="space-y-2">
      {/* Primary Region Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex-shrink-0 mr-1 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-red-700" />
          <span>Region:</span>
        </span>
        {regions.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelectRegion(r.id)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 flex-shrink-0 border ${
              selectedRegion === r.id
                ? 'bg-red-700 text-white border-red-800 shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{r.label}</span>
            <span className={`text-[10px] font-normal ${selectedRegion === r.id ? 'text-amber-200' : 'text-stone-400'}`}>
              ({r.bengali})
            </span>
          </button>
        ))}
      </div>

      {/* Secondary Filter Chips */}
      <div className="py-1 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs">
        {/* Categories chips */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors border text-[11px] ${
                selectedCategory === c.id
                  ? 'bg-stone-900 text-white border-stone-950 shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-stone-300 flex-shrink-0 mx-0.5" />

        {/* Distance filter */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onSelectMaxDistance(maxDistanceKm === 2.0 ? null : 2.0)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium border text-[11px] transition-colors ${
              maxDistanceKm === 2.0
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>&lt; 2 km</span>
          </button>
        </div>

        {/* Low queue filter */}
        <button
          onClick={() => onSelectCrowdFilter(crowdFilter === 'low_queue' ? 'all' : 'low_queue')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium border flex-shrink-0 text-[11px] transition-colors ${
            crowdFilter === 'low_queue'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Flame className="w-3 h-3 text-emerald-600" />
          <span>Low Queue</span>
        </button>

        {/* Favorites only */}
        <button
          onClick={onToggleFavorites}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium border flex-shrink-0 text-[11px] transition-colors ${
            onlyFavorites
              ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Star className={`w-3 h-3 ${onlyFavorites ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>Starred</span>
        </button>

        {/* Unvisited only */}
        <button
          onClick={onToggleUnvisited}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium border flex-shrink-0 text-[11px] transition-colors ${
            onlyUnvisited
              ? 'bg-red-50 text-red-800 border-red-200 font-bold'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <CheckCircle2 className="w-3 h-3 text-red-600" />
          <span>Unvisited</span>
        </button>

        <span className="text-[11px] text-stone-500 font-semibold ml-auto flex-shrink-0 pr-1">
          {totalCount} matching
        </span>
      </div>
    </div>
  );
};
