# Setup Instructions for nicolaikoldby.dk

This is a modern, mobile-first portfolio and blog website for Nicolai Koldby.

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (mobile-first responsive design)
- **Backend**: Node.js + Express.js
- **CMS**: Strapi (headless CMS)
- **Database**: PostgreSQL
- **Deployment**: Docker-ready

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker & Docker Compose
- Git

### 1. Clone and Navigate

```bash
cd /path/to/nkoldby
```

### 2. Setup Environment

Copy the environment template and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings.

### 3. Start Database

```bash
docker-compose up -d
```

This starts PostgreSQL and Adminer (UI for database at http://localhost:8080).

### 4. Install Dependencies

```bash
# Install backend dependencies
cd backend/server
npm install

# Install Strapi CMS
cd ../strapi
npm install

# Install frontend dependencies (optional, frontend is static)
cd ../../frontend
npm install
```

### 5. Start Development Servers

Open 3 terminal windows and run:

**Terminal 1 - Express Backend:**
```bash
cd backend/server
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Strapi CMS:**
```bash
cd backend/strapi
npm run develop
# Runs on http://localhost:1337
```

**Terminal 3 - Frontend:**
```bash
# Serve frontend (use any static server)
cd frontend
# Option A: Using Python
python -m http.server 8000

# Option B: Using Node http-server
npx http-server public -p 8000

# Option C: Using VS Code Live Server extension
# Just open public/index.html and use Live Server
```

The website will be available at:
- Frontend: http://localhost:8000
- API: http://localhost:3000/api
- CMS Admin: http://localhost:1337/admin

## Project Structure

```
nkoldby/
├── CLAUDE.md              # Architecture documentation
├── SETUP.md              # This file
├── .env.example          # Environment template
├── docker-compose.yml    # Database setup
├── package.json          # Root package config
│
├── backend/
│   ├── server/           # Express API server
│   │   ├── src/
│   │   │   ├── index.js           # Main app file
│   │   │   ├── routes/            # API endpoints
│   │   │   │   ├── auth.js        # Authentication
│   │   │   │   ├── users.js       # User profiles
│   │   │   │   └── uploads.js     # File uploads
│   │   │   └── middleware/        # Auth, validation
│   │   └── package.json
│   │
│   ├── strapi/           # Headless CMS
│   │   ├── config/
│   │   ├── src/
│   │   │   └── api/      # Content types
│   │   └── package.json
│   │
│   └── uploads/          # User uploaded files
│
├── frontend/             # Static HTML/CSS/JS
│   ├── public/
│   │   ├── index.html           # Landing page
│   │   ├── portfolio.html       # Portfolio listing
│   │   ├── blog.html            # Blog listing
│   │   ├── post.html            # Single post
│   │   ├── login.html           # Auth page
│   │   ├── dashboard.html       # User dashboard
│   │   └── create-post.html     # Create post
│   │
│   └── assets/
│       ├── css/
│       │   ├── base.css              # Global styles
│       │   ├── components.css        # Components
│       │   ├── responsive.css        # Mobile-first
│       │   └── animations.css        # Animations
│       │
│       ├── js/
│       │   ├── app.js                # Main logic
│       │   ├── api.js                # API calls
│       │   ├── auth.js               # Auth logic
│       │   └── video-lazy-load.js    # Lazy loading
│       │
│       └── images/
│           ├── hero/
│           ├── icons/
│           └── branding/
```

## Database Setup (Strapi)

Strapi will automatically create tables when you first run it. Just follow the setup wizard at http://localhost:1337/admin.

### Create Content Types in Strapi:

1. **Posts Collection**
   - title (Text)
   - slug (Text, unique)
   - description (Text)
   - content (Rich Text)
   - featured_image (Media)
   - images (Media, multiple)
   - video_url (Text)
   - category (Relation)
   - tags (Relation)
   - author (Relation to Users)
   - featured (Boolean)
   - published (Boolean)

2. **Categories Collection**
   - name (Text)
   - slug (Text, unique)
   - description (Text)

3. **Tags Collection**
   - name (Text)
   - slug (Text, unique)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### User Management
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update profile (requires auth)

### File Uploads
- `POST /api/uploads` - Upload file (requires auth)
- `DELETE /api/uploads/:filename` - Delete file (requires auth)

### Posts (via Strapi CMS)
- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (requires Strapi token)

## Video Lazy Loading

To add a video to the landing page:

1. Upload video to `/frontend/assets/videos/`
2. Update the src in `index.html`:

```html
<video id="heroVideo" class="hero-video" muted autoplay loop playsinline>
  <source src="../assets/videos/hero-video.mp4" type="video/mp4">
</video>
```

The VideoLazyLoader will automatically handle lazy loading using Intersection Observer.

## Styling

The design follows the color scheme from PriceComparison:
- Primary Blue: `#2196F3`
- Secondary Orange: `#f2994b`
- Text: `#333`
- Background: `#f5f5f5`

All CSS uses CSS variables for easy customization. Edit `base.css` to change the theme.

## Mobile-First Responsive Design

Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

The design is optimized for:
- Touch-friendly buttons (48px minimum)
- Fast load times (lazy loading for images/videos)
- Readable typography (16px+ font sizes)
- Clear navigation on small screens

## Deployment

### Docker Build

```bash
# Build backend image
docker build -f backend/Dockerfile -t nicolaikoldby-api .

# Build frontend image
docker build -f frontend/Dockerfile -t nicolaikoldby-web .
```

### Environment for Production

Update `.env` with production values:
```
NODE_ENV=production
JWT_SECRET=your-strong-secret-key
DB_PASSWORD=your-strong-password
```

### SSL/HTTPS

Use a reverse proxy like Nginx to handle SSL certificates (Letsencrypt recommended).

## Troubleshooting

### Database Connection Error
- Ensure Docker is running: `docker ps`
- Check PostgreSQL is up: `docker-compose logs postgres`
- Verify `DB_*` variables in `.env`

### Video Not Loading
- Check file path is correct
- Ensure video format is supported (MP4 recommended)
- Check browser console for errors

### API Calls Failing
- Verify API server is running on http://localhost:3000
- Check CORS settings in `backend/server/src/index.js`
- Verify `API_URL` in frontend code

### Strapi Admin Not Loading
- Clear browser cache
- Restart Strapi: `npm run develop`
- Check database connection

## Development Tips

1. **Frontend Changes**: Hot reload automatically when files change
2. **Backend Changes**: Use nodemon (auto-restarts on file changes)
3. **CMS Content**: Changes appear immediately on frontend
4. **Testing**: Open browser console (F12) to see logs

## Next Steps

1. ✅ Setup complete - start developing!
2. Create content in Strapi CMS
3. Add your brand assets (logo, colors, fonts)
4. Test on mobile devices
5. Deploy to production

## Support

For issues or questions, check:
- CLAUDE.md - Architecture & design decisions
- Console logs - JavaScript errors
- Network tab - API call failures
- Strapi admin panel - Content management

---

**Happy building!** 🚀
