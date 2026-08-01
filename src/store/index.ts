import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Address, GeoCoordinates } from '@/types';
import type { PermissionStatus } from '@/services/location';

const safeStorage = () =>
  typeof window !== 'undefined'
    ? localStorage
    : ({
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      } as unknown as Storage);

interface LocationStoreState {
  coords: GeoCoordinates | null;
  address: Address | null;
  permissionStatus: PermissionStatus | 'unknown';
  loading: boolean;
  error: string | null;
  setCoords: (coords: GeoCoordinates) => void;
  setAddress: (address: Address) => void;
  setPermissionStatus: (status: PermissionStatus | 'unknown') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationStoreState>((set) => ({
  coords: null,
  address: null,
  permissionStatus: 'unknown',
  loading: false,
  error: null,
  setCoords: (coords) => set({ coords }),
  setAddress: (address) => set({ address }),
  setPermissionStatus: (permissionStatus) => set({ permissionStatus }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearLocation: () => set({ coords: null, address: null, error: null }),
}));

type AppearanceMode = 'dark' | 'light' | 'system';
type UnitsSystem = 'metric' | 'imperial';

interface SettingsState {
  appearance: AppearanceMode;
  units: UnitsSystem;
  notificationsEnabled: boolean;
  setAppearance: (mode: AppearanceMode) => void;
  setUnits: (units: UnitsSystem) => void;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      appearance: 'system',
      units: 'metric',
      notificationsEnabled: false,
      setAppearance: (appearance) => set({ appearance }),
      setUnits: (units) => set({ units }),
      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
    }),
    {
      name: 'golden-hour-settings',
      storage: createJSONStorage(safeStorage),
    }
  )
);

interface FavoritesState {
  favoriteSpotIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteSpotIds: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favoriteSpotIds: state.favoriteSpotIds.includes(id)
            ? state.favoriteSpotIds.filter((s) => s !== id)
            : [...state.favoriteSpotIds, id],
        })),
      isFavorite: (id) => get().favoriteSpotIds.includes(id),
    }),
    {
      name: 'golden-hour-favorites',
      storage: createJSONStorage(safeStorage),
    }
  )
);
