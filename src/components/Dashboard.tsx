import { useAppContext } from '../context/AppContext';
import { formatScoreToPar, calculateHandicapIndex } from '../utils/scoreUtils';

interface DashboardProps {
  onNewRound: () => void;
  onViewAnalysis: () => void;
  onManageCourses: () => void;
}

export function Dashboard({ onNewRound, onViewAnalysis, onManageCourses }: DashboardProps) {
  const { state } = useAppContext();
  const { rounds, courses } = state;

  const completedRounds = rounds.filter(round => round.completed);
  const recentRounds = completedRounds
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getScoreForRound = (roundId: string) => {
    const round = rounds.find(r => r.id === roundId);
    const course = courses.find(c => c.id === round?.courseId);
    
    if (!round || !course) return null;

    const totalScore = round.scores.reduce((sum, score) => sum + score.strokes, 0);
    const totalPar = round.scores.reduce((sum, score) => {
      const hole = course.holes.find(h => h.number === score.holeNumber);
      return sum + (hole?.par || 4);
    }, 0);

    return { score: totalScore, par: totalPar, scoreToPar: totalScore - totalPar };
  };

  const getScoreColor = (scoreToPar: number) => {
    if (scoreToPar <= -2) return 'text-blue-600';
    if (scoreToPar === -1) return 'text-green-600';
    if (scoreToPar === 0) return 'text-gray-600';
    if (scoreToPar === 1) return 'text-yellow-600';
    if (scoreToPar >= 2) return 'text-red-600';
    return 'text-gray-600';
  };

  const handicapIndex = calculateHandicapIndex(completedRounds, courses);

  // Calculate quick stats
  const totalRoundsPlayed = completedRounds.length;
  const bestScore = completedRounds.length > 0 
    ? Math.min(...completedRounds.map(round => {
        const scoreData = getScoreForRound(round.id);
        return scoreData?.scoreToPar || 0;
      }))
    : null;

  const averageScore = completedRounds.length > 0
    ? completedRounds.reduce((sum, round) => {
        const scoreData = getScoreForRound(round.id);
        return sum + (scoreData?.scoreToPar || 0);
      }, 0) / completedRounds.length
    : null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Golf Performance Tracker</h1>
        <p className="text-xl text-gray-600">Track your rounds, analyze your game, improve your scores</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={onNewRound}
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg text-center transition-colors"
        >
          <div className="text-3xl mb-2">⛳</div>
          <div className="text-lg font-semibold">New Round</div>
          <div className="text-sm opacity-90">Start tracking a new round</div>
        </button>
        
        <button
          onClick={onViewAnalysis}
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-center transition-colors"
        >
          <div className="text-3xl mb-2">📊</div>
          <div className="text-lg font-semibold">View Analysis</div>
          <div className="text-sm opacity-90">Get insights on your game</div>
        </button>
        
        <button
          onClick={onManageCourses}
          className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg text-center transition-colors"
        >
          <div className="text-3xl mb-2">🏌️</div>
          <div className="text-lg font-semibold">Manage Courses</div>
          <div className="text-sm opacity-90">Add or edit golf courses</div>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{totalRoundsPlayed}</div>
          <div className="text-sm text-gray-500">Rounds Played</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {bestScore !== null ? formatScoreToPar(bestScore) : '-'}
          </div>
          <div className="text-sm text-gray-500">Best Score</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {averageScore !== null ? formatScoreToPar(Math.round(averageScore)) : '-'}
          </div>
          <div className="text-sm text-gray-500">Average Score</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {handicapIndex !== null ? handicapIndex.toFixed(1) : '-'}
          </div>
          <div className="text-sm text-gray-500">Est. Handicap</div>
        </div>
      </div>

      {/* Recent Rounds */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Rounds</h2>
        </div>
        
        <div className="p-6">
          {recentRounds.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🏌️‍♂️</div>
              <p className="text-lg mb-2">No rounds recorded yet</p>
              <p className="text-sm">Start your first round to begin tracking your performance!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRounds.map(round => {
                const course = courses.find(c => c.id === round.courseId);
                const scoreData = getScoreForRound(round.id);
                
                if (!course || !scoreData) return null;
                
                return (
                  <div
                    key={round.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(round.date).toLocaleDateString()}
                        {round.scores.length < course.holes.length && (
                          <span className="ml-2 text-yellow-600">
                            (Incomplete - {round.scores.length}/{course.holes.length} holes)
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {scoreData.score}
                      </div>
                      <div className={`text-sm font-medium ${getScoreColor(scoreData.scoreToPar)}`}>
                        {formatScoreToPar(scoreData.scoreToPar)}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {completedRounds.length > 5 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Showing {recentRounds.length} of {completedRounds.length} completed rounds
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Current Round Status */}
      {state.currentRound && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Round in Progress</h3>
              <p className="text-yellow-700">
                {courses.find(c => c.id === state.currentRound?.courseId)?.name} • 
                {state.currentRound.scores.length} holes completed
              </p>
            </div>
            <button
              onClick={onNewRound}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-medium"
            >
              Continue Round
            </button>
          </div>
        </div>
      )}
    </div>
  );
}