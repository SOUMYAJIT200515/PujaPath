import React from 'react';
import { Map, Compass, Route, Users, Wallet } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'map' | 'explore' | 'itinerary' | 'squad' | 'budget';
  onSelectTab: (tab: 'map' | 'explore' | 'itinerary' | 'squad' | 'budget') => void;
  itineraryStopCount?: number;
}

interface NavItem {
  id: 'map' | 'explore' | 'itinerary' | 'squad' | 'budget';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  itineraryStopCount = 0,
}) => {
  const navItems: NavItem[] = [
    { id: 'map', label: 'Map', icon: Map },
    { id: 'explore', label: 'Explore', icon: Compass },
    {
      id: 'itinerary',
      label: 'Itinerary',
      icon: Route,
      badge: itineraryStopCount > 0 ? itineraryStopCount : null,
    },
    { id: 'squad', label: 'Squad', icon: Users },
    { id: 'budget', label: 'Budget', icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-900/15 py-1.5 px-3 md:hidden shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-red-700 font-bold scale-105'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
