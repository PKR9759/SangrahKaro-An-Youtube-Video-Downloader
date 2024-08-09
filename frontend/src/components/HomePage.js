import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../config';
import QualitySelector from './QualitySelector';
import FormatSwitch from './FormatSwitch';
import VideoItem from './VideoItem';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [videos, setVideos] = useState([]);
  const [globalQuality, setGlobalQuality] = useState('360p');
  const [globalFormat, setGlobalFormat] = useState('video');
  const [selectedVideos, setSelectedVideos] = useState({});
  const [applyGlobalSettings, setApplyGlobalSettings] = useState(true);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (applyGlobalSettings) {
      setSelectedVideos(videos.reduce((acc, video) => {
        acc[video.id] = { quality: globalQuality, format: globalFormat };
        return acc;
      }, {}));
    }
  }, [applyGlobalSettings, globalQuality, globalFormat, videos]);

  useEffect(() => {
    if (selectAll) {
      setSelectedVideos(videos.reduce((acc, video) => {
        acc[video.id] = { quality: globalQuality, format: globalFormat };
        return acc;
      }, {}));
    } else {
      setSelectedVideos({});
    }
  }, [selectAll, videos, globalQuality, globalFormat]);

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

  const handleSelectVideo = (videoId, quality, format) => {
    setSelectedVideos(prevVideos => {
      const newSelection = { ...prevVideos };
      if (newSelection[videoId]) {
        delete newSelection[videoId];
      } else {
        newSelection[videoId] = { quality, format };
      }
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    setSelectAll(prev => !prev);
  };

  const handleDownload = async () => {
    setStatus('Downloading videos...');
    for (const [videoId, options] of Object.entries(selectedVideos)) {
      try {
        const response = await axios.post(`${BASE_URL}/download`, { videoId, ...options }, { responseType: 'blob' });
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${videoId}.${options.format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(`Video ${videoId} downloaded successfully!`);
      } catch (error) {
        toast.error(`Failed to download video ${videoId}.`);
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
            <div className="p-6 bg-gray-700 border border-gray-600 rounded-lg shadow-lg mb-6">
              <h2 className="text-xl font-bold text-red-400 mb-4">Global Settings</h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg">Apply Global Settings:</span>
                <button
                  onClick={() => setApplyGlobalSettings(!applyGlobalSettings)}
                  className={`p-2 rounded-lg text-white ${applyGlobalSettings ? 'bg-red-600' : 'bg-gray-600'}`}
                >
                  {applyGlobalSettings ? 'Disable' : 'Enable'}
                </button>
              </div>
              {applyGlobalSettings && (
                <div className="flex space-x-4 mb-4">
                  <QualitySelector
                    quality={globalQuality}
                    setQuality={setGlobalQuality}
                  />
                  <FormatSwitch
                    format={globalFormat}
                    setFormat={setGlobalFormat}
                  />
                </div>
              )}
              <button
                onClick={handleSelectAll}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
              >
                {selectAll ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {videos.map((video) => (
              <VideoItem
                key={video.id}
                video={video}
                globalQuality={globalQuality}
                globalFormat={globalFormat}
                selectedSettings={selectedVideos[video.id]}
                applyGlobalSettings={applyGlobalSettings}
                onSelect={(quality, format) => handleSelectVideo(video.id, quality, format)}
              />
            ))}

            {Object.keys(selectedVideos).length > 0 && (
              <button
                onClick={handleDownload}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
              >
                Download Selected Videos
              </button>
            )}
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
