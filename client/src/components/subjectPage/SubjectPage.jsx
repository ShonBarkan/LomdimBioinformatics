import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Info from './info/Info';
import { useAppContext } from '../../context';

const SubjectPage = () => {
  const { subjectName: urlSubjectName } = useParams();
  const navigate = useNavigate();
  const { currentSubject, subjects, setCurrentSubject, setNotFoundMessage } = useAppContext();

  useEffect(() => {

    // check if current subject matches the URL
    if (currentSubject?.subjectName === urlSubjectName) return;

    // try to find the subject by name
    const foundSubject = subjects.find(
      (s) => s.subjectName.toLowerCase() === urlSubjectName.toLowerCase()
    );

    if (foundSubject) {
      setCurrentSubject(foundSubject);
    } else {
      // if not found, redirect to 404
      setNotFoundMessage("Subject '" + urlSubjectName + "' not found.");
      navigate('/404', { replace: true });
    }
  }, [urlSubjectName, subjects, currentSubject, setCurrentSubject, navigate]);

  const { subjectName, imageUrl, courseName, tags, info } = currentSubject;

  return (
    <div>
      <h2>{subjectName}</h2>
      <img src={imageUrl} alt={subjectName} />
      <h3>Course: {courseName}</h3>
      {tags.map((tag, index) => (
        <span key={index} style={{ color: tag.tagColor }}>
          {tag.tagName}
        </span>
      ))}
      <Info info={info} titleFontSize={20} />
    </div>
  );
};

export default SubjectPage;
