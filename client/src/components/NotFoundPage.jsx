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
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
      <h2 className="text-2xl mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <p className="text-gray-600 mb-6">  
        message : {notFoundMessage}
      </p>
      <button
        onClick={backHome}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFoundPage;
