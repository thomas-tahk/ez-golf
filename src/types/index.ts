export interface Hole {
  number: number;
  par: 3 | 4 | 5;
  yardage?: number;
}

export interface Course {
  id: string;
  name: string;
  holes: Hole[];
  totalPar: number;
}

export interface HoleScore {
  holeNumber: number;
  strokes: number;
  comment?: string;
}

export interface Round {
  id: string;
  courseId: string;
  date: string;
  scores: HoleScore[];
  comments?: string;
  completed: boolean;
}

export interface ProblemArea {
  category: 'driving' | 'approach' | 'putting' | 'short_game';
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence: string[];
}

export interface Recommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  drills?: string[];
}

export interface AnalysisResult {
  overallTrend: 'improving' | 'declining' | 'stable';
  problemAreas: ProblemArea[];
  recommendations: Recommendation[];
  strengths: string[];
}

export interface UserPreferences {
  defaultTeeBox?: string;
  preferredUnits: 'yards' | 'meters';
  showStatistics: boolean;
  enableNotifications: boolean;
}

export interface AnalysisCache {
  lastGenerated: string;
  result: AnalysisResult;
  roundsAnalyzed: string[];
}

export interface AppState {
  courses: Course[];
  rounds: Round[];
  currentRound: Round | null;
  analysis: AnalysisResult | null;
  userPreferences: UserPreferences;
  loading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'CREATE_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'SET_ROUNDS'; payload: Round[] }
  | { type: 'START_ROUND'; payload: Round }
  | { type: 'UPDATE_SCORE'; payload: { holeNumber: number; score: HoleScore } }
  | { type: 'COMPLETE_ROUND' }
  | { type: 'DELETE_ROUND'; payload: string }
  | { type: 'SET_ANALYSIS'; payload: AnalysisResult | null }
  | { type: 'SET_PREFERENCES'; payload: UserPreferences }
  | { type: 'CLEAR_CURRENT_ROUND' };

export interface AnalysisProvider {
  analyze(rounds: Round[], courses: Course[]): Promise<AnalysisResult>;
}

export interface LocalStorageKeys {
  COURSES: 'golf_courses';
  ROUNDS: 'golf_rounds';
  PREFERENCES: 'golf_user_preferences';
  ANALYSIS_CACHE: 'golf_analysis_cache';
}

export interface ScoreStatistics {
  totalScore: number;
  totalPar: number;
  scoreToPar: number;
  birdies: number;
  eagles: number;
  pars: number;
  bogeys: number;
  doubleBogeys: number;
  others: number;
  bestHole: {
    holeNumber: number;
    scoreToPar: number;
  };
  worstHole: {
    holeNumber: number;
    scoreToPar: number;
  };
}

export interface TrendData {
  date: string;
  score: number;
  scoreToPar: number;
  roundId: string;
}