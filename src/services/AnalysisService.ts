import type { Round, Course, AnalysisResult, ProblemArea, Recommendation, AnalysisProvider } from '../types';

export class RulesBasedAnalyzer implements AnalysisProvider {
  async analyze(rounds: Round[], courses: Course[]): Promise<AnalysisResult> {
    const completedRounds = rounds.filter(round => round.completed);
    
    if (completedRounds.length === 0) {
      return {
        overallTrend: 'stable',
        problemAreas: [],
        recommendations: [],
        strengths: [],
      };
    }

    const recentRounds = this.getRecentRounds(completedRounds, 5);
    const problemAreas = this.detectProblems(recentRounds, courses);
    const trend = this.analyzeTrend(completedRounds, courses);
    const recommendations = this.generateRecommendations(problemAreas, trend);
    const strengths = this.identifyStrengths(recentRounds, courses);

    return {
      overallTrend: trend,
      problemAreas,
      recommendations,
      strengths,
    };
  }

  private getRecentRounds(rounds: Round[], count: number): Round[] {
    return rounds
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  }

  private detectProblems(rounds: Round[], courses: Course[]): ProblemArea[] {
    const problems: ProblemArea[] = [];
    
    // Detect putting problems
    const puttingIssues = this.detectPuttingIssues(rounds, courses);
    if (puttingIssues) problems.push(puttingIssues);

    // Detect driving problems
    const drivingIssues = this.detectDrivingIssues(rounds, courses);
    if (drivingIssues) problems.push(drivingIssues);

    // Detect short game problems
    const shortGameIssues = this.detectShortGameIssues(rounds, courses);
    if (shortGameIssues) problems.push(shortGameIssues);

    // Detect consistency problems
    const consistencyIssues = this.detectConsistencyIssues(rounds, courses);
    if (consistencyIssues) problems.push(consistencyIssues);

    return problems.sort((a, b) => this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity));
  }

  private detectPuttingIssues(rounds: Round[], courses: Course[]): ProblemArea | null {
    const evidence: string[] = [];
    let puttingProblems = 0;
    let totalPar3Holes = 0;
    let par3Struggles = 0;

    rounds.forEach(round => {
      const course = courses.find(c => c.id === round.courseId);
      if (!course) return;

      round.scores.forEach(score => {
        const hole = course.holes.find(h => h.number === score.holeNumber);
        if (!hole) return;

        // Check comments for putting-related keywords
        if (score.comment) {
          const comment = score.comment.toLowerCase();
          if (comment.includes('putt') || comment.includes('green') || comment.includes('3-putt')) {
            puttingProblems++;
            evidence.push(`Hole ${score.holeNumber}: ${score.comment}`);
          }
        }

        // Par 3 struggles often indicate putting issues
        if (hole.par === 3) {
          totalPar3Holes++;
          if (score.strokes > hole.par + 1) {
            par3Struggles++;
            evidence.push(`Struggling on Par 3 (Hole ${score.holeNumber}): ${score.strokes - hole.par} over par`);
          }
        }
      });
    });

    const puttingProblemRate = puttingProblems / rounds.length;
    const par3StruggleRate = totalPar3Holes > 0 ? par3Struggles / totalPar3Holes : 0;

    if (puttingProblemRate >= 1.5 || par3StruggleRate >= 0.4) {
      return {
        category: 'putting',
        severity: puttingProblemRate >= 2.5 || par3StruggleRate >= 0.6 ? 'high' : 'medium',
        description: 'Putting appears to be a significant challenge affecting your scores',
        evidence: evidence.slice(0, 3), // Limit evidence to keep it concise
      };
    }

    return null;
  }

  private detectDrivingIssues(rounds: Round[], courses: Course[]): ProblemArea | null {
    const evidence: string[] = [];
    let drivingProblems = 0;
    let totalLongHoles = 0;
    let longHoleStruggles = 0;

    rounds.forEach(round => {
      const course = courses.find(c => c.id === round.courseId);
      if (!course) return;

      round.scores.forEach(score => {
        const hole = course.holes.find(h => h.number === score.holeNumber);
        if (!hole) return;

        // Check comments for driving-related keywords
        if (score.comment) {
          const comment = score.comment.toLowerCase();
          if (comment.includes('drive') || comment.includes('tee') || comment.includes('slice') || 
              comment.includes('hook') || comment.includes('ob') || comment.includes('rough')) {
            drivingProblems++;
            evidence.push(`Hole ${score.holeNumber}: ${score.comment}`);
          }
        }

        // Par 4 and 5 struggles often indicate driving issues
        if (hole.par >= 4) {
          totalLongHoles++;
          if (score.strokes > hole.par + 1) {
            longHoleStruggles++;
            evidence.push(`Struggling on Par ${hole.par} (Hole ${score.holeNumber}): ${score.strokes - hole.par} over par`);
          }
        }
      });
    });

    const drivingProblemRate = drivingProblems / rounds.length;
    const longHoleStruggleRate = totalLongHoles > 0 ? longHoleStruggles / totalLongHoles : 0;

    if (drivingProblemRate >= 1.0 || longHoleStruggleRate >= 0.3) {
      return {
        category: 'driving',
        severity: drivingProblemRate >= 2.0 || longHoleStruggleRate >= 0.5 ? 'high' : 'medium',
        description: 'Tee shots and driving accuracy appear to be impacting your performance',
        evidence: evidence.slice(0, 3),
      };
    }

    return null;
  }

  private detectShortGameIssues(rounds: Round[], _courses: Course[]): ProblemArea | null {
    const evidence: string[] = [];
    let shortGameProblems = 0;

    rounds.forEach(round => {
      round.scores.forEach(score => {
        if (score.comment) {
          const comment = score.comment.toLowerCase();
          if (comment.includes('chip') || comment.includes('pitch') || comment.includes('bunker') || 
              comment.includes('sand') || comment.includes('wedge')) {
            shortGameProblems++;
            evidence.push(`Hole ${score.holeNumber}: ${score.comment}`);
          }
        }
      });
    });

    const shortGameProblemRate = shortGameProblems / rounds.length;

    if (shortGameProblemRate >= 1.0) {
      return {
        category: 'short_game',
        severity: shortGameProblemRate >= 2.0 ? 'high' : 'medium',
        description: 'Short game skills (chipping, pitching, bunker play) need attention',
        evidence: evidence.slice(0, 3),
      };
    }

    return null;
  }

  private detectConsistencyIssues(rounds: Round[], courses: Course[]): ProblemArea | null {
    if (rounds.length < 3) return null;

    const scores = rounds.map(round => {
      const course = courses.find(c => c.id === round.courseId);
      if (!course) return null;
      
      const totalScore = round.scores.reduce((sum, score) => sum + score.strokes, 0);
      const totalPar = round.scores.reduce((sum, score) => {
        const hole = course.holes.find(h => h.number === score.holeNumber);
        return sum + (hole?.par || 4);
      }, 0);
      
      return totalScore - totalPar;
    }).filter(score => score !== null) as number[];

    if (scores.length < 3) return null;

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);

    // High standard deviation indicates inconsistency
    if (standardDeviation > 8) {
      const evidence = [`Score variance: ${standardDeviation.toFixed(1)} strokes`];
      const bestScore = Math.min(...scores);
      const worstScore = Math.max(...scores);
      evidence.push(`Best: ${bestScore > 0 ? '+' : ''}${bestScore}, Worst: ${worstScore > 0 ? '+' : ''}${worstScore}`);

      return {
        category: 'approach',
        severity: standardDeviation > 12 ? 'high' : 'medium',
        description: 'Inconsistent scoring patterns suggest focus on course management and mental game',
        evidence,
      };
    }

    return null;
  }

  private analyzeTrend(rounds: Round[], courses: Course[]): 'improving' | 'declining' | 'stable' {
    if (rounds.length < 3) return 'stable';

    const roundsWithScores = rounds
      .map(round => {
        const course = courses.find(c => c.id === round.courseId);
        if (!course) return null;
        
        const totalScore = round.scores.reduce((sum, score) => sum + score.strokes, 0);
        const totalPar = round.scores.reduce((sum, score) => {
          const hole = course.holes.find(h => h.number === score.holeNumber);
          return sum + (hole?.par || 4);
        }, 0);
        
        return {
          date: new Date(round.date),
          scoreToPar: totalScore - totalPar,
        };
      })
      .filter(round => round !== null)
      .sort((a, b) => a!.date.getTime() - b!.date.getTime()) as { date: Date; scoreToPar: number }[];

    if (roundsWithScores.length < 3) return 'stable';

    const recentRounds = roundsWithScores.slice(-3);
    const olderRounds = roundsWithScores.slice(0, -3);
    
    if (olderRounds.length === 0) return 'stable';

    const recentAverage = recentRounds.reduce((sum, round) => sum + round.scoreToPar, 0) / recentRounds.length;
    const olderAverage = olderRounds.reduce((sum, round) => sum + round.scoreToPar, 0) / olderRounds.length;
    
    const difference = recentAverage - olderAverage;
    
    if (difference < -2) return 'improving';
    if (difference > 2) return 'declining';
    return 'stable';
  }

  private generateRecommendations(problems: ProblemArea[], trend: string): Recommendation[] {
    const recommendations: Recommendation[] = [];

    problems.forEach(problem => {
      switch (problem.category) {
        case 'putting':
          recommendations.push({
            category: 'Putting Practice',
            priority: problem.severity === 'high' ? 'high' : 'medium',
            suggestion: 'Focus on putting fundamentals and green reading',
            drills: [
              'Practice 6-foot putts until you can make 8 out of 10',
              'Work on lag putting from 20+ feet',
              'Practice reading greens before each putt',
            ],
          });
          break;

        case 'driving':
          recommendations.push({
            category: 'Driving Accuracy',
            priority: problem.severity === 'high' ? 'high' : 'medium',
            suggestion: 'Improve tee shot consistency and accuracy',
            drills: [
              'Practice with alignment sticks at the range',
              'Focus on tempo and balance in your swing',
              'Consider course management and club selection',
            ],
          });
          break;

        case 'short_game':
          recommendations.push({
            category: 'Short Game',
            priority: problem.severity === 'high' ? 'high' : 'medium',
            suggestion: 'Develop better touch around the greens',
            drills: [
              'Practice chipping with different clubs',
              'Work on bunker technique',
              'Practice pitch shots with various trajectories',
            ],
          });
          break;

        case 'approach':
          recommendations.push({
            category: 'Consistency',
            priority: 'medium',
            suggestion: 'Focus on course management and mental game',
            drills: [
              'Develop a pre-shot routine',
              'Practice course management decisions',
              'Work on maintaining focus throughout the round',
            ],
          });
          break;
      }
    });

    // Add trend-based recommendations
    if (trend === 'declining') {
      recommendations.push({
        category: 'General Improvement',
        priority: 'high',
        suggestion: 'Consider lessons with a PGA professional to address recent score increases',
        drills: ['Schedule a lesson to identify and fix swing issues'],
      });
    } else if (trend === 'improving') {
      recommendations.push({
        category: 'Maintain Progress',
        priority: 'low',
        suggestion: 'Keep up the good work! Continue current practice routine',
        drills: ['Maintain consistent practice schedule'],
      });
    }

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  private identifyStrengths(rounds: Round[], courses: Course[]): string[] {
    const strengths: string[] = [];
    let goodPar3Performance = 0;
    let goodPar5Performance = 0;
    let totalPar3s = 0;
    let totalPar5s = 0;

    rounds.forEach(round => {
      const course = courses.find(c => c.id === round.courseId);
      if (!course) return;

      round.scores.forEach(score => {
        const hole = course.holes.find(h => h.number === score.holeNumber);
        if (!hole) return;

        if (hole.par === 3) {
          totalPar3s++;
          if (score.strokes <= hole.par) goodPar3Performance++;
        } else if (hole.par === 5) {
          totalPar5s++;
          if (score.strokes <= hole.par + 1) goodPar5Performance++;
        }
      });
    });

    if (totalPar3s > 0 && goodPar3Performance / totalPar3s >= 0.6) {
      strengths.push('Strong performance on Par 3s - good iron play and putting');
    }

    if (totalPar5s > 0 && goodPar5Performance / totalPar5s >= 0.7) {
      strengths.push('Consistent scoring on Par 5s - good course management');
    }

    // Add general strengths based on overall performance
    const averageScore = this.calculateAverageScore(rounds, courses);
    if (averageScore && averageScore.scoreToPar < 5) {
      strengths.push('Maintaining single-digit handicap level scoring');
    }

    if (strengths.length === 0) {
      strengths.push('Consistent effort and dedication to improving your game');
    }

    return strengths;
  }

  private calculateAverageScore(rounds: Round[], courses: Course[]): { score: number; scoreToPar: number } | null {
    if (rounds.length === 0) return null;

    let totalScore = 0;
    let totalPar = 0;
    let roundsWithData = 0;

    rounds.forEach(round => {
      const course = courses.find(c => c.id === round.courseId);
      if (!course) return;

      const roundScore = round.scores.reduce((sum, score) => sum + score.strokes, 0);
      const roundPar = round.scores.reduce((sum, score) => {
        const hole = course.holes.find(h => h.number === score.holeNumber);
        return sum + (hole?.par || 4);
      }, 0);

      if (roundScore > 0 && roundPar > 0) {
        totalScore += roundScore;
        totalPar += roundPar;
        roundsWithData++;
      }
    });

    if (roundsWithData === 0) return null;

    return {
      score: totalScore / roundsWithData,
      scoreToPar: (totalScore - totalPar) / roundsWithData,
    };
  }

  private getSeverityWeight(severity: 'low' | 'medium' | 'high'): number {
    switch (severity) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
    }
  }
}

export const analysisService = new RulesBasedAnalyzer();