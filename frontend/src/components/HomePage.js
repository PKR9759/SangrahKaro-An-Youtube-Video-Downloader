import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../config';
import VideoItem from './VideoItem';
import { FaArrowDown } from 'react-icons/fa';
import InstructionalPopup from './InstructionalPopup';
import FormatSwitch from './FormatSwitch'; // Import the FormatSwitch component
import QualitySelector from './QualitySelector'; // Import the QualitySelector component

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [globalSettings, setGlobalSettings] = useState(false); // New state for global settings
  const [globalQuality, setGlobalQuality] = useState('360p');
  const [globalFormat, setGlobalFormat] = useState('video');

  useEffect(() => {
    const updatedSelection = videos.reduce((acc, video) => {
      acc[video.id] = {
        selected: selectAll,
        quality: globalSettings ? globalQuality : (selectedVideos[video.id]?.quality || '360p'),
        format: globalSettings ? globalFormat : (selectedVideos[video.id]?.format || 'video'),
      };
      return acc;
    }, {});
    setSelectedVideos(updatedSelection);
  }, [selectAll, globalQuality, globalFormat, globalSettings, videos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(`Processing URL: ${url}`);

    try {
      const response = await axios.post(`${BASE_URL}/get-videos`, { url });
      setVideos(response.data.videos);
      setStatus('Videos retrieved successfully!');
    } catch (error) {
      setStatus('Failed to retrieve video information.');
      toast.error('Failed to retrieve video information. Please check the URL and try again.');
    }
  };

  const handleSelectVideo = (videoId) => {
    setSelectedVideos(prevSelection => ({
      ...prevSelection,
      [videoId]: {
        ...prevSelection[videoId],
        selected: !prevSelection[videoId]?.selected
      }
    }));
  };

  const handleSelectAll = () => {
    setSelectAll(prev => !prev);
  };

  const handleQualityChange = (videoId, quality) => {
    setSelectedVideos(prevSelection => ({
      ...prevSelection,
      [videoId]: {
        ...prevSelection[videoId],
        quality
      }
    }));
  };

  const handleFormatChange = (videoId, format) => {
    setSelectedVideos(prevSelection => ({
      ...prevSelection,
      [videoId]: {
        ...prevSelection[videoId],
        format
      }
    }));
  };

  const handleDownload = () => {
    setShowPopup(true);
  };

  const startDownload = async () => {
    setShowPopup(false);

    setStatus('Downloading videos...');
    for (const [videoId, { selected, quality, format }] of Object.entries(selectedVideos)) {
      if (selected) {
        try {
          const response = await axios.post(`${BASE_URL}/download`, { videoId, quality, format }, { responseType: 'blob' });

          const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
          const videoTitle = videos.find(video => video.id === videoId)?.title || 'video';
          const fileName = `${videoTitle}_${quality}.${format}`;

          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();

          window.URL.revokeObjectURL(downloadUrl);
          toast.success(`Video ${videoTitle} downloaded successfully!`);
        } catch (error) {
          toast.error(`Failed to download video ${videoId}.`);
        }
      }
    }
    setStatus('All selected videos processed.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-screen-xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-red-600 mb-6">YouTube Downloader</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-lg font-medium text-gray-300 mb-2">Enter YouTube URL:</label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
              placeholder="https://www.youtube.com/watch?v=example"
              required
            />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300">
            Get Videos
          </button>
          <p className="text-center text-gray-400 mt-4">{status}</p>
        </form>

        {videos.length > 0 && (
          <div className="mt-6 space-y-6">
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">For All Videos:</h2>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-lg font-medium text-gray-300 mb-2 flex items-center">
                      Quality:
                      <div className="ml-2">
                        <QualitySelector quality={globalQuality} setQuality={setGlobalQuality} />
                      </div>
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block text-lg font-medium text-gray-300 mb-2 flex items-center">
                      Format:
                      <div className="ml-2">
                        <FormatSwitch format={globalFormat} setFormat={setGlobalFormat} />
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={globalSettings}
                    onChange={() => setGlobalSettings(!globalSettings)}
                    className="w-5 h-5"
                  />
                  <span className="text-gray-300">Apply to all videos</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSelectAll}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
            >
              {selectAll ? 'Deselect All' : 'Select All'}
            </button>

            {videos.map((video) => (
              <VideoItem
                key={video.id}
                video={video}
                isSelected={!!selectedVideos[video.id]?.selected}
                onSelect={() => handleSelectVideo(video.id)}
                quality={selectedVideos[video.id]?.quality || globalQuality}
                setQuality={(quality) => handleQualityChange(video.id, quality)}
                format={selectedVideos[video.id]?.format || globalFormat}
                setFormat={(format) => handleFormatChange(video.id, format)}
              />
            ))}
            {Object.values(selectedVideos).some(selected => selected) && (
              <button
                onClick={handleDownload}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
              >
                Download All Selected Videos
              </button>
            )}
          </div>
        )}
        <ToastContainer />
      </div>

      {showPopup && (
        <InstructionalPopup
          onClose={() => {
            setShowPopup(false);
            startDownload(); // Call startDownload on close
          }}
        />
      )}

      <button
        onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
      >
        <FaArrowDown size={24} />
      </button>
    </div>
  );
}
