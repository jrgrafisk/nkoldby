// ============================================
// Video Lazy Loading
// ============================================

class VideoLazyLoader {
  constructor() {
    this.videos = [];
    this.observer = null;
    this.init();
  }

  init() {
    // Find all videos with data-src attribute
    this.videos = Array.from(document.querySelectorAll('video[data-src], source[data-src]'));

    if (this.videos.length === 0) return;

    // Use Intersection Observer for lazy loading
    this.createObserver();

    // Also handle videos that load immediately
    this.videos.forEach(video => {
      this.observer.observe(video);
    });
  }

  createObserver() {
    const options = {
      root: null,
      rootMargin: '50px', // Start loading 50px before video enters viewport
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadVideo(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  loadVideo(element) {
    if (element.tagName === 'SOURCE') {
      // Load source element
      const src = element.getAttribute('data-src');
      if (src && !element.getAttribute('src')) {
        element.setAttribute('src', src);
        element.removeAttribute('data-src');

        // Reload video
        const video = element.closest('video');
        if (video) {
          video.load();
        }
      }
    } else if (element.tagName === 'VIDEO') {
      // Load video element directly
      const src = element.getAttribute('data-src');
      if (src) {
        element.setAttribute('src', src);
        element.removeAttribute('data-src');
        element.load();
      }
    }

    // Remove placeholder when loaded
    const placeholder = element.nextElementSibling;
    if (placeholder && placeholder.classList.contains('video-placeholder')) {
      placeholder.style.display = 'none';
    }
  }

  // Manual loading if needed
  static load(element) {
    const loader = new VideoLazyLoader();
    loader.loadVideo(element);
  }
}

// ============================================
// Image Lazy Loading with Blurred Placeholder
// ============================================

class ImageLazyLoader {
  constructor() {
    this.init();
  }

  init() {
    // Find all images with data-src
    const images = document.querySelectorAll('img[data-src]');

    if (images.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0
    });

    images.forEach(img => observer.observe(img));
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    // Create a new image to preload
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = src;
      img.classList.add('fade-in');
      img.removeAttribute('data-src');
    };

    tempImg.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      img.classList.add('image-error');
    };

    tempImg.src = src;
  }
}

// ============================================
// Initialize on page load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  new VideoLazyLoader();
  new ImageLazyLoader();
});

// ============================================
// Export for use in modules
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VideoLazyLoader, ImageLazyLoader };
}
