import type { Course } from '../types';
import { useAppContext } from '../context/AppContext';

interface CourseSelectorProps {
  onCourseSelected: (course: Course) => void;
  onCancel: () => void;
}

export function CourseSelector({ onCourseSelected, onCancel }: CourseSelectorProps) {
  const { state } = useAppContext();
  const { courses, loading } = state;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Select a Course</h2>
          <p className="text-sm text-gray-500 mt-1">Choose which course you'll be playing today</p>
        </div>

        <div className="p-6">
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No courses available. Please add a course first.</p>
              <button
                onClick={onCancel}
                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
              >
                Go to Course Management
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onCourseSelected(course)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{course.name}</h3>
                    <span className="text-lg font-bold text-green-600">Par {course.totalPar}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{course.holes.length} holes</p>
                  
                  <div className="grid grid-cols-6 gap-1 mb-4">
                    {course.holes.slice(0, 9).map((hole) => (
                      <div key={hole.number} className="text-center">
                        <div className="text-xs text-gray-500">{hole.number}</div>
                        <div className="text-sm font-medium">{hole.par}</div>
                      </div>
                    ))}
                  </div>
                  
                  {course.holes.length > 9 && (
                    <div className="grid grid-cols-6 gap-1 mb-4">
                      {course.holes.slice(9, 18).map((hole) => (
                        <div key={hole.number} className="text-center">
                          <div className="text-xs text-gray-500">{hole.number}</div>
                          <div className="text-sm font-medium">{hole.par}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCourseSelected(course);
                    }}
                  >
                    Start Round
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}