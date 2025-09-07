# Golf Performance Tracker - Claude Development Notes

## Project Context
This is a web-based golf performance tracking application built with React + TypeScript + Vite. The app helps golfers track their scores and receive AI-powered insights to improve their game.

## Key Development Guidelines

### Architecture & Design Patterns
- **State Management**: React Context + useReducer for global state
- **Data Persistence**: localStorage with future database migration path
- **Offline-First**: All core functionality works without internet
- **Mobile-Ready**: Touch-friendly responsive design
- **Modular Analysis**: Pluggable analysis system (rules-based → AI)

### Core Technologies
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Service Workers for offline support

### Data Model Overview
```typescript
interface Course {
  id: string;
  name: string;
  holes: Hole[];
  totalPar: number;
}

interface Round {
  id: string;
  courseId: string;
  date: string;
  scores: HoleScore[];
  comments?: string;
  completed: boolean;
}
```

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Testing Strategy
- Focus on analysis logic unit tests
- Test offline functionality manually
- Validate data persistence across browser sessions

### Performance Requirements
- Fast load times for on-course usage
- Smooth interactions on mobile devices
- Efficient localStorage operations

### Future Integration Points
- AI analysis API (OpenAI/Claude)
- Backend synchronization
- External golf data sources
- Social features and sharing

### Security Considerations
- No sensitive data stored (scores only)
- Client-side only (no authentication needed for MVP)
- Validate user input for course/score data

## File Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── services/           # Data services and API layers
└── assets/             # Static assets
```

## Implementation Notes
1. Start with MVP features: course management, score tracking, basic analysis
2. Prioritize offline functionality and mobile UX
3. Build modular analysis system for future AI integration
4. Use localStorage for data persistence with migration utilities
5. Implement service worker for app shell caching

Refer to `/docs/technical-specification.md` for complete technical details.