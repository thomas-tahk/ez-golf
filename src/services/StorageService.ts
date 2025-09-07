import type { Course, Round, UserPreferences, AnalysisCache } from '../types';

const STORAGE_KEYS = {
  COURSES: 'golf_courses',
  ROUNDS: 'golf_rounds',
  PREFERENCES: 'golf_user_preferences',
  ANALYSIS_CACHE: 'golf_analysis_cache',
} as const;

export class StorageService {
  private static getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private static saveToStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  static async getCourses(): Promise<Course[]> {
    const courses = this.getFromStorage<Course[]>(STORAGE_KEYS.COURSES, []);
    
    if (courses.length === 0) {
      const defaultCourses = this.getDefaultCourses();
      await this.saveCourses(defaultCourses);
      return defaultCourses;
    }
    
    return courses;
  }

  static async saveCourses(courses: Course[]): Promise<void> {
    this.saveToStorage(STORAGE_KEYS.COURSES, courses);
  }

  static async getRounds(): Promise<Round[]> {
    return this.getFromStorage<Round[]>(STORAGE_KEYS.ROUNDS, []);
  }

  static async saveRounds(rounds: Round[]): Promise<void> {
    this.saveToStorage(STORAGE_KEYS.ROUNDS, rounds);
  }

  static async getPreferences(): Promise<UserPreferences | null> {
    const prefs = this.getFromStorage<UserPreferences | null>(STORAGE_KEYS.PREFERENCES, null);
    return prefs;
  }

  static async savePreferences(preferences: UserPreferences): Promise<void> {
    this.saveToStorage(STORAGE_KEYS.PREFERENCES, preferences);
  }

  static async getAnalysisCache(): Promise<AnalysisCache | null> {
    return this.getFromStorage<AnalysisCache | null>(STORAGE_KEYS.ANALYSIS_CACHE, null);
  }

  static async saveAnalysisCache(cache: AnalysisCache): Promise<void> {
    this.saveToStorage(STORAGE_KEYS.ANALYSIS_CACHE, cache);
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  private static getDefaultCourses(): Course[] {
    return [
      {
        id: 'course-1',
        name: 'Pebble Beach Golf Links',
        totalPar: 72,
        holes: [
          { number: 1, par: 4, yardage: 377 },
          { number: 2, par: 5, yardage: 502 },
          { number: 3, par: 4, yardage: 390 },
          { number: 4, par: 4, yardage: 331 },
          { number: 5, par: 3, yardage: 188 },
          { number: 6, par: 5, yardage: 523 },
          { number: 7, par: 3, yardage: 106 },
          { number: 8, par: 4, yardage: 416 },
          { number: 9, par: 4, yardage: 466 },
          { number: 10, par: 4, yardage: 446 },
          { number: 11, par: 4, yardage: 384 },
          { number: 12, par: 3, yardage: 202 },
          { number: 13, par: 4, yardage: 392 },
          { number: 14, par: 5, yardage: 565 },
          { number: 15, par: 4, yardage: 395 },
          { number: 16, par: 4, yardage: 403 },
          { number: 17, par: 3, yardage: 178 },
          { number: 18, par: 5, yardage: 548 },
        ]
      },
      {
        id: 'course-2',
        name: 'Augusta National Golf Club',
        totalPar: 72,
        holes: [
          { number: 1, par: 4, yardage: 445 },
          { number: 2, par: 5, yardage: 575 },
          { number: 3, par: 4, yardage: 350 },
          { number: 4, par: 3, yardage: 240 },
          { number: 5, par: 4, yardage: 495 },
          { number: 6, par: 3, yardage: 180 },
          { number: 7, par: 4, yardage: 450 },
          { number: 8, par: 5, yardage: 570 },
          { number: 9, par: 4, yardage: 460 },
          { number: 10, par: 4, yardage: 495 },
          { number: 11, par: 4, yardage: 520 },
          { number: 12, par: 3, yardage: 155 },
          { number: 13, par: 5, yardage: 510 },
          { number: 14, par: 4, yardage: 440 },
          { number: 15, par: 5, yardage: 550 },
          { number: 16, par: 3, yardage: 170 },
          { number: 17, par: 4, yardage: 440 },
          { number: 18, par: 4, yardage: 465 },
        ]
      },
      {
        id: 'course-3',
        name: 'St. Andrews Old Course',
        totalPar: 72,
        holes: [
          { number: 1, par: 4, yardage: 376 },
          { number: 2, par: 4, yardage: 453 },
          { number: 3, par: 4, yardage: 397 },
          { number: 4, par: 4, yardage: 463 },
          { number: 5, par: 5, yardage: 568 },
          { number: 6, par: 4, yardage: 416 },
          { number: 7, par: 4, yardage: 372 },
          { number: 8, par: 3, yardage: 178 },
          { number: 9, par: 4, yardage: 352 },
          { number: 10, par: 4, yardage: 342 },
          { number: 11, par: 3, yardage: 174 },
          { number: 12, par: 4, yardage: 348 },
          { number: 13, par: 4, yardage: 465 },
          { number: 14, par: 5, yardage: 614 },
          { number: 15, par: 4, yardage: 455 },
          { number: 16, par: 4, yardage: 423 },
          { number: 17, par: 4, yardage: 495 },
          { number: 18, par: 4, yardage: 357 },
        ]
      }
    ];
  }
}