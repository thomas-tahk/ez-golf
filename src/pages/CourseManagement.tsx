import { useState } from 'react';
import type { Course } from '../types';
import { CourseList } from '../components/CourseList';
import { CourseBuilder } from '../components/CourseBuilder';

export function CourseManagement() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);

  const handleCreateNew = () => {
    setEditingCourse(undefined);
    setView('create');
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setView('edit');
  };

  const handleSave = () => {
    setEditingCourse(undefined);
    setView('list');
  };

  const handleCancel = () => {
    setEditingCourse(undefined);
    setView('list');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <CourseBuilder
        course={editingCourse}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your golf courses and create new ones
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Add New Course
        </button>
      </div>

      <CourseList onEditCourse={handleEditCourse} />
    </div>
  );
}