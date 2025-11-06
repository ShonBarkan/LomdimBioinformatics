import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Info from './info/Info';
import { useAppContext } from '../../context';
import YouTubePlayer from './YouTubePlayer/YouTubePlayer';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import QuizComponent from '../QuizComponent/QuizComponent';
import { getSubjectById } from '../../api/api';

const SubjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSubject, setCurrentSubject, setNotFoundMessage } = useAppContext();

  useEffect(() => {
    if (!id) {
      setNotFoundMessage('Subject not found.');
      navigate('/404', { replace: true });
      return;
    }

    const fetchSubject = async () => {
      try {
        const response = await getSubjectById(id);
        if (response?.success && response.data) {
          setCurrentSubject(response.data);
        } else {
          setNotFoundMessage(`Subject with id "${id}" not found.`);
          navigate('/404', { replace: true });
        }
      } catch (error) {
        setNotFoundMessage(`Error fetching subject with id "${id}".`);
        navigate('/404', { replace: true });
      }
    };

    fetchSubject();
  }, [id, navigate, setCurrentSubject, setNotFoundMessage]);


  if (!currentSubject) return null;

  const { subjectName, imageUrl, courseName, tags, info, audioUrl, youTubeUrl, subjectTrivia } = currentSubject;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/cards')}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 group"
      >
        <svg 
          className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        חזור לכרטיסיות
      </button>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden bg-white shadow-lg border-4 border-white/20">
                <img 
                  src={imageUrl} 
                  alt={subjectName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-200', 'to-purple-200');
                  }}
                />
              </div>
            </div>
            
            {/* Title and Meta */}
            <div className="flex-grow text-right">
              <div className="mb-3">
                <span className="inline-block px-4 py-2 text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  {courseName}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {subjectName}
              </h1>
              {/* AudioPlayer */}
              <div>
                <p>פודקאסט (AI) בנושא <span className='font-bold'>"{subjectName}"</span></p>
                <AudioPlayer audioUrl={audioUrl} />
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-end">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 text-sm font-medium rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
                    style={{backgroundColor: `${tag.tagColor}30`, borderColor: `${tag.tagColor}60`}}
                  >
                    {tag.tagName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Content Section */}
        <div className="p-6 md:p-8">
          <Info info={info} titleFontSize={24} />
        </div>

        {/* YouTubePlayer */}
        <div className="p-6">
          <h1 className="text-2xl mb-4">Watch this video</h1>
          <YouTubePlayer youTubeUrl={youTubeUrl} />
        </div>
        {/* QuizComponent */}
        {subjectTrivia && (
          <QuizComponent subjectTrivia={subjectTrivia} />
        )}
      </div>
    </div>
  );
};

export default SubjectPage;
