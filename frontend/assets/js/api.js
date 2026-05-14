// API Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const CMS_URL = process.env.CMS_URL || 'http://localhost:1337';

// API Error Handler
class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Generic API Request
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(data.error || 'Request failed', response.status);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============================================
// Authentication APIs
// ============================================
const auth = {
  async register(username, email, password) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
  },

  async login(email, password) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async getCurrentUser() {
    return apiRequest('/auth/me');
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// ============================================
// Posts APIs (from Strapi CMS)
// ============================================
const posts = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${CMS_URL}/api/posts?${queryString}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  async getById(id) {
    const url = `${CMS_URL}/api/posts/${id}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch post');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  async create(postData) {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  async update(id, postData) {
    return apiRequest(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(postData)
    });
  },

  async delete(id) {
    return apiRequest(`/posts/${id}`, {
      method: 'DELETE'
    });
  }
};

// ============================================
// Upload APIs
// ============================================
const uploads = {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/uploads`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) {
        throw new APIError('Upload failed', response.status);
      }

      return response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  async deleteFile(filename) {
    return apiRequest(`/uploads/${filename}`, {
      method: 'DELETE'
    });
  }
};

// ============================================
// Health Check
// ============================================
async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// ============================================
// Utility: Format Image URL
// ============================================
function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${CMS_URL}${path}`;
}

// ============================================
// Utility: Format Date
// ============================================
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
