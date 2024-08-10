import React from 'react';

const FormatSwitch = ({ format, setFormat }) => {
  return (
    <div className="flex items-center space-x-4">
      <label
        onClick={() => setFormat('video')}
        className={`cursor-pointer flex items-center space-x-2 p-2 rounded-lg transition duration-300
          ${format === 'video' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
      >
        <input
          type="radio"
          name="format"
          value="video"
          checked={format === 'video'}
          onChange={() => setFormat('video')}
          className="hidden"
        />
        <span className="w-4 h-4 border border-gray-500 rounded-full flex items-center justify-center">
          {format === 'video' && (
            <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
          )}
        </span>
        <span>Video</span>
      </label>
      
      <label
        onClick={() => setFormat('mp3')}
        className={`cursor-pointer flex items-center space-x-2 p-2 rounded-lg transition duration-300
          ${format === 'mp3' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
      >
        <input
          type="radio"
          name="format"
          value="mp3"
          checked={format === 'mp3'}
          onChange={() => setFormat('mp3')}
          className="hidden"
        />
        <span className="w-4 h-4 border border-gray-500 rounded-full flex items-center justify-center">
          {format === 'mp3' && (
            <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
          )}
        </span>
        <span>MP3</span>
      </label>
    </div>
  );
};

export default FormatSwitch;
