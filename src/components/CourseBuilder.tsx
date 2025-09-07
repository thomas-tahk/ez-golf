import { useState } from 'react';
import type { Course, Hole } from '../types';
import { useAppContext } from '../context/AppContext';

interface CourseBuilderProps {
  course?: Course;
  onSave: () => void;
  onCancel: () => void;
}

export function CourseBuilder({ course, onSave, onCancel }: CourseBuilderProps) {
  const { dispatch } = useAppContext();
  const [courseName, setCourseName] = useState(course?.name || '');
  const [holes, setHoles] = useState<Hole[]>(
    course?.holes || Array.from({ length: 18 }, (_, i) => ({
      number: i + 1,
      par: 4,
      yardage: undefined,
    }))
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!courseName.trim()) {
      newErrors.courseName = 'Course name is required';
    }

    holes.forEach((hole) => {
      if (hole.yardage && hole.yardage < 50) {
        newErrors[`yardage${hole.number}`] = 'Yardage must be at least 50 yards';
      }
      if (hole.yardage && hole.yardage > 800) {
        newErrors[`yardage${hole.number}`] = 'Yardage cannot exceed 800 yards';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
    const courseData: Course = {
      id: course?.id || `course-${Date.now()}`,
      name: courseName.trim(),
      holes,
      totalPar,
    };

    if (course) {
      dispatch({ type: 'UPDATE_COURSE', payload: courseData });
    } else {
      dispatch({ type: 'CREATE_COURSE', payload: courseData });
    }

    onSave();
  };

  const updateHole = (holeNumber: number, field: keyof Hole, value: any) => {
    setHoles(prevHoles =>
      prevHoles.map(hole =>
        hole.number === holeNumber ? { ...hole, [field]: value } : hole
      )
    );
  };

  const resetToDefaults = () => {
    const defaultHoles: Hole[] = [
      // Par 4s for most holes
      ...Array.from({ length: 10 }, (_, i) => ({ number: i + 1, par: 4 as const })),
      // Add some Par 3s
      { number: 3, par: 3 as const },
      { number: 8, par: 3 as const },
      { number: 12, par: 3 as const },
      { number: 16, par: 3 as const },
      // Add some Par 5s
      { number: 5, par: 5 as const },
      { number: 9, par: 5 as const },
      { number: 14, par: 5 as const },
      { number: 18, par: 5 as const },
    ].sort((a, b) => a.number - b.number);

    setHoles(defaultHoles.slice(0, 18).concat(
      Array.from({ length: Math.max(0, 18 - defaultHoles.length) }, (_, i) => ({
        number: defaultHoles.length + i + 1,
        par: 4 as const,
      }))
    ));
  };

  const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {course ? 'Edit Course' : 'Create New Course'}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Name *
            </label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.courseName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter course name"
            />
            {errors.courseName && (
              <p className="mt-1 text-sm text-red-600">{errors.courseName}</p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Hole Configuration</h3>
              <p className="text-sm text-gray-500">Total Par: {totalPar}</p>
            </div>
            <button
              type="button"
              onClick={resetToDefaults}
              className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
            >
              Use Default Par Values
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {holes.map((hole) => (
              <div
                key={hole.number}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Hole {hole.number}</span>
                  <span className="text-sm text-gray-500">Par {hole.par}</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Par
                  </label>
                  <select
                    value={hole.par}
                    onChange={(e) => updateHole(hole.number, 'par', Number(e.target.value) as 3 | 4 | 5)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value={3}>Par 3</option>
                    <option value={4}>Par 4</option>
                    <option value={5}>Par 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Yardage (optional)
                  </label>
                  <input
                    type="number"
                    value={hole.yardage || ''}
                    onChange={(e) => updateHole(
                      hole.number, 
                      'yardage', 
                      e.target.value ? Number(e.target.value) : undefined
                    )}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      errors[`yardage${hole.number}`] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Yards"
                    min="50"
                    max="800"
                  />
                  {errors[`yardage${hole.number}`] && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[`yardage${hole.number}`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            {course ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </div>
    </div>
  );
}