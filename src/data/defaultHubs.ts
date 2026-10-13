import { HubLocation } from '../types';

export const POPULAR_STARTING_HUBS: HubLocation[] = [
  // North Kolkata Hubs
  {
    name: 'Shyambazar 5-Point Crossing',
    description: 'Heart of North Kolkata, Netaji Statue & Metro Gate 1',
    coords: { lat: 22.6001, lng: 88.3712 },
    region: 'NORTH',
  },
  {
    name: 'Sovabazar Sutanuti Metro Station',
    description: 'Direct access to Shobhabazar Rajbari & Kumartuli',
    coords: { lat: 22.5971, lng: 88.3675 },
    region: 'NORTH',
  },
  {
    name: 'Bagbazar Ferry Ghat',
    description: 'Scenic river terminal & historic Bagbazar entrance',
    coords: { lat: 22.6041, lng: 88.3612 },
    region: 'NORTH',
  },

  // Central Kolkata Hubs
  {
    name: 'Howrah Station (Railway)',
    description: 'Major transit terminal across the Hooghly River',
    coords: { lat: 22.5839, lng: 88.3426 },
    region: 'CENTRAL',
  },
  {
    name: 'Howrah Maidan (Green Line Metro)',
    description: 'Underwater Hooghly Metro direct to Esplanade',
    coords: { lat: 22.5855, lng: 88.3248 },
    region: 'CENTRAL',
  },
  {
    name: 'Sealdah Railway Station / Metro',
    description: 'Suburban train & East-West Green Line Metro nexus',
    coords: { lat: 22.5672, lng: 88.3716 },
    region: 'CENTRAL',
  },
  {
    name: 'Esplanade Metro Interchange',
    description: 'Kolkata central transit hub (Blue, Green & Purple lines)',
    coords: { lat: 22.5645, lng: 88.3516 },
    region: 'CENTRAL',
  },

  // South Kolkata Hubs
  {
    name: 'Gariahat 4-Point Crossing',
    description: 'Heart of South Kolkata, Ekdalia & Singhi Park corridor',
    coords: { lat: 22.5188, lng: 88.3654 },
    region: 'SOUTH',
  },
  {
    name: 'Kalighat Metro Station (Rashbehari)',
    description: 'Direct access to Deshapriya Park & Tridhara Sammilani',
    coords: { lat: 22.5175, lng: 88.3468 },
    region: 'SOUTH',
  },
  {
    name: 'Rabindra Sarobar Metro Station',
    description: 'Southern Avenue lakeside entrance to Mudiali & BCA',
    coords: { lat: 22.5098, lng: 88.3462 },
    region: 'SOUTH',
  },
];
