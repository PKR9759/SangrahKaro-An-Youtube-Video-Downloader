import React, { useState } from 'react';
import axios from 'axios';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReatToastify.css';
import { BASE_URL } from '../config';

function HomePage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    setStatus(`Processing URL: ${url}`);

    try{
      const response=await axios.post(`${BASE_URL}/download`,{url});
      setStatus(`Download link: ${response.data.downloadUrl}`);
      toast.success('Video link retrieved successfully!');
    }
    catch (error) {
      setStatus('Failed to retrieve video information.');
      toast.error('Failed to retrieve video information. Please check the URL and try again.');
    }
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">YouTube Video Downloader</h1>
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
            Submit
          </button>
          <p className="text-center text-gray-600 mt-4">{status}</p>
        </form>
      </div>
    </div>
  );
}

export default HomePage;
