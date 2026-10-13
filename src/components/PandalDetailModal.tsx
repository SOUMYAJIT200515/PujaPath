import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Pandal } from '../types';
import {
  X,
  Navigation,
  CheckCircle2,
  Clock,
  Accessibility,
  Info,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Camera,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Coffee,
  Heart,
  Landmark,
  Palette,
  BookOpen,
} from 'lucide-react';
import {
  getGoogleMapsNavigationUrl,
  calculateDistanceKm,
  formatDistance,
  estimateTravelTimeMinutes,
  formatDuration,
} from '../utils/geoUtils';
import {
  getPandalGalleryImages,
  PandalGalleryImage,
} from '../data/pandalGalleryData';
import {
  getPandalFoodRecommendations,
  FoodRecommendation,
} from '../data/pandalFoodData';
import {
  getPandalCulturalHighlight,
  PandalCulturalHighlight,
} from '../data/pandalCulturalData';

interface PandalDetailModalProps {
  pandal: Pandal | null;
  onClose: () => void;
  userCoords: { lat: number; lng: number } | null;
  onToggleFavorite: (id: string) => void;
  onToggleVisited: (id: string) => void;
  onOpenReportCrowd: (pandal: Pandal) => void;
}

export const PandalDetailModal: React.FC<PandalDetailModalProps> = ({
  pandal,
  onClose,
  userCoords,
  onToggleFavorite,
  onToggleVisited,
  onOpenReportCrowd,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>('ALL');
  const [culturalTab, setCulturalTab] = useState<'all' | 'history' | 'theme' | 'art'>('all');
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  // Fetch cultural highlights dynamically based on Pandal ID
  const culturalHighlight = useMemo(() => {
    if (!pandal) return null;
    return getPandalCulturalHighlight(pandal.id, pandal.name, pandal.region);
  }, [pandal?.id, pandal?.name, pandal?.region]);

  // Fetch gallery images and food recommendations dynamically based on Pandal ID
  const galleryImages = useMemo(() => {
    if (!pandal) return [];
    return getPandalGalleryImages(pandal.id, pandal.region);
  }, [pandal?.id, pandal?.region]);

  const foodRecommendations = useMemo(() => {
    if (!pandal) return [];
    return getPandalFoodRecommendations(pandal.id, pandal.region);
  }, [pandal?.id, pandal?.region]);

  // Keyboard navigation for photo lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null && prev < galleryImages.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : galleryImages.length - 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, galleryImages.length]);

  if (!pandal) return null;

  const distanceKm = userCoords
    ? calculateDistanceKm(
        userCoords.lat,
        userCoords.lng,
        pandal.coordinates.lat,
        pandal.coordinates.lng
      )
    : null;

  const walkingMinutes =
    distanceKm !== null
      ? estimateTravelTimeMinutes(distanceKm, 'WALKING')
      : null;

  const scrollGallery = (direction: 'left' | 'right') => {
    if (!galleryScrollRef.current) return;
    const scrollAmount = 300;
    galleryScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const filteredFood =
    selectedFoodCategory === 'ALL'
      ? foodRecommendations
      : foodRecommendations.filter(
          (food) => food.category === selectedFoodCategory
        );

  const foodCategories = [
    { label: 'All Eats', value: 'ALL' },
    { label: 'Kolkata Rolls & Savories', value: 'Kolkata Rolls & Savories' },
    { label: 'Iconic Sweets & Mishti', value: 'Iconic Mishti & Sweets' },
    { label: 'Heritage Cabins & Mughlai', value: 'Heritage Cabins & Mughlai' },
    { label: 'Puja Special & Street Food', value: 'Puja Special & Street Food' },
    { label: 'Traditional Tea & Telebhaja', value: 'Traditional Tea & Telebhaja' },
  ].filter((cat) =>
    cat.value === 'ALL'
      ? true
      : foodRecommendations.some((f) => f.category === cat.value)
  );

  return (
    <>
      <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
        <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Modal Header Image */}
          <div className="relative h-48 sm:h-56 w-full bg-stone-900 flex-shrink-0">
            <img
              src={pandal.photoUrl}
              alt={pandal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

            {/* Close Button & Favorite */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(pandal.id)}
                className={`p-2 rounded-full backdrop-blur-md shadow transition-colors ${
                  pandal.isFavorite
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-stone-900/60 text-white hover:bg-stone-900'
                }`}
                title={pandal.isFavorite ? 'Saved to favorites' : 'Add to favorites'}
              >
                <Heart
                  className={`w-4 h-4 ${pandal.isFavorite ? 'fill-current' : ''}`}
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-stone-900/60 backdrop-blur-md text-white hover:bg-stone-900 shadow transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-amber-400 text-stone-950 text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                {pandal.region} KOLKATA
              </span>
              <span className="bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm capitalize">
                {pandal.category} Puja
              </span>
              <span className="bg-white/90 backdrop-blur-md text-stone-900 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                Est. {pandal.yearEstablished}
              </span>
            </div>

            {/* Title Area */}
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <h2 className="font-serif font-black text-lg sm:text-xl leading-tight">
                {pandal.name}
              </h2>
              <p className="text-xs sm:text-sm text-amber-200 font-medium">
                {pandal.bengaliName}
              </p>
            </div>
          </div>

          {/* Modal Scrollable Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            {/* Quick Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-amber-50/80 border border-amber-200/80 p-2.5 rounded-xl">
                <span className="text-stone-500 text-[10px] block">Location</span>
                <span className="font-semibold text-stone-900 block truncate">
                  {pandal.neighbourhood}
                </span>
                <span className="text-[11px] text-stone-600 truncate block">
                  {pandal.nearestMetro}
                </span>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl">
                <span className="text-stone-500 text-[10px] block">
                  Live Crowd Status
                </span>
                <span className="font-semibold text-red-700 capitalize block">
                  {pandal.crowdLevel.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-stone-400">
                  {pandal.crowdFreshnessMinutes}m ago • {pandal.crowdReportCount} reports
                </span>
              </div>

              {distanceKm !== null && (
                <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-stone-500 text-[10px] block">
                    From Your GPS
                  </span>
                  <span className="font-semibold text-stone-900 block">
                    {formatDistance(distanceKm)}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    ~{formatDuration(walkingMinutes!)} walk
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="font-serif font-bold text-stone-900 text-sm mb-1.5 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-red-700" />
                <span>Heritage & Story</span>
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {pandal.description}
              </p>
            </div>

            {/* ========================================================= */}
            {/* 1. HORIZONTAL SCROLLING PHOTO GALLERY (BY PANDAL ID) */}
            {/* ========================================================= */}
            <div className="bg-stone-900 text-white rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-red-700/80 text-amber-300">
                    <Camera className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                      <span>Pandal Photo Gallery</span>
                      <span className="text-[10px] bg-red-700/90 text-amber-200 px-2 py-0.5 rounded-full font-sans font-semibold">
                        {galleryImages.length} Photos
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      High-resolution darshan of idol, architecture, and night illumination
                    </p>
                  </div>
                </div>

                {/* Left / Right Scroll Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scrollGallery('left')}
                    className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                    title="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollGallery('right')}
                    className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                    title="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Strip */}
              <div
                ref={galleryScrollRef}
                className="flex gap-3 overflow-x-auto pb-2 scroll-smooth scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent snap-x"
                style={{ scrollbarWidth: 'thin' }}
              >
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    onClick={() => setLightboxIndex(index)}
                    className="relative flex-shrink-0 w-48 sm:w-56 h-36 rounded-xl overflow-hidden cursor-pointer group snap-start border border-stone-800 bg-stone-950 hover:border-amber-400/60 transition-all transform hover:-translate-y-0.5 shadow-md"
                  >
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />

                    {/* Tag Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-stone-950/80 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {image.tag}
                      </span>
                    </div>

                    {/* Expand icon on hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/80 p-1 rounded-full text-white">
                      <Maximize2 className="w-3 h-3" />
                    </div>

                    {/* Caption Preview */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 text-left">
                      <p className="text-[11px] font-medium text-stone-200 line-clamp-2 leading-tight">
                        {image.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1 border-t border-stone-800/80">
                <span>💡 Click any photo for full-screen photo darshan</span>
                <span className="font-mono text-amber-400/80">
                  ID: {pandal.id}
                </span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* CULTURAL & HISTORICAL HIGHLIGHTS (FETCHED BY PANDAL ID) */}
            {/* ========================================================= */}
            {culturalHighlight && (
              <div className="rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-50/70 via-rose-50/40 to-amber-50/60 p-4 space-y-3.5 shadow-xs">
                {/* Section Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-red-700 text-amber-200 shadow-xs">
                      <Landmark className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                        <span>Cultural & Historical Highlights</span>
                        <span className="text-[10px] bg-red-100 text-red-900 font-sans font-bold px-2 py-0.5 rounded-full border border-red-200">
                          {culturalHighlight.significanceBadge}
                        </span>
                      </h4>
                      <p className="text-[11px] font-medium text-stone-600">
                        {culturalHighlight.bengaliTag}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-stone-400 bg-white/80 px-2 py-0.5 rounded-md border border-stone-200 hidden sm:inline-block">
                    {pandal.id}
                  </span>
                </div>

                {/* Cultural Navigation Tabs */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-red-200/60 text-[11px]">
                  <button
                    onClick={() => setCulturalTab('all')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                      culturalTab === 'all'
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-white/80 text-stone-700 hover:bg-red-100/60'
                    }`}
                  >
                    All Context
                  </button>
                  <button
                    onClick={() => setCulturalTab('history')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap flex items-center gap-1 ${
                      culturalTab === 'history'
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-white/80 text-stone-700 hover:bg-red-100/60'
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>History</span>
                  </button>
                  <button
                    onClick={() => setCulturalTab('theme')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap flex items-center gap-1 ${
                      culturalTab === 'theme'
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-white/80 text-stone-700 hover:bg-red-100/60'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Theme</span>
                  </button>
                  <button
                    onClick={() => setCulturalTab('art')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap flex items-center gap-1 ${
                      culturalTab === 'art'
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-white/80 text-stone-700 hover:bg-red-100/60'
                    }`}
                  >
                    <Palette className="w-3 h-3" />
                    <span>Artistic Style</span>
                  </button>
                </div>

                {/* Content Cards */}
                <div className="space-y-3 text-xs">
                  {/* 1. HISTORY SECTION */}
                  {(culturalTab === 'all' || culturalTab === 'history') && (
                    <div className="bg-white/95 rounded-xl border border-red-200/70 p-3 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>History & Foundations</span>
                        </span>
                        {culturalHighlight.history.foundingYear && (
                          <span className="text-[10px] bg-red-50 text-red-800 font-bold px-2 py-0.5 rounded-full border border-red-200">
                            Est. {culturalHighlight.history.foundingYear}
                          </span>
                        )}
                      </div>

                      <p className="text-stone-800 leading-relaxed text-[11px] sm:text-xs">
                        {culturalHighlight.history.originStory}
                      </p>

                      <div className="bg-amber-50/70 rounded-lg p-2 border border-amber-100 text-[11px] text-stone-800 space-y-1">
                        <div>
                          <span className="font-bold text-amber-950">
                            📜 Historical Milestone:{' '}
                          </span>
                          <span>{culturalHighlight.history.historicalMilestone}</span>
                        </div>
                        {culturalHighlight.history.prominentFiguresOrLineage && (
                          <div>
                            <span className="font-bold text-amber-950">
                              👥 Patronage & Lineage:{' '}
                            </span>
                            <span>
                              {culturalHighlight.history.prominentFiguresOrLineage}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. THEME SECTION */}
                  {(culturalTab === 'all' || culturalTab === 'theme') && (
                    <div className="bg-white/95 rounded-xl border border-amber-200/70 p-3 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pandal Theme & Concept</span>
                        </span>
                        <span className="text-[11px] font-serif font-bold text-stone-900">
                          {culturalHighlight.theme.conceptName}
                        </span>
                      </div>

                      <p className="text-stone-800 leading-relaxed text-[11px] sm:text-xs">
                        {culturalHighlight.theme.conceptDescription}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                          <span className="font-bold text-amber-900 block mb-0.5">
                            🕊️ Spiritual / Social Concept:
                          </span>
                          <span className="text-stone-700">
                            {culturalHighlight.theme.socialOrSpiritualMessage}
                          </span>
                        </div>
                        <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                          <span className="font-bold text-stone-800 block mb-0.5">
                            🏛️ Architectural Inspiration:
                          </span>
                          <span className="text-stone-700">
                            {culturalHighlight.theme.architecturalInspiration}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. ARTISTIC STYLE SECTION */}
                  {(culturalTab === 'all' || culturalTab === 'art') && (
                    <div className="bg-white/95 rounded-xl border border-rose-200/70 p-3 space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider flex items-center gap-1">
                          <Palette className="w-3.5 h-3.5" />
                          <span>Artistic Style & Craftsmanship</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-stone-500 text-[10px] block">
                            Sculptural Pratima Style
                          </span>
                          <span className="font-bold text-stone-900 block">
                            {culturalHighlight.artisticStyle.sculptureStyle}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500 text-[10px] block">
                            Master Artisan / Studio
                          </span>
                          <span className="font-semibold text-stone-800 block">
                            {culturalHighlight.artisticStyle.artisanOrStudio}
                          </span>
                        </div>
                      </div>

                      {/* Primary Materials */}
                      <div>
                        <span className="text-stone-500 text-[10px] block mb-1">
                          Craft Materials Used:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {culturalHighlight.artisticStyle.primaryMaterials.map((mat) => (
                            <span
                              key={mat}
                              className="text-[10px] bg-stone-100 text-stone-800 font-medium px-2 py-0.5 rounded-md border border-stone-200"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-rose-50/50 rounded-lg p-2 border border-rose-100 text-[11px] space-y-1">
                        <div>
                          <span className="font-bold text-rose-950">
                            💡 Illumination Technique:{' '}
                          </span>
                          <span className="text-stone-800">
                            {culturalHighlight.artisticStyle.lightingTechnique}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-rose-950">
                            👁️ Signature Visual Element:{' '}
                          </span>
                          <span className="text-stone-800">
                            {culturalHighlight.artisticStyle.signatureVisualElement}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cultural Rituals & Secrets */}
                  {culturalHighlight.culturalRituals.length > 0 && (
                    <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-200/60 text-[11px] space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                        🪔 Sacred Traditions & Rituals
                      </span>
                      <ul className="space-y-1 text-stone-700">
                        {culturalHighlight.culturalRituals.map((ritual, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-red-700 font-bold leading-tight mt-0.5">
                              •
                            </span>
                            <span>{ritual}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-1.5 border-t border-amber-200/60 text-stone-800">
                        <span className="font-bold text-red-900">
                          🧭 Hopper Secret:{' '}
                        </span>
                        <span>{culturalHighlight.hopperSecret}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 2. FOOD RECOMMENDATIONS (NEARBY DELICACIES & STREET STALLS) */}
            {/* ========================================================= */}
            <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-yellow-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-600 text-white shadow-xs">
                    <Utensils className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>Recommended Local Eats</span>
                      <span className="text-[10px] bg-amber-200/80 text-amber-950 font-sans font-bold px-2 py-0.5 rounded-full">
                        ভোজন রসিক
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-600">
                      Popular street food spots, iconic cabins & sweet stalls near this pandal
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              {foodCategories.length > 2 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {foodCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedFoodCategory(cat.value)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                        selectedFoodCategory === cat.value
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'bg-white/90 text-stone-700 border border-amber-200/70 hover:bg-amber-100/60'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Food Items List */}
              <div className="space-y-2.5">
                {filteredFood.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/95 rounded-xl border border-amber-200/70 p-3 shadow-xs hover:border-amber-400 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="font-serif font-bold text-stone-900 text-xs sm:text-sm">
                            {item.outletName}
                          </h5>
                          {item.bengaliName && (
                            <span className="text-[11px] text-amber-900/80 font-medium">
                              ({item.bengaliName})
                            </span>
                          )}
                        </div>
                        {item.highlightBadge && (
                          <span className="inline-block mt-0.5 text-[9px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.2 rounded-full">
                            {item.highlightBadge}
                          </span>
                        )}
                      </div>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          item.googleMapsQuery
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
                        title="Find on Google Maps"
                      >
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Must-try dish highlight */}
                    <div className="bg-amber-50/70 rounded-lg p-2 border border-amber-100 flex items-start gap-1.5 text-xs">
                      <span className="font-bold text-amber-900 flex-shrink-0">
                        ⭐ Must-Try:
                      </span>
                      <span className="text-stone-900 font-semibold">
                        {item.signatureItem}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-snug">
                      {item.description}
                    </p>

                    {/* Meta info tags */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1.5 border-t border-stone-100 text-[10px]">
                      <div className="text-stone-600">
                        <span className="font-medium text-stone-500">Distance: </span>
                        <span className="font-semibold text-stone-900">
                          {item.formattedDistance}
                        </span>
                      </div>
                      <div className="text-stone-600">
                        <span className="font-medium text-stone-500">Cost: </span>
                        <span className="font-semibold text-stone-900">
                          {item.priceForTwo}
                        </span>
                      </div>
                      <div className="text-stone-600 col-span-2 sm:col-span-1 truncate">
                        <span className="font-medium text-stone-500">Hours: </span>
                        <span className="font-semibold text-emerald-800">
                          {item.pujaHours}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Festival Schedule & Timings */}
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-3.5 space-y-2">
              <h4 className="font-serif font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Puja Schedule & Darshan Timings</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-500 block text-[10px]">
                    Pandal Open Hours
                  </span>
                  <span className="font-medium text-stone-800">
                    {pandal.festivalInfo.timings}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">
                    Pushpanjali Timing
                  </span>
                  <span className="font-medium text-stone-800">
                    {pandal.festivalInfo.pushpanjaliTime}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">
                    Sandhi Puja
                  </span>
                  <span className="font-medium text-stone-800">
                    {pandal.festivalInfo.sandhiPujaTime}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">
                    Bhog Distribution
                  </span>
                  <span className="font-medium text-stone-800">
                    {pandal.festivalInfo.bhogDistribution}
                  </span>
                </div>
              </div>
              <div className="pt-1 border-t border-amber-200/60 text-[11px] text-amber-900 font-medium">
                💡 Tip: {pandal.festivalInfo.bestTimeToVisit}
              </div>
            </div>

            {/* Accessibility & Logistics */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2">
              <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Accessibility className="w-4 h-4 text-stone-700" />
                <span>Accessibility & Entry Regulations</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      pandal.accessibility.wheelchairAccessible
                        ? 'bg-emerald-500'
                        : 'bg-stone-300'
                    }`}
                  />
                  <span className="text-stone-700">
                    Wheelchair Access:{' '}
                    {pandal.accessibility.wheelchairAccessible ? 'Yes' : 'Limited'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      pandal.accessibility.seniorCitizenLane
                        ? 'bg-emerald-500'
                        : 'bg-stone-300'
                    }`}
                  />
                  <span className="text-stone-700">
                    Senior Line:{' '}
                    {pandal.accessibility.seniorCitizenLane ? 'Dedicated' : 'General'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      pandal.accessibility.vipPassAccepted
                        ? 'bg-emerald-500'
                        : 'bg-stone-300'
                    }`}
                  />
                  <span className="text-stone-700">
                    VIP / Puja Pass:{' '}
                    {pandal.accessibility.vipPassAccepted ? 'Accepted' : 'N/A'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 pt-1">
                Drop-off Point: {pandal.accessibility.nearestDropOff}
              </p>
            </div>

            {/* Source Verification Notice */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-200">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Verified{' '}
                  {pandal.region
                    ? `${pandal.region.charAt(0) + pandal.region.slice(1).toLowerCase()} Kolkata`
                    : 'Kolkata'}{' '}
                  Directory
                </span>
              </span>
              <a
                href={pandal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 hover:underline flex items-center gap-0.5 font-medium"
              >
                <span>Committee Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Modal Bottom Actions */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-2 flex-shrink-0">
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
              className="flex-1 flex items-center justify-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigate in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              onClick={() => onToggleVisited(pandal.id)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                pandal.isVisited
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">
                {pandal.isVisited ? 'Visited' : 'Mark Visited'}
              </span>
            </button>

            <button
              onClick={() => onOpenReportCrowd(pandal)}
              className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
              title="Report live crowd and queue delay"
            >
              <MessageSquare className="w-4 h-4 text-red-700" />
              <span className="hidden sm:inline">Report Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FULL-SCREEN PHOTO LIGHTBOX MODAL */}
      {/* ========================================================= */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-stone-800">
            <div>
              <span className="bg-red-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full mr-2">
                {galleryImages[lightboxIndex].tag}
              </span>
              <span className="text-xs text-stone-400">
                Photo {lightboxIndex + 1} of {galleryImages.length} • {pandal.name}
              </span>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image Container */}
          <div className="relative flex-1 flex items-center justify-center py-4 overflow-hidden">
            <img
              src={galleryImages[lightboxIndex].url}
              alt={galleryImages[lightboxIndex].caption}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Left / Right Nav Buttons */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null && prev > 0
                        ? prev - 1
                        : galleryImages.length - 1
                    )
                  }
                  className="absolute left-2 sm:left-6 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white backdrop-blur-sm transition-colors shadow-lg"
                  title="Previous photo (Left arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null && prev < galleryImages.length - 1
                        ? prev + 1
                        : 0
                    )
                  }
                  className="absolute right-2 sm:right-6 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white backdrop-blur-sm transition-colors shadow-lg"
                  title="Next photo (Right arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Caption & Thumbnails */}
          <div className="pt-3 border-t border-stone-800 text-center space-y-3">
            <div>
              <p className="text-sm sm:text-base font-serif font-medium text-white max-w-2xl mx-auto">
                {galleryImages[lightboxIndex].caption}
              </p>
              {galleryImages[lightboxIndex].credit && (
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  Photo: {galleryImages[lightboxIndex].credit}
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex justify-center gap-2 overflow-x-auto pb-1">
              {galleryImages.map((thumb, idx) => (
                <button
                  key={thumb.id}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    lightboxIndex === idx
                      ? 'border-amber-400 scale-105'
                      : 'border-stone-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={thumb.url}
                    alt={thumb.caption}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
