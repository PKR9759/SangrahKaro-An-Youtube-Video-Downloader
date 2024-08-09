import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../config';

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

  const handleDownload=async () => {
    setStatus("Downloading videos...");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">YouTube Downloader</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-lg font-medium text-gray-700 mb-2">Enter YouTube URL:</label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              placeholder="https://www.youtube.com/watch?v=example"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
            Get Videos
          </button>
          <p className="text-center text-gray-600 mt-4">{status}</p>
        </form>
        {videos.length > 0 && (
          <div className="mt-4">
            {videos.map((video) => (
              <div key={video.id} className="border p-4 mb-2">
                <h2 className="text-xl font-semibold">{video.title}</h2>
                <div className="flex flex-col">
                  <select
                    value={globalQuality}
                    onChange={(e) => setGlobalQuality(e.target.value)}
                    className="border p-2 mb-2"
                  >
                    <option value="144p">144p</option>
                    <option value="360p">360p</option>
                    <option value="720p">720p</option>
                  </select>
                  <select
                    value={globalFormat}
                    onChange={(e) => setGlobalFormat(e.target.value)}
                    className="border p-2 mb-2"
                  >
                    <option value="video">Video</option>
                    <option value="mp3">MP3</option>
                  </select>
                  <button
                    onClick={() => handleSelectVideo(video.id)}
                    className="bg-blue-500 text-white p-2 rounded mb-2"
                  >
                    Select for Download
                  </button>
                </div>
              </div>
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


