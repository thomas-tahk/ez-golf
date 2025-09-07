
interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'new-round', label: 'New Round', icon: '⛳' },
    { id: 'analysis', label: 'Analysis', icon: '📊' },
    { id: 'courses', label: 'Courses', icon: '🏌️' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-green-600 mr-8">
              ⛳ EZ Golf
            </div>
            
            <div className="hidden md:flex space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Golf Performance Tracker
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex space-x-1 pb-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex-1 flex flex-col items-center space-y-1 px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}