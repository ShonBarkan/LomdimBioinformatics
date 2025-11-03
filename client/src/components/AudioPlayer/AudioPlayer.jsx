import React from "react";

const AudioPlayer = ({ audioUrl }) => {
  return (
    <div className="flex justify-center items-center p-4">
      <audio
        src={audioUrl}
        controls
        className="w-full max-w-md rounded-xl shadow-md"
      >
        הדפדפן שלך לא תומך בניגון אודיו.
      </audio>
    </div>
  );
};

export default AudioPlayer;
