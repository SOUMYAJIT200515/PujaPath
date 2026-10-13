import React, { useState } from 'react';
import {
  Itinerary,
  Pandal,
  PandalCategory,
  TransportMode,
  HubLocation,
  RegionFilter,
} from '../types';
import { POPULAR_STARTING_HUBS } from '../data/defaultHubs';
import {
  optimizePandalRoute,
  recalculateItineraryStops,
} from '../utils/routeOptimizer';
import {
  X,
  Sparkles,
  Route,
  Clock,
  Compass,
  ArrowRight,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Trash2,
  Share2,
  MapPin,
  Train,
  Car,
  Footprints,
  Info,
} from 'lucide-react';
import {
  formatDuration,
  formatDistance,
  getGoogleMapsNavigationUrl,
} from '../utils/geoUtils';

interface RoutePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPandals: Pandal[];
  userCoords: { lat: number; lng: number } | null;
  activeItinerary: Itinerary | null;
  onSaveItinerary: (itinerary: Itinerary | null) => void;
  onToggleVisited: (id: string) => void;
  onSelectPandalOnMap: (pandal: Pandal) => void;
}

export const RoutePlannerModal: React.FC<RoutePlannerModalProps> = ({
  isOpen,
  onClose,
  allPandals,
  userCoords,
  activeItinerary,
  onSaveItinerary,
  onToggleVisited,
  onSelectPandalOnMap,
}) => {
  // Planner configurations
  const [regionScope, setRegionScope] = useState<RegionFilter>('ALL');
  const [selectedHub, setSelectedHub] = useState<string>('gps');
  const [timeBudget, setTimeBudget] = useState<number>(5);
  const [budgetPerPerson, setBudgetPerPerson] = useState<number>(500);
  const [transportMode, setTransportMode] = useState<TransportMode>('WALKING');
  const [selectedCategories, setSelectedCategories] = useState<PandalCategory[]>([
    'heritage',
    'traditional',
    'theme',
    'famous',
  ]);
  const [maxStops, setMaxStops] = useState<number>(5);
  const [shareCopied, setShareCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateRoute = () => {
    let startPoint = {
      lat: 22.5645,
      lng: 88.3516,
      name: 'Esplanade Metro Nexus',
    };

    if (selectedHub === 'gps' && userCoords) {
      startPoint = {
        lat: userCoords.lat,
        lng: userCoords.lng,
        name: 'My Live Location',
      };
    } else {
      const hub = POPULAR_STARTING_HUBS.find((h) => h.name === selectedHub);
      if (hub) {
        startPoint = {
          lat: hub.coords.lat,
          lng: hub.coords.lng,
          name: hub.name,
        };
      }
    }

    const newItinerary = optimizePandalRoute({
      startCoords: startPoint,
      returnCoords: startPoint,
      allPandals,
      regionScope,
      timeBudgetHours: timeBudget,
      budgetPerPerson,
      transportMode,
      preferredCategories: selectedCategories,
      maxStops,
    });

    onSaveItinerary(newItinerary);
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    if (!activeItinerary) return;
    const currentPandals = activeItinerary.stops.map((s) => s.pandal);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentPandals.length) return;

    const temp = currentPandals[index];
    currentPandals[index] = currentPandals[targetIndex];
    currentPandals[targetIndex] = temp;

    const updated = recalculateItineraryStops(activeItinerary, currentPandals);
    onSaveItinerary(updated);
  };

  const handleRemoveStop = (pandalId: string) => {
    if (!activeItinerary) return;
    const remainingPandals = activeItinerary.stops
      .filter((s) => s.pandalId !== pandalId)
      .map((s) => s.pandal);

    const updated = recalculateItineraryStops(activeItinerary, remainingPandals);
    onSaveItinerary(updated);
  };

  const handleShareRoute = () => {
    if (!activeItinerary) return;
    const stopNames = activeItinerary.stops.map((s) => s.pandal.name).join(' -> ');
    const text = `🎉 My Kolkata Durga Puja Itinerary (${activeItinerary.timeBudgetHours} hrs, ${activeItinerary.stops.length} stops):\n${stopNames}\nExplore on PujaPath!`;
    navigator.clipboard.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const toggleCategory = (cat: PandalCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-700 via-red-800 to-amber-800 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Route className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="font-serif font-black text-lg sm:text-xl leading-tight">
                Smart Puja Route Planner
              </h2>
              <p className="text-xs text-amber-200/90 font-medium">
                Optimized pandal hopping based on live queues & travel time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs: Configuration vs Generated Itinerary */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Form Settings */}
          <div className="space-y-4">
            {/* Region Scope Selection */}
            <div>
              <label className="text-xs font-bold text-stone-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-red-700" />
                  <span>Hopping Circuit Region</span>
                </span>
                <span className="text-[11px] text-stone-500 font-normal">
                  Cross-region or local tour
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'ALL' as RegionFilter, label: 'All Kolkata', sub: 'Citywide' },
                  { id: 'NORTH' as RegionFilter, label: 'North', sub: 'Heritage' },
                  { id: 'CENTRAL' as RegionFilter, label: 'Central', sub: 'Illumination' },
                  { id: 'SOUTH' as RegionFilter, label: 'South', sub: 'Modern Art' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRegionScope(item.id)}
                    className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                      regionScope === item.id
                        ? 'bg-red-700 text-white border-red-800 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className={`text-[10px] font-normal ${regionScope === item.id ? 'text-amber-200' : 'text-stone-400'}`}>
                      {item.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Location Hub */}
            <div>
              <label className="text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-700" />
                <span>Starting Point</span>
              </label>
              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-stone-900 outline-none focus:border-red-600"
              >
                {userCoords ? (
                  <option value="gps">📍 My Current Live GPS Location</option>
                ) : (
                  <option value="gps">📍 Sovabazar Central (Default GPS)</option>
                )}
                {POPULAR_STARTING_HUBS.map((hub) => (
                  <option key={hub.name} value={hub.name}>
                    🚆 {hub.name} ({hub.description.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Time Budget & Transport Mode */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Available Time</span>
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[3, 5, 8, 12].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setTimeBudget(hours)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        timeBudget === hours
                          ? 'bg-red-700 text-white border-red-800 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                  <span>Transit Mode</span>
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { mode: 'WALKING' as const, label: 'Walk', icon: Footprints },
                    { mode: 'TRANSIT' as const, label: 'Metro', icon: Train },
                    { mode: 'DRIVING' as const, label: 'Taxi', icon: Car },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.mode}
                        type="button"
                        onClick={() => setTransportMode(m.mode)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border flex flex-col items-center gap-0.5 transition-colors ${
                          transportMode === m.mode
                            ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Preferred Categories & Max Stops */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-800 mb-1.5 block">
                  Preferred Themes
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: 'heritage', label: 'Bonedi Bari' },
                      { id: 'traditional', label: 'Sabeki' },
                      { id: 'theme', label: 'Art Theme' },
                      { id: 'famous', label: 'Famous' },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedCategories.includes(cat.id)
                          ? 'bg-red-50 text-red-800 border-red-300 font-bold'
                          : 'bg-white text-stone-500 border-stone-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    Max Stops: {maxStops}
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Budget: ₹{budgetPerPerson}/head
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={maxStops}
                  onChange={(e) => setMaxStops(Number(e.target.value))}
                  className="w-full accent-red-700"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateRoute}
              className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {activeItinerary ? 'Re-optimize Route' : 'Generate Smart Itinerary'}
              </span>
            </button>
          </div>

          {/* Active Generated Itinerary Preview */}
          {activeItinerary && (
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-stone-900 text-base">
                    {activeItinerary.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Total: {activeItinerary.totalDistanceKm} km • Est.{' '}
                    {formatDuration(activeItinerary.totalTimeMinutes)}
                  </p>
                </div>
                <button
                  onClick={handleShareRoute}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-red-700" />
                  <span>{shareCopied ? 'Copied! ✓' : 'Share Plan'}</span>
                </button>
              </div>

              {/* Realistic Feasibility Warning */}
              {activeItinerary.warningMessage && (
                <div className="p-3 bg-amber-50 border border-amber-300/80 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p className="leading-snug">{activeItinerary.warningMessage}</p>
                </div>
              )}

              {/* Stops Schedule */}
              <div className="space-y-2">
                {activeItinerary.stops.map((stop, idx) => (
                  <div
                    key={stop.pandalId}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:border-red-300 transition-all flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-red-700 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                        {stop.order}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                          {stop.pandal.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span>ETA {stop.estimatedArrival}</span>
                          <span>•</span>
                          <span>~{stop.visitDurationMinutes}m visit</span>
                          <span>•</span>
                          <span className="capitalize text-red-700 font-medium">
                            {stop.pandal.crowdLevel.replace('_', ' ')} queue
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Mark Completed */}
                      <button
                        onClick={() => onToggleVisited(stop.pandalId)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          stop.pandal.isVisited
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white text-stone-400 hover:text-stone-700 border-stone-200'
                        }`}
                        title="Mark Visited"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      {/* Reorder Buttons */}
                      <div className="flex flex-col">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveStop(idx, 'up')}
                          className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === activeItinerary.stops.length - 1}
                          onClick={() => handleMoveStop(idx, 'down')}
                          className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete Stop */}
                      <button
                        onClick={() => handleRemoveStop(stop.pandalId)}
                        className="p-1.5 text-stone-400 hover:text-red-700 transition-colors"
                        title="Remove Stop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Google Maps Navigation Link */}
                      <a
                        href={getGoogleMapsNavigationUrl(
                          stop.pandal.coordinates.lat,
                          stop.pandal.coordinates.lng,
                          stop.pandal.name,
                          userCoords?.lat,
                          userCoords?.lng
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors shadow-sm ml-1"
                        title="Navigate to this pandal"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-stone-500">
            Powered by Google Maps Routes & Distance Heuristics
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-semibold text-xs rounded-xl hover:bg-stone-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
