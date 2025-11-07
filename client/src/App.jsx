import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import CardsPage from './components/subjectCards/CardsPage';
import NotFoundPage from './components/NotFoundPage';
import SubjectPage from './components/subjectPage/SubjectPage';
import AddNewSubject from './components/AddNewSubject/AddNewSubject';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useUser } from './contexts/UserContext';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useUser();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link 
                to="/" 
                className={`text-lg font-semibold transition-colors duration-200 ${
                  isHomePage 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                בית
              </Link>
              <Link 
                to="/cards" 
                className={`text-lg font-semibold transition-colors duration-200 ${
                  location.pathname === '/cards' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                כרטיסיות נושאים
              </Link>
              <Link 
                to="/AddNewSubject" 
                className={`text-lg font-semibold transition-colors duration-200 ${
                  location.pathname === '/AddNewSubject' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                הוסף נושא חדש
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                לומדים ביו-אינפורמטיקה
              </div>
              {isAuthenticated() ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    שלום, {user?.name} ({user?.role})
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                  >
                    התנתק
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    התחבר
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all"
                  >
                    הירשם
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="text-center py-20">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                  ברוכים הבאים!
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  פלטפורמה ללמידת ביו-אינפורמטיקה עם תכנים מעשירים ומעניינים
                </p>
                <Link 
                  to="/cards"
                  className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
                >
                  התחל לחקור נושאים
                </Link>
              </div>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/subjectPage/:subjectName/:id" element={<SubjectPage />} />
          <Route 
            path="/AddNewSubject" 
            element={
              <ProtectedRoute>
                <AddNewSubject />
              </ProtectedRoute>
            } 
          />
          <Route path="/404" element={<NotFoundPage/>}/>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
