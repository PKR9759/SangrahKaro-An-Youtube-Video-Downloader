import React from 'react';

const QualitySelector = ({ quality, setQuality }) => {
  return (
    <select
      value={quality}
      onChange={(e) => setQuality(e.target.value)}
      className="border p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
    >
      <option value="144p">144p</option>
      <option value="360p">360p</option>
      <option value="720p">720p</option>
    </select>
  );
};

export default QualitySelector;
