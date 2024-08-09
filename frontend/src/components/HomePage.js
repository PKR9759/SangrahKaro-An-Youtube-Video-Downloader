import React, { useState } from 'react';
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
    setSelectedVideos(prevVideos => ({
      ...prevVideos,
      [videoId]: { quality: globalQuality, format: globalFormat }
    }));
  };

  const handleDownload = async () => {
    setStatus('Downloading videos...');
    for (const [videoId, options] of Object.entries(selectedVideos)) {
      try {
        const response = await axios.post(`${BASE_URL}/download`, { videoId, ...options }, { responseType: 'blob' });
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${videoId}.mp4`);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
      <div className="max-w-3xl w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-6">YouTube Downloader</h1>
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
          <div className="mt-4 space-y-4">
            {videos.map((video) => (
              <VideoItem
                key={video.id}
                video={video}
                globalQuality={globalQuality}
                setGlobalQuality={setGlobalQuality}
                globalFormat={globalFormat}
                setGlobalFormat={setGlobalFormat}
                onSelect={() => handleSelectVideo(video.id)}
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
