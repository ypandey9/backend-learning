This project implements a production-style ecommerce backend API
built with Node.js and Express. It demonstrates authentication,
role-based access control, caching, background processing,
and containerized infrastructure.

Client
  │
  ▼
Express API
  │
  ├── MongoDB (Data Storage)
  ├── Redis (Caching)
  └── BullMQ Queue
        │
        ▼
     Worker

npm install
npm run dev

docker compose up --build

<!-- Api end points -->

POST /api/auth/register
POST /api/auth/login
GET  /api/profile

POST /api/products
GET  /api/products

POST /api/orders
GET  /api/orders


Tech Stack

Backend

Node.js

Express.js

MongoDB

Mongoose

Infrastructure

Redis

BullMQ

Docker

Documentation

Swagger

API Documentation

Swagger UI:

http://localhost:5000/api-docs

Environment Variables

Create .env file:


<!--  -->

PORT=5000

MONGO_URI=mongodb://mongo:27017/backend-learning

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=your_secret
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=7d

<!--  -->

Run Project (Local Development)

Install dependencies:

npm install

Start development server:

npm run dev
Run Project (Docker)

Start all services:

docker compose up --build

This starts:

Node API
MongoDB
Redis
Worker
Example API Endpoints

Authentication

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout

Products

POST /api/products
GET /api/products
GET /api/products/:id

Orders

POST /api/orders
GET /api/orders
Learning Objectives

This project demonstrates practical backend concepts including:

authentication systems

role-based authorization

database transactions

caching strategies

background job processing

containerized backend deployment