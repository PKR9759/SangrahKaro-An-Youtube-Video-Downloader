import React from 'react';

const FormatSwitch = ({ format, setFormat }) => {
  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="video" className="text-gray-300">Video</label>
      <input
        id="video"
        type="radio"
        name="format"
        value="video"
        checked={format === 'video'}
        onChange={() => setFormat('video')}
        className="mr-2"
      />
      <label htmlFor="mp3" className="text-gray-300">MP3</label>
      <input
        id="mp3"
        type="radio"
        name="format"
        value="mp3"
        checked={format === 'mp3'}
        onChange={() => setFormat('mp3')}
      />
    </div>
  );
};

export default FormatSwitch;
