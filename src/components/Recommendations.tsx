import { useState } from 'react';
import type { Recommendation } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  const [expandedRecommendation, setExpandedRecommendation] = useState<number | null>(null);

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Recommendations</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-gray-600">No specific recommendations available yet.</p>
          <p className="text-sm text-gray-500 mt-2">Play more rounds to get personalized practice suggestions!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Recommendations</h3>
      
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="mr-2">{getPriorityIcon(recommendation.priority)}</span>
                  <h4 className="font-semibold text-gray-900">{recommendation.category}</h4>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                    {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{recommendation.suggestion}</p>
              </div>
              
              {recommendation.drills && recommendation.drills.length > 0 && (
                <button
                  onClick={() => setExpandedRecommendation(
                    expandedRecommendation === index ? null : index
                  )}
                  className="ml-4 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                >
                  {expandedRecommendation === index ? 'Hide Drills' : 'Show Drills'}
                </button>
              )}
            </div>
            
            {expandedRecommendation === index && recommendation.drills && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">Recommended Drills:</h5>
                <div className="space-y-2">
                  {recommendation.drills.map((drill, drillIndex) => (
                    <div key={drillIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 mr-3">
                        {drillIndex + 1}
                      </div>
                      <p className="text-gray-700">{drill}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-blue-600 text-xl">💡</span>
          </div>
          <div className="ml-3">
            <h4 className="font-medium text-blue-900">Pro Tips</h4>
            <div className="mt-2 text-sm text-blue-800 space-y-1">
              <p>• Focus on quality over quantity when practicing</p>
              <p>• Keep a practice journal to track your progress</p>
              <p>• Consider working with a PGA professional for personalized instruction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}