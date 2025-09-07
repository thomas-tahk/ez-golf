import type { Round, Course, ScoreStatistics, TrendData } from '../types';

export function calculateRoundStatistics(round: Round, course: Course): ScoreStatistics {
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
}

export function getTrendData(rounds: Round[], courses: Course[]): TrendData[] {
  return rounds
    .filter(round => round.completed)
    .map(round => {
      const course = courses.find(c => c.id === round.courseId);
      if (!course) return null;

      const stats = calculateRoundStatistics(round, course);
      return {
        date: round.date,
        score: stats.totalScore,
        scoreToPar: stats.scoreToPar,
        roundId: round.id,
      };
    })
    .filter(data => data !== null)
    .sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime()) as TrendData[];
}

export function formatScoreToPar(scoreToPar: number): string {
  if (scoreToPar === 0) return 'E';
  return scoreToPar > 0 ? `+${scoreToPar}` : `${scoreToPar}`;
}

export function getScoreColor(scoreToPar: number): string {
  if (scoreToPar <= -2) return 'text-blue-600';
  if (scoreToPar === -1) return 'text-green-600';
  if (scoreToPar === 0) return 'text-gray-600';
  if (scoreToPar === 1) return 'text-yellow-600';
  if (scoreToPar >= 2) return 'text-red-600';
  return 'text-gray-600';
}

export function getScoreLabel(scoreToPar: number): string {
  if (scoreToPar === -2) return 'Eagle';
  if (scoreToPar === -1) return 'Birdie';
  if (scoreToPar === 0) return 'Par';
  if (scoreToPar === 1) return 'Bogey';
  if (scoreToPar === 2) return 'Double Bogey';
  if (scoreToPar > 2) return `+${scoreToPar}`;
  if (scoreToPar < -2) return `${scoreToPar}`;
  return '';
}

export function calculateHandicapIndex(rounds: Round[], courses: Course[]): number | null {
  const completedRounds = rounds.filter(round => round.completed);
  if (completedRounds.length < 5) return null;

  // Simple handicap calculation - use best 8 of last 20 rounds
  const recentRounds = completedRounds.slice(-20);
  const differentials = recentRounds
    .map(round => {
      const course = courses.find(c => c.id === round.courseId);
      if (!course) return null;

      const stats = calculateRoundStatistics(round, course);
      // Simplified differential calculation (normally includes course rating and slope)
      return stats.scoreToPar;
    })
    .filter(diff => diff !== null)
    .sort((a, b) => a! - b!) as number[];

  if (differentials.length < 5) return null;

  const countToUse = Math.min(8, Math.floor(differentials.length * 0.4));
  const bestDifferentials = differentials.slice(0, countToUse);
  const average = bestDifferentials.reduce((sum, diff) => sum + diff, 0) / bestDifferentials.length;

  return Math.round(average * 0.96 * 10) / 10; // Simplified handicap calculation
}