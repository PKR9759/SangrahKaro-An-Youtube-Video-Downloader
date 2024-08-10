import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../config';
import VideoItem from './VideoItem';
import { FaArrowDown } from 'react-icons/fa'; // Add this line if using react-icons

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState({});

  useEffect(() => {
    const updatedSelection = videos.reduce((acc, video) => {
      acc[video.id] = selectAll;
      return acc;
    }, {});
    setSelectedVideos(updatedSelection);
  }, [selectAll, videos]);

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
        selected: !prevSelection[videoId]?.selected,
        quality: prevSelection[videoId]?.quality || '360p', // Default quality
        format: prevSelection[videoId]?.format || 'mp4' // Default format
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
  const handleDownload = async () => {
    setStatus('Downloading videos...');
    for (const [videoId, { selected, quality, format }] of Object.entries(selectedVideos)) {
        if (selected) {
            try {
                const response = await axios.post(`${BASE_URL}/download`, { videoId, quality, format }, { responseType: 'blob' });
                
                // Create a URL object from the response Blob
                const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
                
                // Get video title from the response or any other source
                const videoTitle = videos.find(video => video.id === videoId)?.title || 'video';
                
                // Generate a file name using the video title
                const fileName = `${videoTitle}_${quality}.${format}`;
                
                // Create an <a> element and trigger the download
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', fileName); // Set the desired filename here
                document.body.appendChild(link);
                link.click();
                link.remove();
                
                // Clean up
                window.URL.revokeObjectURL(downloadUrl);

                toast.success(`Video ${videoTitle} downloaded successfully!`);
            } catch (error) {
                toast.error(`Failed to download video ${videoId}.`);
            }
        }
    }
    setStatus('All selected videos processed.');
};


  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
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
                quality={selectedVideos[video.id]?.quality}
                setQuality={(quality) => handleQualityChange(video.id, quality)}
                format={selectedVideos[video.id]?.format}
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

      {/* Go to Bottom Button */}
      <button
        onClick={scrollToBottom}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
      >
        <FaArrowDown size={24} />
      </button>
    </div>
  );
}
