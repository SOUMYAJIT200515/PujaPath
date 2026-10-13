import React, { useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  Compass,
  MapPin,
  Sparkles,
  Users,
  Wallet,
  PhoneCall,
  Search,
  Filter,
  LogIn,
  LogOut,
  Cloud,
  CheckCircle2,
  Check,
  User as UserIcon,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'explore' | 'itinerary' | 'squad' | 'budget';
  onSelectTab: (tab: 'map' | 'explore' | 'itinerary' | 'squad' | 'budget') => void;
  isTrackingGps: boolean;
  hasGpsCoords: boolean;
  onRequestGps: () => void;
  onOpenEmergencyModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: FirebaseUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isSyncing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  isTrackingGps,
  hasGpsCoords,
  onRequestGps,
  onOpenEmergencyModal,
  searchQuery,
  onSearchChange,
  user,
  onSignIn,
  onSignOut,
  isSyncing = false,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/15 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab('map')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-amber-700 text-white flex items-center justify-center shadow-md shadow-red-900/20 group-hover:scale-105 transition-transform">
              <span className="font-serif text-xl font-bold tracking-tight">প</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-extrabold text-stone-900 text-lg tracking-wide">
                  PujaPath
                </span>
                <span className="text-[10px] bg-red-100 text-red-800 font-semibold px-1.5 py-0.5 rounded-full border border-red-200">
                  All Kolkata Circuit
                </span>
              </div>
              <p className="text-[11px] text-amber-900/80 font-medium">
                North • Central • South • সমগ্র কলকাতা পূজাপথ
              </p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Bagbazar, Sovabazar, Kumartuli, Metro..."
                className="w-full pl-9 pr-3 py-1.5 bg-stone-100/80 focus:bg-white border border-stone-200 focus:border-red-600 rounded-xl text-xs text-stone-900 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Action Header Tools */}
          <div className="flex items-center gap-2">
            {/* GPS Toggle Pill */}
            <button
              onClick={onRequestGps}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                hasGpsCoords
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title="Toggle Live GPS"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  hasGpsCoords ? 'bg-blue-600 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="hidden sm:inline">
                {hasGpsCoords ? 'GPS Live' : 'Locate Me'}
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => onSelectTab('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'map'
                    ? 'bg-red-700 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => onSelectTab('explore')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'explore'
                    ? 'bg-red-700 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                Pandals
              </button>
              <button
                onClick={() => onSelectTab('itinerary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'itinerary'
                    ? 'bg-red-700 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                Route Planner
              </button>
              <button
                onClick={() => onSelectTab('squad')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'squad'
                    ? 'bg-red-700 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                Puja Squad
              </button>
              <button
                onClick={() => onSelectTab('budget')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'budget'
                    ? 'bg-red-700 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                Budget
              </button>
            </nav>

            {/* Emergency Hotline Button */}
            <button
              onClick={onOpenEmergencyModal}
              className="p-2 rounded-xl text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
              title="Police & Medical Emergency Helplines"
            >
              <PhoneCall className="w-4 h-4" />
            </button>

            {/* Google Authentication & Firebase Cloud Sync */}
            <div className="relative">
              {user ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-all text-left"
                    title="Google Account & Cloud Sync"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-7 h-7 rounded-full object-cover border border-amber-600/40"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-600 to-amber-600 text-white flex items-center justify-center font-bold text-xs">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="hidden sm:block">
                      <div className="text-[11px] font-bold text-stone-900 leading-tight max-w-[90px] truncate">
                        {user.displayName?.split(' ')[0] || 'Hopper'}
                      </div>
                      <div className="text-[9px] flex items-center gap-1 text-emerald-700 font-medium">
                        <Cloud className={`w-2.5 h-2.5 ${isSyncing ? 'animate-bounce text-amber-600' : 'text-emerald-600'}`} />
                        <span>{isSyncing ? 'Syncing...' : 'Synced'}</span>
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-100">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-amber-500/50"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-sm">
                            {user.displayName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {user.displayName || 'Devotee'}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="py-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px] px-2 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
                          <span className="flex items-center gap-1.5">
                            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Firestore Cloud Sync</span>
                          </span>
                          <span className="text-[10px] font-semibold bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full">
                            Active
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 px-2 leading-relaxed">
                          Your favorites, visited pandals, crowd reports, and routes are securely backed up to Firebase Firestore.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onSignOut();
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onSignIn}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:shadow transition-all group"
                  title="Sign in with Google to sync your itinerary and pandal visits"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Google Sign In</span>
                  <span className="sm:hidden">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 md:hidden">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search North Kolkata pandals..."
              className="w-full pl-8 pr-3 py-1.5 bg-stone-100/90 border border-stone-200 focus:border-red-600 rounded-xl text-xs text-stone-900 outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
