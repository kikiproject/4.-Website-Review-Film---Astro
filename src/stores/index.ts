import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, WatchlistItem, FavoriteItem, Notification } from '../types';

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'astro-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

// Watchlist Store
interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;
  addItem: (item: WatchlistItem) => void;
  removeItem: (movieId: number) => void;
  setItems: (items: WatchlistItem[]) => void;
  isInWatchlist: (movieId: number) => boolean;
  setLoading: (loading: boolean) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (movieId) => 
        set((state) => ({ 
          items: state.items.filter((item) => item.movieId !== movieId) 
        })),
      setItems: (items) => set({ items }),
      isInWatchlist: (movieId) => get().items.some((item) => item.movieId === movieId),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'astro-watchlist',
    }
  )
);

// Favorites Store
interface FavoritesState {
  items: FavoriteItem[];
  isLoading: boolean;
  addItem: (item: FavoriteItem) => void;
  removeItem: (movieId: number) => void;
  setItems: (items: FavoriteItem[]) => void;
  isFavorite: (movieId: number) => boolean;
  setLoading: (loading: boolean) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (movieId) => 
        set((state) => ({ 
          items: state.items.filter((item) => item.movieId !== movieId) 
        })),
      setItems: (items) => set({ items }),
      isFavorite: (movieId) => get().items.some((item) => item.movieId === movieId),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'astro-favorites',
    }
  )
);

// Notification Store
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  setNotifications: (notifications: Notification[]) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => 
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: state.notifications.find((n) => n.id === id && !n.isRead)
            ? state.unreadCount - 1
            : state.unreadCount,
        })),
      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        }),
      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'astro-notifications',
    }
  )
);

// UI Store
interface UIState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  theme: 'dark' | 'light';
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  closeMobileMenu: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isMobileMenuOpen: false,
      isSearchOpen: false,
      theme: 'dark',
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      setTheme: (theme) => set({ theme }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      closeSearch: () => set({ isSearchOpen: false }),
    }),
    {
      name: 'astro-ui',
      partialize: (state) => ({ theme: state.theme, isSidebarOpen: state.isSidebarOpen }),
    }
  )
);

// Search History Store
interface SearchHistoryState {
  history: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      addSearch: (query) =>
        set((state) => ({
          history: [query, ...state.history.filter((q) => q !== query)].slice(0, 10),
        })),
      removeSearch: (query) =>
        set((state) => ({
          history: state.history.filter((q) => q !== query),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'astro-search-history',
    }
  )
);

// Recently Viewed Store
interface RecentlyViewedState {
  movieIds: number[];
  addMovie: (movieId: number) => void;
  clearHistory: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      movieIds: [],
      addMovie: (movieId) =>
        set((state) => ({
          movieIds: [movieId, ...state.movieIds.filter((id) => id !== movieId)].slice(0, 20),
        })),
      clearHistory: () => set({ movieIds: [] }),
    }),
    {
      name: 'astro-recently-viewed',
    }
  )
);
