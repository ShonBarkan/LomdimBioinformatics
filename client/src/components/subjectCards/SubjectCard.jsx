import React from 'react';
import { useAppContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const SubjectCard = ({subject}) => {
    const {setCurrentSubject} = useAppContext();
    const { user } = useUser();
    const navigate = useNavigate();
    const {subjectName , imageUrl ,courseName , tags } = subject
    
    // Check if subject is learned
    const isLearned = user && user.learnedSubjects && subject._id && 
      user.learnedSubjects.some(learnedSubj => {
        const learnedId = typeof learnedSubj === 'object' ? learnedSubj._id || learnedSubj : learnedSubj;
        return learnedId === subject._id || learnedId?.toString() === subject._id?.toString();
      });
    
    const onSelectSubject = () => {
        if (!user) {
            // If user is not logged in, redirect to login
            navigate('/login');
            return;
        }
        setCurrentSubject(subject);
        navigate(`/subjectPage/${subjectName}/${subject._id}`);
    }
    
    return (
        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 flex flex-col ${
          isLearned ? 'border-4 border-green-500' : 'border border-gray-100'
        }`}>
            {/* Image Container */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                <img 
                    src={imageUrl} 
                    alt={subjectName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            </div>
            
            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Course Name Badge */}
                <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                        {courseName}
                    </span>
                </div>
                
                {/* Subject Name */}
                <h2 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2 min-h-[3.5rem]">
                    {subjectName}
                </h2>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4 flex-grow">
                    {tags.map((tag, index) => (
                        <span 
                            key={index} 
                            className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                            style={{borderColor: tag.tagColor, color: tag.tagColor, backgroundColor: `${tag.tagColor}15`}}
                        >
                            {tag.tagName}
                        </span>
                    ))}
                </div>
                
                {/* Read More Button */}
                <button 
                    onClick={onSelectSubject}
                    className="mt-auto w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    קרא עוד
                </button>
            </div>
        </div>
    );
}

export default SubjectCard;
