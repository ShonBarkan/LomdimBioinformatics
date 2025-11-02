import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { notFoundMessage, setNotFoundMessage } = useAppContext();
  const backHome = () => {
    setNotFoundMessage('');
    navigate('/');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full border border-gray-100">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-2xl opacity-30"></div>
            <div className="relative text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          עמוד לא נמצא
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          העמוד שאתה מחפש לא קיים או הועבר למיקום אחר.
        </p>

        {/* Custom Message */}
        {notFoundMessage && (
          <div className="bg-red-50 border-r-4 border-red-400 p-4 rounded-lg mb-6 text-right">
            <p className="text-red-700 font-medium">
              {notFoundMessage}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={backHome}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            חזור לדף הבית
          </button>
          <button
            onClick={() => {
              setNotFoundMessage('');
              navigate('/cards');
            }}
            className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-md border-2 border-indigo-600 hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200"
          >
            עבר לכרטיסיות
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
