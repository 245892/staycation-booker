import { Booking } from '@/types/booking';
import { addDays, differenceInDays, isBefore, isSameDay, isAfter, differenceInHours } from 'date-fns';

/**
 * Gap Filler Engine: Finds 1-night gaps between bookings for a property
 * and suggests promotional pricing.
 */
export function findGaps(bookings: Booking[], propertyId: string): { date: Date; originalPrice: number; promoPrice: number }[] {
  const active = bookings
    .filter(b => b.propertyId === propertyId && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

  const gaps: { date: Date; originalPrice: number; promoPrice: number }[] = [];
  
  for (let i = 0; i < active.length - 1; i++) {
    const currentCheckOut = new Date(active[i].checkOut);
    const nextCheckIn = new Date(active[i + 1].checkIn);
    const gapNights = differenceInDays(nextCheckIn, currentCheckOut);
    
    if (gapNights === 1) {
      gaps.push({
        date: new Date(currentCheckOut),
        originalPrice: 0, // will be set by caller
        promoPrice: 0,
      });
    }
  }
  
  return gaps;
}

/**
 * Dynamic Pricing: Adjusts price based on proximity to the date.
 * - Within 48 hours: 25% off
 * - Within 24 hours: 35% off
 * - Gap filler (1-night): 30% off
 */
export function getDynamicPrice(
  basePrice: number,
  checkInDate: Date,
  isGapFiller: boolean = false
): { price: number; discount: number; label: string } {
  if (isGapFiller) {
    return {
      price: Math.round(basePrice * 0.70),
      discount: 30,
      label: 'Gap Filler Deal',
    };
  }

  const hoursUntil = differenceInHours(checkInDate, new Date());
  
  if (hoursUntil <= 24 && hoursUntil > 0) {
    return {
      price: Math.round(basePrice * 0.65),
      discount: 35,
      label: 'Flash Deal – Tonight!',
    };
  }
  
  if (hoursUntil <= 48 && hoursUntil > 0) {
    return {
      price: Math.round(basePrice * 0.75),
      discount: 25,
      label: 'Last-Minute Deal',
    };
  }

  return { price: basePrice, discount: 0, label: '' };
}

/**
 * Check if a date is a gap filler opportunity for a property
 */
export function isGapFillerDate(
  date: Date,
  bookings: Booking[],
  propertyId: string
): boolean {
  const active = bookings
    .filter(b => b.propertyId === propertyId && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

  for (let i = 0; i < active.length - 1; i++) {
    const currentCheckOut = new Date(active[i].checkOut);
    const nextCheckIn = new Date(active[i + 1].checkIn);
    const gapNights = differenceInDays(nextCheckIn, currentCheckOut);
    
    if (gapNights === 1 && isSameDay(currentCheckOut, date)) {
      return true;
    }
  }
  
  return false;
}
