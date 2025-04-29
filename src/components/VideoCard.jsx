import { useState } from 'react';
import { videoAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaRegStar, FaHeart, FaRegComment, FaLock } from 'react-icons/fa';

export default function VideoCard({ video, onCommentAdded, onRatingUpdated }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const { token, permissions, currentUser } = useAuth();

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // Check if user has permission to comment
    if (!permissions.canComment) {
      setError('As a creator, you cannot comment on videos');
      return;
    }
    
    try {
      const result = await videoAPI.addComment(video._id, comment, token);
      setComment('');
      setError('');
      if (onCommentAdded) {
        onCommentAdded(result);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleRating = async (value) => {
    // Check if user has permission to rate
    if (!permissions.canRate) {
      setError('As a creator, you cannot rate videos');
      return;
    }
    
    try {
      const updatedVideo = await videoAPI.rateVideo(video._id, value, token);
      setRating(value);
      setError('');
      
      // Call the callback to refresh videos if provided
      if (onRatingUpdated && typeof onRatingUpdated === 'function') {
        onRatingUpdated(updatedVideo);
      }
    } catch (error) {
      console.error('Error rating video:', error);
      setError('Failed to rate video. Please try again.');
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Calculate average rating
  const avgRating = video.ratings && video.ratings.length > 0 
    ? (video.ratings.reduce((a, b) => a + b, 0) / video.ratings.length).toFixed(1) 
    : 'No ratings';

  return (
    <div className="border rounded-lg overflow-hidden bg-white mt-6 mb-6 shadow-md">
      {/* 1. Video creator info */}
      <div className="flex items-center p-3 border-b">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
          {video.createdBy?.username?.charAt(0) || 'U'}
        </div>
        <div className="ml-3">
          <p className="font-semibold">{video.createdBy?.username || 'Unknown User'}</p>
          {video.location && <p className="text-xs text-gray-500">{video.location}</p>}
        </div>
      </div>
      
      {/* 2. Title and 3. Caption */}
      <div className="p-3 border-b">
        <p className="font-semibold text-lg">{video.title}</p>
        <p className="text-sm mt-1">{video.caption}</p>
        {video.people && video.people.length > 0 && (
          <p className="text-sm text-blue-500 mt-1">
            With: {video.people.join(', ')}
          </p>
        )}
      </div>
      
      {/* 4. Video */}
      <div className="relative bg-black" style={{ maxHeight: '500px', minHeight: '250px' }}>
        <video 
          src={video.videoUrl}
          className="w-full h-auto max-h-[500px] mx-auto object-contain"
          onClick={handleVideoClick}
          playsInline
          loop
          muted
          controls={isPlaying}
          poster={video.thumbnailUrl}
          onLoadedMetadata={(e) => {
            // Store video dimensions when metadata is loaded
            setVideoWidth(e.target.videoWidth);
            setVideoHeight(e.target.videoHeight);
          }}
          ref={(el) => {
            if (el) {
              if (isPlaying) {
                el.play();
              } else {
                el.pause();
              }
            }
          }}
        />
      </div>
      
      {/* 5. Rate/Comment section */}
      <div className="p-3 border-t">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3">
            {error}
          </div>
        )}
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <button className="flex items-center text-gray-700 hover:text-red-500 transition-colors">
              <FaHeart size={20} />
            </button>
            <button className="flex items-center text-gray-700 hover:text-blue-500 transition-colors" onClick={toggleComments}>
              <FaRegComment size={20} />
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-2">Rate:</span>
            <div className="flex">
              {permissions.canRate ? (
                [1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => handleRating(star)}
                    style={{color: 'gold'}}
                    className="text-xl mx-0.5 focus:outline-none group"
                  >
                    {rating >= star ? (
                      <FaStar className="text-yellow-500" /> 
                    ) : (
                      <FaRegStar className="text-gray-400 group-hover:text-yellow-400 transition-colors" />
                    )}
                  </button>
                ))
              ) : (
                <div className="flex items-center text-gray-500">
                  <FaLock size={14} className="mr-1" />
                  <span className="text-xs">&nbsp;Creators cannot rate</span>
                </div>
              )}
            </div>
            <span className="ml-2 text-sm">{avgRating}</span>
          </div>
        </div>
      </div>
      
      {/* Comments section */}
      {showComments && (
        <div className="p-3 border-t">
          <h3 className="font-semibold mb-2">Comments</h3>
          <div className="max-h-40 overflow-y-auto mb-3">
            {video.comments && video.comments.length > 0 ? (
              video.comments.map((comment, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold mr-2">{comment.userId?.username || 'User'}</span>
                  <span>{comment.comment}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet</p>
            )}
          </div>
          
          {/* Add comment form - only show if user has permission */}
          {permissions.canComment ? (
            <form onSubmit={handleCommentSubmit} className="flex">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                style={{border: '1px solid #e5e7eb'}}
                className="flex-grow bg-gray-100 text-gray-500 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
              >
                Post
              </button>
            </form>
          ) : (
            <div className="bg-gray-100 p-3 rounded text-center text-gray-500 flex items-center justify-center">
              <FaLock size={14} className="mr-2" />
              <span>&nbsp;Creators cannot comment on videos</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
