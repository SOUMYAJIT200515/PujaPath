export interface PandalCulturalHighlight {
  pandalId: string;
  heritageTitle: string;
  bengaliTag: string;
  significanceBadge: string;
  history: {
    foundingYear?: number;
    originStory: string;
    historicalMilestone: string;
    prominentFiguresOrLineage?: string;
  };
  theme: {
    conceptName: string;
    conceptDescription: string;
    socialOrSpiritualMessage: string;
    architecturalInspiration: string;
  };
  artisticStyle: {
    sculptureStyle: string; // e.g. Ekchala Daaker Saaj, Contemporary Terracotta, Sholapith, Dokra
    artisanOrStudio: string;
    primaryMaterials: string[];
    lightingTechnique: string; // e.g. Chandannagar Dynamic LEDs, Warm Temple Lanterns
    signatureVisualElement: string;
  };
  culturalRituals: string[];
  hopperSecret: string;
}

export const PANDAL_CULTURAL_REGISTRY: Record<string, PandalCulturalHighlight> = {
  'bagbazar-sarbojanin': {
    pandalId: 'bagbazar-sarbojanin',
    heritageTitle: 'Bagbazar Sarbojanin Durgotsav',
    bengaliTag: 'উত্তর কলকাতার শতবর্ষের বনেদি সাবেকিয়ানার শিরোমণি',
    significanceBadge: 'Centenary Barowari Legacy (Est. 1919)',
    history: {
      foundingYear: 1919,
      originStory:
        'Bengal’s premier community puja, Bagbazar Sarbojanin democratized Durgotsav by moving worship from aristocratic private courtyards into the public square, fostering anti-colonial nationalist unity.',
      historicalMilestone:
        'Visited by Netaji Subhas Chandra Bose and Deshbandhu Chittaranjan Das, who served as key patrons and committee presidents in the 1930s.',
      prominentFiguresOrLineage: 'Presided over by freedom fighters; immortalized in modern Bengali folk history.',
    },
    theme: {
      conceptName: 'Eternal Sabekiyana (সনাতন সাবেকি রূপ)',
      conceptDescription:
        'Strict adherence to timeless Vedic aesthetics, rejecting transient commercial themes in favor of pure spiritual devotion and unadulterated heritage.',
      socialOrSpiritualMessage:
        'Preserving the living soul and ancestral integrity of Bengali community celebrations across generations.',
      architecturalInspiration: 'Majestic open-air classical white pillared pavilion reflecting colonial-era Bengali mansions.',
    },
    artisticStyle: {
      sculptureStyle: 'Pristine Ekchala Pratima draped in Daaker Saaj',
      artisanOrStudio: 'Master Kumartuli hereditary sculpting lineages continuing an unbroken 100+ year tradition',
      primaryMaterials: ['Ganga Clay', 'Silver Foil (Daaker Saaj)', 'Mica', 'Pith (Shola)'],
      lightingTechnique: 'Chandannagar ornamental arched street gates casting golden reflections across Bagbazar Street',
      signatureVisualElement: 'The majestic, compassionate eyes of the Goddess sculpted in the classic almond-eyed Patachitra style.',
    },
    culturalRituals: [
      'Devi Aradhana strictly according to centuries-old Gupta Press Panjika rituals',
      'Electrifying Dhunuchi Naach at the open pavilion accompanied by traditional Dhakis',
      'Grand immersion procession marching down to Bagbazar Ghat on the holy Hooghly river on Bijoya Dashami',
    ],
    hopperSecret:
      'Visit at sunrise (6:30 AM) on Maha Ashtami to witness the serene preparation of the 108 blue lotus offering away from the 3-hour crowd queues.',
  },

  'kumartuli-park': {
    pandalId: 'kumartuli-park',
    heritageTitle: 'Kumartuli Park Sarbojanin',
    bengaliTag: 'মৃৎশিল্পীদের আঙিনায় পৌরাণিক ও পরিবেশবান্ধব শিল্পকলা',
    significanceBadge: 'Artisan Heartland Showcase (Est. 1993)',
    history: {
      foundingYear: 1993,
      originStory:
        'Conceived by the master clay idol artisans and local youth of Kumartuli to showcase monumental temple replicas and dynamic sculpture right at the birthplace of Bengal’s idols.',
      historicalMilestone:
        'Pioneered the transition from static pandals into walk-in architectural wonders that tell an immersive epic mythological narrative.',
      prominentFiguresOrLineage: 'Directly supported by the Kumartuli Mritshilpi Samiti master sculptors.',
    },
    theme: {
      conceptName: 'Temple of Vedic Elements & Celestial Grace',
      conceptDescription:
        'Grand structural replication of ancient architectural marvels harmonized with sustainable clay craft, terracotta motifs, and Vedic cosmograms.',
      socialOrSpiritualMessage:
        'Honoring the hereditary soil artists who breathe life into straw and mud, celebrating ecological balance.',
      architecturalInspiration: 'Orissan Kalinga architecture merged with intricate South Indian Gopuram stone carvings.',
    },
    artisticStyle: {
      sculptureStyle: 'Monumental Realistic Clay Sculpting with Fluid Drapes',
      artisanOrStudio: 'Senior artisans from Kumartuli studios adjacent to Banamali Sarkar Street',
      primaryMaterials: ['Alluvial Clay', 'Jute Fiber', 'Terracotta Relic Tiles', 'Natural Dyes'],
      lightingTechnique: 'Dramatic warm-amber architectural spotlighting accentuating every chisel mark on the deity.',
      signatureVisualElement: 'Intricately modeled Mahishasuramardini posture showcasing muscular dynamism and divine triumph.',
    },
    culturalRituals: [
      'Chokkhu Daan ceremony performed by senior master sculptor at dawn of Mahalaya',
      'Special Sandhi Puja offering with traditional bell-metal conches and live stotra recitations',
    ],
    hopperSecret:
      'Wander through adjacent Kumartuli potter lanes before entering the pandal to witness the artisans putting final touches on miniature idols.',
  },

  'ahiritola-sarbojanin': {
    pandalId: 'ahiritola-sarbojanin',
    heritageTitle: 'Ahiritola Sarbojanin Durgotsav',
    bengaliTag: 'গঙ্গার কূল ঘেঁষা জনপদের ঐতিহ্য ও শৈল্পিক নান্দনিকতা',
    significanceBadge: 'Historic Riverbank Barowari (Est. 1940)',
    history: {
      foundingYear: 1940,
      originStory:
        'Founded by river traders, dockworkers, and historic North Kolkata residents along BK Paul Avenue, serving as a unifying celebration during World War II.',
      historicalMilestone:
        'Evolved into one of the most intellectually praised theme pujas, addressing women empowerment, water conservation, and Bengali literature.',
      prominentFiguresOrLineage: 'Associated with the maritime merchant history of Ahiritola Ghat and Sovabazar.',
    },
    theme: {
      conceptName: 'Resilience of the Soil & Rivers of Bengal',
      conceptDescription:
        'Evocative installations using river silt, fishing nets, hand-beaten brass, and rural folk weaves reflecting the lifeline of the Hooghly.',
      socialOrSpiritualMessage: 'Environmental sanctity of sacred rivers and sustainable coexistence with nature.',
      architecturalInspiration: 'Rural Bengal terracotta temple courtyards and riverine barge designs.',
    },
    artisticStyle: {
      sculptureStyle: 'Stylized Folk-Terracotta Fusion',
      artisanOrStudio: 'Collaborative curation with Government College of Art & Craft scholars',
      primaryMaterials: ['Terracotta Plaques', 'River Reeds', 'Hand-loomed Gamcha Fabrics', 'Brass'],
      lightingTechnique: 'Soft aquatic blue and copper floodlighting simulating shimmering river water ripples.',
      signatureVisualElement: 'Goddess Durga portrayed with protective maternal serenity riding a fierce, stylized brass lion.',
    },
    culturalRituals: [
      'Ganga aarti and Kalabou Snan procession down to Ahiritola Ghat on Maha Saptami morning',
      'Community distribution of Khichuri bhog prepared in clay handis',
    ],
    hopperSecret:
      'Pair this darshan with midnight telebhaja from Kalika and hot tea served in traditional clay bhaanrs near Ahiritola Ghat.',
  },

  'shobhabazar-rajbari': {
    pandalId: 'shobhabazar-rajbari',
    heritageTitle: 'Shobhabazar Rajbari Durga Puja',
    bengaliTag: '১৭৫৭ সালের বনেদি জমিদারী রাজকীয় ঠাকুরদালানের আভিজাত্য',
    significanceBadge: 'Aristocratic Royal Heritage (Est. 1757)',
    history: {
      foundingYear: 1757,
      originStory:
        'Inaugurated by Raja Nabakrishna Deb following the Battle of Plassey. This historic mansion established the grand scale of domestic aristocratic Durgotsav in Bengal.',
      historicalMilestone:
        'Attended by Lord Clive and Warren Hastings; later visited by Swami Vivekananda upon his triumphant return from the Chicago Parliament of Religions.',
      prominentFiguresOrLineage: 'Deb royal dynasty of Shobhabazar; preserved in both the Boro Taraf and Choto Taraf courtyards.',
    },
    theme: {
      conceptName: 'Aristocratic Thakurdalan Heritage (বনেদি রাজদরবার)',
      conceptDescription:
        'Traditional zamindari courtyard darshan held in the colonnaded Thakurdalan with majestic horseshoe arches and Belgian glass chandeliers.',
      socialOrSpiritualMessage: 'Preserving 260+ years of uninterrupted aristocratic Shakta and Vaishnava ritual lineages.',
      architecturalInspiration: 'Colonial Indo-European courtyard architecture with Tuscan columns and arched verandas.',
    },
    artisticStyle: {
      sculptureStyle: 'Authentic Rajbari Ekchala with Shola & Gold leaf foil',
      artisanOrStudio: 'Hereditary Rajbari family sculptors residing in Kumartuli for over six generations',
      primaryMaterials: ['Sacred Ganga Mud', 'Fine Sholapith', 'Pure Silver Filigree', 'Gold Leaf Foils'],
      lightingTechnique: 'Illuminated by antique multi-tiered Belgian crystal chandeliers and warm brass lamps.',
      signatureVisualElement: 'The majestic Kathamo (wooden armature) worshipped since 1757, upon which the clay idol is sculpted every year.',
    },
    culturalRituals: [
      'Bodhon performed in the presence of the sacred family Shaligram Shila',
      'Symbolic offering of Nilkantha bird releasing wish to Lord Shiva upon Bijoya Dashami immersion',
      'Immersion carried out using two royal boats with royal family bearers rowing onto the Hooghly river',
    ],
    hopperSecret:
      'Enter the open Thakurdalan courtyard during afternoon Sandhi Puja to hear the reverberating beats of royal Dhakis inside the quadrangle.',
  },

  'kashi-bose-lane': {
    pandalId: 'kashi-bose-lane',
    heritageTitle: 'Kashi Bose Lane Durga Puja Samity',
    bengaliTag: 'নান্দনিক শিল্প ও মানবিক অনুভূতির এক অপূর্ব মেলবন্ধন',
    significanceBadge: 'Social Consciousness Artistry (Est. 1937)',
    history: {
      foundingYear: 1937,
      originStory:
        'Started by the residents of the historic Kashi Bose Lane alley in North Kolkata, transitioning over decades into one of the city’s top award-winning art destinations.',
      historicalMilestone:
        'Won consecutive state and international tourism honors for thought-provoking themes highlighting human rights, child labor, and female courage.',
      prominentFiguresOrLineage: 'Supported by legendary contemporary Bengal visual artists and set designers.',
    },
    theme: {
      conceptName: 'Echoes of the Unheard (মানবিক সংবেদনশীলতা)',
      conceptDescription:
        'Architectural installation crafted with astonishing attention to detail, utilizing organic everyday objects to narrate stories of empathy and spiritual rebirth.',
      socialOrSpiritualMessage: 'Divine Mother as the ultimate protector of marginalized lives and cosmic balance.',
      architecturalInspiration: 'Avant-garde spatial installation with acoustic soundscapes and tactile wall textures.',
    },
    artisticStyle: {
      sculptureStyle: 'Expressive Modern Clay Sculpting blending realism with divinity',
      artisanOrStudio: 'Led by acclaimed contemporary Bengal theme creators and sculptors',
      primaryMaterials: ['Raw Wood', 'Earthen Terracotta', 'Handmade Paper', 'Natural Jute Rope'],
      lightingTechnique: 'Concealed fiber-optic and micro-LED accents highlighting emotional textures on statues.',
      signatureVisualElement: 'Unique multidimensional idol that integrates seamlessly into the surrounding architectural story.',
    },
    culturalRituals: [
      'All-inclusive Pushpanjali where thousands of neighbourhood women participate in matching red-and-white sarees',
      'Cultural folk music recitals during Maha Saptami and Ashtami evenings',
    ],
    hopperSecret:
      'Walk slowly through the entry tunnel to absorb the customized spatial soundscape designed specifically to accompany the visual story.',
  },

  'hatibagan-sarbojanin': {
    pandalId: 'hatibagan-sarbojanin',
    heritageTitle: 'Hatibagan Sarbojanin Durgotsav',
    bengaliTag: 'কলকাতার নাট্যমঞ্চ ও কারুশিল্পের ঐতিহ্যবাহী সমাবেশ',
    significanceBadge: 'Historic Theatre District Barowari (Est. 1935)',
    history: {
      foundingYear: 1935,
      originStory:
        'Located in the heart of Kolkata’s legendary theatre district (Star Theatre corridor), this puja has always been deeply intertwined with stagecraft and dramatic arts.',
      historicalMilestone:
        'Pioneered interactive thematic designs where dramatic lighting, recorded voice acting, and kinetic movements transform the pandal into an open stage.',
      prominentFiguresOrLineage: 'Patronized by generations of legendary Bengali theatre actors and dramatists.',
    },
    theme: {
      conceptName: 'Theatre of Devotion & Folk Heritage',
      conceptDescription:
        'Blending traditional jatra stage designs with indigenous Bengal handicraft traditions such as Patachitra, Kantha stitch, and brass bell castings.',
      socialOrSpiritualMessage: 'Reviving declining rural folk crafts by giving village artisans a premier urban stage.',
      architecturalInspiration: 'Historic Star Theatre wooden proscenium fused with rural Bengal Chala huts.',
    },
    artisticStyle: {
      sculptureStyle: 'Dynamic Mythological Expressionism',
      artisanOrStudio: 'Artisan guilds from Medinipur and Kumartuli',
      primaryMaterials: ['Sholapith', 'Kantha Fabric Panels', 'Brass Cymbals', 'Sal Wood'],
      lightingTechnique: 'Theatrical stage lighting with spotlights simulating twilight and sunrise over the sanctorum.',
      signatureVisualElement: 'Elaborate Chalchitra backdrop illustrating the stories of Chandi Mangal and Ramayana.',
    },
    culturalRituals: [
      'Pre-puja theater skits and recitation sessions on the open stage',
      'Traditional Dhunuchi competition featuring regional champion dancers',
    ],
    hopperSecret:
      'Combine your darshan with a stop at Star Theatre opposite the crossing and the historic Hatibagan evening market.',
  },

  'nalin-sarkar-street': {
    pandalId: 'nalin-sarkar-street',
    heritageTitle: 'Nalin Sarkar Street Sarbojanin',
    bengaliTag: 'বাংলার বিলুপ্তপ্রায় লোকশিল্প ও ক্ষুদ্রাতিক্ষুদ্র কারুকাজ',
    significanceBadge: 'Fine Craftsmanship Pioneer (Est. 1933)',
    history: {
      foundingYear: 1933,
      originStory:
        'A cozy neighborhood community puja that skyrocketed to global acclaim through its mastery of microscopic detailing using single natural materials like palm leaves, coir, or wood shavings.',
      historicalMilestone:
        'Regular winner of the coveted Asian Paints Sharad Shamman for best traditional and artistic craftsmanship.',
      prominentFiguresOrLineage: 'Pioneered by local artists dedicated to reviving rare cottage arts.',
    },
    theme: {
      conceptName: 'Symphony of Bengal Cottage Crafts (হাতে বোনা রূপকথা)',
      conceptDescription:
        'Thousands of hours of painstaking hand-assembly creating monumental domes, chandeliers, and murals using humble ecological materials.',
      socialOrSpiritualMessage: 'Zero-waste devotion honoring the patience and soul of human handicraft.',
      architecturalInspiration: 'Intricate temple filigree carved into palm wood and clay tiles.',
    },
    artisticStyle: {
      sculptureStyle: 'Classical Sculptural Harmony with Natural Pigment Colors',
      artisanOrStudio: 'Curated by master village craft cooperatives under urban artistic directors',
      primaryMaterials: ['Palm Fiber', 'Bamboo Slivers', 'Clay Engravings', 'Herbal Colors'],
      lightingTechnique: 'Warm incandescent illumination preserving the organic textures of raw wooden fibers.',
      signatureVisualElement: 'Ceiling tapestries woven so finely that they resemble antique carved marble.',
    },
    culturalRituals: [
      'Ritual Pushpanjali celebrated with handmade wooden offering trays',
      'Traditional Sindoor Khela where generational families gather on Dashami',
    ],
    hopperSecret:
      'Take a close look at the exterior wall panels—every decorative flower is handmade with individual fiber strands.',
  },

  'simla-vyayam-samiti': {
    pandalId: 'simla-vyayam-samiti',
    heritageTitle: 'Simla Vyayam Samiti Durgotsav',
    bengaliTag: 'স্বাধীনতা সংগ্রামের আখড়া ও বীরত্বের প্রতীকী দুর্গোৎসব',
    significanceBadge: 'Freedom Struggle Citadel (Est. 1926)',
    history: {
      foundingYear: 1926,
      originStory:
        'Founded as a physical culture gymnasium (Akhada) by revolutionary Atindra Nath Bose during the freedom movement. Durga Puja was organized to instill courage, physical strength, and national pride in Bengali youth.',
      historicalMilestone:
        'Netaji Subhas Chandra Bose actively associated with the samiti; the British government repeatedly surveilled and attempted to ban their martial displays.',
      prominentFiguresOrLineage: 'Revolutionary heroes of the Jugantar and Anushilan Samiti freedom movements.',
    },
    theme: {
      conceptName: 'Shakti & Valor (বীরাষ্টমী ও শক্তিরূপা দুর্গা)',
      conceptDescription:
        'Unapologetically traditional idol embodying cosmic strength and martial valor, standing firm against oppression.',
      socialOrSpiritualMessage: 'Self-reliance, physical bravery, and moral fortitude as taught by Swami Vivekananda.',
      architecturalInspiration: 'Classical courtyard gymnasium archway with patriotic murals and heroic insignia.',
    },
    artisticStyle: {
      sculptureStyle: 'Fiery Mahishasuramardini with Martial Poise (বীররসের প্রতিমা)',
      artisanOrStudio: 'Hereditary Kumartuli sculptors adhering strictly to the 1926 original mould',
      primaryMaterials: ['Ganga Clay', 'Traditional Daaker Saaj', 'Real Brass Weapons'],
      lightingTechnique: 'Vibrant golden amber searchlights highlighting the heroic stance of Mother Durga.',
      signatureVisualElement: 'The powerful, dynamic posture of the lion pouncing on the demon with fierce realism.',
    },
    culturalRituals: [
      'Birastami martial arts demonstrations (Lathi-Khela, sword exhibitions) on Maha Ashtami morning',
      'Pushpanjali recited with ancient warrior mantras dedicated to Bharat Mata and Shakti',
    ],
    hopperSecret:
      'Do not miss the Birastami physical displays on Ashtami morning at 10 AM—a historic spectacle unique to this pandal.',
  },

  'telengabagan-sarbojanin': {
    pandalId: 'telengabagan-sarbojanin',
    heritageTitle: 'Telengabagan Sarbojanin Durgotsav',
    bengaliTag: 'ঐতিহাসিক উত্তর কলকাতার নান্দনিক ভাবনার পথিকৃৎ',
    significanceBadge: 'Theme Trailblazer (Est. 1966)',
    history: {
      foundingYear: 1966,
      originStory:
        'Located near Ultadanga along VIP Road, Telengabagan was among the earliest pandals in North Kolkata to break the mould in the early 2000s and introduce themed spatial narratives.',
      historicalMilestone:
        'Credited with ushering in the era of high-concept visual installations in North Kolkata, competing with the southern giants.',
      prominentFiguresOrLineage: 'Known for nurturing young avant-garde sculptors and installation artists.',
    },
    theme: {
      conceptName: 'Harmonics of Nature & Sacred geometry',
      conceptDescription:
        'Transforming the park grounds into an otherworldly sanctuary reflecting sacred mandalas, cosmic sound frequencies, and earthen tranquility.',
      socialOrSpiritualMessage: 'Inner peace and cosmic equilibrium in an increasingly chaotic modern world.',
      architecturalInspiration: 'Himalayan monasteries fused with organic bamboo dome architecture.',
    },
    artisticStyle: {
      sculptureStyle: 'Meditative Avant-Garde Idol with Classical Grace',
      artisanOrStudio: 'Renowned modern fine arts creators from Santiniketan and Kolkata',
      primaryMaterials: ['Raw Bamboo', 'Terracotta Bells', 'Stone Dust Pigments', 'Handmade Textiles'],
      lightingTechnique: 'Subtle gradient illumination that breathes synchronously with meditative ambient music.',
      signatureVisualElement: 'Idol’s serene, all-knowing facial expression evoking deep meditative silence.',
    },
    culturalRituals: [
      'Classical flute and sitar recitals performed inside the inner sanctum during Sandhya Aarti',
      'Community lunch feeding thousands of pilgrims across Sasthi to Navami',
    ],
    hopperSecret:
      'The quietest hours are between 2:30 AM and 5:00 AM, when the soothing ambient music and lighting truly cast an ethereal spell.',
  },

  'college-square': {
    pandalId: 'college-square',
    heritageTitle: 'College Square Sarbojanin Durgotsav',
    bengaliTag: 'মধ্য কলকাতার দীঘির জলে ভাসমান আলোর মহাজাগতিক রূপ',
    significanceBadge: 'Aquatic Light Spectacular (Est. 1948)',
    history: {
      foundingYear: 1948,
      originStory:
        'Surrounded by Kolkata’s intellectual institutions (Calcutta University, Presidency University, Boi-Para), founded right after Indian Independence in the sacred square lake grounds.',
      historicalMilestone:
        'Famous worldwide for erecting a colossal illuminated architectural monument in the center of the lake, mirrored perfectly in the water.',
      prominentFiguresOrLineage: 'Patronized by generations of academicians, student leaders, and Boi-Para booksellers.',
    },
    theme: {
      conceptName: 'Illuminated Celestial Water Palace (জলপ্রাসাদ ও আলোকমালা)',
      conceptDescription:
        'Full-scale illuminated replica of famous world monuments (Vatican, Mysore Palace, Akshardham, or Golden Temple) reflected across the vast water surface.',
      socialOrSpiritualMessage: 'Universal harmony, collegiate unity, and intellectual enlightenment.',
      architecturalInspiration: 'Classical European and Indian palatial architecture illuminated by master electricians.',
    },
    artisticStyle: {
      sculptureStyle: 'Monumental Traditional Pratima with Golden Shola Ornaments',
      artisanOrStudio: 'Senior sculptors from Kumartuli specialized in large-scale classical idols',
      primaryMaterials: ['Intricate Bamboo Framework', 'Illuminated LED Panels', 'Sholapith', 'Water Reflections'],
      lightingTechnique: 'Legendary Chandannagar dynamos and million-bulb dynamic LED animations synchronized across the entire lake.',
      signatureVisualElement: 'The mirror reflection of the grand dome glistening on the calm waters of College Square tank.',
    },
    culturalRituals: [
      'Goddess worshipped with serene devotional songs playing across the entire lake perimeter',
      'Pushpanjali attended by thousands of college students and scholars gathered along the ghats',
    ],
    hopperSecret:
      'Stand on the southeastern corner of the water tank at midnight for the absolute best panoramic photo of the illuminated reflection.',
  },

  'santosh-mitra-square': {
    pandalId: 'santosh-mitra-square',
    heritageTitle: 'Santosh Mitra Square (Lebutala Park)',
    bengaliTag: 'সোনার প্রতিমা ও বিশ্বমানের স্থাপত্যের অভূতপূর্ব প্রদর্শনী',
    significanceBadge: 'Monumental Grandeur Icon (Est. 1936)',
    history: {
      foundingYear: 1936,
      originStory:
        'Originally known as Lebutala Park, renamed in honor of martyr Santosh Mitra. Recognized across India for jaw-dropping, high-budget architectural spectacles.',
      historicalMilestone:
        'Created history by sculpting a Durga idol adorned with 50 kilograms of pure gold, and later featuring London’s Big Ben, Las Vegas Sphere, and Ram Mandir replicas.',
      prominentFiguresOrLineage: 'Commemorating revolutionary martyr Santosh Mitra who was martyred in Hijli Detention Camp.',
    },
    theme: {
      conceptName: 'Wonder of the World Palatial Replica',
      conceptDescription:
        'Breathtaking hyper-realistic architectural re-creations standing tens of meters tall, utilizing advanced engineering, laser projection mapping, and golden filigree.',
      socialOrSpiritualMessage: 'Celebrating human engineering triumph and bringing international wonders to the heart of Bengal.',
      architecturalInspiration: 'Iconic world wonders and sacred Indian heritage temples recreated to scale.',
    },
    artisticStyle: {
      sculptureStyle: 'Royal Swarna & Rupa Shilpa (Gold & Silver Embellishment)',
      artisanOrStudio: 'Master goldsmiths and jewelers of Bowbazar collaborating with veteran idol makers',
      primaryMaterials: ['Pure Gold & Silver Filigree Foils', 'Structural Steel', 'High-density Molded Relief Panels'],
      lightingTechnique: 'Cutting-edge 3D laser mapping, automated moving beam lights, and diamond-white floodlights.',
      signatureVisualElement: 'Dazzling golden Mukut (crown) and jewelry sparkling under hyper-focused spotlights.',
    },
    culturalRituals: [
      'Grand inauguration attended by national cultural luminaries and spiritual leaders',
      'Massive police-guided darshan lines that flow like an ocean through central Kolkata avenues',
    ],
    hopperSecret:
      'Visit in the early morning between 5:00 AM and 7:30 AM to bypass the monumental 2-to-3-hour evening queue.',
  },

  'mohammad-ali-park': {
    pandalId: 'mohammad-ali-park',
    heritageTitle: 'Mohammad Ali Park Durgotsav',
    bengaliTag: 'মধ্য কলকাতার রাজকীয় প্রাসাদ ও সাম্প্রদায়িক সম্প্রীতি',
    significanceBadge: 'Harmony & Palatial Splendor (Est. 1969)',
    history: {
      foundingYear: 1969,
      originStory:
        'Organized in the iconic public park on Central Avenue. Famous for showcasing communal brotherhood, welcoming people of every faith to participate in Bengal’s grandest festival.',
      historicalMilestone:
        'Known for creating gigantic replicas of ancient Indian fortresses (Gwalior Fort, Chittorgarh, Konark Sun Temple) with authentic stone textures.',
      prominentFiguresOrLineage: 'Jointly stewarded by multifaith community leaders of Bowbazar and Central Kolkata.',
    },
    theme: {
      conceptName: 'Imperial Fortresses of Ancient India',
      conceptDescription:
        'Imposing royal fortress pavilions complete with fortified bastions, medieval courtyards, stone carvings, and grand chandeliers.',
      socialOrSpiritualMessage: 'Unity in diversity and pride in India’s shared architectural heritage.',
      architecturalInspiration: 'Rajasthani havelis and medieval stone forts.',
    },
    artisticStyle: {
      sculptureStyle: 'Grand Classical Sabeki Pratima with Golden Foil Work',
      artisanOrStudio: 'Kumartuli sculptors adhering to classical dignified forms',
      primaryMaterials: ['Plaster Relief', 'Carved Wood', 'Brass Fixtures', 'Embossed Metal Foils'],
      lightingTechnique: 'Chandannagar ornamental dynamic illumination stretching from Central Avenue into the park grounds.',
      signatureVisualElement: 'Towering fortified ramparts greeting hoppers as they step off the Central Metro station.',
    },
    culturalRituals: [
      'Multifaith cultural assembly and musical recitals on Shashthi evening',
      'Traditional Sandhi Puja performed with 108 earthen lamps lit by senior community members',
    ],
    hopperSecret:
      'Use the Central Metro Gate 2 exit directly into the queuing boulevard for quick, smooth entry.',
  },

  'bowbazar-sarbojanin': {
    pandalId: 'bowbazar-sarbojanin',
    heritageTitle: 'Bowbazar Sarbojanin Durgotsav',
    bengaliTag: 'স্বর্ণবণিক ও মধ্য কলকাতার সুপ্রাচীন বনেদি ঐতিহ্য',
    significanceBadge: 'Goldsmiths’ Heritage Barowari (Est. 1930)',
    history: {
      foundingYear: 1930,
      originStory:
        'Established by the affluent goldsmith merchants and residents of Bowbazar, preserving the deep link between traditional Bengali jewelry craft and divine adornment.',
      historicalMilestone:
        'Known for exquisite filigree work (Rupa & Swarna Tarakashi) handcrafted by generations of Bowbazar artisans.',
      prominentFiguresOrLineage: 'Legacy of the traditional merchant guilds of Central Kolkata.',
    },
    theme: {
      conceptName: 'Filigree & Devotion (রূপার তারের কারুকাজ)',
      conceptDescription:
        'Highlighting the delicate silver filigree art of Bengal and Orissa, framing the Goddess in a shimmering web of precious metals.',
      socialOrSpiritualMessage: 'Preserving time-honored metalwork guilds in the face of mass machine manufacturing.',
      architecturalInspiration: 'Antique merchant Thakurdalans with arched teakwood balconies.',
    },
    artisticStyle: {
      sculptureStyle: 'Classic Sabeki Pratima adorned with delicate filigree foils',
      artisanOrStudio: 'Master jewelers of Bowbazar and Kumartuli sculptors',
      primaryMaterials: ['Silver Filigree', 'Fine Clay', 'Hand-stitched Zari Brocade', 'Shola'],
      lightingTechnique: 'Warm golden pin-spotting highlighting the intricate metal twists of the crown and ornaments.',
      signatureVisualElement: 'The astonishingly intricate Daak (halo) woven entirely from fine silver-colored wire.',
    },
    culturalRituals: [
      'Family-style Pushpanjali where local families chant generation-old hymns in Sanskrit',
      'Grand Bhog distribution featuring authentic Bengali khichuri, labra, and mishti',
    ],
    hopperSecret:
      'Combine this visit with exploring the historic jewelry lanes of Bowbazar and grabbing sweets from nearby Bhim Chandra Nag.',
  },

  'chaltabagan-sarbojanin': {
    pandalId: 'chaltabagan-sarbojanin',
    heritageTitle: 'Manicktalla Chaltabagan Lohapatty Durgotsav',
    bengaliTag: 'ঢাকের বোল, ধুনুচি নাচ ও রাজকীয় পরিবেশনা',
    significanceBadge: 'Dhunuchi Dance & Cultural Epicenter (Est. 1943)',
    history: {
      foundingYear: 1943,
      originStory:
        'Founded by the local metal and hardware merchant community of Lohapatty in Manicktalla. Has grown into one of Kolkata’s most joyful and celebrated cultural hubs.',
      historicalMilestone:
        'Famed for hosting Kolkata’s biggest Dhunuchi Naach competition and celebrity Sindoor Khela, drawing international cultural ambassadors.',
      prominentFiguresOrLineage: 'Patronized by eminent civic leaders, artists, and diplomats.',
    },
    theme: {
      conceptName: 'Glass, Light & Devotional Harmony (কাঁচ ও আলোর মায়াবী রূপ)',
      conceptDescription:
        'Pioneered pandals constructed with millions of cut-glass bangles, brass bells, clay cups, and mirrored mosaics.',
      socialOrSpiritualMessage: 'Joyous communal harmony, hospitality, and vibrant celebration of life.',
      architecturalInspiration: 'Rajasthani Sheesh Mahal mirrored pavilions harmonized with Bengal Chala roofing.',
    },
    artisticStyle: {
      sculptureStyle: 'Regal Traditional Pratima with Resplendent Expressive Eyes',
      artisanOrStudio: 'Leading Kumartuli artisans with family lineage in traditional royal sculpting',
      primaryMaterials: ['Cut Glass', 'Mirrored Mosaics', 'Bell Metal', 'Clay'],
      lightingTechnique: 'Prismatic crystal chandeliers refracting dynamic colors across every wall surface.',
      signatureVisualElement: 'Dazzling reflections bouncing off thousands of mirrors creating a kaleidoscopic sanctuary.',
    },
    culturalRituals: [
      'The legendary Chaltabagan Dhunuchi Naach showcase attended by international photographers',
      'Grand Bijoya Dashami Sindoor Khela celebrating feminine solidarity and auspicious blessings',
    ],
    hopperSecret:
      'Arrive around 8:00 PM on Maha Ashtami to catch the mesmerizing live Dhunuchi Naach with dozens of dancers balancing smoking earthen burners.',
  },

  'sealdah-athletic': {
    pandalId: 'sealdah-athletic',
    heritageTitle: 'Sealdah Railway Athletic Club Durgotsav',
    bengaliTag: 'রেলশহরের গতিশীলতা ও বাংলার ঐতিহ্য',
    significanceBadge: 'Railway Pioneers’ Heritage (Est. 1952)',
    history: {
      foundingYear: 1952,
      originStory:
        'Founded by the railway staff, commuters, and athletes of the historic Sealdah railway terminus, celebrating the city’s tireless pulse and connectivity.',
      historicalMilestone:
        'Known for creative architectural scale and welcoming hundreds of thousands of rural pilgrims arriving at Sealdah Station.',
      prominentFiguresOrLineage: 'Eastern Railway sports champions and local civic leaders.',
    },
    theme: {
      conceptName: 'Lifeline of Bengal (যোগাযোগ ও সম্প্রীতি)',
      conceptDescription:
        'Showcasing the journey of Bengal from vintage steam locomotives to green high-speed transit, anchored around divine protection.',
      socialOrSpiritualMessage: 'Honoring the labor and daily commute of the common working citizen of Bengal.',
      architecturalInspiration: 'Victorian brick railway terminals blended with traditional temple domes.',
    },
    artisticStyle: {
      sculptureStyle: 'Classical Sabeki with Dignified Majestic Expression',
      artisanOrStudio: 'Kumartuli artisans collaborating with railway designers',
      primaryMaterials: ['Wood Planks', 'Brass Rivets', 'Natural Jute', 'Terracotta'],
      lightingTechnique: 'Signal amber, railway lantern effects, and modern warm facade washes.',
      signatureVisualElement: 'Authentic railway artifacts and steam-era memorabilia integrated into the pandal facade.',
    },
    culturalRituals: [
      'Special morning prayer for the safety of railway workers and daily passengers',
      'Open community bhog catering to travelers arriving at Sealdah during the festive days',
    ],
    hopperSecret:
      'Conveniently located within a 5-minute walk from Sealdah Metro station, making it an ideal first or final stop for Central circuits.',
  },

  'ekdalia-evergreen': {
    pandalId: 'ekdalia-evergreen',
    heritageTitle: 'Ekdalia Evergreen Club Durgotsav',
    bengaliTag: 'দক্ষিণ কলকাতার সাবেকিয়ানার স্বর্ণশিখর ও ঝাড়বাতির রাজকীয় রূপ',
    significanceBadge: 'South Kolkata Sabeki Crown (Est. 1943)',
    history: {
      foundingYear: 1943,
      originStory:
        'Conceived in the heart of Gariahat during World War II by local elders to preserve uncompromised Vedic rituals in South Kolkata amid the rising wave of avant-garde theme pujas.',
      historicalMilestone:
        'Nurtured for decades by the late political visionary Subrata Mukherjee; preserved an unyielding rule of never abandoning traditional Ekchala Pratima and temple replicas.',
      prominentFiguresOrLineage: 'Late Subrata Mukherjee, legendary public leader and long-time patron.',
    },
    theme: {
      conceptName: 'Classical Indian Temple Replica (পবিত্র দেবালয়)',
      conceptDescription:
        'Faithful architectural reconstruction of famous historic Indian temples (Meenakshi, Konark, Brihadisvara, or Hampi) with towering Shikhara.',
      socialOrSpiritualMessage: 'Timelessness of Sanatan Vedic devotion standing proud amidst modern trends.',
      architecturalInspiration: 'Dravidian Gopuram and Orissan Deula temple stone architecture.',
    },
    artisticStyle: {
      sculptureStyle: 'Pristine Ekchala Sabeki Pratima with Radiant Golden Shola Ornaments',
      artisanOrStudio: 'Sanatan Rudra Pal studio of Kumartuli—the absolute master of traditional facial expression',
      primaryMaterials: ['Fiberglass Replica Casts', 'Ganga Mud', 'Pure Sholapith', 'Belgian Glass Chandeliers'],
      lightingTechnique: 'The legendary German crystal chandelier suspended from the ceiling dome casting a mesmerizing golden glow.',
      signatureVisualElement: 'The serene, motherly face of Goddess Durga sculpted by Sanatan Rudra Pal, universally revered for its sublime grace.',
    },
    culturalRituals: [
      'Strict adherence to traditional Panjika timings with morning and evening Aarti',
      'Elaborate Pushpanjali filling the entire Ekdalia road on Ashtami morning',
      'Sacred Sandhi Puja offering 108 illuminated brass lamps and lotus flowers',
    ],
    hopperSecret:
      'Look straight up inside the sanctorum to admire the gigantic illuminated chandelier imported from Europe, a signature hallmark since the 1970s.',
  },

  'singhi-park': {
    pandalId: 'singhi-park',
    heritageTitle: 'Singhi Park Sarbojanin Durgotsav',
    bengaliTag: 'ঐতিহাসিক মন্দির স্থাপত্য ও আলোকসজ্জার জাদুকরী রূপ',
    significanceBadge: 'Temple Architecture Haven (Est. 1941)',
    history: {
      foundingYear: 1941,
      originStory:
        'Located right across Gariahat from Ekdalia Evergreen, Singhi Park was founded by the prominent residents of Dover Terrace and Gariahat.',
      historicalMilestone:
        'Renowned for pioneering the grand "temple replica" format in South Kolkata, paired with the most elaborate Chandannagar light panels in the city.',
      prominentFiguresOrLineage: 'Singhi estate family and Dover Terrace patrons.',
    },
    theme: {
      conceptName: 'Sanctuary of Ancient Temples (মন্দির পরিক্রমা)',
      conceptDescription:
        'Exact miniature structural replicas of ancient Indian architectural wonders carved with thousands of sculptural motifs.',
      socialOrSpiritualMessage: 'Connecting modern urban youth to the architectural genius of ancient Indian master masons.',
      architecturalInspiration: 'Badami cave temples, Khajuraho stone carvings, or Hoysala star-shaped sanctums.',
    },
    artisticStyle: {
      sculptureStyle: 'Classical Ekchala with Rich Velvet and Gold Zari Drapes',
      artisanOrStudio: 'Kumartuli master sculptors of the Pal family',
      primaryMaterials: ['Plywood Architecture', 'Stone Powder Casts', 'Gilt Foil', 'Clay'],
      lightingTechnique: 'Magnificent Chandannagar animated light gates illustrating episodes from Ramayana and Mahabharata.',
      signatureVisualElement: 'The towering multi-tiered temple spire visible from Gariahat flyover.',
    },
    culturalRituals: [
      'Daily Sandhya Aarti accompanied by resonant triple-Dhaak beats and Shankha dhwani',
      'Bijoya Dashami Sindoor Khela celebrated with generations of South Kolkata women',
    ],
    hopperSecret:
      'Walk through the lit approach road from Dover Lane to experience the storytelling light panels before entering the main courtyard.',
  },

  'tridhara-sammilani': {
    pandalId: 'tridhara-sammilani',
    heritageTitle: 'Tridhara Sammilani Durgotsav',
    bengaliTag: 'ত্রিধারার সঙ্গমে সমকালীন শিল্প, চিন্তা ও নান্দনিক বিপ্লব',
    significanceBadge: 'Avant-Garde Theme Titan (Est. 1947)',
    history: {
      foundingYear: 1947,
      originStory:
        'Founded in the year of India’s independence at the confluence of three iconic South Kolkata roads (Manoharpukur, Rashbehari, Mahanirban), hence the name "Tridhara" (three streams).',
      historicalMilestone:
        'Consistently dominates modern Durga Puja awards, pioneering cutting-edge conceptual art installations that provoke deep introspection.',
      prominentFiguresOrLineage: 'Led by Debasish Kumar and celebrated Bengal artistic directors.',
    },
    theme: {
      conceptName: 'Philosophical Art Odyssey (চিরায়ত চিন্তা ও সমকালীন শিল্প)',
      conceptDescription:
        'Multisensory art installation confronting contemporary existential, spiritual, and environmental themes through abstract sculptural storytelling.',
      socialOrSpiritualMessage: 'Awakening of human consciousness and universal compassion.',
      architecturalInspiration: 'Modern Scandinavian minimalism fused with primitive tribal shrines and organic earth formations.',
    },
    artisticStyle: {
      sculptureStyle: 'Experimental Sculptural Idol with Deep Stylized Elegance',
      artisanOrStudio: 'Master contemporary Bengal artists (Bhabatosh Sutar, Gouranga Kuila, or Pradip Das lineage)',
      primaryMaterials: ['Cast Iron', 'Carved Teak', 'Hand-hammered Copper', 'Organic Earthen Mortar'],
      lightingTechnique: 'Architectural mood illumination with dynamic shadow play cast across textured relief walls.',
      signatureVisualElement: 'The unconventional, deeply emotional sculptural rendering of Devi Durga merging with the landscape.',
    },
    culturalRituals: [
      'Curated music compositions and poetry recitations playing throughout the sanctum',
      'Pushpanjali where attendees receive natural bilva patra in eco-friendly leaf cups',
    ],
    hopperSecret:
      'Visit in the early hours (3:00 AM - 5:30 AM) when the ambient soundscape and artistic shadows create an almost surreal sanctuary.',
  },

  'hindustan-park': {
    pandalId: 'hindustan-park',
    heritageTitle: 'Hindustan Park Sarbojanin Durgotsav',
    bengaliTag: 'দক্ষিণ কলকাতার শৈল্পিক ঐতিহ্য ও গ্রামবাংলার লোকশিল্প',
    significanceBadge: 'Folk Art & Aesthetic Pioneer (Est. 1931)',
    history: {
      foundingYear: 1931,
      originStory:
        'Began as an intimate neighborhood puja in the aristocratic residential enclave of Hindustan Park, home to renowned Bengali artists, writers, and thinkers.',
      historicalMilestone:
        'Earned international renown for transforming their compact urban lane into an immersive, museum-grade folk art installation.',
      prominentFiguresOrLineage: 'Associated with Bengal school artists and Santiniketan scholars.',
    },
    theme: {
      conceptName: 'Living Soul of Bengal Folk Craft (বাংলার লোকজীবনের গান)',
      conceptDescription:
        'Celebrating endangered indigenous folk arts such as Dokra metal craft, Patachitra scrolls, Chhau masks, or terracotta toys.',
      socialOrSpiritualMessage: 'Sustaining rural artistic traditions and honoring the anonymous village artisan.',
      architecturalInspiration: 'Rural mud houses with thatched roofs, wooden courtyards, and hand-painted alpona floors.',
    },
    artisticStyle: {
      sculptureStyle: 'Stylized Folk Pratima infused with rural warmth and grace',
      artisanOrStudio: 'Folk master artisans invited from Purulia, Bankura, and Pingla',
      primaryMaterials: ['Dokra Brass', 'Natural Patachitra Pigments', 'Palm Thatch', 'Terracotta'],
      lightingTechnique: 'Subtle warm ambient lanterns mimicking rural oil lamps and soft morning sunlight.',
      signatureVisualElement: 'Intricate hand-painted Alpona motifs covering the entire walkway leading into the sanctum.',
    },
    culturalRituals: [
      'Live demonstration by folk scroll painters (Patuas) chanting traditional ballads outside the pandal',
      'Community feast bringing together historic residents of Dover and Hindustan Park',
    ],
    hopperSecret:
      'Look for the miniature folk curios and Patachitra scrolls that adorn the exit corridor—many can be purchased from the visiting rural artisans.',
  },

  'deshapriya-park': {
    pandalId: 'deshapriya-park',
    heritageTitle: 'Deshapriya Park Durgotsav',
    bengaliTag: 'বিশালতার বিস্ময় ও রূপকথার জীবন্ত রূপায়ণ',
    significanceBadge: 'Monumental Wonder (Est. 1937)',
    history: {
      foundingYear: 1937,
      originStory:
        'Set inside South Kolkata’s largest recreational park named after patriot Deshapriya JM Sengupta. Known for creating some of the largest pandal structures in Asia.',
      historicalMilestone:
        'Created world headlines in 2015 by erecting an 88-foot tall Durga idol, creating unprecedented traffic and requiring special urban safety protocols.',
      prominentFiguresOrLineage: 'Commemorating Deshapriya Jatindra Mohan Sengupta.',
    },
    theme: {
      conceptName: 'Colosseum of Myth & Grandeur (মহাকাব্যিক স্থাপত্য)',
      conceptDescription:
        'Massive architectural constructions replicating iconic world temples, ancient monuments, or mythical celestial palaces on an immense scale.',
      socialOrSpiritualMessage: 'The infinite, boundless omnipresence of the Divine Mother encompassing all creation.',
      architecturalInspiration: 'Hellenistic palaces, Thai Buddhist pagodas, or grand Mayan and Indian temples.',
    },
    artisticStyle: {
      sculptureStyle: 'Majestic Heroic Idol with Towering Presence',
      artisanOrStudio: 'Senior sculptors collaborating with structural civil engineers',
      primaryMaterials: ['Structural Steel Trusses', 'Fiberglass Relief', 'Gilt Metal Sheeting', 'Clay'],
      lightingTechnique: 'Stadium-scale architectural illumination and laser sky-beams visible across South Kolkata.',
      signatureVisualElement: 'The sheer scale of the pandal soaring 70+ feet into the night sky over Rashbehari Avenue.',
    },
    culturalRituals: [
      'Grand Vedic Yajna and Sandhi Puja conducted with immense ritual paraphernalia',
      'Massive crowd management with state-of-the-art security and drone surveillance',
    ],
    hopperSecret:
      'Enter from the southern gate of Deshapriya Park off Priya Cinema for smoother crowd throughput during peak hours.',
  },

  'ballygunge-cultural': {
    pandalId: 'ballygunge-cultural',
    heritageTitle: 'Ballygunge Cultural Association',
    bengaliTag: 'নান্দনিক সংস্কৃতি, আধুনিক ভাবনা ও সাবেকি আভিজাত্য',
    significanceBadge: 'Refined Cultural Pioneer (Est. 1951)',
    history: {
      foundingYear: 1951,
      originStory:
        'Founded by the cultural elite and scholars of Ballygunge. Dedicated to presenting refined, intellectually stimulating themes without sensory cacophony.',
      historicalMilestone:
        'Celebrated for pristine environmental design, social consciousness, and showcasing museum-quality installations that win top artistic accolades.',
      prominentFiguresOrLineage: 'Renowned writers, classical musicians, and university professors of South Kolkata.',
    },
    theme: {
      conceptName: 'Ode to Literature, Art & Social Renewal',
      conceptDescription:
        'Aesthetic exploration of Tagore’s literature, ecological preservation, or forgotten rural crafts transformed into contemporary fine art.',
      socialOrSpiritualMessage: 'Intellectual enlightenment, gentleness of spirit, and non-violence.',
      architecturalInspiration: 'Santiniketan architecture, open-air courtyards, and organic earthen structures.',
    },
    artisticStyle: {
      sculptureStyle: 'Poetic Sculptural Elegance with Serene Facial Demeanor',
      artisanOrStudio: 'Acclaimed fine arts graduates and sculptors from Visva-Bharati Santiniketan',
      primaryMaterials: ['Sholapith', 'Terracotta', 'Handmade Paper', 'Natural Clay Dyes'],
      lightingTechnique: 'Muted, elegant museum illumination allowing visitors to appreciate fine textural subtleties.',
      signatureVisualElement: 'The calm, compassionate smile of the deity radiating peaceful maternal grace.',
    },
    culturalRituals: [
      'All-morning Rabindra Sangeet and classical instrumental sessions during festival days',
      'Thoughtful community bhog prepared with organic ingredients served in sal leaf plates',
    ],
    hopperSecret:
      'Take time to read the beautifully written Bengali and English curatorial plaques placed throughout the walkway.',
  },

  'mudiali-club': {
    pandalId: 'mudiali-club',
    heritageTitle: 'Mudiali Club Durgotsav',
    bengaliTag: 'সাবেকিয়ানার জৌলুস ও সোনার আলোয় উদ্ভাসিত পরিবেশনা',
    significanceBadge: 'South Kolkata Jewel (Est. 1935)',
    history: {
      foundingYear: 1935,
      originStory:
        'Established by the historic Mudiali neighborhood residents near Southern Avenue lakes. Known as one of the most aesthetically immaculate pujas in South Kolkata.',
      historicalMilestone:
        'Winner of dozens of Sharad Shamman trophies for combining traditional Ekchala idols with intricately handcrafted decorative backdrops made from copper, conch shells, and shola.',
      prominentFiguresOrLineage: 'Generational families of Mudiali and Rabindra Sarobar lake community.',
    },
    theme: {
      conceptName: 'Golden Sanctum of Devotion (স্বর্ণাভ ভক্তিধাম)',
      conceptDescription:
        'Breathtakingly detailed hall of worship featuring millions of handcrafted elements, embossed brass medallions, and glowing chandeliers.',
      socialOrSpiritualMessage: 'Devotion as a sacred inner refuge that purifies the soul.',
      architecturalInspiration: 'Classical Indian temple sanctums adorned with ornate mandapas and toranas.',
    },
    artisticStyle: {
      sculptureStyle: 'Pristine Traditional Ekchala with Regal Daaker Saaj',
      artisanOrStudio: 'Legendary Kumartuli sculptors carrying on family traditions',
      primaryMaterials: ['Embossed Copper & Brass Plates', 'Pure White Sholapith', 'Clay', 'Silk Fabrics'],
      lightingTechnique: 'A warm golden glow that fills the inner hall, reflecting off polished metallic foils.',
      signatureVisualElement: 'The breathtaking Chalchitra backdrop carved with immaculate geometric and floral symmetry.',
    },
    culturalRituals: [
      'Punctual ritual pushpanjali accompanied by conch shells and sacred Vedic chants',
      'One of South Kolkata’s most orderly, graceful queue corridors flanked by lush greenery',
    ],
    hopperSecret:
      'Located within walking distance of Shib Mandir and Lake Kalibari—perfect to combine into a tranquil morning walk route.',
  },

  'suruchi-sangha': {
    pandalId: 'suruchi-sangha',
    heritageTitle: 'Suruchi Sangha Durgotsav',
    bengaliTag: 'এক ভারত, শ্রেষ্ঠ ভারতের রাজ্য পরিক্রমা ও জাতীয় ঐক্য',
    significanceBadge: 'Pan-Indian Cultural Showcase (Est. 1954)',
    history: {
      foundingYear: 1954,
      originStory:
        'Located in New Alipore, Suruchi Sangha pioneered the concept of adopting a different Indian state or culture every year, celebrating the incredible diversity of India.',
      historicalMilestone:
        'Every year, master artisans, dancers, and folk artists travel from the chosen state to build authentic pavilions (e.g. Kashmir, Rajasthan, Kerala, Goa, Assam).',
      prominentFiguresOrLineage: 'Spearheaded by Aroop Biswas and prominent cultural patrons.',
    },
    theme: {
      conceptName: 'States of India Cultural Odyssey (রাজ্য পরিক্রমা)',
      conceptDescription:
        'Immersive replica of a distinct Indian state’s traditional village, temple architecture, and cultural handicrafts accompanied by authentic regional theme music.',
      socialOrSpiritualMessage: 'National integration, celebrating unity across diverse linguistic and cultural traditions.',
      architecturalInspiration: 'Authentic regional vernacular architecture from across India.',
    },
    artisticStyle: {
      sculptureStyle: 'State-Themed Stylized Durga Idol draped in Authentic Regional Handloom',
      artisanOrStudio: 'Joint collaboration between Kumartuli sculptors and visiting state master artisans',
      primaryMaterials: ['Authentic State Handlooms', 'Regional Wood & Stone', 'Terracotta', 'Clay'],
      lightingTechnique: 'Dynamic architectural lighting paired with customized regional musical anthems.',
      signatureVisualElement: 'The Goddess draped in rare, authentic GI-tagged handlooms (e.g. Kanjeevaram, Pashmina, Muga silk).',
    },
    culturalRituals: [
      'Live traditional dance and musical troupes performing authentic regional arts on the open stage',
      'Theme song written specifically for the puja composed by Bengal’s top music directors',
    ],
    hopperSecret:
      'Listen closely to the customized theme song playing on the approach boulevard—it is recorded every year especially for the theme.',
  },
};

/**
 * Fetch cultural and historical highlights for a pandal based on its ID
 */
export function getPandalCulturalHighlight(
  pandalId: string,
  pandalName?: string,
  region: 'NORTH' | 'CENTRAL' | 'SOUTH' = 'NORTH'
): PandalCulturalHighlight {
  if (PANDAL_CULTURAL_REGISTRY[pandalId]) {
    return PANDAL_CULTURAL_REGISTRY[pandalId];
  }

  // Fallback for custom or extended pandals
  const regionName = region === 'NORTH' ? 'North Kolkata' : region === 'CENTRAL' ? 'Central Kolkata' : 'South Kolkata';
  return {
    pandalId,
    heritageTitle: pandalName || 'Heritage Durgotsav',
    bengaliTag: `${regionName} বনেদি ঐতিহ্য ও সাবেকিয়ানা`,
    significanceBadge: `${regionName} Cultural Landmark`,
    history: {
      originStory: `A cherished community celebration in ${regionName}, preserving ancestral traditions and bringing neighborhoods together in joyous devotion.`,
      historicalMilestone: `Deeply rooted in the social fabric of Bengal’s sacred autumn festivities, carrying forward community Barowari harmony.`,
    },
    theme: {
      conceptName: 'Eternal Devotion & Cultural Harmony',
      conceptDescription: 'A sacred synthesis of traditional Bengali craftsmanship, community volunteerism, and devotional celebration.',
      socialOrSpiritualMessage: 'Unity, preservation of cultural roots, and triumph of good over darkness.',
      architecturalInspiration: 'Traditional Bengali Chala and Thakurdalan architecture.',
    },
    artisticStyle: {
      sculptureStyle: 'Traditional Clay Sculpture with Classic Drapes',
      artisanOrStudio: 'Hereditary Kumartuli Artisan Studio',
      primaryMaterials: ['Alluvial Ganga Clay', 'Straw & Bamboo', 'Natural Earth Colors'],
      lightingTechnique: 'Festive Chandannagar ornamental lighting',
      signatureVisualElement: 'Divine Pratima sculpted with motherly compassion and protective triumph.',
    },
    culturalRituals: [
      'Morning Pushpanjali and Sandhya Aarti with traditional Dhakis',
      'Community Bhog distribution and Bijoya Dashami celebration',
    ],
    hopperSecret: 'Visit during early morning hours to enjoy peaceful darshan before evening queue peaks.',
  };
}
