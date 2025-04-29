import React, { useState } from 'react';
import axios from 'axios';

const AddVideoPage = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [people, setPeople] = useState('');

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('title', title);
    formData.append('caption', caption);
    formData.append('location', location);
    formData.append('people', people);

    // await axios.post('http://localhost:5000/api/videos', formData, {
      await axios.post('/api/videos', formData, {  
    headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Redirect to home page or another page after successful upload
    window.location.href = '/';
  };

  return (
    <div>
      <h1>Add Video</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="video/*"
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="People"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
        />
        <button type="submit">Upload Video</button>
      </form>
    </div>
  );
};

export default AddVideoPage;
