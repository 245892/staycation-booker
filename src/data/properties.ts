import { Property } from '@/types/booking';

// Unit 101 – Emerald Accents (AI-Generated)
import moa101Hero from '@/assets/gallery/gallery_101_hero.png';
import moa101Detail from '@/assets/gallery/gallery_101_detail.png';
import moa101View from '@/assets/gallery/gallery_101_view.png';
import moa101Bath from '@/assets/gallery/gallery_101_bathroom.png';
import moa101Life from '@/assets/gallery/gallery_101_lifestyle.png';

// Unit 102 – Navy Accents (AI-Generated)
import moa102Hero from '@/assets/gallery/gallery_102_hero.png';
import moa102Detail from '@/assets/gallery/gallery_102_detail.png';
import moa102View from '@/assets/gallery/gallery_102_view.png';
import moa102Bath from '@/assets/gallery/gallery_102_bathroom.png';
import moa102Life from '@/assets/gallery/gallery_102_lifestyle.png';

// Unit 103 – Burnt Orange Accents (AI-Generated)
import moa103Hero from '@/assets/gallery/gallery_103_hero.png';
import moa103Detail from '@/assets/gallery/gallery_103_detail.png';
import moa103View from '@/assets/gallery/gallery_103_view.png';
import moa103Bath from '@/assets/gallery/gallery_103_bathroom.png';
import moa103Life from '@/assets/gallery/gallery_103_lifestyle.png';

// Units 201–303 – Curated Unsplash premium galleries (distinct per unit, no duplication)

// Unit 201 – Ruby Red Accents
const moa201Gallery = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1604076913837-52ab5629fde4?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?q=80&w=2070&auto=format&fit=crop',
];

// Unit 202 – Deep Teal Accents
const moa202Gallery = [
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594563703937-fdc640497dcd?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
];

// Unit 203 – Mustard Yellow Accents
const moa203Gallery = [
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?q=80&w=2070&auto=format&fit=crop',
];

// Unit 301 – Amethyst Purple Accents
const moa301Gallery = [
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop',
];

// Unit 302 – Charcoal Grey Accents
const moa302Gallery = [
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564078516393-cf04bd966897?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop',
];

// Unit 303 – Champagne Gold Accents
const moa303Gallery = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=2070&auto=format&fit=crop',
];

export const properties: Property[] = [
  {
    id: 'moa-101', name: 'Bay Breeze Suite', floor: '10th Floor',
    description: 'Wake up to stunning Manila Bay sunsets from this elegantly appointed unit featuring floor-to-ceiling windows.',
    amenities: ['King Bed', 'Sofa Bed', 'WiFi', 'Kitchen', 'Pool Access', 'Bay View'],
    maxGuests: 4, pricePerNight: 3500, imageIndex: 0,
    gallery: [moa101Hero, moa101Detail, moa101View, moa101Bath, moa101Life],
    rating: 4.9, bestFeature: 'Walking distance to MOA Arena', sqft: 32, wifi: '100Mbps',
  },
  {
    id: 'moa-102', name: 'Skyline Studio', floor: '15th Floor',
    description: 'A modern studio with panoramic city views, perfect for couples or small families seeking urban comfort.',
    amenities: ['King Bed', 'Sofa Bed', 'WiFi', 'Kitchen', 'Pool Access', 'City View'],
    maxGuests: 4, pricePerNight: 3200, imageIndex: 1,
    gallery: [moa102Hero, moa102Detail, moa102View, moa102Bath, moa102Life],
    rating: 4.8, bestFeature: 'Panoramic city views from bed', sqft: 28, wifi: '50Mbps',
  },
  {
    id: 'moa-103', name: 'Sunset Haven', floor: '12th Floor',
    description: 'Enjoy golden-hour views from your private retreat, complete with premium amenities and cozy interiors.',
    amenities: ['King Bed', 'Sofa Bed', 'WiFi', 'Kitchen', 'Pool Access', 'Sunset View'],
    maxGuests: 4, pricePerNight: 3800, imageIndex: 2,
    gallery: [moa103Hero, moa103Detail, moa103View, moa103Bath, moa103Life],
    rating: 4.9, bestFeature: 'Premium interiors with warm lighting', sqft: 30, wifi: '150Mbps',
  },
  {
    id: 'moa-201', name: 'Harbor View Loft', floor: '20th Floor',
    description: 'Elevated living at its finest with harbor views and contemporary design throughout.',
    amenities: ['King Bed', 'Sofa Bed', 'WiFi', 'Kitchen', 'Pool Access', 'Harbor View'],
    maxGuests: 4, pricePerNight: 4000, imageIndex: 3,
    gallery: moa201Gallery,
    rating: 4.7, bestFeature: 'High-floor harbor view loft', sqft: 35, wifi: '100Mbps',
  },
  {
    id: 'moa-202', name: 'Coastal Retreat', floor: '18th Floor',
    description: 'A serene escape with coastal-inspired interiors and premium bedding for the ultimate relaxation.',
    amenities: ['King Bed', 'Sofa Bed', 'WiFi', 'Kitchen', 'Pool Access', 'Sea View'],
    maxGuests: 4, pricePerNight: 3600, imageIndex: 4,
    gallery: moa202Gallery,
    rating: 4.8, bestFeature: 'Coastal-inspired serene escape', sqft: 31, wifi: '100Mbps',
  },
  {
    id: 'moa-203', name: 'Metro Luxe Suite', floor: '22nd Floor',
    description: 'Top-floor luxury with wraparound city views and designer furnishings.',
    amenities: ['King Bed', 'Sofa Bed', 'WiFi', 'Kitchen', 'Pool Access', 'Panoramic View'],
    maxGuests: 4, pricePerNight: 4200, imageIndex: 5,
    gallery: moa203Gallery,
    rating: 5.0, bestFeature: 'Top-floor luxury with wrap-around views', sqft: 40, wifi: '200Mbps',
  },
  {
    id: 'moa-301', name: 'Garden Terrace', floor: '8th Floor',
    description: 'A tranquil unit overlooking landscaped gardens, ideal for those who prefer a quieter stay.',
    amenities: ['King Bed', 'Sofa Bed', 'WiFi', 'Kitchen', 'Pool Access', 'Garden View'],
    maxGuests: 4, pricePerNight: 3000, imageIndex: 6,
    gallery: moa301Gallery,
    rating: 4.6, bestFeature: 'Tranquil garden terrace retreat', sqft: 29, wifi: '50Mbps',
  },
  {
    id: 'moa-302', name: 'Moonlight Studio', floor: '16th Floor',
    description: 'Modern minimalist design with ambient lighting and spectacular nighttime city views.',
    amenities: ['King Bed', 'Sofa Bed', 'WiFi', 'Kitchen', 'Pool Access', 'Night View'],
    maxGuests: 4, pricePerNight: 3400, imageIndex: 7,
    gallery: moa302Gallery,
    rating: 4.8, bestFeature: 'Modern minimalist night-sky views', sqft: 28, wifi: '100Mbps',
  },
  {
    id: 'moa-303', name: 'Pearl Suite', floor: '25th Floor',
    description: 'Our premium corner unit offering dual-aspect views of the bay and the city skyline.',
    amenities: ['King Bed', 'Sofa Bed', 'WiFi', 'Kitchen', 'Pool Access', 'Dual View'],
    maxGuests: 4, pricePerNight: 4500, imageIndex: 8,
    gallery: moa303Gallery,
    rating: 4.9, bestFeature: 'Dual-aspect views of bay and city', sqft: 42, wifi: '200Mbps',
  },
];
