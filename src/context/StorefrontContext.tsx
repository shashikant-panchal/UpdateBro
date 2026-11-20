import React, { createContext, useContext } from 'react';
import { useStorefrontData } from '../hooks/useStorefrontData';
import type { Product, CategoryMeta, HeroSlide } from '../types';
import type { DbStoreSettings } from '../types/database';

interface StorefrontContextValue {
  banners: HeroSlide[];
  categories: CategoryMeta[];
  products: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  combos: Product[];
  featuredProducts: Product[];
  storeSettings: DbStoreSettings;
  isLoading: boolean;
  refreshStorefront: () => Promise<void>;
}

export const StorefrontContext = createContext<StorefrontContextValue | undefined>(undefined);

export const StorefrontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const data = useStorefrontData();

  return (
    <StorefrontContext.Provider value={data}>
      {children}
    </StorefrontContext.Provider>
  );
};

export const useStorefront = (): StorefrontContextValue => {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error('useStorefront must be used within a StorefrontProvider');
  }
  return context;
};
