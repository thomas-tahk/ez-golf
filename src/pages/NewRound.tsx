import { useState, useEffect } from 'react';
import type { Course, Round } from '../types';
import { useAppContext } from '../context/AppContext';
import { CourseSelector } from '../components/CourseSelector';
import { LiveScoring } from '../components/LiveScoring';
import { RoundSummary } from '../components/RoundSummary';

type RoundState = 'course-selection' | 'scoring' | 'summary';

export function NewRound() {
  const { state, dispatch } = useAppContext();
  const [roundState, setRoundState] = useState<RoundState>('course-selection');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [completedRound, setCompletedRound] = useState<Round | null>(null);

  useEffect(() => {
    if (state.currentRound && !completedRound) {
      setRoundState('scoring');
      const course = state.courses.find(c => c.id === state.currentRound!.courseId);
      if (course) {
        setSelectedCourse(course);
      }
    }
  }, [state.currentRound, state.courses, completedRound]);

  const handleCourseSelected = (course: Course) => {
    const newRound: Round = {
      id: `round-${Date.now()}`,
      courseId: course.id,
      date: new Date().toISOString(),
      scores: [],
      completed: false,
    };

    setSelectedCourse(course);
    dispatch({ type: 'START_ROUND', payload: newRound });
    setRoundState('scoring');
  };

  const handleRoundComplete = () => {
    if (state.currentRound) {
      setCompletedRound(state.currentRound);
      setRoundState('summary');
    }
  };

  const handleExitScoring = () => {
    setRoundState('course-selection');
    setSelectedCourse(null);
  };

  const handleNewRound = () => {
    setCompletedRound(null);
    setSelectedCourse(null);
    setRoundState('course-selection');
    dispatch({ type: 'CLEAR_CURRENT_ROUND' });
  };

  const handleBackToDashboard = () => {
    setCompletedRound(null);
    setSelectedCourse(null);
    setRoundState('course-selection');
    dispatch({ type: 'CLEAR_CURRENT_ROUND' });
  };

  const handleAnalyze = () => {
    // TODO: Navigate to analysis page
    console.log('Analysis requested for round:', completedRound?.id);
  };

  if (roundState === 'scoring' && selectedCourse) {
    return (
      <LiveScoring
        course={selectedCourse}
        onComplete={handleRoundComplete}
        onExit={handleExitScoring}
      />
    );
  }

  if (roundState === 'summary' && completedRound && selectedCourse) {
    return (
      <RoundSummary
        round={completedRound}
        course={selectedCourse}
        onAnalyze={handleAnalyze}
        onNewRound={handleNewRound}
        onHome={handleBackToDashboard}
      />
    );
  }

  return (
    <CourseSelector
      onCourseSelected={handleCourseSelected}
      onCancel={handleBackToDashboard}
    />
  );
}