import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../../context';
import { useUser } from '../../contexts/UserContext';
import SubjectCard from './SubjectCard';

const CardsPage = () => {
  const { subjects } = useAppContext();
  const { user } = useUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [learnedFilter, setLearnedFilter] = useState('all'); // 'all', 'learned', 'not-learned'
  const [loading, setLoading] = useState(true);

  // Simulate loading subjects (you can remove timeout if your API already handles loading state)
  useEffect(() => {
    if (subjects && subjects.length > 0) {
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [subjects]);

  // extract unique course names for filter options
  const courseNames = useMemo(() => {
    const allCourses = subjects.map((s) => s.courseName);
    return [...new Set(allCourses)];
  }, [subjects]);

  // handle checkbox toggle
  const handleCourseToggle = (courseName) => {
    setSelectedCourses((prev) =>
      prev.includes(courseName)
        ? prev.filter((c) => c !== courseName)
        : [...prev, courseName]
    );
  };

  // Helper function to check if subject is learned
  const isSubjectLearned = (subject) => {
    if (!user || !user.learnedSubjects || !subject._id) return false;
    return user.learnedSubjects.some((learnedSubj) => {
      const learnedId =
        typeof learnedSubj === 'object' ? learnedSubj._id || learnedSubj : learnedSubj;
      return learnedId === subject._id || learnedId?.toString() === subject._id?.toString();
    });
  };

  // apply filters
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesName = subject.subjectName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCourse =
        selectedCourses.length === 0 || selectedCourses.includes(subject.courseName);

      let matchesLearned = true;
      if (learnedFilter === 'learned') {
        matchesLearned = isSubjectLearned(subject);
      } else if (learnedFilter === 'not-learned') {
        matchesLearned = !isSubjectLearned(subject);
      }

      return matchesName && matchesCourse && matchesLearned;
    });
  }, [subjects, searchTerm, selectedCourses, learnedFilter, user]);

  // Show loader while loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-10 w-10 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            ></path>
          </svg>
          <p className="text-gray-600 text-lg font-medium">טוען נושאים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8 w-full">
      {/* Page Header */}
      <div className="text-center mb-4 sm:mb-8 px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-3">
          כרטיסיות נושאים
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          גלה ולמד נושאים מעניינים בביו-אינפורמטיקה
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-8 border border-gray-100 w-full">
        {/* Search Input */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            חיפוש לפי שם נושא
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="חפש נושא..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 text-right text-sm sm:text-base"
              dir="rtl"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Course Filter */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            סנן לפי קורס
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {courseNames.map((courseName) => (
              <label key={courseName} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(courseName)}
                  onChange={() => handleCourseToggle(courseName)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer transition-all"
                />
                <span className="text-gray-700 font-medium group-hover:text-indigo-600 transition-colors duration-200">
                  {courseName}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Learned Filter */}
        {user && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              סנן לפי סטטוס למידה
            </label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { value: 'all', label: 'הכל' },
                { value: 'learned', label: 'נלמד' },
                { value: 'not-learned', label: 'לא נלמד' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="learnedFilter"
                    value={option.value}
                    checked={learnedFilter === option.value}
                    onChange={(e) => setLearnedFilter(e.target.value)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 focus:ring-2 cursor-pointer transition-all"
                  />
                  <span className="text-gray-700 font-medium group-hover:text-indigo-600 transition-colors duration-200">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Info */}
        {(searchTerm || selectedCourses.length > 0 || learnedFilter !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm text-gray-600">
                מציג {filteredSubjects.length} מתוך {subjects.length} נושאים
              </span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCourses([]);
                  setLearnedFilter('all');
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline"
              >
                נקה סינון
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subject Cards Grid */}
      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
          {filteredSubjects.map((subject, index) => (
            <SubjectCard key={index} subject={subject} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">לא נמצאו נושאים</h3>
          <p className="text-gray-500">נסה לשנות את החיפוש או הסינון</p>
        </div>
      )}
    </div>
  );
};

export default CardsPage;
