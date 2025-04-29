import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { videoAPI } from '../utils/api';
import { FaTimes } from 'react-icons/fa';

export default function UploadModal({ isOpen, onClose, onVideoUploaded }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    location: '',
    people: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setError('');
    } else {
      setVideoFile(null);
      setError('Please select a valid video file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      setError('Please select a video to upload');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create FormData object for file upload
      const uploadData = new FormData();
      uploadData.append('video', videoFile);
      uploadData.append('title', formData.title);
      uploadData.append('caption', formData.caption);
      uploadData.append('location', formData.location);
      
      // Convert people string to array if not empty
      if (formData.people.trim()) {
        const peopleArray = formData.people.split(',').map(person => person.trim());
        peopleArray.forEach(person => {
          uploadData.append('people', person);
        });
      }
      
      console.log('Uploading video with data:', {
        title: formData.title,
        caption: formData.caption,
        location: formData.location,
        people: formData.people,
        videoFile: videoFile.name
      });
      
      const response = await videoAPI.uploadVideo(uploadData, token);
      console.log('Upload response:', response);
      
      // Reset form on success
      setFormData({
        title: '',
        caption: '',
        location: '',
        people: ''
      });
      setVideoFile(null);
      setSuccess(true);
      
      // Call the callback to refresh videos if provided
      if (onVideoUploaded && typeof onVideoUploaded === 'function') {
        onVideoUploaded(response);
      }
      
      // Close modal
      onClose();
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pt-6 p-4 backdrop-blur-sm" style={{zIndex: 100, background: '#777'}}>
      <div className="bg-white rounded-lg shadow-xl overflow-auto w-full max-w-2xl max-h-[85vh] relative">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-bold text-gray-800">Upload New Video</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">Video uploaded successfully!</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="video" style={{textAlign: 'left'}}>
                Video File
              </label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 py-1 px-0"
              />
              {videoFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {videoFile.name}
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="title" style={{textAlign: 'left'}}>
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="appearance-none  bg-gray-100 text-gray-500 rounded w-full py-2 px-3 leading-tight focus:outline-none"
                placeholder="Enter video title"
                style={{border: '1px solid #e5e7eb'}}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="caption" style={{textAlign: 'left'}}>
                Caption
              </label>
              <textarea
                id="caption"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                className="appearance-none  bg-gray-100 text-gray-500 rounded w-full py-2 px-3 leading-tight focus:outline-none"
                placeholder="Write a caption for your video"
                style={{border: '1px solid #e5e7eb'}}
                rows="3"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="location" style={{textAlign: 'left'}}>
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="appearance-none  bg-gray-100 text-gray-500 rounded w-full py-2 px-3 leading-tight focus:outline-none"
                placeholder="Add location (optional)"
                style={{border: '1px solid #e5e7eb'}}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="people" style={{textAlign: 'left'}}>
                People
              </label>
              <input
                type="text"
                id="people"
                name="people"
                value={formData.people}
                onChange={handleChange}
                className="appearance-none  bg-gray-100 text-gray-500 rounded w-full py-2 px-3 leading-tight focus:outline-none"
                placeholder="Tag people (comma separated, optional)"
                style={{ border: '1px solid #e5e7eb' }}
              />
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded focus:outline-none disabled:opacity-70"
              >
                {loading ? 'Uploading...' : 'Upload Video'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-block font-medium text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
