import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

/**
 * Login Component
 * Handles user authentication
 * Redirects to intended page after successful login
 */
const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before login (if any)
  const from = location.state?.from?.pathname || '/';

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate input
    if (!name.trim() || !password.trim()) {
      setError('אנא מלא את כל השדות');
      setLoading(false);
      return;
    }

    try {
      // Attempt login
      const result = await login(name.trim(), password);

      if (result.success) {
        // Login successful, redirect to intended page or home
        navigate(from, { replace: true });
      } else {
        // Login failed, show error
        setError(result.message || 'שם משתמש או סיסמה שגויים');
      }
    } catch (err) {
      setError('שגיאה בהתחברות. אנא נסה שוב.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">התחברות</h1>
            <p className="text-gray-600">אנא הכנס את פרטי ההתחברות שלך</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                שם משתמש
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="הכנס שם משתמש"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                סיסמה
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="הכנס סיסמה"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
            >
              {loading ? 'מתחבר...' : 'התחבר'}
            </button>
          </form>

          {/* SignUp Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              אין לך חשבון?{' '}
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                הירשם כאן
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

