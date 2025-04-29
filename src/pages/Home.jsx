import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { videoAPI } from '../utils/api';
import VideoCard from '../components/VideoCard';
import UploadModal from '../components/UploadModal';
import { FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only fetch videos if user is authenticated
    if (isAuthenticated) {
      fetchVideos();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const fetchVideos = async () => {
    try {
      console.log('Fetching videos with token:', token);
      const data = await videoAPI.getAllVideos(token);
      console.log('Videos received from API:', data);
      setVideos(data);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (updatedVideo) => {
    // Update the videos array with the new comment
    setVideos(videos.map(video => 
      video._id === updatedVideo._id ? updatedVideo : video
    ));
  };
  
  const handleRatingUpdated = (updatedVideo) => {
    // Update the videos array with the new rating
    setVideos(videos.map(video => 
      video._id === updatedVideo._id ? updatedVideo : video
    ));
  };
  
  const handleVideoUploaded = (newVideo) => {
    // Add the new video to the videos array
    setVideos([newVideo, ...videos]);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to VideoGram</h1>
        <p className="text-lg text-center mb-8">Share and discover amazing videos</p>
        <div className="flex space-x-4">
          <Link 
            to="/login" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-8 px-4">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No videos yet</h2>
          <p className="text-gray-600 mb-6">Be the first to upload a video!</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg flex items-center mx-auto"
          >
            <FaPlusCircle className="mr-2" /> Upload Video
          </button>
          
          {/* Upload Modal */}
          <UploadModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onVideoUploaded={handleVideoUploaded}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upload Modal */}
          <UploadModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onVideoUploaded={handleVideoUploaded}
          />
          
          {videos.map((video) => (
            <VideoCard 
              key={video._id} 
              video={video} 
              onCommentAdded={handleCommentAdded}
              onRatingUpdated={handleRatingUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
