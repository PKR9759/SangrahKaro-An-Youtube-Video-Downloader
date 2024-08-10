import React from 'react';

const QualitySelector = ({ quality, setQuality }) => {
  const allQualities = [
    "144p", "240p", "360p", "480p", "720p", "1080p", "1440p", "2160p"
  ];

  return (
    <select
      value={quality}
      onChange={(e) => setQuality(e.target.value)}
      className="border p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
    >
      {allQualities.map((q) => (
        <option key={q} value={q}>
          {q}
        </option>
      ))}
    </select>
  );
};

export default QualitySelector;
