import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Quote } from '@/constants/quotes';

export interface FavoriteAnalytics {
  quoteId: string;
  count: number;
  lastFavoritedAt: number; // timestamp
}

interface FavoritesContextType {
  favorites: Set<string>; // quote IDs
  favoriteAnalytics: Map<string, FavoriteAnalytics>;
  toggleFavorite: (quote: Quote) => Promise<void>;
  isFavorited: (quoteId: string) => boolean;
  getMostFavorited: (limit?: number) => FavoriteAnalytics[];
  exportFavorites: (quotes: Quote[]) => string;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'favorites_list';
const ANALYTICS_STORAGE_KEY = 'favorites_analytics';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoriteAnalytics, setFavoriteAnalytics] = useState<Map<string, FavoriteAnalytics>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load from SecureStore on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritesJson = await SecureStore.getItemAsync(FAVORITES_STORAGE_KEY);
        const analyticsJson = await SecureStore.getItemAsync(ANALYTICS_STORAGE_KEY);

        if (favoritesJson) {
          setFavorites(new Set(JSON.parse(favoritesJson)));
        }

        if (analyticsJson) {
          const analyticsArray = JSON.parse(analyticsJson);
          const analyticsMap = new Map<string, FavoriteAnalytics>(
            analyticsArray.map((item: FavoriteAnalytics) => [item.quoteId, item])
          );
          setFavoriteAnalytics(analyticsMap);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const saveFavorites = async (newFavorites: Set<string>, newAnalytics: Map<string, FavoriteAnalytics>) => {
    try {
      await SecureStore.setItemAsync(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(Array.from(newFavorites))
      );

      await SecureStore.setItemAsync(
        ANALYTICS_STORAGE_KEY,
        JSON.stringify(Array.from(newAnalytics.values()))
      );
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = async (quote: Quote) => {
    const newFavorites = new Set(favorites);
    const newAnalytics = new Map(favoriteAnalytics);

    if (newFavorites.has(quote.id)) {
      // Remove favorite
      newFavorites.delete(quote.id);
      newAnalytics.delete(quote.id);
    } else {
      // Add favorite
      newFavorites.add(quote.id);
      const existing = newAnalytics.get(quote.id);
      newAnalytics.set(quote.id, {
        quoteId: quote.id,
        count: (existing?.count || 0) + 1,
        lastFavoritedAt: Date.now(),
      });
    }

    setFavorites(newFavorites);
    setFavoriteAnalytics(newAnalytics);
    await saveFavorites(newFavorites, newAnalytics);
  };

  const isFavorited = (quoteId: string): boolean => {
    return favorites.has(quoteId);
  };

  const getMostFavorited = (limit: number = 10): FavoriteAnalytics[] => {
    return Array.from(favoriteAnalytics.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  const exportFavorites = (quotes: Quote[]): string => {
    const favoriteQuotes = quotes.filter((q) => favorites.has(q.id));

    const csv = [
      'Quote,Rating,Times Favorited,Last Favorited',
      ...favoriteQuotes.map((q) => {
        const analytics = favoriteAnalytics.get(q.id);
        const lastFavoritedDate = analytics
          ? new Date(analytics.lastFavoritedAt).toISOString().split('T')[0]
          : 'N/A';
        return `"${q.text.replace(/"/g, '""')}",${q.rating},${analytics?.count || 0},${lastFavoritedDate}`;
      }),
    ].join('\n');

    return csv;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteAnalytics,
        toggleFavorite,
        isFavorited,
        getMostFavorited,
        exportFavorites,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
