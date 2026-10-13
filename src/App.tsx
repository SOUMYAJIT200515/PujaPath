/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  signInWithGoogle,
  signOutUser,
  subscribeToAuthState,
  testFirestoreConnection,
  loadUserPreferences,
  saveUserPreferences,
  saveUserItinerary,
  submitCrowdReportToFirestore,
  subscribeToCrowdReports,
} from './services/firebase';
import { INITIAL_PANDALS } from './data/initialPandals';
import { Pandal, CrowdReport, Itinerary, SquadGroup, Expense, RegionFilter } from './types';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateDistanceKm } from './utils/geoUtils';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { MapContainer } from './components/MapContainer';
import { RegionSelector } from './components/RegionSelector';
import { FilterBar } from './components/FilterBar';
import { PandalCard } from './components/PandalCard';
import { PandalDetailModal } from './components/PandalDetailModal';
import { RoutePlannerModal } from './components/RoutePlannerModal';
import { CrowdReportModal } from './components/CrowdReportModal';
import { SquadModal } from './components/SquadModal';
import { BudgetTrackerModal } from './components/BudgetTrackerModal';
import { EmergencyModal } from './components/EmergencyModal';
import { LocationBanner } from './components/LocationBanner';
import { QuotaExceededBanner } from './components/QuotaExceededBanner';
import {
  Sparkles,
  Route,
  Users,
  Compass,
  MapPin,
  CheckCircle2,
  Navigation,
  ExternalLink,
  Crown,
  Edit3,
  UserPlus,
  Wifi,
  WifiOff,
  HardDriveDownload,
  Download,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import {
  cacheDownloadedItinerary,
  cachePandalLocations,
  getCachedItinerary,
  getCachedPandals,
  getOfflineCacheStatus,
  clearOfflineCache,
  OfflineCacheStatus,
} from './services/offlineCache';

const INITIAL_SQUAD: SquadGroup = {
  id: 'squad-kolkata-1',
  code: 'PUJA-700004',
  name: 'Kolkata Pandal Hoppers 🥁',
  leaderId: 'user-me',
  meetingPoint: 'Esplanade Metro Interchange / Netaji Statue Shyambazar',
  emergencyContact: '100 / 112',
  members: [
    {
      id: 'user-me',
      name: 'You (Hopper)',
      avatar: 'Y',
      isSharingLocation: false,
      visitedPandalIds: [],
    },
    {
      id: 'user-shreya',
      name: 'Shreya',
      avatar: 'S',
      isSharingLocation: true,
      lastLocation: {
        lat: 22.5996,
        lng: 88.3642, // Kumartuli Park (North)
        updatedAt: Date.now() - 3 * 60 * 1000,
        accuracy: 15,
      },
      visitedPandalIds: ['bagbazar-sarbojanin', 'kumartuli-park'],
    },
    {
      id: 'user-anirban',
      name: 'Anirban',
      avatar: 'A',
      isSharingLocation: true,
      lastLocation: {
        lat: 22.5186,
        lng: 88.3662, // Ekdalia Evergreen (South)
        updatedAt: Date.now() - 5 * 60 * 1000,
        accuracy: 20,
      },
      visitedPandalIds: ['ekdalia-evergreen', 'singhi-park'],
    },
  ],
};

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    category: 'metro_train',
    description: 'Metro smart cards & tokens (Central to Gariahat)',
    amount: 80,
    paidByMemberId: 'user-shreya',
    paidByName: 'Shreya',
    splitWithMemberIds: ['user-me', 'user-shreya', 'user-anirban'],
    timestamp: Date.now() - 60 * 60 * 1000,
  },
  {
    id: 'exp-2',
    category: 'food_bhog',
    description: 'Hot Kathi rolls & Mishti at Gariahat / Hatibagan',
    amount: 320,
    paidByMemberId: 'user-me',
    paidByName: 'You (Hopper)',
    splitWithMemberIds: ['user-me', 'user-shreya', 'user-anirban'],
    timestamp: Date.now() - 30 * 60 * 1000,
  },
];

export default function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  // VITE_GOOGLE_MAPS_ID is specifically for Google Maps Cloud Map ID styling (vector/raster).
  // It is NOT the API key.
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID || 'DEMO_MAP_ID';
  // VITE_API_BASE_URL is the backend base URL.
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

  // Geolocation hook
  const {
    coords: userCoords,
    accuracy: userAccuracy,
    lastUpdated: lastGpsUpdate,
    isTracking: isTrackingGps,
    permissionStatus,
    errorMessage: gpsErrorMessage,
    startTracking: requestGps,
    stopTracking,
    setManualLocation,
  } = useGeolocation();

  // Persistent user state
  const [pandals, setPandals] = useLocalStorage<Pandal[]>(
    'pujapath_pandals_v2',
    INITIAL_PANDALS
  );
  const [activeItinerary, setActiveItinerary] = useLocalStorage<Itinerary | null>(
    'pujapath_itinerary',
    null
  );
  const [squad, setSquad] = useLocalStorage<SquadGroup>(
    'pujapath_squad',
    INITIAL_SQUAD
  );
  const [expenses, setExpenses] = useLocalStorage<Expense[]>(
    'pujapath_expenses',
    INITIAL_EXPENSES
  );
  const [targetBudget, setTargetBudget] = useLocalStorage<number>(
    'pujapath_budget_goal',
    600
  );

  // Regional navigation state
  const [selectedRegion, setSelectedRegion] = useLocalStorage<RegionFilter>(
    'pujapath_region_filter',
    'ALL'
  );

  // UI state
  const [activeTab, setActiveTab] = useState<
    'map' | 'explore' | 'itinerary' | 'squad' | 'budget'
  >('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | null>(null);
  const [crowdFilter, setCrowdFilter] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyUnvisited, setOnlyUnvisited] = useState(false);

  // Modals state
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(null);
  const [detailedPandal, setDetailedPandal] = useState<Pandal | null>(null);
  const [reportingPandal, setReportingPandal] = useState<Pandal | null>(null);
  const [isRoutePlannerOpen, setIsRoutePlannerOpen] = useState(false);
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);
  const [isSquadEditMode, setIsSquadEditMode] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Firebase Auth & Cloud Firestore State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [authErrorNotice, setAuthErrorNotice] = useState<string | null>(null);

  // Service Worker Cache API & Offline Coverage State
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [offlineToast, setOfflineToast] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<OfflineCacheStatus>({
    isSupported: true,
    hasCachedItinerary: false,
    hasCachedPandals: false,
    pandalCount: 0,
    itineraryTitle: null,
    stopCount: 0,
    lastCachedAt: null,
  });

  const isLowNetworkOrOffline = !isOnline || isSimulatedOffline;

  // Sync with Firebase Authentication and Cloud Firestore
  useEffect(() => {
    // 1. Verify Firestore connectivity on application boot
    testFirestoreConnection();

    // 2. Subscribe to Firebase Auth changes
    const unsubscribeAuth = subscribeToAuthState(async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          const cloudPrefs = await loadUserPreferences(user.uid);
          if (cloudPrefs) {
            // Merge cloud visited & favorites
            setPandals((prev) =>
              prev.map((p) => ({
                ...p,
                isVisited: cloudPrefs.visitedPandalIds?.includes(p.id) || p.isVisited || false,
                isFavorite: cloudPrefs.favoritePandalIds?.includes(p.id) || p.isFavorite || false,
              }))
            );
            if (cloudPrefs.selectedRegion) {
              setSelectedRegion(cloudPrefs.selectedRegion as RegionFilter);
            }
            if (cloudPrefs.targetBudget) {
              setTargetBudget(cloudPrefs.targetBudget);
            }
          } else {
            // First time login - seed initial preferences to Firestore
            const initialVisited = pandals.filter((p) => p.isVisited).map((p) => p.id);
            const initialFavs = pandals.filter((p) => p.isFavorite).map((p) => p.id);
            await saveUserPreferences(user.uid, {
              visitedPandalIds: initialVisited,
              favoritePandalIds: initialFavs,
              selectedRegion,
              targetBudget,
            });
          }
        } catch (err) {
          console.warn('Error synchronizing preferences with Firestore:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    // 3. Real-time Firestore crowd reports listener
    const unsubscribeReports = subscribeToCrowdReports((reports) => {
      if (reports && reports.length > 0) {
        setPandals((prev) =>
          prev.map((p) => {
            const latest = reports.find((r) => r.pandalId === p.id);
            if (latest) {
              const freshness = Math.max(
                1,
                Math.round((Date.now() - (latest.timestamp || Date.now())) / 60000)
              );
              return {
                ...p,
                crowdLevel: latest.crowdLevel,
                crowdFreshnessMinutes: freshness,
                crowdReportCount: p.crowdReportCount + 1,
              };
            }
            return p;
          })
        );
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeReports();
    };
  }, []);

  // Google Sign-In handler
  const handleSignIn = async () => {
    try {
      setAuthErrorNotice(null);
      const user = await signInWithGoogle();
      if (user) {
        setAuthErrorNotice(null);
      }
    } catch (err: unknown) {
      console.warn('Failed to sign in with Google:', err);
      const code = (err as { code?: string })?.code;
      let msg = 'Google Sign-in could not be completed. Please try again.';
      if (code === 'auth/popup-blocked') {
        msg = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
      } else if (code === 'auth/network-request-failed') {
        msg = 'Network connection issue. Please check your internet connection.';
      } else if (code === 'auth/unauthorized-domain') {
        msg = 'This domain is pending authorization in Firebase OAuth settings.';
      }
      setAuthErrorNotice(msg);
      setTimeout(() => setAuthErrorNotice(null), 8000);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  // Toggle favorite with Firestore persistence
  const handleToggleFavorite = (pandalId: string) => {
    setPandals((prev) => {
      const next = prev.map((p) =>
        p.id === pandalId ? { ...p, isFavorite: !p.isFavorite } : p
      );
      if (currentUser) {
        setIsSyncing(true);
        saveUserPreferences(currentUser.uid, {
          visitedPandalIds: next.filter((p) => p.isVisited).map((p) => p.id),
          favoritePandalIds: next.filter((p) => p.isFavorite).map((p) => p.id),
          selectedRegion,
          targetBudget,
        })
          .catch(console.warn)
          .finally(() => setIsSyncing(false));
      }
      return next;
    });
  };

  // Toggle visited with Firestore persistence
  const handleToggleVisited = (pandalId: string) => {
    setPandals((prev) => {
      const next = prev.map((p) =>
        p.id === pandalId ? { ...p, isVisited: !p.isVisited } : p
      );
      if (currentUser) {
        setIsSyncing(true);
        saveUserPreferences(currentUser.uid, {
          visitedPandalIds: next.filter((p) => p.isVisited).map((p) => p.id),
          favoritePandalIds: next.filter((p) => p.isFavorite).map((p) => p.id),
          selectedRegion,
          targetBudget,
        })
          .catch(console.warn)
          .finally(() => setIsSyncing(false));
      }
      return next;
    });

    // Sync with squad member progress
    setSquad((prev) => ({
      ...prev,
      members: prev.members.map((m) => {
        if (m.id === 'user-me') {
          const hasVisited = m.visitedPandalIds.includes(pandalId);
          return {
            ...m,
            visitedPandalIds: hasVisited
              ? m.visitedPandalIds.filter((id) => id !== pandalId)
              : [...m.visitedPandalIds, pandalId],
          };
        }
        return m;
      }),
    }));
  };

  // Save Itinerary with Firestore persistence
  const handleSaveItinerary = (itinerary: Itinerary | null) => {
    setActiveItinerary(itinerary);
    if (itinerary && currentUser) {
      setIsSyncing(true);
      saveUserItinerary(currentUser.uid, itinerary)
        .catch(console.warn)
        .finally(() => setIsSyncing(false));
    }
  };

  // Submit community crowd report with Firestore persistence
  const handleCrowdReport = (report: Partial<CrowdReport>) => {
    if (!report.pandalId || !report.crowdLevel) return;

    const fullReport: CrowdReport = {
      id: `crowd-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      pandalId: report.pandalId,
      pandalName: report.pandalName || 'Pandal',
      crowdLevel: report.crowdLevel,
      waitTimeMinutes: report.waitTimeMinutes || 15,
      reporterName: currentUser?.displayName || report.reporterName || 'Devotee',
      comment: report.comment || '',
      timestamp: Date.now(),
      source: 'community',
    };

    // Asynchronously submit to Firestore
    if (currentUser) {
      submitCrowdReportToFirestore(fullReport, currentUser.uid).catch(console.warn);
    }

    setPandals((prev) =>
      prev.map((p) => {
        if (p.id === report.pandalId) {
          return {
            ...p,
            crowdLevel: report.crowdLevel!,
            crowdFreshnessMinutes: 1,
            crowdReportCount: p.crowdReportCount + 1,
          };
        }
        return p;
      })
    );
  };

  // Toggle location sharing consent for squad
  const handleToggleLocationSharing = (enable: boolean) => {
    setSquad((prev) => ({
      ...prev,
      members: prev.members.map((m) => {
        if (m.id === 'user-me') {
          return {
            ...m,
            isSharingLocation: enable,
            lastLocation:
              enable && userCoords
                ? {
                    lat: userCoords.lat,
                    lng: userCoords.lng,
                    updatedAt: Date.now(),
                    accuracy: userAccuracy || 20,
                  }
                : undefined,
          };
        }
        return m;
      }),
    }));

    if (enable && !userCoords) {
      requestGps();
    }
  };

  // Filtered pandals list (filtered by Region, Search, Category, Distance, Crowd, and sorted by actual distance)
  const filteredPandals = useMemo(() => {
    const refLat = userCoords ? userCoords.lat : 22.5645;
    const refLng = userCoords ? userCoords.lng : 88.3516;

    const matched = pandals.filter((p) => {
      // Region circuit filter
      if (selectedRegion !== 'ALL' && p.region !== selectedRegion) {
        return false;
      }

      // Search across name, Bengali title, neighbourhood, metro station
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBengali = p.bengaliName.toLowerCase().includes(q);
        const matchesArea = p.neighbourhood.toLowerCase().includes(q);
        const matchesMetro = p.nearestMetro.toLowerCase().includes(q);
        if (!matchesName && !matchesBengali && !matchesArea && !matchesMetro) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Max Distance from user GPS
      if (maxDistanceKm !== null && userCoords) {
        const d = calculateDistanceKm(
          userCoords.lat,
          userCoords.lng,
          p.coordinates.lat,
          p.coordinates.lng
        );
        if (d > maxDistanceKm) return false;
      }

      // Low queue crowd filter
      if (crowdFilter === 'low_queue') {
        if (p.crowdLevel !== 'low' && p.crowdLevel !== 'moderate') return false;
      }

      // Only Favorites
      if (onlyFavorites && !p.isFavorite) {
        return false;
      }

      // Only Unvisited
      if (onlyUnvisited && p.isVisited) {
        return false;
      }

      return true;
    });

    // Sort by actual distance from current user position (or central Kolkata reference point)
    return matched.sort((a, b) => {
      const distA = calculateDistanceKm(refLat, refLng, a.coordinates.lat, a.coordinates.lng);
      const distB = calculateDistanceKm(refLat, refLng, b.coordinates.lat, b.coordinates.lng);
      return distA - distB;
    });
  }, [
    pandals,
    selectedRegion,
    searchQuery,
    selectedCategory,
    maxDistanceKm,
    userCoords,
    crowdFilter,
    onlyFavorites,
    onlyUnvisited,
  ]);

  const visitedCount = pandals.filter((p) => p.isVisited).length;
  const currentMember = squad.members.find((m) => m.id === 'user-me');

  return (
    <APIProvider apiKey={apiKey} libraries={['places', 'routes', 'core', 'maps']}>
      <div className="min-h-screen bg-stone-100 flex flex-col font-sans pb-16 md:pb-0">
        {/* Google Maps Quota Defense Sticky Banner */}
        <QuotaExceededBanner />

        {/* Global Navigation Header */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isTrackingGps={isTrackingGps}
          hasGpsCoords={!!userCoords}
          onRequestGps={requestGps}
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          user={currentUser}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          isSyncing={isSyncing}
        />

        {/* Auth Error Notification Banner */}
        {authErrorNotice && (
          <div className="bg-amber-500 text-stone-950 px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-amber-600 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
              <span className="w-2 h-2 rounded-full bg-stone-900 animate-pulse flex-shrink-0" />
              <span>{authErrorNotice}</span>
            </div>
            <button
              onClick={() => setAuthErrorNotice(null)}
              className="text-stone-950 hover:text-stone-800 font-bold ml-2 text-sm px-1.5 py-0.5 rounded"
            >
              ×
            </button>
          </div>
        )}

        {/* GPS Permission / Fallback Info Banner */}
        <LocationBanner
          permissionStatus={permissionStatus}
          errorMessage={gpsErrorMessage}
          onRequestGps={requestGps}
          onSelectHub={(coords) =>
            setManualLocation(coords.lat, coords.lng, 'Esplanade Metro Nexus')
          }
        />

        {/* Main Application Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
          {/* Prominent Regional Hopping Circuit Selector */}
          <RegionSelector
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            pandals={pandals}
            userCoords={userCoords}
          />

          {/* Quick Metrics Bar on top */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white rounded-2xl p-3 border border-stone-200/80 shadow-sm text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-stone-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {visitedCount} of {pandals.length} pandals visited
                </span>
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-stone-600 hidden sm:inline">
                {activeItinerary
                  ? `Active Route: ${activeItinerary.stops.length} stops (${activeItinerary.timeBudgetHours}h)`
                  : 'No active route builder loaded'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRoutePlannerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-amber-700 text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Plan Route</span>
              </button>
              <button
                onClick={() => setIsSquadModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-bold text-xs transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Squad</span>
              </button>
            </div>
          </div>

          {/* Filter Bar with Regional Tabs & Categories */}
          <FilterBar
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            maxDistanceKm={maxDistanceKm}
            onSelectMaxDistance={setMaxDistanceKm}
            crowdFilter={crowdFilter}
            onSelectCrowdFilter={setCrowdFilter}
            onlyFavorites={onlyFavorites}
            onToggleFavorites={() => setOnlyFavorites(!onlyFavorites)}
            onlyUnvisited={onlyUnvisited}
            onToggleUnvisited={() => setOnlyUnvisited(!onlyUnvisited)}
            totalCount={filteredPandals.length}
          />

          {/* Tab Views */}
          {activeTab === 'map' && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[560px]">
              {/* Interactive Google Map (Dominates viewport) */}
              <div className="lg:col-span-8 h-[60vh] lg:h-[72vh] min-h-[420px]">
                <MapContainer
                  pandals={filteredPandals}
                  userCoords={userCoords}
                  userAccuracy={userAccuracy}
                  lastGpsUpdate={lastGpsUpdate}
                  isTrackingGps={isTrackingGps}
                  selectedPandal={selectedPandal}
                  selectedRegion={selectedRegion}
                  onSelectPandal={setSelectedPandal}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleVisited={handleToggleVisited}
                  onOpenReportCrowd={(p) => setReportingPandal(p)}
                  onOpenDetails={(p) => setDetailedPandal(p)}
                  activeItinerary={activeItinerary}
                  squadMembers={squad.members}
                  onRequestGps={requestGps}
                />
              </div>

              {/* Side Card Drawer / Nearby Pandals */}
              <div className="lg:col-span-4 flex flex-col gap-3 h-full max-h-[72vh] overflow-hidden">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-serif font-black text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-red-700" />
                    <span>
                      Nearby{' '}
                      {selectedRegion === 'ALL'
                        ? 'All Kolkata'
                        : selectedRegion === 'NORTH'
                        ? 'North Kolkata'
                        : selectedRegion === 'CENTRAL'
                        ? 'Central Kolkata'
                        : 'South Kolkata'}
                    </span>
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    {filteredPandals.length} pandals
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {filteredPandals.map((pandal) => (
                    <PandalCard
                      key={pandal.id}
                      pandal={pandal}
                      userCoords={userCoords}
                      onSelect={(p) => setSelectedPandal(p)}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleVisited={handleToggleVisited}
                      onOpenDetails={(p) => setDetailedPandal(p)}
                      onOpenReportCrowd={(p) => setReportingPandal(p)}
                      isInRoute={activeItinerary?.stops.some(
                        (s) => s.pandalId === pandal.id
                      )}
                      stopOrder={
                        activeItinerary?.stops.find(
                          (s) => s.pandalId === pandal.id
                        )?.order
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPandals.map((pandal) => (
                  <PandalCard
                    key={pandal.id}
                    pandal={pandal}
                    userCoords={userCoords}
                    onSelect={(p) => {
                      setSelectedPandal(p);
                      setActiveTab('map');
                    }}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleVisited={handleToggleVisited}
                    onOpenDetails={(p) => setDetailedPandal(p)}
                    onOpenReportCrowd={(p) => setReportingPandal(p)}
                    isInRoute={activeItinerary?.stops.some(
                      (s) => s.pandalId === pandal.id
                    )}
                    stopOrder={
                      activeItinerary?.stops.find(
                        (s) => s.pandalId === pandal.id
                      )?.order
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              {activeItinerary ? (
                <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-serif font-black text-stone-900 text-xl">
                        {activeItinerary.title}
                      </h2>
                      <p className="text-xs text-stone-500">
                        Starting from {activeItinerary.startPoint.name} •{' '}
                        {activeItinerary.totalDistanceKm} km total
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsRoutePlannerOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow transition-colors"
                      >
                        Adjust Stops
                      </button>
                      <button
                        onClick={() => setActiveTab('map')}
                        className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs hover:bg-amber-100 transition-colors"
                      >
                        View on Map
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeItinerary.stops.map((stop) => (
                      <div
                        key={stop.pandalId}
                        className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-red-700 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                            {stop.order}
                          </span>
                          <div>
                            <h4 className="font-bold text-stone-900 text-sm">
                              {stop.pandal.name}
                            </h4>
                            <span className="text-[11px] text-stone-500">
                              ETA {stop.estimatedArrival} • ~
                              {stop.visitDurationMinutes}m visit •{' '}
                              <span className="capitalize text-red-700">
                                {stop.pandal.crowdLevel.replace('_', ' ')} queue
                              </span>
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleVisited(stop.pandalId)}
                          className={`p-2 rounded-xl border text-xs font-semibold ${
                            stop.pandal.isVisited
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-white text-stone-600 border-stone-200'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              stop.pandal.isVisited
                                ? 'text-emerald-600'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto">
                    <Route className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-black text-stone-900 text-lg">
                    No Itinerary Planned Yet
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Create an optimized pandal tour based on your available time,
                    live queues, and preferred styles (Bonedi Bari, Sabeki, or Art
                    Theme).
                  </p>
                  <button
                    onClick={() => setIsRoutePlannerOpen(true)}
                    className="px-5 py-2.5 bg-red-700 text-white font-bold text-xs rounded-xl shadow-md hover:bg-red-800 transition-colors"
                  >
                    Build My Puja Itinerary
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'squad' && (() => {
            const squadLeader =
              squad.members.find(
                (m) => m.id === (squad.leaderId || squad.members[0]?.id)
              ) || squad.members[0];

            return (
              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
                {/* Header & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif font-black text-stone-900 text-xl">
                        {squad.name}
                      </h2>
                      <span className="bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {squad.members.length} Hoppers
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Passcode: <strong className="font-mono text-stone-800">{squad.code}</strong> • Meeting Point: {squad.meetingPoint}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsSquadEditMode(true);
                        setIsSquadModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Squad & Leader</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsSquadEditMode(false);
                        setIsSquadModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-stone-800 transition-colors"
                    >
                      Live GPS & SOS
                    </button>
                  </div>
                </div>

                {/* Squad Leader Banner */}
                <div className="bg-gradient-to-br from-amber-500/15 via-amber-400/10 to-orange-500/10 border-2 border-amber-400/70 p-4 rounded-2xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-stone-950 font-black flex items-center justify-center text-lg shadow-sm ring-2 ring-amber-300">
                      <Crown className="w-6 h-6 text-stone-950 fill-stone-950" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-900 font-black uppercase tracking-wider block">
                        👑 Designated Squad Leader
                      </span>
                      <h3 className="font-serif font-black text-base text-stone-900">
                        {squadLeader?.name}{' '}
                        {squadLeader?.id === 'user-me' && (
                          <span className="text-xs font-normal text-stone-600">(You)</span>
                        )}
                      </h3>
                      <p className="text-[11px] text-stone-600">
                        Directs rendezvous points, manages hopping pace, and keeps everyone together
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsSquadEditMode(true);
                      setIsSquadModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-amber-300 text-amber-950 text-xs font-bold transition-colors shadow-xs flex items-center gap-1"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>Change Leader</span>
                  </button>
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {squad.members.map((member) => {
                    const isLeader = member.id === squadLeader?.id;
                    const isMe = member.id === 'user-me';

                    return (
                      <div
                        key={member.id}
                        className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                          isLeader
                            ? 'bg-amber-50/60 border-amber-300/90 shadow-xs'
                            : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm ${
                                isLeader
                                  ? 'bg-amber-500 text-stone-950 font-black ring-2 ring-amber-400'
                                  : 'bg-gradient-to-tr from-red-600 to-amber-600 text-white'
                              }`}
                            >
                              {member.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-stone-900 text-sm">
                                  {member.name}
                                </h4>
                                {isMe && (
                                  <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-medium">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-stone-500">
                                {member.visitedPandalIds.length} pandals completed
                              </span>
                            </div>
                          </div>

                          {isLeader && (
                            <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Crown className="w-2.5 h-2.5 fill-current" />
                              Leader
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                          <div>
                            {member.isSharingLocation ? (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
                                📍 Live GPS On
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full inline-block">
                                Location Paused
                              </span>
                            )}
                          </div>

                          {!isLeader && (
                            <button
                              onClick={() => {
                                setSquad((prev) => ({
                                  ...prev,
                                  leaderId: member.id,
                                  members: prev.members.map((m) => ({
                                    ...m,
                                    role: m.id === member.id ? 'leader' : 'member',
                                  })),
                                }));
                              }}
                              className="text-[10px] font-bold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-0.5"
                            >
                              <Crown className="w-2.5 h-2.5 text-amber-600" />
                              <span>Make Leader</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Member Card Shortcut */}
                  <button
                    onClick={() => {
                      setIsSquadEditMode(true);
                      setIsSquadModalOpen(true);
                    }}
                    className="p-4 rounded-2xl border-2 border-dashed border-stone-300 hover:border-red-400 bg-stone-50/50 hover:bg-red-50/30 flex flex-col items-center justify-center gap-1.5 text-stone-600 hover:text-red-700 transition-all min-h-[110px]"
                  >
                    <UserPlus className="w-5 h-5 text-red-600" />
                    <span className="text-xs font-bold">+ Add Friends to Squad</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {activeTab === 'budget' && (
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-black text-stone-900 text-xl">
                    Hopper Budget & Expense Splitter
                  </h2>
                  <p className="text-xs text-stone-500">
                    Target: ₹{targetBudget}/person • {expenses.length} expenses logged
                  </p>
                </div>
                <button
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="px-4 py-2 bg-red-700 text-white font-bold text-xs rounded-xl shadow hover:bg-red-800 transition-colors"
                >
                  Manage Budget
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs text-amber-900/80 block">Total Spend</span>
                  <span className="font-extrabold text-2xl text-stone-900">
                    ₹{expenses.reduce((sum, e) => sum + e.amount, 0)}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs text-stone-600 block">Per-Person Split</span>
                  <span className="font-extrabold text-2xl text-stone-900">
                    ₹{Math.round(expenses.reduce((sum, e) => sum + e.amount, 0) / Math.max(1, squad.members.length))}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs text-emerald-900/80 block">Remaining Goal</span>
                  <span className="font-extrabold text-2xl text-emerald-800">
                    ₹{Math.max(0, targetBudget - Math.round(expenses.reduce((sum, e) => sum + e.amount, 0) / Math.max(1, squad.members.length)))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Mobile Fixed Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          itineraryStopCount={activeItinerary?.stops.length}
        />

        {/* Modals */}
        <PandalDetailModal
          pandal={detailedPandal}
          onClose={() => setDetailedPandal(null)}
          userCoords={userCoords}
          onToggleFavorite={handleToggleFavorite}
          onToggleVisited={handleToggleVisited}
          onOpenReportCrowd={(p) => setReportingPandal(p)}
        />

        <RoutePlannerModal
          isOpen={isRoutePlannerOpen}
          onClose={() => setIsRoutePlannerOpen(false)}
          allPandals={pandals}
          userCoords={userCoords}
          activeItinerary={activeItinerary}
          onSaveItinerary={handleSaveItinerary}
          onToggleVisited={handleToggleVisited}
          onSelectPandalOnMap={(p) => {
            setSelectedPandal(p);
            setActiveTab('map');
            setIsRoutePlannerOpen(false);
          }}
        />

        <CrowdReportModal
          pandal={reportingPandal}
          onClose={() => setReportingPandal(null)}
          onSubmitReport={handleCrowdReport}
        />

        <SquadModal
          isOpen={isSquadModalOpen}
          onClose={() => {
            setIsSquadModalOpen(false);
            setIsSquadEditMode(false);
          }}
          squad={squad}
          currentUserId="user-me"
          isSharingLocation={currentMember?.isSharingLocation || false}
          onToggleLocationSharing={handleToggleLocationSharing}
          onUpdateSquad={(updated) => setSquad(updated)}
          allPandals={pandals}
          defaultToEdit={isSquadEditMode}
        />

        <BudgetTrackerModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          expenses={expenses}
          onAddExpense={(exp) =>
            setExpenses((prev) => [
              ...prev,
              { ...exp, id: `exp-${Date.now()}`, timestamp: Date.now() },
            ])
          }
          onDeleteExpense={(id) =>
            setExpenses((prev) => prev.filter((e) => e.id !== id))
          }
          targetBudgetPerHead={targetBudget}
          onUpdateTargetBudget={setTargetBudget}
          squadMembers={squad.members}
        />

        <EmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
        />
      </div>
    </APIProvider>
  );
}
