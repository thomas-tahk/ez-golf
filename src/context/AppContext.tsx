import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction, UserPreferences } from '../types';
import { appReducer } from './appReducer';
import { StorageService } from '../services/StorageService';

const initialUserPreferences: UserPreferences = {
  preferredUnits: 'yards',
  showStatistics: true,
  enableNotifications: false,
};

const initialState: AppState = {
  courses: [],
  rounds: [],
  currentRound: null,
  analysis: null,
  userPreferences: initialUserPreferences,
  loading: false,
  error: null,
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const courses = await StorageService.getCourses();
        const rounds = await StorageService.getRounds();
        const preferences = await StorageService.getPreferences();
        
        dispatch({ type: 'SET_COURSES', payload: courses });
        dispatch({ type: 'SET_ROUNDS', payload: rounds });
        if (preferences) {
          dispatch({ type: 'SET_PREFERENCES', payload: preferences });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    StorageService.saveCourses(state.courses);
  }, [state.courses]);

  useEffect(() => {
    StorageService.saveRounds(state.rounds);
  }, [state.rounds]);

  useEffect(() => {
    StorageService.savePreferences(state.userPreferences);
  }, [state.userPreferences]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}