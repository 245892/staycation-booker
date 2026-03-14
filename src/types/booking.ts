export interface Property {
  id: string;
  name: string;
  floor: string;
  description: string;
  amenities: string[];
  maxGuests: number;
  pricePerNight: number;
  imageIndex: number;
  gallery?: string[];
  rating?: number;
  bestFeature?: string;
  sqft?: number;
  wifi?: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid';
  createdAt: string;
  totalPrice: number;
}
