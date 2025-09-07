import type { ProblemArea } from '../types';

interface ProblemAreasProps {
  problems: ProblemArea[];
}

export function ProblemAreas({ problems }: ProblemAreasProps) {
  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'low':
        return 'border-blue-300 bg-blue-50';
    }
  };

  const getSeverityTextColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'text-red-800';
      case 'medium':
        return 'text-yellow-800';
      case 'low':
        return 'text-blue-800';
    }
  };

  const getSeverityBadgeColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'putting':
        return 'Putting';
      case 'driving':
        return 'Driving';
      case 'short_game':
        return 'Short Game';
      case 'approach':
        return 'Approach/Consistency';
      default:
        return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'putting':
        return '🏌️‍♂️';
      case 'driving':
        return '🚗';
      case 'short_game':
        return '🎯';
      case 'approach':
        return '📊';
      default:
        return '⚠️';
    }
  };

  if (problems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem Areas</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-gray-600">No major issues detected in your recent rounds!</p>
          <p className="text-sm text-gray-500 mt-2">Keep up the good work and continue practicing consistently.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem Areas</h3>
      
      <div className="space-y-4">
        {problems.map((problem, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${getSeverityColor(problem.severity)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getCategoryIcon(problem.category)}</span>
                <div>
                  <h4 className={`font-semibold ${getSeverityTextColor(problem.severity)}`}>
                    {getCategoryTitle(problem.category)}
                  </h4>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSeverityBadgeColor(problem.severity)}`}>
                    {problem.severity.charAt(0).toUpperCase() + problem.severity.slice(1)} Priority
                  </span>
                </div>
              </div>
            </div>
            
            <p className={`mb-3 ${getSeverityTextColor(problem.severity)}`}>
              {problem.description}
            </p>
            
            {problem.evidence.length > 0 && (
              <div className="mt-3">
                <h5 className={`text-sm font-medium mb-2 ${getSeverityTextColor(problem.severity)}`}>
                  Evidence:
                </h5>
                <ul className="space-y-1">
                  {problem.evidence.map((evidence, evidenceIndex) => (
                    <li key={evidenceIndex} className={`text-sm ${getSeverityTextColor(problem.severity)} opacity-80`}>
                      • {evidence}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Tip:</strong> Focus on the highest priority issues first. Consistent practice in these areas 
          will have the biggest impact on your scores.
        </p>
      </div>
    </div>
  );
}