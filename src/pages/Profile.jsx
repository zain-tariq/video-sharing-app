import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { videoAPI } from '../utils/api';
import VideoCard from '../components/VideoCard';

export default function Profile() {
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, currentUser } = useAuth();

  useEffect(() => {
    fetchUserVideos();
  }, [token]);

  const fetchUserVideos = async () => {
    try {
      // Get all videos and filter by current user
      const allVideos = await videoAPI.getAllVideos(token);
      // This assumes the backend returns the creator details with each video
      const filteredVideos = allVideos.filter(video => 
        video.createdBy && video.createdBy._id === currentUser?.id
      );
      setUserVideos(filteredVideos);
    } catch (err) {
      console.error('Error fetching user videos:', err);
      setError('Failed to load your videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (updatedVideo) => {
    setUserVideos(userVideos.map(video => 
      video._id === updatedVideo._id ? updatedVideo : video
    ));
  };

  return (
    <div className="max-w-md mx-auto pt-16 pb-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold">
            {currentUser?.username?.charAt(0) || 'U'}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{currentUser?.username || 'User'}</h2>
            <p className="text-gray-600">{currentUser?.email}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-2">Your Videos</h3>
          <p className="text-gray-600">{userVideos.length} videos uploaded</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : userVideos.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No videos yet</h2>
          <p className="text-gray-600 mb-6">Upload your first video!</p>
          <Link 
            to="/upload" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Upload Video
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userVideos.map((video) => (
            <VideoCard 
              key={video._id} 
              video={video} 
              onCommentAdded={handleCommentAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
