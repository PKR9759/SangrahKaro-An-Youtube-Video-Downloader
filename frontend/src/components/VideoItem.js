import React from 'react';
import QualitySelector from './QualitySelector';
import FormatSwitch from './FormatSwitch';

const VideoItem = ({ video, isSelected, onSelect }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center space-x-4">
      <img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className="w-24 h-16 object-cover rounded-lg"/>
      <div className="flex-1 flex flex-col justify-between">
        <h2 className="text-lg font-semibold text-white truncate">{video.title}</h2>
        <div className="flex items-center justify-between space-x-4 mt-2">
          <QualitySelector quality="360p" setQuality={() => {}} />
          <FormatSwitch format="video" setFormat={() => {}} />
          <button
            onClick={onSelect}
            className={`px-4 py-2 rounded-lg transition duration-300 ${isSelected ? 'bg-green-600' : 'bg-red-600'} text-white hover:${isSelected ? 'bg-green-700' : 'bg-red-700'} focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            {isSelected ? 'Selected' : 'Select for Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
