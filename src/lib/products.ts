export type ProductSlug = 'speedair-pro' | 'speedair-coastal' | 'rowbill-lite' | 'rowbill-speed';

export interface ProductMediaItem {
  type: 'image' | 'youtube';
  src: string; // for image: "/images/ayger/..."; for youtube: full URL
  alt?: string;
  poster?: string; // optional preview for videos
}

export interface ProductRecord {
  slug: ProductSlug;
  name: string;
  priceEur: number;
  summary: string; // short blurb
  bullets: string[]; // key features bullets
  overview?: string; // long copy for PDP
  badges?: string[];
  media: ProductMediaItem[];
}

const img = (file: string) => `/images/ayger/${file}`;

export const PRODUCTS: ProductRecord[] = [
  {
    slug: 'speedair-pro',
    name: 'SpeedAir Pro Racing Sculls',
    priceEur: 899,
    summary: 'Designed for Champions – Lighter, Faster, Stronger!',
    bullets: [
      'Ultra-Light Design – 500 grams lighter than competitors. Less weight, more speed!',
      'Low Wind Resistance – Aerodynamic structure minimizes wind impact for max efficiency.',
      'Perfect Water Entry & Exit – Minimal resistance, smoother strokes, ultimate performance.',
    ],
    badges: ['Made in Germany 🇩🇪', 'New'],
    media: [
      { type: 'youtube', src: 'https://youtube.com/shorts/qdivVy9Qu6I?si=FNno7JUvkYEVBYbd', poster: img('speed air pro product 1.jpg') },
      { type: 'youtube', src: 'https://youtube.com/shorts/yFl49AgJPHM?si=b2ZSaxpt6uQfVp8s', poster: img('speed air pro product 2.jpg') },
      { type: 'youtube', src: 'https://youtube.com/shorts/KPuSwrWjN7c?si=Q4OXoHlhzmp7ZL2u', poster: img('speed air pro product 3.jpg') },
      { type: 'youtube', src: 'https://youtube.com/shorts/qdivVy9Qu6I?si=vPv5ixg4-YZphSch', poster: img('speed air pro product 4.jpg') },
      { type: 'image', src: img('speed air pro product 1.jpg'), alt: 'SpeedAir Pro product 1' },
      { type: 'image', src: img('speed air pro product 2.jpg'), alt: 'SpeedAir Pro product 2' },
      { type: 'image', src: img('speed air pro product 3.jpg'), alt: 'SpeedAir Pro product 3' },
      { type: 'image', src: img('speed air pro product 4.jpg'), alt: 'SpeedAir Pro product 4' },
    ],
  },
  {
    slug: 'speedair-coastal',
    name: 'SpeedAir Coastal',
    priceEur: 599,
    summary: 'Designed for Champions – Lighter, Faster, Stronger!',
    bullets: [
      'Ultra-Light Design – 500 grams lighter than competitors. Less weight, more speed!',
      'Low Wind Resistance – Aerodynamic structure minimizes wind impact for max efficiency.',
      'Perfect Water Entry & Exit – Minimal resistance, smoother strokes, ultimate performance.',
    ],
    badges: ['Made in Germany 🇩🇪'],
    media: [
      { type: 'image', src: img('speedair coastal product 1.png'), alt: 'SpeedAir Coastal product 1' },
      { type: 'image', src: img('speedair coastal product 2.jpeg'), alt: 'SpeedAir Coastal product 2' },
      { type: 'image', src: img('speedair coastal product 3.png'), alt: 'SpeedAir Coastal product 3' },
    ],
  },
  {
    slug: 'rowbill-lite',
    name: 'RowBill Lite',
    priceEur: 99,
    summary: 'Take Control of Your Rowing – Simple, Durable, Effective!',
    bullets: [
      'Track Your Pace – real-time stroke count + duration.',
      'Affordable & High-Value – budget-friendly, high impact.',
      'Tough & Durable – built for intense training.',
      'Vibrant Colors, Sleek Design – eye-catching options.',
      '🏆 Row Smarter, Improve Faster! Perfect for beginners and competitors.',
    ],
    badges: ['Made in Germany 🇩🇪'],
    media: [
      { type: 'youtube', src: 'https://youtube.com/shorts/SVExeopZ0UU?si=LahIRdvjo3qvhb2u', poster: img('rowbill lite product photo 1.png') },
      { type: 'image', src: img('rowbill lite product photo 1.png'), alt: 'RowBill Lite product 1' },
      { type: 'image', src: img('rowbill lite product photo 2.png'), alt: 'RowBill Lite product 2' },
      { type: 'image', src: img('rowbill lite product photo 3.png'), alt: 'RowBill Lite product 3' },
    ],
  },
  {
    slug: 'rowbill-speed',
    name: 'RowBill Speed',
    priceEur: 330,
    summary: 'RowBill Speed / the all new GPS rowing Monitor — Made in Germany 🇩🇪',
    bullets: [
      'High-precision GPS sensor',
      'Bright, full-color OLED display',
      '3 rowing modes: Distance/Time, Interval, Free',
      'Cycling mode – BLE cadence sensors',
      'HR tracking – BLE HR sensor',
      '15-hour battery – USB-C fast charging',
      'Built-in memory – records all sessions',
      'Mounting hardware included',
    ],
    overview: 'Overview will be provided verbatim per content spec.',
    badges: ['Made in Germany 🇩🇪'],
    media: [
      { type: 'youtube', src: 'https://youtube.com/shorts/j_g8nd-3lg8?si=OcoFMCTfwzqUFKF3', poster: img('RowBill Speed Product 1.png') },
      { type: 'youtube', src: 'https://youtube.com/shorts/E3eL2fa6PmM?si=IQBJ5aEVnj-fWdp7', poster: img('RowBill Speed Product 1.png') },
      { type: 'youtube', src: 'https://youtube.com/shorts/j_g8nd-3lg8?si=cOfnnHz6EteVKa7D', poster: img('RowBill Speed Product 1.png') },
      { type: 'youtube', src: 'https://youtube.com/shorts/E3eL2fa6PmM?si=ErXCy8a7p4C5Usft', poster: img('RowBill Speed Product 1.png') },
      { type: 'image', src: img('RowBill Speed Product 1.png'), alt: 'RowBill Speed product 1' },
    ],
  },
];

export function getProductBySlug(slug: string): ProductRecord | undefined {
  return PRODUCTS.find(p => p.slug === slug as ProductSlug);
}

export function formatPriceEur(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}


