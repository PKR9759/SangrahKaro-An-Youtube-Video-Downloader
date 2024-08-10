import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const InstructionalPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <FaInfoCircle size={32} className="text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-4">Important Information</h2>
        <p className="text-gray-300 mb-4">
          Your browser's default download location settings might prompt you each time a download starts.
          To avoid this, please configure your browser to download files automatically to a default location.
        </p>
        <ul className="list-disc list-inside text-left text-gray-300 mb-4">
          <li>Go to <strong>Browser Settings</strong> > <strong>Advanced</strong> > <strong>Downloads</strong> and turn off <strong>'Ask where to save each file before downloading'</strong>.</li>
        </ul>
        <button
          onClick={onClose}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default InstructionalPopup;
