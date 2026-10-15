import React from 'react';

const FullscreenToggle = ({ isFullscreen, onToggle }) => {
  return (
    <div className="fixed bottom-20 right-6 z-50">
      <button
        onClick={onToggle}
        className="bg-gray-600 hover:bg-gray-700 text-white w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none"
        aria-label="Toggle fullscreen"
      >
        {isFullscreen ? (
          <i class="ri-collapse-diagonal-line text-xl"></i> // exit fullscreen icon
        ) : (
          <i className="ri-expand-diagonal-s-line text-xl"></i> // enter fullscreen icon
        )}
      </button>
    </div>
  );
};

export default FullscreenToggle;