export type CrowdLevel = 'low' | 'moderate' | 'high' | 'very_high' | 'unknown';

export type PandalCategory = 'heritage' | 'traditional' | 'theme' | 'famous';

export type TransportMode = 'WALKING' | 'TRANSIT' | 'DRIVING';

export type Region = 'NORTH' | 'CENTRAL' | 'SOUTH';

export type RegionFilter = 'ALL' | 'NORTH' | 'CENTRAL' | 'SOUTH';

export interface Pandal {
  id: string;
  name: string;
  bengaliName: string;
  region: Region;
  address: string;
  neighbourhood: string;
  nearestMetro: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  category: PandalCategory;
  yearEstablished: number;
  photoUrl: string;
  sourceUrl: string;
  festivalInfo: {
    timings: string;
    pushpanjaliTime: string;
    sandhiPujaTime: string;
    bhogDistribution: string;
    bestTimeToVisit: string;
  };
  accessibility: {
    wheelchairAccessible: boolean;
    seniorCitizenLane: boolean;
    vipPassAccepted: boolean;
    nearestDropOff: string;
  };
  crowdLevel: CrowdLevel;
  crowdFreshnessMinutes: number;
  crowdReportCount: number;
  rating: number;
  reviewCount: number;
  isFavorite?: boolean;
  isVisited?: boolean;
}

export interface CrowdReport {
  id: string;
  pandalId: string;
  pandalName: string;
  crowdLevel: CrowdLevel;
  waitTimeMinutes: number;
  reporterName: string;
  comment: string;
  timestamp: number;
  source: 'community' | 'official';
}

export interface ItineraryStop {
  pandalId: string;
  order: number;
  estimatedArrival: string;
  visitDurationMinutes: number;
  travelTimeMinutes: number;
  travelDistanceKm: number;
  completed: boolean;
  pandal: Pandal;
}

export interface Itinerary {
  id: string;
  title: string;
  regionScope?: RegionFilter;
  startPoint: {
    name: string;
    lat: number;
    lng: number;
  };
  endPoint: {
    name: string;
    lat: number;
    lng: number;
  };
  timeBudgetHours: number;
  budgetPerPerson: number;
  transportMode: TransportMode;
  preferredCategories: PandalCategory[];
  stops: ItineraryStop[];
  totalDistanceKm: number;
  totalTimeMinutes: number;
  isRealistic: boolean;
  warningMessage?: string;
  createdAt: number;
}

export interface SquadMember {
  id: string;
  name: string;
  avatar: string;
  role?: 'leader' | 'member';
  isSharingLocation: boolean;
  lastLocation?: {
    lat: number;
    lng: number;
    updatedAt: number;
    accuracy: number;
  };
  visitedPandalIds: string[];
}

export interface SquadGroup {
  id: string;
  code: string;
  name: string;
  leaderId: string;
  meetingPoint: string;
  emergencyContact: string;
  members: SquadMember[];
  sharedItineraryId?: string;
}

export type ExpenseCategory =
  | 'metro_train'
  | 'taxi_auto'
  | 'food_bhog'
  | 'pass_vip'
  | 'emergency'
  | 'other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paidByMemberId: string;
  paidByName: string;
  splitWithMemberIds: string[];
  timestamp: number;
}

export interface UserLocationState {
  coords: { lat: number; lng: number } | null;
  accuracy: number | null;
  lastUpdated: number | null;
  isTracking: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unavailable' | 'timeout';
  errorMessage?: string;
}

export interface HubLocation {
  name: string;
  description: string;
  coords: { lat: number; lng: number };
  region?: Region;
}
