import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface WaitlistEntry {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  desiredCheckIn: string;
  desiredCheckOut: string;
  createdAt: string;
  notified: boolean;
}

interface WaitlistContextType {
  entries: WaitlistEntry[];
  addToWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'notified'>) => void;
  removeFromWaitlist: (id: string) => void;
  getWaitlistForProperty: (propertyId: string) => WaitlistEntry[];
  notifyWaitlist: (propertyId: string, checkIn: string, checkOut: string) => WaitlistEntry[];
}

const WaitlistContext = createContext<WaitlistContextType | null>(null);

const STORAGE_KEY = 'aha_waitlist';

function loadWaitlist(): WaitlistEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<WaitlistEntry[]>(loadWaitlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addToWaitlist = useCallback((entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'notified'>) => {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `WL-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      notified: false,
    };
    setEntries(prev => [...prev, newEntry]);
  }, []);

  const removeFromWaitlist = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const getWaitlistForProperty = useCallback((propertyId: string) => {
    return entries.filter(e => e.propertyId === propertyId);
  }, [entries]);

  const notifyWaitlist = useCallback((propertyId: string, checkIn: string, checkOut: string) => {
    const matching = entries.filter(e =>
      e.propertyId === propertyId &&
      !e.notified &&
      new Date(e.desiredCheckIn) < new Date(checkOut) &&
      new Date(e.desiredCheckOut) > new Date(checkIn)
    );
    
    if (matching.length > 0) {
      setEntries(prev => prev.map(e =>
        matching.some(m => m.id === e.id) ? { ...e, notified: true } : e
      ));
    }
    
    return matching;
  }, [entries]);

  return (
    <WaitlistContext.Provider value={{ entries, addToWaitlist, removeFromWaitlist, getWaitlistForProperty, notifyWaitlist }}>
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error('useWaitlist must be used within WaitlistProvider');
  return ctx;
}
