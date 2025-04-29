// API service for interacting with the backend
// Using relative URL to work with the Vite proxy
const API_URL = '/api';

//const API_URL = 'http://localhost:5000/api';

console.log('API URL configured as:', API_URL);

// Helper function to handle API requests
async function apiRequest(url, method = 'GET', data = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log(`Adding token to request: Bearer ${token.substring(0, 15)}...`);
  }

  const config = {
    method,
    headers,
    credentials: 'include', // Include cookies if your server uses sessions
    mode: 'cors', // Explicitly set CORS mode
  };

  if (data) {
    config.body = JSON.stringify(data);
  }
  
  // Log the request for debugging
  console.log(`API Request to ${url}:`, { method, headers, data });

  try {
    const response = await fetch(`${API_URL}${url}`, config);
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      } catch (jsonError) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
    }
    
    // For successful responses, try to parse JSON
    try {
      const responseData = await response.json();
      return responseData;
    } catch (jsonError) {
      console.error('JSON Parse Error:', jsonError);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
};

// Video API
export const videoAPI = {
  getAllVideos: (token) => {
    console.log('Getting all videos with token:', token ? 'Token provided' : 'No token');
    return apiRequest('/videos', 'GET', null, token);
  },
  getVideo: (videoId, token) => apiRequest(`/videos/${videoId}`, 'GET', null, token),
  uploadVideo: (formData, token) => {
    console.log('Uploading video with token:', token ? 'Token provided' : 'No token');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
    };
    
    console.log('Upload URL:', `${API_URL}/videos/upload`);
    
    return fetch(`${API_URL}/videos/upload`, {
      method: 'POST',
      headers,
      body: formData, // Don't stringify FormData
    }).then(response => {
      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        return response.json().then(err => {
          console.error('Upload error response:', err);
          throw new Error(err.error || 'Failed to upload video');
        });
      }
      return response.json();
    });
  },
  addComment: (videoId, comment, token) => 
    apiRequest(`/videos/${videoId}/comments`, 'POST', { comment }, token),
  rateVideo: (videoId, rating, token) => 
    apiRequest(`/videos/${videoId}/rate`, 'POST', { rating }, token),
};

// Comment API
export const commentAPI = {
  getVideoComments: (videoId, token) => 
    apiRequest(`/videos/${videoId}/comments`, 'GET', null, token),
  deleteComment: (videoId, commentId, token) => 
    apiRequest(`/videos/${videoId}/comments/${commentId}`, 'DELETE', null, token),
  likeComment: (videoId, commentId, token) => 
    apiRequest(`/videos/${videoId}/comments/${commentId}/like`, 'POST', null, token),
};
