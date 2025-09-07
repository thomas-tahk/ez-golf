import type { Course } from '../types';
import { useAppContext } from '../context/AppContext';

interface CourseListProps {
  onSelectCourse?: (course: Course) => void;
  onEditCourse?: (course: Course) => void;
}

export function CourseList({ onSelectCourse, onEditCourse }: CourseListProps) {
  const { state, dispatch } = useAppContext();
  const { courses, loading } = state;

  const handleDeleteCourse = (courseId: string, courseName: string) => {
    if (window.confirm(`Are you sure you want to delete "${courseName}"?`)) {
      dispatch({ type: 'DELETE_COURSE', payload: courseId });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Golf Courses</h2>
        <span className="text-sm text-gray-500">{courses.length} courses available</span>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No courses found. Add your first course to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 truncate">
                  {course.name}
                </h3>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  Par {course.totalPar}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 text-sm">
                  {course.holes.length} holes
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {course.holes.slice(0, 6).map((hole) => (
                    <span
                      key={hole.number}
                      className="text-xs px-2 py-1 bg-gray-100 rounded"
                    >
                      {hole.number}: Par {hole.par}
                    </span>
                  ))}
                  {course.holes.length > 6 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      +{course.holes.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {onSelectCourse && (
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Play Round
                  </button>
                )}
                {onEditCourse && (
                  <button
                    onClick={() => onEditCourse(course)}
                    className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteCourse(course.id, course.name)}
                  className="px-3 py-2 border border-red-300 hover:bg-red-50 text-red-700 rounded-md text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}