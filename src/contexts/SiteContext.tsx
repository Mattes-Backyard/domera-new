
import React, { createContext, useContext, useState } from 'react';

interface Site {
  id: string;
  name: string;
  location: string;
}

interface SiteContextType {
  currentSite: Site;
  sites: Site[];
  switchSite: (siteId: string) => void;
}

const sites: Site[] = [
  { id: 'site1', name: 'Downtown Storage', location: 'Downtown District' },
  { id: 'site2', name: 'Riverside Storage', location: 'Riverside Area' }
];

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSite, setCurrentSite] = useState<Site>(sites[0]);

  const switchSite = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    if (site) {
      setCurrentSite(site);
    }
  };

  return (
    <SiteContext.Provider value={{ currentSite, sites, switchSite }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
