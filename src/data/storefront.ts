import type { BundleCombo, HeroSlide, LifestyleTile } from '../types';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-audio',
    eyebrow: 'FLAGSHIP AUDIO DROP • 42dB HYBRID ANC',
    title: 'Next-Gen Audio, Zero Compromise',
    highlightWord: 'Zero Compromise',
    subtitle:
      '12.4mm titanium drivers, 45H runtime, and feather-matte acoustic shells built for pure studio clarity.',
    ctaLabel: 'Shop Audio Drops',
    secondaryCtaLabel: 'Inspect UB Pods',
    targetCategory: 'tws-earbuds',
    featuredProductId: 'ub-tws-anc-01',
    image: '/assets/hero-audio.jpg',
    gradientLight: 'from-[#F7FAF8] via-[#EDF8F2] to-[#DFF3E9]',
    gradientDark: 'from-[#161920] via-[#192023] to-[#1B2724]',
    pillTint: '#7ED4AD',
    floatingBadge: {
      label: 'AirWave ANC Pro',
      metric: '42dB ANC • ₹1,699',
    },
  },
  {
    id: 'slide-charge',
    eyebrow: 'GaN III ECOSYSTEM • UP TO 100W PD',
    title: 'Hyper-Charge Ecosystem',
    highlightWord: 'Hyper-Charge',
    subtitle:
      'Power your laptop, MagSafe phone, and earbuds at once. Cool-matrix 65W GaN adapters, 15W MagSnap banks, and 100W ballistic braided cables.',
    ctaLabel: 'Explore GaN Power',
    secondaryCtaLabel: 'View 65W GaN',
    targetCategory: 'fast-chargers',
    featuredProductId: 'ub-gan-65w-01',
    image: '/assets/hero-charge.jpg',
    gradientLight: 'from-[#FAF9FC] via-[#F2F0FC] to-[#E9E6FD]',
    gradientDark: 'from-[#16171F] via-[#1D1D2B] to-[#232237]',
    pillTint: '#B8B8FF',
    floatingBadge: {
      label: 'HyperGaN 65W',
      metric: '3-Port • ₹1,799',
    },
  },
  {
    id: 'slide-wear',
    eyebrow: 'NEW SEASON WEARABLES • 60Hz AMOLED',
    title: 'Wear Your Vibe',
    highlightWord: 'Your Vibe',
    subtitle:
      '1.96" Always-On AMOLED smartwatches and 60-hour liquid-silicone neckbands crafted for daily performance.',
    ctaLabel: 'Shop Wearables',
    secondaryCtaLabel: 'View Horizon Watch',
    targetCategory: 'smartwatches',
    featuredProductId: 'ub-watch-amoled-01',
    image: '/assets/hero-wear.jpg',
    gradientLight: 'from-[#FCF9F7] via-[#FDF0EB] to-[#FCE4DB]',
    gradientDark: 'from-[#19171B] via-[#221C1E] to-[#2B2121]',
    pillTint: '#FF9B85',
    floatingBadge: {
      label: 'Horizon AMOLED',
      metric: '60Hz Call • ₹2,299',
    },
  },
];

export const LIFESTYLE_TILES: LifestyleTile[] = [
  {
    id: 'wfh',
    title: 'Work From Home',
    subtitle: 'Ergonomic CNC stands, 70H ANC studio cans & clutter-free GaN desk hubs.',
    tag: 'CREATOR DESK',
    image: '/assets/lifestyle-wfh.jpg',
    spanClass: 'md:col-span-2 md:row-span-2',
    accentHex: '#8ECAE6',
    featuredSkus: ['ub-hp-studio-02', 'ub-stand-alu-03', 'ub-gan-100w-03'],
  },
  {
    id: 'gaming',
    title: 'Pro Gaming',
    subtitle: '40ms zero-lag BlitzX buds & 100W E-Marker braided leads.',
    tag: '40MS SYNC',
    image: '/assets/lifestyle-gaming.jpg',
    spanClass: 'md:col-span-2 md:row-span-1',
    accentHex: '#7ED4AD',
    featuredSkus: ['ub-tws-game-02', 'ub-cable-100w-01'],
  },
  {
    id: 'travel',
    title: 'Travel & Fast Charge',
    subtitle: 'MagSafe slim banks, 65W GaN plugs & alloy car adapters.',
    tag: 'FLIGHT READY',
    image: '/assets/lifestyle-travel.jpg',
    spanClass: 'md:col-span-1 md:row-span-1',
    accentHex: '#B8B8FF',
    featuredSkus: ['ub-pb-mag-01', 'ub-gan-65w-01', 'ub-car-dual-01'],
  },
  {
    id: 'fitness',
    title: 'Fitness & Outdoors',
    subtitle: '5ATM GPS watches & sweat-proof IPX7 sport neckbands.',
    tag: '5ATM + IPX7',
    image: '/assets/lifestyle-fitness.jpg',
    spanClass: 'md:col-span-1 md:row-span-1',
    accentHex: '#FF9B85',
    featuredSkus: ['ub-watch-rugged-02', 'ub-nb-sport-03'],
  },
];

export const POWER_COMBOS: BundleCombo[] = [
  {
    id: 'combo-nomad',
    title: 'Hyper-Charge Nomad Kit',
    subtitle: 'HyperGaN 65W 3-Port + ArmorWeave 100W USB-C Cable',
    badge: 'SAVE ₹399 EXTRA',
    productIds: ['ub-gan-65w-01', 'ub-cable-100w-01'],
    comboPrice: 1899,
    combinedMrp: 4998,
    pastelBg: 'from-cloud to-surface',
  },
  {
    id: 'combo-commuter',
    title: 'Daily Audio + Power Duo',
    subtitle: 'UB AirWave ANC Pods + MagSnap 10,000mAh Wireless Slim',
    badge: 'SAVE ₹599 EXTRA',
    productIds: ['ub-tws-anc-01', 'ub-pb-mag-01'],
    comboPrice: 3199,
    combinedMrp: 7998,
    pastelBg: 'from-accent-soft to-surface',
  },
  {
    id: 'combo-desk',
    title: 'Desk & Drive Essentials',
    subtitle: 'Origami Aluminum Stand + AlloyDrive 60W Dual Car Adapter',
    badge: 'SAVE ₹299 EXTRA',
    productIds: ['ub-stand-alu-03', 'ub-car-dual-01'],
    comboPrice: 1399,
    combinedMrp: 3598,
    pastelBg: 'from-cloud to-accent-soft',
  },
];

export const MARQUEE_MESSAGES = [
  '⚡ Free Express Shipping above ₹499',
  '🛡️ 1-Year Instant Replacement Warranty across 700+ Centers',
  '🎁 Use Code UPDATE10 for Flat 10% OFF at Checkout',
  '🚀 Same-Day Dispatch on Orders before 4 PM IST',
  '🧾 100% GST Tax Invoice Available on All Business Orders',
];
