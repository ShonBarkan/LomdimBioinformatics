import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context';
import SubjectCard from './SubjectCard';

const CardsPage = () => {
  const { subjects } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);

  // extract unique course names for filter options
  const courseNames = useMemo(() => {
    const allCourses = subjects.map(s => s.courseName);
    return [...new Set(allCourses)];
  }, [subjects]);

  // handle checkbox toggle
  const handleCourseToggle = (courseName) => {
    setSelectedCourses(prev =>
      prev.includes(courseName)
        ? prev.filter(c => c !== courseName)
        : [...prev, courseName]
    );
  };

  // apply filters
  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => {
      const matchesName =
        subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse =
        selectedCourses.length === 0 || selectedCourses.includes(subject.courseName);
      return matchesName && matchesCourse;
    });
  }, [subjects, searchTerm, selectedCourses]);

  return (
    <div className="p-4 space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by subject name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-xl p-2 shadow-sm w-full max-w-md"
        />

        {/* Course Filter */}
        <div className="flex flex-wrap gap-3">
          {courseNames.map(courseName => (
            <label key={courseName} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCourses.includes(courseName)}
                onChange={() => handleCourseToggle(courseName)}
              />
              <span>{courseName}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredSubjects.map((subject, index) => (
          <SubjectCard key={index} subject={subject} />
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-gray-500 italic">No subjects found.</div>
      )}
    </div>
  );
};

export default CardsPage;
