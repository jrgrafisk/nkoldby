// ============================================
// Main Application Logic
// ============================================

class App {
  constructor() {
    this.init();
  }

  async init() {
    // Check API health
    const isHealthy = await checkHealth();
    if (!isHealthy) {
      console.warn('API server not responding');
    }

    // Load auth state
    loadAuthState();

    // Setup mobile menu toggle
    this.setupMobileMenu();

    // Load page-specific content
    this.loadPageContent();
  }

  setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });

      // Close menu when link is clicked
      navMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          navMenu.classList.remove('active');
        }
      });
    }
  }

  async loadPageContent() {
    const page = this.getCurrentPage();

    switch (page) {
      case 'home':
        this.loadHomePage();
        break;
      case 'portfolio':
        this.loadPortfolioPage();
        break;
      case 'blog':
        this.loadBlogPage();
        break;
      case 'post':
        this.loadPostPage();
        break;
      case 'dashboard':
        this.loadDashboardPage();
        break;
    }
  }

  getCurrentPage() {
    const pathname = window.location.pathname;

    if (pathname.includes('portfolio')) return 'portfolio';
    if (pathname.includes('blog')) return 'blog';
    if (pathname.includes('post')) return 'post';
    if (pathname.includes('dashboard')) return 'dashboard';
    return 'home';
  }

  async loadHomePage() {
    // Load featured projects
    this.loadFeaturedProjects();

    // Load latest blog posts
    this.loadLatestPosts();
  }

  async loadFeaturedProjects() {
    const container = document.getElementById('featuredProjects');
    if (!container) return;

    container.innerHTML = '<div class="spinner"></div>';

    try {
      const projects = await posts.getAll({
        'filters[featured][$eq]': true,
        'pagination[limit]': 3,
        'sort': '-createdAt'
      });

      if (projects.length === 0) {
        container.innerHTML = '<p>No featured projects yet.</p>';
        return;
      }

      container.innerHTML = projects
        .map(project => this.renderProjectCard(project))
        .join('');

      // Add entrance animation
      container.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.animation = `slideInBottom 0.6s ease-out ${index * 0.1}s both`;
      });
    } catch (error) {
      console.error('Error loading projects:', error);
      container.innerHTML = '<p>Failed to load projects.</p>';
    }
  }

  async loadLatestPosts() {
    const container = document.getElementById('latestPosts');
    if (!container) return;

    container.innerHTML = '<div class="spinner"></div>';

    try {
      const allPosts = await posts.getAll({
        'pagination[limit]': 6,
        'sort': '-createdAt'
      });

      if (allPosts.length === 0) {
        container.innerHTML = '<p>No posts yet.</p>';
        return;
      }

      container.innerHTML = allPosts
        .map(post => this.renderPostCard(post))
        .join('');

      // Add entrance animation
      container.querySelectorAll('.post-card').forEach((card, index) => {
        card.style.animation = `slideInBottom 0.6s ease-out ${index * 0.1}s both`;
      });
    } catch (error) {
      console.error('Error loading posts:', error);
      container.innerHTML = '<p>Failed to load posts.</p>';
    }
  }

  async loadPortfolioPage() {
    this.loadFeaturedProjects();
  }

  async loadBlogPage() {
    const container = document.getElementById('allPosts');
    if (!container) return;

    container.innerHTML = '<div class="spinner"></div>';

    try {
      const allPosts = await posts.getAll({
        'sort': '-createdAt'
      });

      if (allPosts.length === 0) {
        container.innerHTML = '<p>No posts yet.</p>';
        return;
      }

      container.innerHTML = allPosts
        .map(post => this.renderPostCard(post))
        .join('');
    } catch (error) {
      console.error('Error loading posts:', error);
      container.innerHTML = '<p>Failed to load posts.</p>';
    }
  }

  async loadPostPage() {
    const postId = this.getQueryParam('id');
    if (!postId) {
      window.location.href = '/blog.html';
      return;
    }

    const container = document.getElementById('postContent');
    if (!container) return;

    container.innerHTML = '<div class="spinner"></div>';

    try {
      const post = await posts.getById(postId);

      if (!post) {
        container.innerHTML = '<p>Post not found.</p>';
        return;
      }

      container.innerHTML = `
        <article class="post-detail">
          ${post.attributes.featured_image?.data ? `
            <img src="${getImageUrl(post.attributes.featured_image.data.attributes.url)}"
                 alt="${post.attributes.title}" class="post-featured-image">
          ` : ''}

          <div class="post-meta">
            <span class="post-date">${formatDate(post.attributes.createdAt)}</span>
            ${post.attributes.author?.data ? `
              <span class="post-author">by ${post.attributes.author.data.attributes.name}</span>
            ` : ''}
          </div>

          <h1>${post.attributes.title}</h1>

          <div class="post-body">
            ${post.attributes.content}
          </div>
        </article>
      `;

      // Update page title and meta tags
      document.title = post.attributes.title;
      this.updateMetaTags(post);
    } catch (error) {
      console.error('Error loading post:', error);
      container.innerHTML = '<p>Failed to load post.</p>';
    }
  }

  async loadDashboardPage() {
    if (!requireAuth()) return;

    const user = getCurrentUser();
    const container = document.getElementById('dashboardContent');

    if (!container) return;

    container.innerHTML = `
      <h1>Welcome back, ${user.username}!</h1>
      <p>Manage your posts and profile.</p>
      <a href="/create-post.html" class="btn btn-primary">Create New Post</a>
    `;
  }

  renderProjectCard(project) {
    const imageUrl = project.attributes?.featured_image?.data
      ? getImageUrl(project.attributes.featured_image.data.attributes.url)
      : null;

    return `
      <div class="project-card entrance-item">
        ${imageUrl ? `<img src="${imageUrl}" alt="${project.attributes.title}" class="project-image">` : ''}
        <div class="project-content">
          <h3 class="project-title">${project.attributes.title}</h3>
          <p class="project-description">${project.attributes.description || ''}</p>
          <div class="project-footer">
            <a href="/post.html?id=${project.id}" class="project-link">View Project →</a>
          </div>
        </div>
      </div>
    `;
  }

  renderPostCard(post) {
    const imageUrl = post.attributes?.featured_image?.data
      ? getImageUrl(post.attributes.featured_image.data.attributes.url)
      : null;

    return `
      <div class="post-card entrance-item">
        ${imageUrl ? `<img src="${imageUrl}" alt="${post.attributes.title}" class="post-image">` : ''}
        <div class="post-content">
          <h3 class="post-title">${post.attributes.title}</h3>
          <p class="post-excerpt">${post.attributes.description || ''}</p>
          <div class="post-footer">
            <div class="post-meta">${formatDate(post.attributes.createdAt)}</div>
            <a href="/post.html?id=${post.id}" class="post-link">Read →</a>
          </div>
        </div>
      </div>
    `;
  }

  updateMetaTags(post) {
    // Update OG tags for social sharing
    const description = post.attributes.description || post.attributes.content?.substring(0, 160);
    const imageUrl = post.attributes?.featured_image?.data
      ? getImageUrl(post.attributes.featured_image.data.attributes.url)
      : null;

    this.setMetaTag('og:title', post.attributes.title);
    this.setMetaTag('og:description', description);
    this.setMetaTag('description', description);

    if (imageUrl) {
      this.setMetaTag('og:image', imageUrl);
    }
  }

  setMetaTag(name, content) {
    let tag = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);

    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
      document.head.appendChild(tag);
    }

    tag.content = content;
  }

  getQueryParam(param) {
    const url = new URL(window.location);
    return url.searchParams.get(param);
  }
}

// ============================================
// Initialize app on page load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
