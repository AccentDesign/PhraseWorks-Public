import React, { useContext, useRef, useState } from 'react';
import { APIUploadFile } from '@/API/APIMedia';
import { APIConnectorContext } from '@/Contexts/APIConnectorContext';
import { notify } from '@/Utils/Notification';
import { APILogError } from '../../../../API/APISystem';

const MediaAdd = ({ reloadMedia, setReloadMedia }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const fileInputRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  const SendData = async () => {
    const inputFiles = fileInputRef.current.files;
    if (!inputFiles.length) return;
    const file = fileInputRef.current.files[0];
    if (!file) {
      notify('Please select a file.', 'error');
      return;
    }

    try {
      const result = await APIUploadFile(loginPassword, file);
      if (result.status === 200 && result.data.uploadFile) {
        notify('File uploaded', 'success');
        setReloadMedia(true);
        setFile(null);
        fileInputRef.current.value = '';
      }
    } catch (err) {
      await APILogError(err.stack || String(err));
      console.error('Upload or fetch failed:', err);
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      // Manually assign the files to input element
      fileInputRef.current.files = files;
      handleChange({ target: { files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  return (
    <div
      className={`flex flex-row items-center p-4 mt-8 border-4 border-dashed rounded-md min-h-40 ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input type="file" multiple ref={fileInputRef} onChange={handleChange} />
      <button
        className="ml-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 focus:outline-none"
        type="submit"
        onClick={async () => {
          await SendData();
        }}
      >
        Upload
      </button>
    </div>
  );
};

export default MediaAdd;
