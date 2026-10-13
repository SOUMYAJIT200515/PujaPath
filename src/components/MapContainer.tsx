import React, { useState, useEffect, useCallback } from 'react';
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Navigation,
  Crosshair,
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Users,
  ChevronRight,
  Maximize2,
  Star,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { Pandal, SquadMember, Itinerary, RegionFilter } from '../types';
import {
  calculateDistanceKm,
  formatDistance,
  estimateTravelTimeMinutes,
  formatDuration,
  getGoogleMapsNavigationUrl,
} from '../utils/geoUtils';
import { MapRouteRenderer } from './MapRouteRenderer';

interface MapContainerProps {
  pandals: Pandal[];
  userCoords: { lat: number; lng: number } | null;
  userAccuracy: number | null;
  lastGpsUpdate: number | null;
  isTrackingGps: boolean;
  selectedPandal: Pandal | null;
  selectedRegion: RegionFilter;
  onSelectPandal: (pandal: Pandal | null) => void;
  onToggleFavorite: (id: string) => void;
  onToggleVisited: (id: string) => void;
  onOpenReportCrowd: (pandal: Pandal) => void;
  onOpenDetails: (pandal: Pandal) => void;
  activeItinerary: Itinerary | null;
  squadMembers?: SquadMember[];
  onRequestGps: () => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  pandals,
  userCoords,
  userAccuracy,
  lastGpsUpdate,
  isTrackingGps,
  selectedPandal,
  selectedRegion,
  onSelectPandal,
  onToggleFavorite,
  onToggleVisited,
  onOpenReportCrowd,
  onOpenDetails,
  activeItinerary,
  squadMembers = [],
  onRequestGps,
}) => {
  const map = useMap();
  const [isMapReady, setIsMapReady] = useState(false);

  // Preserve configured mapId from environment, with safe fallback to 'DEMO_MAP_ID'
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID || 'DEMO_MAP_ID';

  // Center on user GPS
  const handleCenterOnUser = useCallback(() => {
    if (userCoords && map) {
      map.panTo(userCoords);
      map.setZoom(16);
    } else {
      onRequestGps();
    }
  }, [userCoords, map, onRequestGps]);

  // Regional View Presets
  const handlePanToRegion = useCallback(
    (region: 'ALL' | 'NORTH' | 'CENTRAL' | 'SOUTH') => {
      if (!map) return;
      switch (region) {
        case 'NORTH':
          map.panTo({ lat: 22.5971, lng: 88.3675 });
          map.setZoom(14);
          break;
        case 'CENTRAL':
          map.panTo({ lat: 22.5735, lng: 88.3650 });
          map.setZoom(14);
          break;
        case 'SOUTH':
          map.panTo({ lat: 22.5186, lng: 88.3580 });
          map.setZoom(14);
          break;
        case 'ALL':
        default:
          map.panTo({ lat: 22.5600, lng: 88.3600 });
          map.setZoom(12);
          break;
      }
    },
    [map]
  );

  // Auto pan when region selection changes in parent
  useEffect(() => {
    if (map && selectedRegion) {
      handlePanToRegion(selectedRegion);
    }
  }, [selectedRegion, map, handlePanToRegion]);

  // Helper to check if pandal is in active itinerary
  const getItineraryStopOrder = (pandalId: string) => {
    if (!activeItinerary) return null;
    const stop = activeItinerary.stops.find((s) => s.pandalId === pandalId);
    return stop ? stop.order : null;
  };

  // Determine route points for polyline
  const routeOrigin = activeItinerary
    ? activeItinerary.startPoint
    : userCoords;
  const routeDestination =
    activeItinerary && activeItinerary.stops.length > 0
      ? activeItinerary.stops[activeItinerary.stops.length - 1].pandal.coordinates
      : selectedPandal
      ? selectedPandal.coordinates
      : null;

  const routeWaypoints =
    activeItinerary && activeItinerary.stops.length > 1
      ? activeItinerary.stops
          .slice(0, activeItinerary.stops.length - 1)
          .map((s) => s.pandal.coordinates)
      : [];

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-lg border border-amber-900/10 bg-amber-50/20">
      <Map
        mapId={mapId}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        defaultCenter={{ lat: 22.5600, lng: 88.3600 }}
        defaultZoom={12}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="w-full h-full"
        onTilesLoaded={() => setIsMapReady(true)}
      >
        {/* Route Renderer */}
        {routeOrigin && routeDestination && (
          <MapRouteRenderer
            origin={routeOrigin}
            destination={routeDestination}
            waypoints={routeWaypoints}
            travelMode={activeItinerary?.transportMode || 'WALKING'}
            strokeColor="#B91C1C"
          />
        )}

        {/* User GPS Live Marker */}
        {userCoords && (
          <AdvancedMarker
            position={userCoords}
            title="My Live Location"
            zIndex={100}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-10 h-10 rounded-full bg-blue-500/25 animate-ping" />
              <div className="absolute w-7 h-7 rounded-full bg-blue-500/35 border border-blue-400" />
              <div className="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
          </AdvancedMarker>
        )}

        {/* Squad Members Sharing Live Location */}
        {squadMembers
          .filter((m) => m.isSharingLocation && m.lastLocation)
          .map((member) => (
            <AdvancedMarker
              key={member.id}
              position={{
                lat: member.lastLocation!.lat,
                lng: member.lastLocation!.lng,
              }}
              title={`${member.name}'s Location`}
              zIndex={95}
            >
              <div className="flex flex-col items-center">
                <div className="px-1.5 py-0.5 bg-emerald-700 text-white text-[10px] font-semibold rounded shadow-sm whitespace-nowrap mb-0.5">
                  {member.name}
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-6 h-6 rounded-full bg-emerald-500/30 animate-pulse" />
                  <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-[8px] text-white font-bold">
                    {member.name[0]}
                  </div>
                </div>
              </div>
            </AdvancedMarker>
          ))}

        {/* Pandal Markers with Region Specific Styling */}
        {pandals.map((pandal) => {
          const stopOrder = getItineraryStopOrder(pandal.id);
          const isSelected = selectedPandal?.id === pandal.id;
          const isVisited = pandal.isVisited;
          const isFav = pandal.isFavorite;

          // Regional color styling
          let pinBg = 'bg-red-700';
          let borderCol = 'border-amber-300';
          let regionTag = 'N';

          if (pandal.region === 'CENTRAL') {
            pinBg = 'bg-amber-600';
            borderCol = 'border-amber-200';
            regionTag = 'C';
          } else if (pandal.region === 'SOUTH') {
            pinBg = 'bg-teal-700';
            borderCol = 'border-teal-200';
            regionTag = 'S';
          }

          if (isVisited) {
            pinBg = 'bg-emerald-600';
            borderCol = 'border-white';
          } else if (stopOrder !== null) {
            pinBg = 'bg-red-800';
            borderCol = 'border-white';
          } else if (pandal.crowdLevel === 'very_high') {
            pinBg = 'bg-rose-700';
          } else if (pandal.crowdLevel === 'low') {
            pinBg = 'bg-teal-700';
          }

          return (
            <AdvancedMarker
              key={pandal.id}
              position={pandal.coordinates}
              title={`${pandal.name} (${pandal.region})`}
              zIndex={isSelected ? 90 : stopOrder ? 80 : 50}
              onClick={() => onSelectPandal(pandal)}
            >
              <div
                className={`group cursor-pointer transform transition-all duration-200 ${
                  isSelected ? 'scale-125 -translate-y-2' : 'hover:scale-110'
                }`}
              >
                <div
                  className={`relative flex items-center justify-center px-2 py-1 rounded-full shadow-lg border-2 ${pinBg} ${borderCol} text-white font-bold text-xs`}
                >
                  {stopOrder !== null ? (
                    <span className="flex items-center gap-0.5">
                      <span className="text-[10px] bg-white text-red-700 rounded-full w-4 h-4 flex items-center justify-center font-extrabold">
                        {stopOrder}
                      </span>
                    </span>
                  ) : isVisited ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <span className="text-amber-200 text-xs">🪔</span>
                  )}

                  {isFav && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-stone-950 p-0.5 rounded-full shadow">
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </span>
                  )}
                </div>

                {/* Bottom pin pointer */}
                <div
                  className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] mx-auto ${
                    isVisited
                      ? 'border-t-emerald-600'
                      : stopOrder !== null
                      ? 'border-t-red-800'
                      : pandal.region === 'CENTRAL'
                      ? 'border-t-amber-600'
                      : pandal.region === 'SOUTH'
                      ? 'border-t-teal-700'
                      : 'border-t-red-700'
                  }`}
                />
              </div>
            </AdvancedMarker>
          );
        })}

        {/* Interactive Info Window for Selected Pandal */}
        {selectedPandal && (
          <InfoWindow
            position={selectedPandal.coordinates}
            onCloseClick={() => onSelectPandal(null)}
            pixelOffset={[0, -32]}
          >
            <div className="p-2 max-w-[280px] sm:max-w-[320px] font-sans">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        selectedPandal.region === 'NORTH'
                          ? 'bg-red-100 text-red-800'
                          : selectedPandal.region === 'CENTRAL'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {selectedPandal.region} Kolkata
                    </span>
                    <span className="text-[10px] text-stone-400">•</span>
                    <span className="text-[10px] text-stone-500 capitalize">
                      {selectedPandal.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                    {selectedPandal.name}
                  </h4>
                  <p className="text-xs text-red-700 font-medium">
                    {selectedPandal.bengaliName}
                  </p>
                </div>
                <button
                  onClick={() => onToggleFavorite(selectedPandal.id)}
                  className="text-stone-400 hover:text-amber-500 transition-colors p-1"
                  title="Bookmark Pandal"
                >
                  <Star
                    className={`w-4 h-4 ${
                      selectedPandal.isFavorite
                        ? 'fill-amber-500 text-amber-500'
                        : ''
                    }`}
                  />
                </button>
              </div>

              <div className="text-[11px] text-stone-600 mb-2 flex items-center gap-1.5 truncate">
                <span className="font-medium">{selectedPandal.neighbourhood}</span>
                <span>•</span>
                <span className="truncate">{selectedPandal.nearestMetro}</span>
              </div>

              {/* Distance and Estimated Time from Live GPS */}
              {userCoords && (
                <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-2 mb-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500 text-[10px] block">
                      Distance
                    </span>
                    <span className="font-semibold text-stone-900">
                      {formatDistance(
                        calculateDistanceKm(
                          userCoords.lat,
                          userCoords.lng,
                          selectedPandal.coordinates.lat,
                          selectedPandal.coordinates.lng
                        )
                      )}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 text-[10px] block">
                      Est. Transit
                    </span>
                    <span className="font-semibold text-red-700">
                      {formatDuration(
                        estimateTravelTimeMinutes(
                          calculateDistanceKm(
                            userCoords.lat,
                            userCoords.lng,
                            selectedPandal.coordinates.lat,
                            selectedPandal.coordinates.lng
                          ),
                          'WALKING'
                        )
                      )}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 text-[10px] block">
                      Queue Delay
                    </span>
                    <span
                      className={`font-semibold capitalize text-[11px] ${
                        selectedPandal.crowdLevel === 'low'
                          ? 'text-emerald-700'
                          : selectedPandal.crowdLevel === 'moderate'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {selectedPandal.crowdLevel.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <a
                  href={getGoogleMapsNavigationUrl(
                    selectedPandal.coordinates.lat,
                    selectedPandal.coordinates.lng,
                    selectedPandal.name,
                    userCoords?.lat,
                    userCoords?.lng
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold py-1.5 px-2 rounded-lg transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <button
                  onClick={() => onToggleVisited(selectedPandal.id)}
                  className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 px-2 rounded-lg border transition-colors ${
                    selectedPandal.isVisited
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedPandal.isVisited ? 'Visited ✓' : 'Mark Visited'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200 mt-2 text-[11px]">
                <button
                  onClick={() => onOpenReportCrowd(selectedPandal)}
                  className="text-stone-600 hover:text-red-700 font-medium"
                >
                  Report Queue
                </button>
                <button
                  onClick={() => onOpenDetails(selectedPandal)}
                  className="text-red-700 font-semibold hover:underline flex items-center gap-0.5"
                >
                  <span>Details & Aarti</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>

      {/* Floating Controls Overlay with Regional Quick Jump */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        <button
          onClick={handleCenterOnUser}
          className={`p-2.5 rounded-xl shadow-md border backdrop-blur-md transition-all flex items-center justify-center ${
            isTrackingGps && userCoords
              ? 'bg-blue-600 text-white border-blue-700'
              : 'bg-white/95 text-stone-700 hover:text-blue-600 border-stone-200'
          }`}
          title={userCoords ? 'Center to My Live GPS' : 'Enable Live GPS Location'}
        >
          <Crosshair className="w-5 h-5" />
        </button>

        {/* Quick Regional Pan Controls */}
        <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-stone-200 overflow-hidden divide-y divide-stone-100 text-[10px] font-bold">
          <button
            onClick={() => handlePanToRegion('ALL')}
            className="px-2.5 py-1.5 text-stone-700 hover:bg-stone-100 hover:text-red-700 transition-colors"
            title="All Kolkata View"
          >
            All
          </button>
          <button
            onClick={() => handlePanToRegion('NORTH')}
            className="px-2.5 py-1.5 text-red-700 hover:bg-red-50 transition-colors"
            title="North Kolkata Hub"
          >
            North
          </button>
          <button
            onClick={() => handlePanToRegion('CENTRAL')}
            className="px-2.5 py-1.5 text-amber-700 hover:bg-amber-50 transition-colors"
            title="Central Kolkata Hub"
          >
            Central
          </button>
          <button
            onClick={() => handlePanToRegion('SOUTH')}
            className="px-2.5 py-1.5 text-teal-700 hover:bg-teal-50 transition-colors"
            title="South Kolkata Hub"
          >
            South
          </button>
        </div>
      </div>

      {/* Live Status Pill at Bottom Left */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 text-stone-800 text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 pointer-events-auto">
          <span
            className={`w-2 h-2 rounded-full ${
              userCoords ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span>
            {userCoords
              ? `Live GPS (±${Math.round(userAccuracy || 10)}m)`
              : `${selectedRegion === 'ALL' ? 'All Kolkata' : selectedRegion + ' Kolkata'} View`}
          </span>
        </div>

        {activeItinerary && (
          <div className="bg-amber-900/90 backdrop-blur-md text-amber-100 text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 pointer-events-auto">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>
              {activeItinerary.stops.length} stops •{' '}
              {activeItinerary.totalDistanceKm} km
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
