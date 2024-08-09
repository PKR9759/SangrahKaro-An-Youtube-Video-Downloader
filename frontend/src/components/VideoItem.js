import React from 'react';
import QualitySelector from './QualitySelector';
import FormatSwitch from './FormatSwitch';

const VideoItem = ({ video, globalQuality, setGlobalQuality, globalFormat, setGlobalFormat, onSelect }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex items-center space-x-4">
      <img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className="w-16 h-16 object-cover rounded-lg"/>
      <div className="flex-1 overflow-hidden">
        <h2 className="text-lg font-semibold text-white truncate">{video.title}</h2>
      </div>
      <div className="flex flex-col items-center">
        <QualitySelector quality={globalQuality} setQuality={setGlobalQuality} />
        <FormatSwitch format={globalFormat} setFormat={setGlobalFormat} />
        <button
          onClick={onSelect}
          className="bg-red-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
        >
          Select for Download
        </button>
      </div>
    </div>
  );
};

export default VideoItem;
