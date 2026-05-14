# nicolaikoldby.dk - Complete Website Redesign

## Project Overview

A modern portfolio/blog website for Nicolai Koldby with user authentication, content management, and media handling. Built with a headless CMS approach for maximum flexibility.

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Server**: Express.js (simple, lightweight)
- **CMS**: Strapi (headless, great for media)
- **Authentication**: JWT + session management
- **Database**: PostgreSQL
- **File Storage**: Local uploads (can integrate S3/CDN later)

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Vanilla CSS (no frameworks, inspired by PriceComparison)
- **JavaScript**: Vanilla JS (no React/Vue for simplicity)
- **Design System**: Mobile-first, responsive grid

### Hosting & Deployment
- Self-hosted or cloud (Vercel, Railway, or custom VPS)
- Docker support for easy deployment

## Project Structure

```
nkoldby/
├── backend/
│   ├── strapi/              # CMS instance (Strapi)
│   │   ├── config/
│   │   ├── src/
│   │   │   ├── api/         # Content types & API endpoints
│   │   │   ├── plugins/
│   │   │   └── admin/
│   │   └── package.json
│   │
│   ├── server/              # Express server (auth, uploads, etc)
│   │   ├── src/
│   │   │   ├── routes/      # API routes
│   │   │   ├── controllers/ # Route handlers
│   │   │   ├── middleware/  # Auth, validation
│   │   │   ├── models/      # DB schemas
│   │   │   └── config/      # Database config
│   │   └── package.json
│   │
│   └── uploads/             # User uploaded files

├── frontend/
│   ├── public/
│   │   ├── index.html       # Landing page
│   │   ├── portfolio.html   # Portfolio listing
│   │   ├── blog.html        # Blog listing
│   │   ├── post.html        # Single post template
│   │   ├── login.html       # Login/register
│   │   ├── dashboard.html   # User dashboard
│   │   └── create-post.html # Create new post
│   │
│   ├── assets/
│   │   ├── css/
│   │   │   ├── base.css     # Global styles
│   │   │   ├── components.css
│   │   │   ├── responsive.css
│   │   │   └── animations.css
│   │   ├── js/
│   │   │   ├── app.js       # Main app script
│   │   │   ├── auth.js      # Auth logic
│   │   │   ├── api.js       # API calls
│   │   │   ├── video-lazy-load.js
│   │   │   └── form-handler.js
│   │   └── images/
│   │       ├── hero/        # Hero section images
│   │       ├── icons/       # UI icons
│   │       └── branding/    # Logo, favicons
│   │
│   └── package.json         # Frontend dependencies

├── docker-compose.yml       # Local development setup
├── .env.example             # Environment variables template
├── README.md                # Setup instructions
└── CLAUDE.md               # This file
```

## Key Features

### MVP (Phase 1)
1. **Landing Page**
   - Hero section with lazy-loaded video
   - Brief intro/bio
   - Featured posts/projects
   - Call-to-action buttons

2. **Portfolio/Blog System**
   - Post creation (title, description, images, content)
   - Post listings (grid or list view)
   - Single post view with full content
   - Categorization/tagging

3. **User Management**
   - User registration & login (JWT)
   - User dashboard with created posts
   - Profile management
   - Secure password hashing

4. **Media Handling**
   - Photo upload with validation
   - Video embedding with lazy loading
   - Image optimization placeholders

5. **Responsive Design**
   - Mobile-first CSS approach
   - Tablet & desktop layouts
   - Touch-friendly UI

6. **SEO**
   - Meta tags (title, description, OG tags)
   - Sitemap.xml
   - Schema markup (JSON-LD)
   - Clean URLs

### Phase 2 (Future)
- Comments system
- Search functionality
- Admin dashboard
- Email notifications
- Social sharing
- Analytics

## Design Principles (from PriceComparison)

### Color Palette
- **Primary Accent**: #2196F3 (Material blue) - CTAs, links
- **Secondary Accent**: #f2994b (Warm orange) - Highlights, active states
- **Neutrals**: #333 (text), #666-#999 (secondary), #f5f5f5 (backgrounds)
- **Accent**: #e74c3c (red) - Important/featured content

### Typography
- Font Family: Arial, system fonts, sans-serif (simple & web-safe)
- **H1**: 28px, bold (700)
- **H2**: 24px, semi-bold (600)
- **H3**: 20px, semi-bold (600)
- **Body**: 14-16px, regular (400)
- **Small**: 12px, regular (400)
- Line height: 1.6 for body text

### Layout & Spacing
- 8px spacing grid (multiples of 8)
- Max content width: 1200px
- Card-based design with 8px border-radius
- Subtle box shadows for depth
- Flexbox for responsive alignment

### Interactive Elements
- Hover effects (color transitions)
- Smooth transitions (0.3s)
- Clear focus states (accessibility)
- Touch targets: 48px minimum (mobile)

## Database Schema

### Users (Express)
```sql
- id (UUID, primary key)
- username (string, unique)
- email (string, unique)
- password_hash (string)
- bio (text)
- avatar_url (string)
- created_at (timestamp)
- updated_at (timestamp)
```

### Posts (Strapi)
```
- id (UUID)
- title (string)
- slug (string, unique)
- description (string)
- content (rich text)
- featured_image (image)
- images (multiple images)
- video_url (string, optional)
- category (relation)
- tags (relation)
- author (relation to User)
- published (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### Categories (Strapi)
```
- id (UUID)
- name (string)
- slug (string)
- description (text)
```

### Tags (Strapi)
```
- id (UUID)
- name (string)
- slug (string)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh JWT

### Posts (via Strapi)
- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (auth required)
- `PATCH /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)

### Users
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update profile (auth required)
- `POST /api/users/:id/avatar` - Upload avatar (auth required)

### Uploads
- `POST /api/uploads` - Upload file (auth required)
- `DELETE /api/uploads/:id` - Delete file (auth required)

## Security Considerations

1. **Password Security**
   - bcrypt hashing with salt rounds
   - Minimum 8 characters

2. **API Security**
   - JWT tokens (short-lived access, refresh tokens)
   - CORS configuration
   - Rate limiting on auth endpoints
   - Input validation & sanitization
   - XSS prevention (output escaping)
   - CSRF tokens for forms

3. **File Upload Security**
   - File type validation
   - File size limits
   - Virus scanning (optional)
   - Secure file naming

4. **Database Security**
   - SQL injection prevention (parameterized queries)
   - Environment variables for secrets
   - Database encryption at rest

## Development Workflow

### Local Setup
1. Clone repository
2. Copy `.env.example` to `.env` and configure
3. Run `docker-compose up` (starts PostgreSQL)
4. Install dependencies: `npm install` (both backend & frontend)
5. Initialize Strapi: `cd backend/strapi && npm run develop`
6. Start Express server: `cd backend/server && npm run dev`
7. Frontend is served directly from `frontend/` folder

### Deployment
1. Build Strapi & Express for production
2. Configure environment variables
3. Run database migrations
4. Deploy to hosting provider
5. Set up SSL/HTTPS
6. Configure CDN for static assets

## Next Steps

1. Set up project directory structure
2. Initialize Node.js packages & dependencies
3. Create Strapi instance with content types
4. Build Express backend with auth
5. Design landing page & responsive layouts
6. Connect frontend to APIs
7. Test & optimize
8. Deploy

---

**Status**: Initial architecture documented
**Last Updated**: 2026-05-14
