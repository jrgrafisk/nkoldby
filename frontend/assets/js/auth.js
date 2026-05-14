// ============================================
// Authentication State Management
// ============================================

let currentUser = null;

// Load user from localStorage on page load
function loadAuthState() {
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('authToken');

  if (storedUser && token) {
    try {
      currentUser = JSON.parse(storedUser);
      updateNavBar();
    } catch (e) {
      console.error('Failed to load auth state:', e);
      logout();
    }
  }
}

// Update navbar based on auth state
function updateNavBar() {
  const navAuth = document.getElementById('navAuth');
  const navUser = document.getElementById('navUser');

  if (currentUser && navAuth && navUser) {
    navAuth.style.display = 'none';
    navUser.style.display = 'flex';
  } else if (navAuth && navUser) {
    navAuth.style.display = 'flex';
    navUser.style.display = 'none';
  }
}

// ============================================
// Login / Register Functions
// ============================================

async function handleLogin(email, password) {
  try {
    const response = await auth.login(email, password);

    // Store token and user data
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    currentUser = response.user;

    updateNavBar();
    return { success: true, message: 'Login successful' };
  } catch (error) {
    return { success: false, message: error.message || 'Login failed' };
  }
}

async function handleRegister(username, email, password) {
  try {
    const response = await auth.register(username, email, password);

    // Store token and user data
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    currentUser = response.user;

    updateNavBar();
    return { success: true, message: 'Registration successful' };
  } catch (error) {
    return { success: false, message: error.message || 'Registration failed' };
  }
}

function logout() {
  auth.logout();
  currentUser = null;
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  updateNavBar();
  window.location.href = '/index.html';
}

// Check if user is authenticated
function isAuthenticated() {
  return !!currentUser && !!localStorage.getItem('authToken');
}

// Get current user
function getCurrentUser() {
  return currentUser;
}

// Require authentication for a page
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

// ============================================
// Form Handling
// ============================================

function setupAuthForm(formId, onSubmit) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Loading...';

    try {
      const result = await onSubmit(data);

      if (result.success) {
        showAlert('success', result.message);
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1000);
      } else {
        showAlert('error', result.message);
      }
    } catch (error) {
      showAlert('error', 'An unexpected error occurred');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

// ============================================
// UI Helpers
// ============================================

function showAlert(type, message) {
  const alertContainer = document.getElementById('alertContainer');
  if (!alertContainer) return;

  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  alertContainer.appendChild(alert);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// ============================================
// Initialize on page load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadAuthState();
});
