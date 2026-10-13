import React from 'react';
import { RegionFilter, Pandal } from '../types';
import { Compass, CheckCircle2, Flame, MapPin, Sparkles } from 'lucide-react';

interface RegionSelectorProps {
  selectedRegion: RegionFilter;
  onSelectRegion: (region: RegionFilter) => void;
  pandals: Pandal[];
  userCoords: { lat: number; lng: number } | null;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onSelectRegion,
  pandals,
  userCoords,
}) => {
  // Compute regional metrics
  const getStats = (region: 'NORTH' | 'CENTRAL' | 'SOUTH') => {
    const regionalPandals = pandals.filter((p) => p.region === region);
    const visitedCount = regionalPandals.filter((p) => p.isVisited).length;
    const totalReports = regionalPandals.reduce((sum, p) => sum + (p.crowdReportCount || 0), 0);
    const lowQueueCount = regionalPandals.filter(
      (p) => p.crowdLevel === 'low' || p.crowdLevel === 'moderate'
    ).length;
    return {
      count: regionalPandals.length,
      visitedCount,
      totalReports,
      lowQueueCount,
      popular: regionalPandals.slice(0, 2).map((p) => p.name.split(' ')[0]),
    };
  };

  const northStats = getStats('NORTH');
  const centralStats = getStats('CENTRAL');
  const southStats = getStats('SOUTH');
  const allVisited = pandals.filter((p) => p.isVisited).length;
  const allReports = pandals.reduce((sum, p) => sum + (p.crowdReportCount || 0), 0);

  const regionCards = [
    {
      id: 'ALL' as RegionFilter,
      title: 'All Kolkata',
      bengali: 'সমগ্র কলকাতা',
      tagline: 'North, Central & South circuit on one map',
      count: pandals.length,
      visited: allVisited,
      reports: allReports,
      accentColor: 'from-amber-700 via-red-800 to-rose-900',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      activeBorder: 'border-amber-600 ring-2 ring-amber-500/30',
      highlights: 'Complete Citywide Tour',
    },
    {
      id: 'NORTH' as RegionFilter,
      title: 'North Kolkata',
      bengali: 'উত্তর কলকাতা',
      tagline: 'Sabeki Daaker Saaj, Bonedi Bari & Kumartuli artisans',
      count: northStats.count,
      visited: northStats.visitedCount,
      reports: northStats.totalReports,
      accentColor: 'from-red-700 to-red-900',
      badgeColor: 'bg-red-100 text-red-900 border-red-300',
      activeBorder: 'border-red-600 ring-2 ring-red-500/30',
      highlights: 'Bagbazar • Kumartuli • Sovabazar',
    },
    {
      id: 'CENTRAL' as RegionFilter,
      title: 'Central Kolkata',
      bengali: 'মধ্য কলকাতা',
      tagline: 'Illuminated water palaces, golden themes & Sealdah nexus',
      count: centralStats.count,
      visited: centralStats.visitedCount,
      reports: centralStats.totalReports,
      accentColor: 'from-amber-600 to-orange-800',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      activeBorder: 'border-amber-600 ring-2 ring-amber-500/30',
      highlights: 'College Sq • Santosh Mitra • Bowbazar',
    },
    {
      id: 'SOUTH' as RegionFilter,
      title: 'South Kolkata',
      bengali: 'দক্ষিণ কলকাতা',
      tagline: 'Avant-garde architectural installations & Gariahat corridor',
      count: southStats.count,
      visited: southStats.visitedCount,
      reports: southStats.totalReports,
      accentColor: 'from-teal-800 to-emerald-950',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      activeBorder: 'border-teal-600 ring-2 ring-teal-500/30',
      highlights: 'Ekdalia • Tridhara • Deshapriya',
    },
  ];

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-black text-stone-900 text-base sm:text-lg flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-red-700" />
            <span>Select Hopping Circuit</span>
          </h2>
          <p className="text-xs text-stone-500">
            Switch between regions or view the complete Kolkata network
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
            {allVisited} / {pandals.length} Hopped
          </span>
        </div>
      </div>

      {/* Prominent Selectable Region Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {regionCards.map((card) => {
          const isSelected = selectedRegion === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectRegion(card.id)}
              className={`group cursor-pointer rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between gap-2.5 relative overflow-hidden bg-white ${
                isSelected
                  ? `${card.activeBorder} shadow-md bg-stone-50/60`
                  : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
              }`}
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accentColor} ${
                  isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-75'
                }`}
              />

              <div>
                <div className="flex items-start justify-between gap-1.5 mb-1">
                  <div>
                    <h3 className="font-serif font-black text-stone-900 text-sm sm:text-base leading-tight">
                      {card.title}
                    </h3>
                    <span className="text-[11px] text-red-800 font-semibold block">
                      {card.bengali}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${card.badgeColor}`}
                  >
                    {card.count} Pandals
                  </span>
                </div>

                <p className="text-[11px] text-stone-600 leading-snug line-clamp-2">
                  {card.tagline}
                </p>
              </div>

              {/* Bottom Quick Metric Pills */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                <span className="text-stone-500 font-medium flex items-center gap-1">
                  <CheckCircle2
                    className={`w-3 h-3 ${
                      card.visited > 0 ? 'text-emerald-600' : 'text-stone-300'
                    }`}
                  />
                  <span>
                    {card.visited} visited
                  </span>
                </span>

                <span className="text-stone-600 font-semibold flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-amber-600" />
                  <span>{card.reports} crowd updates</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
