import React, { useState, useEffect } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              לומדים ביו-אינפורמטיקה
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
                className={`text-lg font-semibold transition-colors duration-200 ${
                  location.pathname === '/cards' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                כרטיסיות נושאים
              </Link>
              {(user?.role === 'admin' || user?.role === 'teacher') && (
                <Link 
                  to="/AddNewSubject" 
                  onClick={closeMobileMenu}
                  className={`text-lg font-semibold transition-colors duration-200 ${
                    location.pathname === '/AddNewSubject' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  הוסף נושא חדש
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link 
                  to="/signup" 
                  onClick={closeMobileMenu}
                  className={`text-lg font-semibold transition-colors duration-200 ${
                    location.pathname === '/signup' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  הוסף משתמש
                </Link>
              )}
            </div>

            {/* Desktop User Section */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated() ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    שלום, {user?.name} ({user?.role})
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                      closeMobileMenu();
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
                    onClick={closeMobileMenu}
                    className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    התחבר
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="תפריט"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slides in from right */}
        <div
          className={`lg:hidden fixed top-16 right-0 h-[calc(100vh-4rem)] w-full sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 space-y-6">
            {/* Mobile Logo */}
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
              לומדים ביו-אינפורמטיקה
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-4">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className={`block px-4 py-3 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                  isHomePage 
                    ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                בית
              </Link>
              <Link 
                to="/cards" 
                onClick={closeMobileMenu}
                className={`block px-4 py-3 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                  location.pathname === '/cards' 
                    ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                כרטיסיות נושאים
              </Link>
              {(user?.role === 'admin' || user?.role === 'teacher') && (
                <Link 
                  to="/AddNewSubject" 
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                    location.pathname === '/AddNewSubject' 
                      ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  הוסף נושא חדש
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link 
                  to="/signup" 
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                    location.pathname === '/signup' 
                      ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  הוסף משתמש
                </Link>
              )}
            </div>

            {/* Mobile User Section */}
            <div className="pt-6 border-t border-gray-200">
              {isAuthenticated() ? (
                <div className="space-y-4">
                  <div className="px-4 py-2 text-sm text-gray-600">
                    שלום, {user?.name}
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-500">
                    תפקיד: {user?.role}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                      closeMobileMenu();
                    }}
                    className="w-full px-4 py-3 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all text-right"
                  >
                    התנתק
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block w-full px-4 py-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all text-center"
                >
                  התחבר
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
            onClick={closeMobileMenu}
          />
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="text-center py-8 sm:py-12 md:py-20 px-4 w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6">
                  ברוכים הבאים!
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  פלטפורמה ללמידת ביו-אינפורמטיקה עם תכנים מעשירים ומעניינים
                </p>
                <Link 
                  to="/cards"
                  className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
                >
                  התחל לחקור נושאים
                </Link>
              </div>
            } 
          />
          <Route 
            path="/login" 
            element={
              <ProtectedRoute allowUnauthenticated={true} blockRoles={['teacher', 'student', 'admin']}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SignUp />
              </ProtectedRoute>
            } 
          />
          <Route path="/cards" element={<CardsPage />} />
          <Route 
            path="/subjectPage/:subjectName/:id" 
            element={
              <ProtectedRoute>
                <SubjectPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/AddNewSubject" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
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
