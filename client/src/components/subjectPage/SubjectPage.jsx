import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Info from './info/Info';
import { useAppContext } from '../../context';
import { useUser } from '../../contexts/UserContext';
import YouTubePlayer from './YouTubePlayer/YouTubePlayer';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import QuizComponent from '../QuizComponent/QuizComponent';
import { getSubjectById, markSubjectDone, unmarkSubjectDone } from '../../api/api';
import EditSubjectModal from './EditSubjectModal/EditSubjectModal';

const SubjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSubject, setCurrentSubject, setNotFoundMessage } = useAppContext();
  const { user, setUser } = useUser();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMarkingDone, setIsMarkingDone] = useState(false);
  const [isSubjectDone, setIsSubjectDone] = useState(false);

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

  // Check if subject is already marked as done
  useEffect(() => {
    if (user && currentSubject?._id) {
      const learnedSubjectIds = user.learnedSubjects?.map(subj => 
        typeof subj === 'object' ? subj._id || subj : subj
      ) || [];
      setIsSubjectDone(learnedSubjectIds.includes(currentSubject._id));
    }
  }, [user, currentSubject]);

  const handleMarkAsDone = async () => {
    if (!user || !currentSubject?._id) return;
    
    try {
      setIsMarkingDone(true);
      if (isSubjectDone) {
        // Unmark as done
        const response = await unmarkSubjectDone(currentSubject._id);
        if (response?.success && response.user) {
          setUser(response.user);
          setIsSubjectDone(false);
        }
      } else {
        // Mark as done
        const response = await markSubjectDone(currentSubject._id);
        if (response?.success && response.user) {
          setUser(response.user);
          setIsSubjectDone(true);
        }
      }
    } catch (error) {
      console.error('Error toggling subject done status:', error);
      alert(isSubjectDone ? 'שגיאה בביטול סימון הנושא' : 'שגיאה בסימון הנושא כהושלם');
    } finally {
      setIsMarkingDone(false);
    }
  };

  if (!currentSubject) return null;

  const { subjectName, imageUrl, courseName, tags, info, audioUrl, youTubeUrl, subjectTrivia, createdBy, editedBy } = currentSubject;

  return (
    <div className="space-y-4 sm:space-y-8 w-full">
      <button
        onClick={() => navigate('/cards')}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 group mb-4"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        חזור לכרטיסיות
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 w-full">
        {/* header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-8 text-white relative">
          {/* ✏️ Edit button - Only for admin and teacher */}
          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <button
              onClick={() => setIsEditOpen(true)}
              className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-xs sm:text-sm transition"
            >
              Edit
            </button>
          )}

          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start md:items-center mt-8 sm:mt-0">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-xl overflow-hidden bg-white shadow-lg border-4 border-white/20">
                <img src={imageUrl} alt={subjectName} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex-grow text-right w-full">
              <div className="mb-3 flex items-center gap-2 sm:gap-3 justify-end flex-wrap">
                <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  {courseName}
                </span>
                {user && (
                  <button
                    onClick={handleMarkAsDone}
                    disabled={isMarkingDone}
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold rounded-full border transition ${
                      isSubjectDone
                        ? 'bg-green-500/30 hover:bg-green-500/40 border-green-300 text-white'
                        : 'bg-white/20 hover:bg-white/30 border-white/30 text-white'
                    }`}
                  >
                    {isMarkingDone ? 'מעבד...' : isSubjectDone ? '✓ הושלם' : 'סמן כהושלם'}
                  </button>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 break-words">{subjectName}</h1>
              <div className="mb-3 sm:mb-0">
                <p className="text-sm sm:text-base mb-2">פודקאסט (AI) בנושא <span className='font-bold'>"{subjectName}"</span></p>
                <AudioPlayer audioUrl={audioUrl} />
              </div>

              <div className="flex flex-wrap gap-2 justify-end mt-3 sm:mt-4">
                {tags.map((tag, index) => (
                  <span key={index} className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-full bg-white/20 backdrop-blur-sm border border-white/30" style={{ backgroundColor: `${tag.tagColor}30`, borderColor: `${tag.tagColor}60` }}>
                    {tag.tagName}
                  </span>
                ))}
              </div>

              {/* Created and Edited By Info */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20 text-xs sm:text-sm text-white/80">
                {createdBy && (
                  <p className="mb-1 break-words">
                    נוצר על ידי: <span className="font-semibold">{createdBy}</span>
                  </p>
                )}
                {editedBy && editedBy.length > 0 && (
                  <p className="break-words">
                    נערך על ידי: <span className="font-semibold">{editedBy.join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Info */}
        <div className="p-4 sm:p-6 md:p-8">
          <Info info={info} titleFontSize={24} />
        </div>
        {/* YouTube Video */}
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl mb-4">Watch this video</h1>
          <div className="w-full overflow-hidden">
            <YouTubePlayer youTubeUrl={youTubeUrl} />
          </div>
        </div>
        {/* Quiz */}
        {subjectTrivia && (
          <div className="p-4 sm:p-6">
            <QuizComponent subjectTrivia={subjectTrivia} />
          </div>
        )}
      </div>

      {/* 🧩 Edit Modal */}
      <EditSubjectModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        subject={currentSubject}
        onSave={(updated) => setCurrentSubject(updated)}
      />
    </div>
  );
};

export default SubjectPage;
