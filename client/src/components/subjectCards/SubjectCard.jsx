import React from 'react';
import { useAppContext } from '../../context';
import { useNavigate } from 'react-router-dom';

const SubjectCard = ({subject}) => {
    const {setCurrentSubject} = useAppContext();
    const navigate = useNavigate();
    const {subjectName , imageUrl ,courseName , tags } = subject
    const onSelectSubject = () => {
        setCurrentSubject(subject);
        navigate(`/subjectPage/${subjectName}`);
    }
    return (
        <div>
            <h2>{subjectName}</h2>
            <img src={imageUrl} alt={subjectName} />
            <h3>Course: {courseName}</h3>
            {tags.map((tag, index) => (
                <span key={index} style={{color:tag.tagColor}}>{tag.tagName}</span>
            ))}
            <button onClick={onSelectSubject}> read more</button>

        </div>
    );
}

export default SubjectCard;
