import type { Course, Round, ScoreStatistics } from '../types';
import { useAppContext } from '../context/AppContext';

interface RoundSummaryProps {
  round: Round;
  course: Course;
  onAnalyze?: () => void;
  onNewRound?: () => void;
  onHome?: () => void;
}

export function RoundSummary({ round, course, onAnalyze, onNewRound, onHome }: RoundSummaryProps) {
  const { dispatch } = useAppContext();

  const calculateStatistics = (): ScoreStatistics => {
    let totalScore = 0;
    let totalPar = 0;
    let birdies = 0;
    let eagles = 0;
    let pars = 0;
    let bogeys = 0;
    let doubleBogeys = 0;
    let others = 0;
    
    let bestHole = { holeNumber: 1, scoreToPar: 0 };
    let worstHole = { holeNumber: 1, scoreToPar: 0 };

    round.scores.forEach(score => {
      const hole = course.holes.find(h => h.number === score.holeNumber);
      if (!hole) return;

      totalScore += score.strokes;
      totalPar += hole.par;
      
      const scoreToPar = score.strokes - hole.par;
      
      if (scoreToPar <= -2) eagles++;
      else if (scoreToPar === -1) birdies++;
      else if (scoreToPar === 0) pars++;
      else if (scoreToPar === 1) bogeys++;
      else if (scoreToPar === 2) doubleBogeys++;
      else others++;

      if (scoreToPar < bestHole.scoreToPar) {
        bestHole = { holeNumber: score.holeNumber, scoreToPar };
      }
      if (scoreToPar > worstHole.scoreToPar) {
        worstHole = { holeNumber: score.holeNumber, scoreToPar };
      }
    });

    return {
      totalScore,
      totalPar,
      scoreToPar: totalScore - totalPar,
      birdies,
      eagles,
      pars,
      bogeys,
      doubleBogeys,
      others,
      bestHole,
      worstHole,
    };
  };

  const handleDeleteRound = () => {
    if (window.confirm('Are you sure you want to delete this round?')) {
      dispatch({ type: 'DELETE_ROUND', payload: round.id });
      onHome?.();
    }
  };

  const formatScoreToPar = (scoreToPar: number) => {
    if (scoreToPar === 0) return 'E';
    return scoreToPar > 0 ? `+${scoreToPar}` : `${scoreToPar}`;
  };

  const getScoreColor = (scoreToPar: number) => {
    if (scoreToPar <= -2) return 'text-blue-600';
    if (scoreToPar === -1) return 'text-green-600';
    if (scoreToPar === 0) return 'text-gray-600';
    if (scoreToPar === 1) return 'text-yellow-600';
    if (scoreToPar >= 2) return 'text-red-600';
    return 'text-gray-600';
  };

  const stats = calculateStatistics();
  const completedHoles = round.scores.length;
  const isComplete = round.completed;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
              <p className="text-sm text-gray-500">
                {new Date(round.date).toLocaleDateString()} • 
                {isComplete ? ' Completed' : ` ${completedHoles} of ${course.holes.length} holes played`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.totalScore}</div>
              <div className={`text-lg font-medium ${getScoreColor(stats.scoreToPar)}`}>
                {formatScoreToPar(stats.scoreToPar)}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Round Statistics</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.eagles > 0 && (
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.eagles}</div>
                <div className="text-sm text-blue-800">Eagles</div>
              </div>
            )}
            {stats.birdies > 0 && (
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.birdies}</div>
                <div className="text-sm text-green-800">Birdies</div>
              </div>
            )}
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.pars}</div>
              <div className="text-sm text-gray-800">Pars</div>
            </div>
            {stats.bogeys > 0 && (
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.bogeys}</div>
                <div className="text-sm text-yellow-800">Bogeys</div>
              </div>
            )}
            {stats.doubleBogeys > 0 && (
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.doubleBogeys}</div>
                <div className="text-sm text-orange-800">Double+</div>
              </div>
            )}
          </div>

          {/* Best/Worst Holes */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Best Hole</h4>
              <p className="text-green-700">
                Hole {stats.bestHole.holeNumber}: {formatScoreToPar(stats.bestHole.scoreToPar)}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Toughest Hole</h4>
              <p className="text-red-700">
                Hole {stats.worstHole.holeNumber}: {formatScoreToPar(stats.worstHole.scoreToPar)}
              </p>
            </div>
          </div>
        </div>

        {/* Scorecard */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scorecard</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Hole</th>
                  {course.holes.slice(0, 9).map(hole => (
                    <th key={hole.number} className="text-center py-2 min-w-8">{hole.number}</th>
                  ))}
                  <th className="text-center py-2 font-bold">OUT</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">Par</td>
                  {course.holes.slice(0, 9).map(hole => (
                    <td key={hole.number} className="text-center py-2">{hole.par}</td>
                  ))}
                  <td className="text-center py-2 font-bold">
                    {course.holes.slice(0, 9).reduce((sum, hole) => sum + hole.par, 0)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Score</td>
                  {course.holes.slice(0, 9).map(hole => {
                    const score = round.scores.find(s => s.holeNumber === hole.number);
                    const scoreToPar = score ? score.strokes - hole.par : 0;
                    return (
                      <td key={hole.number} className={`text-center py-2 font-bold ${
                        score ? getScoreColor(scoreToPar) : 'text-gray-300'
                      }`}>
                        {score ? score.strokes : '-'}
                      </td>
                    );
                  })}
                  <td className="text-center py-2 font-bold">
                    {round.scores
                      .filter(s => s.holeNumber <= 9)
                      .reduce((sum, score) => sum + score.strokes, 0) || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {course.holes.length > 9 && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Hole</th>
                    {course.holes.slice(9, 18).map(hole => (
                      <th key={hole.number} className="text-center py-2 min-w-8">{hole.number}</th>
                    ))}
                    <th className="text-center py-2 font-bold">IN</th>
                    <th className="text-center py-2 font-bold">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Par</td>
                    {course.holes.slice(9, 18).map(hole => (
                      <td key={hole.number} className="text-center py-2">{hole.par}</td>
                    ))}
                    <td className="text-center py-2 font-bold">
                      {course.holes.slice(9, 18).reduce((sum, hole) => sum + hole.par, 0)}
                    </td>
                    <td className="text-center py-2 font-bold">{stats.totalPar}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Score</td>
                    {course.holes.slice(9, 18).map(hole => {
                      const score = round.scores.find(s => s.holeNumber === hole.number);
                      const scoreToPar = score ? score.strokes - hole.par : 0;
                      return (
                        <td key={hole.number} className={`text-center py-2 font-bold ${
                          score ? getScoreColor(scoreToPar) : 'text-gray-300'
                        }`}>
                          {score ? score.strokes : '-'}
                        </td>
                      );
                    })}
                    <td className="text-center py-2 font-bold">
                      {round.scores
                        .filter(s => s.holeNumber > 9)
                        .reduce((sum, score) => sum + score.strokes, 0) || '-'}
                    </td>
                    <td className="text-center py-2 font-bold text-lg">{stats.totalScore}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Comments */}
        {round.comments && (
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Round Notes</h3>
            <p className="text-gray-700">{round.comments}</p>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-3 justify-between">
          <div className="flex gap-3">
            {onHome && (
              <button
                onClick={onHome}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
            )}
            {onAnalyze && isComplete && (
              <button
                onClick={onAnalyze}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
              >
                Get Analysis
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            {onNewRound && (
              <button
                onClick={onNewRound}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
              >
                New Round
              </button>
            )}
            <button
              onClick={handleDeleteRound}
              className="px-4 py-2 border border-red-300 hover:bg-red-50 text-red-700 rounded-md text-sm font-medium"
            >
              Delete Round
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}