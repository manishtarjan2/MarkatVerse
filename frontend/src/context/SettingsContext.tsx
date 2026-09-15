"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type Sector = {
  id: string;
  businessTypeId: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

type SettingsContextType = {
  sectors: Sector[];
  isSectorActive: (sectorName: string) => boolean;
  refreshSectors: () => Promise<void>;
  toggleSector: (id: string, isActive: boolean) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [sectors, setSectors] = useState<Sector[]>([]);

  const refreshSectors = async () => {
    try {
      const res = await fetch(`${API_URL}/configuration/sectors`);
      if (res.ok) {
        const data = await res.json();
        setSectors(data);
      } else {
        console.error('Failed to fetch sectors');
      }
    } catch (err) {
      console.error('Error fetching sectors:', err);
    }
  };

  useEffect(() => {
    refreshSectors();
  }, []);

  const isSectorActive = (sectorName: string) => {
    const sector = sectors.find(s => s.name.toLowerCase() === sectorName.toLowerCase());
    return sector ? sector.isActive : true; // Default to true if not found or not configured yet
  };

  const toggleSector = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`${API_URL}/configuration/sectors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error('Failed to update sector');
      
      // Optimistically update
      setSectors(prev => prev.map(s => s.id === id ? { ...s, isActive } : s));
    } catch (err) {
      console.error(err);
      // Re-fetch to sync if failed
      refreshSectors();
      throw err;
    }
  };

  return (
    <SettingsContext.Provider value={{ sectors, isSectorActive, refreshSectors, toggleSector }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}
