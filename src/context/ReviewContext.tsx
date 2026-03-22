import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Review {
  id: string;
  propertyId: string;
  bookingId?: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id'>) => void;
}

const ReviewContext = createContext<ReviewContextType | null>(null);

const STORAGE_KEY = 'aha_reviews';

const defaultReviews: Review[] = [
  { id: '1', name: 'Sarah M.', rating: 5, text: 'Amazing stay! Central location and super clean unit.', date: 'Mar 12, 2026', propertyId: 'moa-102' },
  { id: '2', name: 'Mark T.', rating: 5, text: 'Loved the fast Wi-Fi and high floor views. Highly recommend.', date: 'Mar 05, 2026', propertyId: 'moa-201' },
  { id: '3', name: 'Jessica L.', rating: 4, text: 'Very convenient location right next to MOA. Easy check-in process.', date: 'Feb 28, 2026', propertyId: 'moa-101' },
  { id: '4', name: 'Alex P.', rating: 5, text: 'Perfect for a weekend getaway. Will definitely book again!', date: 'Feb 15, 2026', propertyId: 'moa-203' },
];

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultReviews;
    } catch {
      return defaultReviews;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (review: Omit<Review, 'id'>) => {
    const newReview = { ...review, id: `REV-${Date.now()}` };
    setReviews(prev => [newReview, ...prev]);
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewProvider');
  return ctx;
}
