import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { analysisService } from '../services/AnalysisService';
import { getTrendData } from '../utils/scoreUtils';
import { TrendsChart } from '../components/TrendsChart';
import { ProblemAreas } from '../components/ProblemAreas';
import { Recommendations } from '../components/Recommendations';

export function Analysis() {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completedRounds = state.rounds.filter(round => round.completed);
  const trendData = getTrendData(state.rounds, state.courses);

  useEffect(() => {
    if (completedRounds.length > 0 && !state.analysis) {
      generateAnalysis();
    }
  }, [completedRounds.length, state.analysis]);

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const analysis = await analysisService.analyze(state.rounds, state.courses);
      dispatch({ type: 'SET_ANALYSIS', payload: analysis });
    } catch (err) {
      setError('Failed to generate analysis. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalysis = () => {
    dispatch({ type: 'SET_ANALYSIS', payload: null });
    generateAnalysis();
  };

  if (completedRounds.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-6">📊</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Performance Analysis</h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete some rounds to see your performance analysis
          </p>
          <p className="text-gray-500">
            Play at least one complete round to get insights into your game!
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-red-800 mb-2">Analysis Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={generateAnalysis}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const analysis = state.analysis;

  if (!analysis) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <button
            onClick={generateAnalysis}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-lg"
          >
            Generate Analysis
          </button>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      case 'stable':
        return '📊';
      default:
        return '📊';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declining':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'stable':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendMessage = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'Your scores are trending in the right direction!';
      case 'declining':
        return 'Your recent rounds show room for improvement.';
      case 'stable':
        return 'Your performance has been consistent lately.';
      default:
        return 'Not enough data to determine trend.';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Analysis</h1>
          <p className="text-gray-600 mt-1">
            Based on {completedRounds.length} completed round{completedRounds.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={refreshAnalysis}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
        >
          Refresh Analysis
        </button>
      </div>

      {/* Overall Trend */}
      <div className={`border rounded-lg p-6 ${getTrendColor(analysis.overallTrend)}`}>
        <div className="flex items-center mb-3">
          <span className="text-3xl mr-3">{getTrendIcon(analysis.overallTrend)}</span>
          <div>
            <h3 className="text-lg font-semibold">Overall Trend</h3>
            <p className="capitalize font-medium">{analysis.overallTrend}</p>
          </div>
        </div>
        <p>{getTrendMessage(analysis.overallTrend)}</p>
      </div>

      {/* Charts and Analysis Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TrendsChart data={trendData} />
        
        {/* Strengths */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Strengths</h3>
          {analysis.strengths.length > 0 ? (
            <div className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mt-0.5 mr-3">
                    ✓
                  </div>
                  <p className="text-gray-700">{strength}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Keep working on your game to identify your strengths!</p>
            </div>
          )}
        </div>
      </div>

      {/* Problem Areas */}
      <ProblemAreas problems={analysis.problemAreas} />

      {/* Recommendations */}
      <Recommendations recommendations={analysis.recommendations} />

      {/* Footer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">About This Analysis</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            This analysis is based on your recent rounds and uses pattern recognition to identify 
            areas for improvement. The recommendations are generated using golf-specific algorithms 
            that analyze your scoring patterns and comments.
          </p>
          <p>
            For the most accurate assessment, consider working with a PGA professional who can 
            provide personalized instruction based on your swing and playing style.
          </p>
        </div>
      </div>
    </div>
  );
}