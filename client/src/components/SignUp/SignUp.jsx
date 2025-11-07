import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

/**
 * SignUp Component
 * Handles user registration
 * Redirects to intended page after successful registration
 */
const SignUp = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before signup (if any)
  const from = location.state?.from?.pathname || '/';

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate input
    if (!name.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('אנא מלא את כל השדות');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('סיסמה חייבת להכיל לפחות 6 תווים');
      setLoading(false);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      setLoading(false);
      return;
    }

    try {
      // Attempt registration
      const result = await register(name.trim(), password, role);

      if (result.success) {
        // Registration successful, redirect to intended page or home
        navigate(from, { replace: true });
      } else {
        // Registration failed, show error
        setError(result.message || 'שגיאה בהרשמה. אנא נסה שוב.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בהרשמה. אנא נסה שוב.');
      console.error('Signup error:', err);
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">הרשמה</h1>
            <p className="text-gray-600">צור חשבון חדש כדי להתחיל</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* SignUp Form */}
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
                placeholder="הכנס סיסמה (לפחות 6 תווים)"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                אימות סיסמה
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="הכנס שוב את הסיסמה"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                תפקיד
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                disabled={loading}
              >
                <option value="student">תלמיד</option>
                <option value="teacher">מורה</option>
                <option value="admin">מנהל</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
            >
              {loading ? 'נרשם...' : 'הירשם'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              כבר יש לך חשבון?{' '}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                התחבר כאן
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

