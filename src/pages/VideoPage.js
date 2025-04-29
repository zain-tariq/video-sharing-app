import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoPage = ({ match }) => {
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      //const response = await axios.get(`http://localhost:5000/api/videos/${match.params.videoId}`);
      const response = await axios.get(`/api/videos/${match.params.videoId}`);
      setVideo(response.data);
    };
    fetchVideo();
  }, [match.params.videoId]);

  const handleCommentSubmit = async () => {
    //const response = await axios.post(`http://localhost:5000/api/videos/${match.params.videoId}/comment`, { comment });
    const response = await axios.post(`/api/videos/${match.params.videoId}/comment`, { comment });

    setVideo(response.data); // Re-fetch the video data to include the new comment
  };

  if (!video) return <p>Loading...</p>;

  return (
    <div>
      <h1>{video.title}</h1>
      <video src={video.videoUrl} controls />
      <div>
        <h3>Comments</h3>
        {video.comments.map((comment, index) => (
          <p key={index}>{comment.comment}</p>
        ))}
      </div>
      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleCommentSubmit}>Submit Comment</button>
      </div>
    </div>
  );
};

export default VideoPage;
