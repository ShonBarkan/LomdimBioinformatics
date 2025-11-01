import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CardsPage from './components/subjectCards/CardsPage';
import NotFoundPage from './components/NotFoundPage';
import SubjectPage from './components/subjectPage/SubjectPage';

const App = () => {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
        <Link to="/">Home</Link> | <Link to="/cards">Cards</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome!</h1>} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/subjectPage/:subjectName" element={<SubjectPage />} />
        <Route path="/404" element={<NotFoundPage/>}/>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
