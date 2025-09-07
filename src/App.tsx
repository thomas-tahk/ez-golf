import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { NewRound } from './pages/NewRound';
import { Analysis } from './pages/Analysis';
import { CourseManagement } from './pages/CourseManagement';

type AppView = 'dashboard' | 'new-round' | 'analysis' | 'courses';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            onNewRound={() => setCurrentView('new-round')}
            onViewAnalysis={() => setCurrentView('analysis')}
            onManageCourses={() => setCurrentView('courses')}
          />
        );
      case 'new-round':
        return <NewRound />;
      case 'analysis':
        return <Analysis />;
      case 'courses':
        return <CourseManagement />;
      default:
        return (
          <Dashboard
            onNewRound={() => setCurrentView('new-round')}
            onViewAnalysis={() => setCurrentView('analysis')}
            onManageCourses={() => setCurrentView('courses')}
          />
        );
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          currentView={currentView} 
          onNavigate={(view) => setCurrentView(view as AppView)} 
        />
        <main className="py-8">
          {renderCurrentView()}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
