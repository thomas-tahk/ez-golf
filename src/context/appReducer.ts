import type { AppState, AppAction } from '../types';

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_COURSES':
      return { ...state, courses: action.payload };

    case 'CREATE_COURSE':
      return { 
        ...state, 
        courses: [...state.courses, action.payload] 
      };

    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.payload.id ? action.payload : course
        )
      };

    case 'DELETE_COURSE':
      return {
        ...state,
        courses: state.courses.filter(course => course.id !== action.payload)
      };

    case 'SET_ROUNDS':
      return { ...state, rounds: action.payload };

    case 'START_ROUND':
      return { 
        ...state, 
        currentRound: action.payload,
        rounds: [...state.rounds, action.payload]
      };

    case 'UPDATE_SCORE':
      if (!state.currentRound) return state;
      
      const updatedScores = [...state.currentRound.scores];
      const existingScoreIndex = updatedScores.findIndex(
        score => score.holeNumber === action.payload.holeNumber
      );
      
      if (existingScoreIndex >= 0) {
        updatedScores[existingScoreIndex] = action.payload.score;
      } else {
        updatedScores.push(action.payload.score);
      }
      
      const updatedRound = {
        ...state.currentRound,
        scores: updatedScores
      };
      
      return {
        ...state,
        currentRound: updatedRound,
        rounds: state.rounds.map(round =>
          round.id === updatedRound.id ? updatedRound : round
        )
      };

    case 'COMPLETE_ROUND':
      if (!state.currentRound) return state;
      
      const completedRound = {
        ...state.currentRound,
        completed: true
      };
      
      return {
        ...state,
        currentRound: null,
        rounds: state.rounds.map(round =>
          round.id === completedRound.id ? completedRound : round
        )
      };

    case 'DELETE_ROUND':
      return {
        ...state,
        rounds: state.rounds.filter(round => round.id !== action.payload),
        currentRound: state.currentRound?.id === action.payload ? null : state.currentRound
      };

    case 'SET_ANALYSIS':
      return { ...state, analysis: action.payload };

    case 'SET_PREFERENCES':
      return { ...state, userPreferences: action.payload };

    case 'CLEAR_CURRENT_ROUND':
      return { ...state, currentRound: null };

    default:
      return state;
  }
}