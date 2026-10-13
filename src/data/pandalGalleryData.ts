import { Region } from '../types';

export interface PandalGalleryImage {
  id: string;
  url: string;
  caption: string;
  tag: 'Pratima & Idol' | 'Pandal Architecture' | 'Illumination & Lights' | 'Art & Craftsmanship' | 'Night Darshan' | 'Rituals & Dhunuchi';
  credit?: string;
}

// Curated galleries mapped specifically by Pandal ID
export const PANDAL_GALLERY_REGISTRY: Record<string, PandalGalleryImage[]> = {
  'bagbazar-sarbojanin': [
    {
      id: 'bb-1',
      url: 'https://images.unsplash.com/photo-1601637775986-7788b7bc97ee?auto=format&fit=crop&w=1200&q=80',
      caption: 'Pristine traditional Ekchala Durga Pratima adorned with shimmering Daaker Saaj',
      tag: 'Pratima & Idol',
      credit: 'Bagbazar Sarbojanin Archive',
    },
    {
      id: 'bb-2',
      url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Chandannagar ornamental light archways illuminating Bagbazar Street',
      tag: 'Illumination & Lights',
      credit: 'Heritage Kolkata Lens',
    },
    {
      id: 'bb-3',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      caption: 'Vibrant Dhunuchi Naach and traditional Dhakis playing rhythmic Bols at the courtyard',
      tag: 'Rituals & Dhunuchi',
      credit: 'Durgotsav Photo Collective',
    },
    {
      id: 'bb-4',
      url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      caption: 'Historic century-old pavilion gates welcoming thousands of devotees on Maha Ashtami',
      tag: 'Pandal Architecture',
      credit: 'North Kolkata Walks',
    },
    {
      id: 'bb-5',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      caption: 'Midnight crowd darshan along Circular Canal & Bagbazar Ghat promenade',
      tag: 'Night Darshan',
      credit: 'Night Hoppers Kolkata',
    },
  ],

  'kumartuli-park': [
    {
      id: 'kp-1',
      url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Grand handcrafted clay sculpture carved right next to the historic artisans’ colony',
      tag: 'Pratima & Idol',
      credit: 'Kumartuli Artisan Guild',
    },
    {
      id: 'kp-2',
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Spectacular architectural theme facade constructed from eco-friendly bamboo and terracotta',
      tag: 'Pandal Architecture',
      credit: 'Design Studio Kolkata',
    },
    {
      id: 'kp-3',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      caption: 'Intricate folk art murals detailing ancient Bengal mythology and rural heritage',
      tag: 'Art & Craftsmanship',
      credit: 'Bengal Crafts Forum',
    },
    {
      id: 'kp-4',
      url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      caption: 'Golden hour illumination reflecting across the Kumartuli Park pavilion',
      tag: 'Illumination & Lights',
      credit: 'Kolkata Festival Guild',
    },
    {
      id: 'kp-5',
      url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      caption: 'Devotees offering pushpanjali in the open-air pavilion on Ashtami morning',
      tag: 'Rituals & Dhunuchi',
      credit: 'Darshan Diaries',
    },
  ],

  'college-square': [
    {
      id: 'cs-1',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      caption: 'Mesmerizing illuminated water palace reflecting upon the College Square swimming pool',
      tag: 'Illumination & Lights',
      credit: 'Chandannagar Light Artists',
    },
    {
      id: 'cs-2',
      url: 'https://images.unsplash.com/photo-1601637775986-7788b7bc97ee?auto=format&fit=crop&w=1200&q=80',
      caption: 'Dazzling traditional Pratima sculpted with majestic silver crown ornamentation',
      tag: 'Pratima & Idol',
      credit: 'College Square Sarbojanin',
    },
    {
      id: 'cs-3',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      caption: 'Evening atmosphere across College Street Boi-Para with thousands of revelers',
      tag: 'Night Darshan',
      credit: 'Central Hopper Circle',
    },
    {
      id: 'cs-4',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      caption: 'Ornate temple ceiling recreating ancient architectural wonders with gold filigree',
      tag: 'Art & Craftsmanship',
      credit: 'Bengal Craft Archives',
    },
  ],

  'santosh-mitra-square': [
    {
      id: 'sms-1',
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Colossal illuminated replica of global heritage architecture glowing in golden neon',
      tag: 'Pandal Architecture',
      credit: 'Santosh Mitra Square Media',
    },
    {
      id: 'sms-2',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      caption: 'Synchronized laser light spectacle during midnight darshan at Lebutala Park',
      tag: 'Illumination & Lights',
      credit: 'Kolkata Night Explorer',
    },
    {
      id: 'sms-3',
      url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Maa Durga idol adorned with authentic gold and silver jewelry designed by Bowbazar jewellers',
      tag: 'Pratima & Idol',
      credit: 'Swarna Shilpa Registry',
    },
    {
      id: 'sms-4',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      caption: 'High-energy queue excitement moving seamlessly through the barricaded avenues',
      tag: 'Night Darshan',
      credit: 'Puja Path Patrol',
    },
  ],

  'mohammad-ali-park': [
    {
      id: 'map-1',
      url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      caption: 'Monumental fort and palace replica rising above the historic central Kolkata park',
      tag: 'Pandal Architecture',
      credit: 'Mohammad Ali Park Committee',
    },
    {
      id: 'map-2',
      url: 'https://images.unsplash.com/photo-1601637775986-7788b7bc97ee?auto=format&fit=crop&w=1200&q=80',
      caption: 'Classical idol blending royal Rajput motifs with authentic Bengali iconography',
      tag: 'Pratima & Idol',
      credit: 'Central Puja Documentation',
    },
    {
      id: 'map-3',
      url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Dazzling Chandannagar 3D motion illuminations along Chittaranjan Avenue',
      tag: 'Illumination & Lights',
      credit: 'CR Avenue Illumination Cell',
    },
  ],

  'ekdalia-evergreen': [
    {
      id: 'ee-1',
      url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      caption: 'Famous authentic replica of historic Indian stone temples with intricate shikhara',
      tag: 'Pandal Architecture',
      credit: 'Ekdalia Evergreen Club',
    },
    {
      id: 'ee-2',
      url: 'https://images.unsplash.com/photo-1601637775986-7788b7bc97ee?auto=format&fit=crop&w=1200&q=80',
      caption: 'Unchanged traditional Sabeki Pratima sculpted by master Sanatan Rudra Pal',
      tag: 'Pratima & Idol',
      credit: 'South Kolkata Heritage',
    },
    {
      id: 'ee-3',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      caption: 'Huge German chandelier hanging from the sanctum ceiling casting warm royal glow',
      tag: 'Illumination & Lights',
      credit: 'Gariahat Hopper Lens',
    },
    {
      id: 'ee-4',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      caption: 'Dhakis and conch-shell players sounding the Maha Ashtami Sandhipuja herald',
      tag: 'Rituals & Dhunuchi',
      credit: 'Bengal Rhythms Guild',
    },
  ],

  'singhi-park': [
    {
      id: 'sp-1',
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Grand South Indian temple sanctum recreated with hand-molded stucco and gold leaf',
      tag: 'Pandal Architecture',
      credit: 'Singhi Park Committee',
    },
    {
      id: 'sp-2',
      url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Timeless Pratima crafted with benign maternal grace and classical weapons',
      tag: 'Pratima & Idol',
      credit: 'Kumartuli Master Sculptors',
    },
    {
      id: 'sp-3',
      url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Illuminated Dover Lane entrance corridor crowded with joyous festival goers',
      tag: 'Night Darshan',
      credit: 'South Kolkata Fest',
    },
  ],

  'suruchi-sangha': [
    {
      id: 'ss-1',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      caption: 'Innovative State Heritage Theme representing India’s diverse tribal arts and crafts',
      tag: 'Art & Craftsmanship',
      credit: 'Suruchi Sangha Cultural Wing',
    },
    {
      id: 'ss-2',
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Organic materials transformed into monumental contemporary sculptures',
      tag: 'Pandal Architecture',
      credit: 'Art College Alumni Collective',
    },
    {
      id: 'ss-3',
      url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Expressive and deeply emotive Durga Idol crafted to harmonize with the theme story',
      tag: 'Pratima & Idol',
      credit: 'Pratima Shilpa Sangstha',
    },
    {
      id: 'ss-4',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      caption: 'Midnight crowd enjoying the musical soundscape and open theme plaza in New Alipore',
      tag: 'Night Darshan',
      credit: 'Alipore Hopper Guild',
    },
  ],

  'tridhara-sammilani': [
    {
      id: 'ts-1',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      caption: 'Pioneering contemporary theme blending kinetic light fixtures with folk craftsmanship',
      tag: 'Art & Craftsmanship',
      credit: 'Tridhara Sammilani Arts',
    },
    {
      id: 'ts-2',
      url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Bold avant-garde Durga idol conceptualized by Bengal’s leading theme artists',
      tag: 'Pratima & Idol',
      credit: 'Modern Bengali Sculptors',
    },
    {
      id: 'ts-3',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      caption: 'Triangular intersection at Rashbehari illuminated with radiant neon canopy',
      tag: 'Illumination & Lights',
      credit: 'South Lights Collective',
    },
  ],

  'deshapriya-park': [
    {
      id: 'dp-1',
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Colossal thematic installation rising majestically across the expansive open grounds',
      tag: 'Pandal Architecture',
      credit: 'Deshapriya Park Puja Media',
    },
    {
      id: 'dp-2',
      url: 'https://images.unsplash.com/photo-1601637775986-7788b7bc97ee?auto=format&fit=crop&w=1200&q=80',
      caption: 'Towering idol commanding reverence with elaborate divine attributes and glow',
      tag: 'Pratima & Idol',
      credit: 'Deshapriya Darshan Team',
    },
    {
      id: 'dp-3',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      caption: 'Sea of night hoppers entering through the multi-lane security cordon',
      tag: 'Night Darshan',
      credit: 'Kolkata Police & Hopper Feed',
    },
  ],

  'chetla-agrani': [
    {
      id: 'ca-1',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      caption: 'Spectacular indigenous folk art installation made of woven cane, bell-metal, and clay',
      tag: 'Art & Craftsmanship',
      credit: 'Chetla Agrani Club',
    },
    {
      id: 'ca-2',
      url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Intensely expressive clay pratima sculpted by famed artist Bhabatosh Sutar',
      tag: 'Pratima & Idol',
      credit: 'Bengal Theme Guild',
    },
    {
      id: 'ca-3',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      caption: 'Warm ambient wooden lantern lights casting mystical shadows inside the sanctuary',
      tag: 'Illumination & Lights',
      credit: 'Artistic Darshan Studio',
    },
  ],

  'mudiali-club': [
    {
      id: 'mc-1',
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Immaculately detailed pavilion known for symphonic lighting choreography and aesthetics',
      tag: 'Pandal Architecture',
      credit: 'Mudiali Club Documentation',
    },
    {
      id: 'mc-2',
      url: 'https://images.unsplash.com/photo-1601637775986-7788b7bc97ee?auto=format&fit=crop&w=1200&q=80',
      caption: 'Traditional Sabeki idol nestled in an ethereal white and gold sanctum',
      tag: 'Pratima & Idol',
      credit: 'South Heritage Archive',
    },
    {
      id: 'mc-3',
      url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Bespoke musical lighting show that runs every 15 minutes during evening darshan',
      tag: 'Illumination & Lights',
      credit: 'Illumination Tech Kolkata',
    },
  ],

  'shobhabazar-rajbari': [
    {
      id: 'srb-1',
      url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      caption: 'Majestic open Natmandir Thakurdalan of Raja Nabakrishna Deb dating back to 1757',
      tag: 'Pandal Architecture',
      credit: 'Rajbari Heritage Trust',
    },
    {
      id: 'srb-2',
      url: 'https://images.unsplash.com/photo-1601637775986-7788b7bc97ee?auto=format&fit=crop&w=1200&q=80',
      caption: 'Aristocratic Ekchala idol with German silver foil Daaker Saaj and Lion with horse face',
      tag: 'Pratima & Idol',
      credit: 'Bonedi Bari Society',
    },
    {
      id: 'srb-3',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      caption: 'Centuries-old family cannon firing ritual to mark the commencement of Sandhi Puja',
      tag: 'Rituals & Dhunuchi',
      credit: 'Heritage Bengal Lens',
    },
  ],
};

// Regional default fallback galleries to guarantee rich 4-photo galleries for any pandal ID
export const REGIONAL_GALLERY_FALLBACKS: Record<Region, PandalGalleryImage[]> = {
  NORTH: [
    {
      id: 'north-f-1',
      url: 'https://images.unsplash.com/photo-1601637775986-7788b7bc97ee?auto=format&fit=crop&w=1200&q=80',
      caption: 'Traditional Ekchala Pratima with authentic Daaker Saaj silver ornamentation',
      tag: 'Pratima & Idol',
      credit: 'Kumartuli Sculptors Guild',
    },
    {
      id: 'north-f-2',
      url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      caption: 'Heritage North Kolkata Bonedi style courtyard pavilion and traditional archways',
      tag: 'Pandal Architecture',
      credit: 'Heritage Walks Kolkata',
    },
    {
      id: 'north-f-3',
      url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Classic Chandannagar motion lightgates lining the historic avenue',
      tag: 'Illumination & Lights',
      credit: 'Chandannagar Light Arts',
    },
    {
      id: 'north-f-4',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      caption: 'Rhythmic beats of Dhaak and aromatic Dhunuchi smoke filling the darshan hall',
      tag: 'Rituals & Dhunuchi',
      credit: 'Durgotsav Photo Collective',
    },
  ],
  CENTRAL: [
    {
      id: 'central-f-1',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      caption: 'Dazzling monumental light installations illuminating central Kolkata public squares',
      tag: 'Illumination & Lights',
      credit: 'Central Illumination Cell',
    },
    {
      id: 'central-f-2',
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Grand architectural replica recreating world-famous palaces and heritage temples',
      tag: 'Pandal Architecture',
      credit: 'Central Puja Forum',
    },
    {
      id: 'central-f-3',
      url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Magnificent golden ornament Pratima sculpted with royal craftsmanship',
      tag: 'Pratima & Idol',
      credit: 'Kumartuli Master Guild',
    },
    {
      id: 'central-f-4',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      caption: 'Bustling night darshan atmosphere on Maha Saptami and Ashtami',
      tag: 'Night Darshan',
      credit: 'Kolkata Festival Hopper',
    },
  ],
  SOUTH: [
    {
      id: 'south-f-1',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      caption: 'Avant-garde contemporary art installation handcrafted by Bengal College of Art alumni',
      tag: 'Art & Craftsmanship',
      credit: 'Modern Theme Guild',
    },
    {
      id: 'south-f-2',
      url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Innovative sculptural Pratima fusing modern Bengali sculpture with divine grace',
      tag: 'Pratima & Idol',
      credit: 'Bengal Sculpture Society',
    },
    {
      id: 'south-f-3',
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Immersive walk-in theme pavilion designed using organic bamboo, clay, and brass',
      tag: 'Pandal Architecture',
      credit: 'South Design Forum',
    },
    {
      id: 'south-f-4',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      caption: 'Late night darshan crowds enjoying the carnival spirit along Gariahat and Southern Avenue',
      tag: 'Night Darshan',
      credit: 'South Hopper Circle',
    },
  ],
};

/**
 * Fetches gallery photos based on Pandal ID, with intelligent regional fallback
 */
export function getPandalGalleryImages(
  pandalId: string,
  region: Region = 'NORTH'
): PandalGalleryImage[] {
  if (PANDAL_GALLERY_REGISTRY[pandalId] && PANDAL_GALLERY_REGISTRY[pandalId].length > 0) {
    return PANDAL_GALLERY_REGISTRY[pandalId];
  }

  // Fallback to regional high-res curated photos
  return REGIONAL_GALLERY_FALLBACKS[region] || REGIONAL_GALLERY_FALLBACKS.NORTH;
}
