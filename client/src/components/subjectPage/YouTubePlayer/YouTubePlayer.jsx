import React from "react";

const YouTubePlayer = ({ youTubeUrl, title = "YouTube video" }) => {
  if (!youTubeUrl || typeof youTubeUrl !== "string") {
    return null; // or render a friendly fallback message
  }

  // Extract video ID from full URL or use directly if given
  const getVideoId = (url) => {
    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[1] && match[1].length === 11 ? match[1] : null;
  };

  const videoId = getVideoId(youTubeUrl);

  if (!videoId) {
    return (
      <div className="text-gray-500 italic text-center py-4">
        🎥 No valid YouTube video found for this subject.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-md aspect-video">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubePlayer;
