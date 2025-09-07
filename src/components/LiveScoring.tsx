import { useState, useEffect } from 'react';
import type { Course, HoleScore } from '../types';
import { useAppContext } from '../context/AppContext';

interface LiveScoringProps {
  course: Course;
  onComplete: () => void;
  onExit: () => void;
}

export function LiveScoring({ course, onComplete, onExit }: LiveScoringProps) {
  const { state, dispatch } = useAppContext();
  const { currentRound } = state;
  const [currentHole, setCurrentHole] = useState(1);
  const [strokes, setStrokes] = useState(1);
  const [comment, setComment] = useState('');

  const currentHoleData = course.holes.find(h => h.number === currentHole);
  const currentScore = currentRound?.scores.find(s => s.holeNumber === currentHole);

  useEffect(() => {
    if (currentScore) {
      setStrokes(currentScore.strokes);
      setComment(currentScore.comment || '');
    } else {
      setStrokes(currentHoleData?.par || 4);
      setComment('');
    }
  }, [currentHole, currentScore, currentHoleData]);

  const saveScore = () => {
    if (!currentRound) return;

    const score: HoleScore = {
      holeNumber: currentHole,
      strokes,
      comment: comment.trim() || undefined,
    };

    dispatch({
      type: 'UPDATE_SCORE',
      payload: { holeNumber: currentHole, score }
    });
  };

  const handleNextHole = () => {
    saveScore();
    if (currentHole < course.holes.length) {
      setCurrentHole(currentHole + 1);
    }
  };

  const handlePreviousHole = () => {
    saveScore();
    if (currentHole > 1) {
      setCurrentHole(currentHole - 1);
    }
  };

  const handleCompleteRound = () => {
    saveScore();
    dispatch({ type: 'COMPLETE_ROUND' });
    onComplete();
  };

  const handleSaveAndExit = () => {
    saveScore();
    onExit();
  };

  const adjustStrokes = (delta: number) => {
    setStrokes(Math.max(1, strokes + delta));
  };

  const getScoreToPar = () => {
    const par = currentHoleData?.par || 4;
    const scoreToPar = strokes - par;
    if (scoreToPar === 0) return 'Par';
    if (scoreToPar === -2) return 'Eagle';
    if (scoreToPar === -1) return 'Birdie';
    if (scoreToPar === 1) return 'Bogey';
    if (scoreToPar === 2) return 'Double Bogey';
    if (scoreToPar > 2) return `+${scoreToPar}`;
    if (scoreToPar < -2) return `${scoreToPar}`;
    return '';
  };

  const getScoreColor = () => {
    const par = currentHoleData?.par || 4;
    const scoreToPar = strokes - par;
    if (scoreToPar <= -2) return 'text-blue-600';
    if (scoreToPar === -1) return 'text-green-600';
    if (scoreToPar === 0) return 'text-gray-600';
    if (scoreToPar === 1) return 'text-yellow-600';
    if (scoreToPar >= 2) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTotalScore = () => {
    if (!currentRound) return { total: 0, par: 0 };
    
    let total = 0;
    let par = 0;
    
    currentRound.scores.forEach(score => {
      total += score.strokes;
      const hole = course.holes.find(h => h.number === score.holeNumber);
      if (hole) par += hole.par;
    });
    
    // Include current hole if it's been scored
    const currentHoleScore = currentRound.scores.find(s => s.holeNumber === currentHole);
    if (!currentHoleScore) {
      total += strokes;
      par += currentHoleData?.par || 4;
    }
    
    return { total, par };
  };

  const progress = ((currentHole - 1) / course.holes.length) * 100;
  const totalScore = getTotalScore();

  if (!currentHoleData) {
    return <div>Error: Hole data not found</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{course.name}</h2>
              <p className="text-sm text-gray-500">
                Total: {totalScore.total} ({totalScore.total > totalScore.par ? '+' : ''}{totalScore.total - totalScore.par})
              </p>
            </div>
            <button
              onClick={handleSaveAndExit}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Save & Exit
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Hole {currentHole} of {course.holes.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current Hole */}
        <div className="px-6 py-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Hole {currentHole}</h1>
            <div className="flex justify-center items-center space-x-4">
              <span className="text-lg text-gray-600">Par {currentHoleData.par}</span>
              {currentHoleData.yardage && (
                <span className="text-lg text-gray-600">{currentHoleData.yardage} yards</span>
              )}
            </div>
          </div>

          {/* Stroke Counter */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center space-x-4 mb-3">
              <button
                onClick={() => adjustStrokes(-1)}
                disabled={strokes <= 1}
                className="w-12 h-12 rounded-full bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:hover:bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl"
              >
                −
              </button>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-1">{strokes}</div>
                <div className={`text-sm font-medium ${getScoreColor()}`}>
                  {getScoreToPar()}
                </div>
              </div>
              
              <button
                onClick={() => adjustStrokes(1)}
                className="w-12 h-12 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-600 font-bold text-xl"
              >
                +
              </button>
            </div>
            
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button
                  key={num}
                  onClick={() => setStrokes(num)}
                  className={`w-8 h-8 rounded text-sm font-medium ${
                    strokes === num
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., missed putt, great drive, slice..."
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={handlePreviousHole}
              disabled={currentHole === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              ← Previous
            </button>
            
            {currentHole < course.holes.length ? (
              <button
                onClick={handleNextHole}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
              >
                Next Hole →
              </button>
            ) : (
              <button
                onClick={handleCompleteRound}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
              >
                Complete Round
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}