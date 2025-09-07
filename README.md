# 🏌️ Golf Performance Tracker (EZ Golf)

A comprehensive web-based golf performance tracking application that helps golfers track their scores and receive AI-powered insights to improve their game.

## 🎯 Features

### Core Functionality
- **Course Management** - Create, edit, and manage golf courses with hole-by-hole configuration
- **Live Scoring** - Real-time round tracking with mobile-optimized interface
- **Performance Analysis** - Rules-based analysis engine that identifies problem areas
- **Trend Tracking** - Visual score trends and performance metrics
- **Offline Support** - Works completely offline with service worker caching

### Key Components
- **Dashboard** - Quick overview of recent rounds and statistics
- **Course Builder** - Intuitive course creation with validation
- **Live Scoring Interface** - Touch-friendly hole-by-hole scoring
- **Analysis Engine** - Detects putting, driving, short game, and consistency issues
- **Recommendations** - Personalized practice suggestions with drills

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **Build Tool**: Vite
- **Data Storage**: localStorage (offline-first)
- **PWA**: Service Worker for offline functionality

## 📱 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ez-golf
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5174`

### Build for Production
```bash
npm run build
```

## 🎮 How to Use

### 1. Course Setup
- Navigate to "Courses" to view pre-loaded famous courses
- Create custom courses with hole-by-hole par values
- Edit existing courses as needed

### 2. Playing a Round
- Click "New Round" from the dashboard
- Select a course from the available options
- Use the live scoring interface to track each hole
- Add comments for specific holes (e.g., "missed putt", "great drive")
- Complete the round to save your score

### 3. Performance Analysis
- Visit the "Analysis" section after completing rounds
- View score trends over time
- Identify problem areas (putting, driving, short game, consistency)
- Get personalized practice recommendations

## 📊 Analysis Features

The rules-based analysis engine evaluates:

### Problem Detection
- **Putting Issues** - High scores on par 3s, putting-related comments
- **Driving Problems** - Struggles on longer holes, driving comments
- **Short Game** - Chipping, pitching, and bunker difficulties
- **Consistency** - High variance in scoring patterns

### Recommendations
- Prioritized practice suggestions
- Specific drills for improvement areas
- Course management tips
- Mental game advice

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── CourseList.tsx   # Course management
│   ├── LiveScoring.tsx  # Scoring interface
│   └── ...
├── pages/              # Main application pages
├── context/            # React Context providers
├── services/           # Data services and analysis
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## 💾 Data Storage

- **Offline-First**: All data stored in localStorage
- **No Backend Required**: Fully client-side application
- **Data Persistence**: Automatic saving of rounds and courses
- **Future-Ready**: Designed for easy backend integration

## 🔄 Future Enhancements

### Phase 2 Features (Planned)
- AI-powered analysis using OpenAI/Claude
- Backend API for data synchronization
- User authentication and profiles
- Social features and sharing
- Advanced statistics and charts

### Phase 3 Features (Vision)
- Mobile app (React Native)
- Integration with golf course databases
- Tournament tracking
- Handicap calculations
- Weather integration
- GPS course mapping

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Structure
- **TypeScript**: Full type safety throughout
- **React Hooks**: Modern React patterns
- **Context API**: Global state management
- **Service Workers**: Offline functionality
- **Responsive Design**: Mobile-first approach

## 📝 Sample Data

The application comes with three pre-loaded famous golf courses:
- **Pebble Beach Golf Links** - Par 72, 18 holes
- **Augusta National Golf Club** - Par 72, 18 holes  
- **St. Andrews Old Course** - Par 72, 18 holes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎯 Roadmap

- [ ] Enhanced mobile experience
- [ ] Integration with external APIs
- [ ] Advanced analytics dashboard
- [ ] Multi-user support
- [ ] Cloud synchronization
- [ ] Tournament management

## 🏌️‍♂️ Made for Golfers, by Golfers

Built with passion for the game of golf and the desire to help players improve their performance through data-driven insights.

---

**Happy Golfing! ⛳**
