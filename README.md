# Miraa Marketplace

A comprehensive full-stack marketplace application built with modern web technologies. Miraa enables users to buy and sell products with features including authentication, product listings, shopping cart, payments, order management, seller dashboards, and more.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with role-based access (Buyer, Seller, Admin)
- **Product Catalog**: Browse, search, and filter products with advanced filtering
- **Shopping Cart**: Add/remove products, manage quantities, real-time updates
- **Checkout & Payments**: Integrated Stripe payment processing
- **Order Management**: Track orders, view order history, manage shipments
- **Seller Dashboard**: Manage products, inventory, sales, and analytics
- **Reviews & Ratings**: Customer reviews with ratings and photos
- **Inventory Management**: Real-time stock tracking and management
- **Admin Panel**: Monitor users, products, transactions, and platform analytics
- **Notifications**: Email and in-app notifications for orders and updates

## 📋 Tech Stack

### Frontend
- **Framework**: Next.js 14+ with React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit / Zustand
- **API Client**: Axios / SWR
- **UI Components**: Headless UI / Shadcn/ui
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

### DevOps & Tools
- **Version Control**: Git / GitHub
- **Package Manager**: npm / yarn
- **Environment Variables**: dotenv
- **Email Service**: Nodemailer / SendGrid
- **Payment**: Stripe API
- **File Storage**: AWS S3 / Cloudinary
- **CI/CD**: GitHub Actions (ready to configure)

## 📁 Project Structure

```
miraa-marketplace/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Next.js pages and API routes
│   │   ├── styles/          # Global styles and Tailwind config
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # State management (Redux/Zustand)
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   └── services/        # API service layer
│   ├── public/              # Static assets
│   ├── .env.local           # Environment variables (local)
│   ├── next.config.js       # Next.js configuration
│   ├── tsconfig.json        # TypeScript config
│   └── package.json
│
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database models (Prisma)
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   ├── services/        # Business services
│   │   ├── types/           # TypeScript types
│   │   ├── config/          # Configuration files
│   │   └── app.ts           # Express app setup
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   ├── .env                 # Environment variables
│   ├── tsconfig.json        # TypeScript config
│   └── package.json
│
├── docs/                    # Documentation
│   ├── API.md              # API documentation
│   ├── DATABASE.md         # Database schema docs
│   ├── SETUP.md            # Setup instructions
│   └── CONTRIBUTING.md     # Contributing guidelines
│
├── .github/
│   └── workflows/          # GitHub Actions workflows
│       ├── ci.yml          # CI/CD pipeline
│       └── tests.yml       # Test automation
│
└── docker-compose.yml      # Docker Compose for local development
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Git

### Quick Start

#### 1. Clone the Repository
```bash
git clone https://github.com/denismuringuri-max/01-public-marketplace.git
cd 01-public-marketplace
```

#### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run dev
```

#### 3. Setup Frontend
```bash
cd ../frontend
npm install
cp .env.local.example .env.local
npm run dev
```

#### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api/docs

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/miraa_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
SENDGRID_API_KEY=SG...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
NODE_ENV=development
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `GET /api/auth/profile` - Get current user profile

### Product Endpoints
- `GET /api/products` - List all products (with filters, pagination)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product (sellers only)
- `PUT /api/products/:id` - Update product (sellers only)
- `DELETE /api/products/:id` - Delete product (sellers only)
- `POST /api/products/:id/reviews` - Add product review

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart

### Order Endpoints
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin/seller)

### Seller Endpoints
- `GET /api/seller/dashboard` - Get seller dashboard data
- `GET /api/seller/products` - Get seller's products
- `GET /api/seller/sales` - Get sales analytics

For complete API documentation, see [API.md](./docs/API.md)

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts (buyers, sellers, admins)
- **products** - Product listings
- **categories** - Product categories
- **cart_items** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Order line items
- **reviews** - Product reviews and ratings
- **inventory** - Product stock management
- **transactions** - Payment transactions
- **notifications** - User notifications

For detailed schema, see [DATABASE.md](./docs/DATABASE.md)

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd ../frontend
npm run test
```

### Coverage
```bash
npm run test:coverage
```

## 📦 Build & Deployment

### Build Production Bundle
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

### Docker Deployment
```bash
docker-compose up --build
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Write tests
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🆘 Support

For issues, questions, or suggestions, please [open an issue](https://github.com/denismuringuri-max/01-public-marketplace/issues) on GitHub.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Multi-vendor support improvements
- [ ] AI-powered product recommendations
- [ ] Internationalization (i18n)
- [ ] Performance optimization
- [ ] Enhanced security features
- [ ] Real-time chat support

---

**Happy Coding! 🚀**
