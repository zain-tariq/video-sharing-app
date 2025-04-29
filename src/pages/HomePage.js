import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await axios.get('http://localhost:5000/api/videos'); // Adjust to your API endpoint
      setVideos(response.data);
    };
    fetchVideos();
  }, []);

  return (
    <div>
      <h1>All Videos</h1>
      <div>
        {videos.map((video) => (
          <div key={video._id}>
            <h2>{video.title}</h2>
            <Link to={`/video/${video._id}`}>View Video</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
