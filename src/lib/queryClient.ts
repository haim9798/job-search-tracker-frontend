import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ApiError } from '../types';

console.log('📊 QueryClient module loading...');

// Cache configuration for different data types
export const cacheConfigs = {
  // Frequently changing data
  positions: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
  },
  
  // Moderately changing data
  interviews: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
  },
  
  // Rarely changing data
  userProfile: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
  },
  
  // Statistics (expensive to calculate)
  statistics: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnMount: false,
  },
} as const;

// Create query client with comprehensive configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Cache time: how long data stays in cache after becoming unused
      cacheTime: 10 * 60 * 1000, // 10 minutes
      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error && typeof error === 'object' && 'code' in error) {
          const apiError = error as ApiError;
          if (apiError.code.startsWith('4')) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Background refetch interval (disabled by default)
      refetchInterval: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Global error handling for queries
      console.error('Query error:', error, query);
      
      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as ApiError;
        // Don't show toast for background refetches
        if (query.state.fetchStatus !== 'fetching' || query.state.dataUpdatedAt === 0) {
          toast.error(apiError.message || 'An error occurred while fetching data');
        }
      }
    },
    onSuccess: (data, query) => {
      // Optional: Log successful queries in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Query success:', query.queryKey, data);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, _context, mutation) => {
      // Global error handling for mutations
      console.error('Mutation error:', error, variables, mutation);
      
      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as ApiError;
        toast.error(apiError.message || 'An error occurred while saving data');
      }
    },
    onSuccess: (data, _variables, _context, mutation) => {
      // Optional: Show success toast for mutations
      if (process.env.NODE_ENV === 'development') {
        console.log('Mutation success:', mutation.options.mutationKey, data);
      }
    },
  }),
});

console.log('📊 QueryClient created successfully');

// Query key factory for consistent key generation
export const queryKeys = {
  // Auth keys
  auth: {
    user: ['auth', 'user'] as const,
    verify: ['auth', 'verify'] as const,
  },
  
  // Position keys
  positions: {
    all: ['positions'] as const,
    lists: () => [...queryKeys.positions.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.positions.lists(), filters] as const,
    details: () => [...queryKeys.positions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.positions.details(), id] as const,
    summary: () => [...queryKeys.positions.all, 'summary'] as const,
    byStatus: (status: string) => [...queryKeys.positions.all, 'status', status] as const,
    byCompany: (company: string) => [...queryKeys.positions.all, 'company', company] as const,
    recent: () => [...queryKeys.positions.all, 'recent'] as const,
  },
  
  // Interview keys
  interviews: {
    all: ['interviews'] as const,
    lists: () => [...queryKeys.interviews.all, 'list'] as const,
    list: (positionId?: string) => [...queryKeys.interviews.lists(), positionId] as const,
    details: () => [...queryKeys.interviews.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.interviews.details(), id] as const,
    upcoming: () => [...queryKeys.interviews.all, 'upcoming'] as const,
    today: () => [...queryKeys.interviews.all, 'today'] as const,
    overdue: () => [...queryKeys.interviews.all, 'overdue'] as const,
    byOutcome: (outcome: string) => [...queryKeys.interviews.all, 'outcome', outcome] as const,
    stats: (positionId: string) => [...queryKeys.interviews.all, 'stats', positionId] as const,
  },
  
  // Statistics keys
  statistics: {
    all: ['statistics'] as const,
    overview: () => [...queryKeys.statistics.all, 'overview'] as const,
    positions: () => [...queryKeys.statistics.all, 'positions'] as const,
    interviews: () => [...queryKeys.statistics.all, 'interviews'] as const,
    companies: () => [...queryKeys.statistics.all, 'companies'] as const,
    dashboard: () => [...queryKeys.statistics.all, 'dashboard'] as const,
    monthly: (year: number) => [...queryKeys.statistics.all, 'monthly', year] as const,
    custom: (filters: any) => [...queryKeys.statistics.all, 'custom', filters] as const,
  },
} as const;

// Cache invalidation utilities
export const invalidateQueries = {
  // Invalidate all position-related queries
  positions: () => {
    queryClient.invalidateQueries(queryKeys.positions.all);
    queryClient.invalidateQueries(queryKeys.statistics.all);
  },
  
  // Invalidate specific position
  position: (id: string) => {
    queryClient.invalidateQueries(queryKeys.positions.detail(id));
    queryClient.invalidateQueries(queryKeys.positions.lists());
    queryClient.invalidateQueries(queryKeys.interviews.list(id));
    queryClient.invalidateQueries(queryKeys.statistics.all);
  },
  
  // Invalidate all interview-related queries
  interviews: () => {
    queryClient.invalidateQueries(queryKeys.interviews.all);
    queryClient.invalidateQueries(queryKeys.statistics.all);
  },
  
  // Invalidate specific interview
  interview: (id: string, positionId?: string) => {
    queryClient.invalidateQueries(queryKeys.interviews.detail(id));
    if (positionId) {
      queryClient.invalidateQueries(queryKeys.interviews.list(positionId));
      queryClient.invalidateQueries(queryKeys.positions.detail(positionId));
    }
    queryClient.invalidateQueries(queryKeys.interviews.upcoming());
    queryClient.invalidateQueries(queryKeys.interviews.today());
    queryClient.invalidateQueries(queryKeys.statistics.all);
  },
  
  // Invalidate all statistics
  statistics: () => {
    queryClient.invalidateQueries(queryKeys.statistics.all);
  },
  
  // Invalidate all data (nuclear option)
  all: () => {
    queryClient.invalidateQueries();
  },
};

// Prefetch utilities
export const prefetchQueries = {
  // Prefetch position details when hovering over position card
  positionDetails: (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.positions.detail(id),
      queryFn: () => import('../services').then(({ positionService }) => positionService.getPosition(id)),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  },
  
  // Prefetch interviews when viewing position details
  positionInterviews: (positionId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.interviews.list(positionId),
      queryFn: () => import('../services').then(({ interviewService }) => interviewService.getInterviews(positionId)),
      staleTime: 2 * 60 * 1000,
    });
  },
  
  // Prefetch dashboard data
  dashboard: () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.statistics.dashboard(),
      queryFn: () => import('../services').then(({ statisticsService }) => statisticsService.getDashboardSummary()),
      staleTime: 5 * 60 * 1000,
    });
  },
};

// Optimistic update utilities
export const optimisticUpdates = {
  // Optimistically update position in cache
  updatePosition: (id: string, updates: any) => {
    queryClient.setQueryData(queryKeys.positions.detail(id), (old: any) => {
      if (!old) {
        return old;
      }
      return {
        ...old,
        ...updates,
        updated_at: new Date().toISOString(),
      };
    });
    
    // Also update in lists
    queryClient.setQueriesData(
      { queryKey: queryKeys.positions.lists() },
      (old: any) => {
        if (!old?.positions) {
          return old;
        }
        return {
          ...old,
          positions: old.positions.map((position: any) =>
            position.id === id ? { ...position, ...updates, updated_at: new Date().toISOString() } : position
          ),
        };
      }
    );
  },
  
  // Optimistically update interview in cache
  updateInterview: (id: string, positionId: string, updates: any) => {
    queryClient.setQueryData(queryKeys.interviews.detail(id), (old: any) => {
      if (!old) {
        return old;
      }
      return {
        ...old,
        ...updates,
        updated_at: new Date().toISOString(),
      };
    });
    
    // Update in position's interview list
    queryClient.setQueryData(queryKeys.interviews.list(positionId), (old: any) => {
      if (!old) {
        return old;
      }
      return old.map((interview: any) =>
        interview.id === id ? { ...interview, ...updates, updated_at: new Date().toISOString() } : interview
      );
    });
  },
  
  // Optimistically add new position
  addPosition: (newPosition: any) => {
    queryClient.setQueriesData(
      { queryKey: queryKeys.positions.lists() },
      (old: any) => {
        if (!old?.positions) {
          return old;
        }
        return {
          ...old,
          positions: [newPosition, ...old.positions],
          total: old.total + 1,
        };
      }
    );
  },
  
  // Optimistically remove position
  removePosition: (id: string) => {
    queryClient.setQueriesData(
      { queryKey: queryKeys.positions.lists() },
      (old: any) => {
        if (!old?.positions) {
          return old;
        }
        return {
          ...old,
          positions: old.positions.filter((position: any) => position.id !== id),
          total: Math.max(0, old.total - 1),
        };
      }
    );
  },
};

// Background sync utilities
export const backgroundSync = {
  // Start background sync for active queries
  start: () => {
    const interval = setInterval(() => {
      // Refetch stale queries that are currently being observed
      queryClient.refetchQueries({
        type: 'active',
        stale: true,
      });
    }, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(interval);
  },
  
  // Sync specific data types
  syncPositions: () => {
    queryClient.refetchQueries({
      queryKey: queryKeys.positions.all,
      type: 'active',
    });
  },
  
  syncInterviews: () => {
    queryClient.refetchQueries({
      queryKey: queryKeys.interviews.all,
      type: 'active',
    });
  },
  
  syncStatistics: () => {
    queryClient.refetchQueries({
      queryKey: queryKeys.statistics.all,
      type: 'active',
    });
  },
};

export default queryClient;