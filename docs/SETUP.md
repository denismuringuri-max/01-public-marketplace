# Miraa Marketplace - Setup Guide

This guide will help you set up the Miraa Marketplace application for development and production.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **PostgreSQL** 14 or higher
- **Git**
- **Docker** (optional, for containerized setup)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/denismuringuri-max/01-public-marketplace.git
cd 01-public-marketplace
```

### 2. Set Up the Database

#### Option A: Using PostgreSQL Directly

```bash
# Create database
createdb miraa_db

# Create user (if not exists)
createuser miraa_user -P
# Enter password: miraa_password
```

#### Option B: Using Docker

```bash
docker run --name miraa_postgres \
  -e POSTGRES_USER=miraa_user \
  -e POSTGRES_PASSWORD=miraa_password \
  -e POSTGRES_DB=miraa_db \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 3. Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your configuration (especially JWT_SECRET and Stripe keys)
nano .env

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:5000`

**Available backend scripts:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run prisma:studio` - Open Prisma Studio GUI

### 4. Set Up Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Update .env.local with your configuration
nano .env.local

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

**Available frontend scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs
- **Prisma Studio**: http://localhost:5555 (after running `npm run prisma:studio`)

## Docker Compose Setup

For a faster setup using Docker Compose:

```bash
# Copy environment variables
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Update the .env files with your configuration

# Start all services
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

## Environment Variables Configuration

### Backend (.env)

```env
DATABASE_URL=postgresql://miraa_user:miraa_password@localhost:5432/miraa_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
SENDGRID_API_KEY=SG...
NODE_ENV=development
PORT=5000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Getting Required API Keys

### Stripe (Payment Processing)

1. Create an account at [Stripe](https://stripe.com)
2. Go to Dashboard → API Keys
3. Copy your test keys to the `.env` files

### SendGrid (Email Service)

1. Create an account at [SendGrid](https://sendgrid.com)
2. Create an API key under Settings → API Keys
3. Add to backend `.env`

### AWS S3 (File Storage - Optional)

1. Create an AWS account
2. Create an S3 bucket
3. Generate IAM credentials
4. Add to backend `.env`

## Database Migrations

### Create a New Migration

```bash
cd backend
npm run prisma:migrate -- --name your_migration_name
```

### View Database with Prisma Studio

```bash
cd backend
npm run prisma:studio
```

### Reset Database (Development Only)

```bash
cd backend
npm run prisma:migrate reset
```

## Testing

### Run Backend Tests

```bash
cd backend
npm run test
npm run test:coverage
```

### Run Frontend Tests

```bash
cd frontend
npm run test
npm run test:coverage
```

## Production Deployment

### Build the Application

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Environment Variables for Production

Ensure all production environment variables are set:

- Use strong, randomly generated `JWT_SECRET`
- Use production Stripe keys (not test keys)
- Set `NODE_ENV=production`
- Use production database URL
- Configure CORS properly

### Deploy with Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Deploy to Cloud Services

#### Vercel (Frontend)

```bash
npm install -g vercel
vercel
```

#### Heroku (Backend)

```bash
heroku create miraa-marketplace-api
heroku addons:create heroku-postgresql:standard-0
git push heroku main
```

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U miraa_user -d miraa_db -c "SELECT 1"

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000
kill -9 <PID>

# Or use a different port
PORT=5001 npm run dev
```

### Node Modules Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Prisma Client Issues

```bash
npm run prisma:generate
```

## Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `npm run test`
4. Commit changes: `git commit -am "Add your feature"`
5. Push to branch: `git push origin feature/your-feature`
6. Create a Pull Request

## Performance Optimization

### Frontend
- Enable image optimization
- Use React.memo for expensive components
- Implement code splitting with dynamic imports
- Use SWR or React Query for data fetching

### Backend
- Add database indexing
- Implement caching with Redis
- Use pagination for large datasets
- Optimize database queries

## Security Best Practices

1. Never commit `.env` files
2. Rotate API keys regularly
3. Use HTTPS in production
4. Implement rate limiting
5. Validate all user inputs
6. Use helmet for HTTP headers
7. Implement CORS properly
8. Keep dependencies updated

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review the API documentation
3. Check backend logs: `docker-compose logs backend`
4. Check frontend console: Browser DevTools

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
