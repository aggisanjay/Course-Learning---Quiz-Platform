import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, RefreshCw } from 'lucide-react';
import { courseApi } from '../services/courseApi';
import CourseCard from '../components/courses/CourseCard';
import CourseFilter from '../components/courses/CourseFilter';
import { CourseCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';

export const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedDifficulty = searchParams.get('difficulty') || 'All';

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value.trim() === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseApi.getCourses({
        search: searchQuery,
        category: selectedCategory,
        difficulty: selectedDifficulty,
      });

      if (res.success) {
        setCourses(res.data.courses || []);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError(err.message || 'Unable to load courses. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Courses
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Master in-demand tech skills with curated lessons and practice quizzes.
        </p>
      </div>

      {/* Filter Component */}
      <CourseFilter
        searchQuery={searchQuery}
        onSearchChange={(q) => updateFilters('q', q)}
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => updateFilters('category', cat)}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={(diff) => updateFilters('difficulty', diff)}
        onClearFilters={handleClearFilters}
        totalResults={courses.length}
      />

      {/* Courses Grid / Statuses */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load courses"
          message={error}
          onRetry={fetchCourses}
        />
      ) : courses.length === 0 ? (
        <EmptyState
          icon="course"
          title="No courses found"
          description="We couldn't find any courses matching your filter criteria. Try adjusting your search keywords or resetting filters."
          actionLabel="Reset All Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
