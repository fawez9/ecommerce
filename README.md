# E-commerce Platform

This repository contains the source code for a full-stack e-commerce application. The platform features a React-based client for a dynamic user experience and a robust Node.js/Express backend to manage data, authentication, and business logic. It includes separate interfaces and functionalities for both customers and administrators.

## Features

### Customer-Facing Features
- **User Authentication**: Secure registration and login functionality.
- **Product Catalog**: Browse a grid of all available products with details like name, price, and sale status.
- **Product Details Page**: View detailed information about a single product.
- **Shopping Cart**: Add products to a cart, view the cart, update item quantities, and remove items.
- **Checkout Process**: A multi-step checkout process to place an order. User details are pre-filled for authenticated users.
- **User Profile**: View and edit personal information (name, email, phone, address) and change the password.
- **Order History**: Authenticated users can view a list of their past orders with status and details.

### Administrative Features
- **Admin Dashboard**: A central hub for administrators displaying key metrics like total users, products, and orders, along with a real-time chart tracking daily orders.
- **Product Management (CRUD)**: A comprehensive interface to create, read, update, and delete products in the catalog.
- **User Management**: View a list of all registered users, see their details, and delete user accounts.
- **Order Management**: View all customer orders, inspect order details (items, customer info), update order status (e.g., 'in progress', 'confirmed', 'declined'), and delete orders.
- **Role-Based Access Control**: Secure endpoints and UI components are accessible only to administrators.

## Technology Stack

### Frontend (Client)
- **Framework**: React with TypeScript
- **Routing**: React Router
- **State Management**: React Context API (for Shopping Cart)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Charting**: Recharts
- **Styling**: CSS, FontAwesome

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Middleware**: CORS

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A running MongoDB instance

### Backend Setup

1.  **Navigate to the server directory**:
    ```sh
    cd server
    ```
2.  **Install dependencies**:
    ```sh
    npm install
    ```
3.  **Create an environment file**:
    Create a `.env` file in the `server` directory and add the following variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=3001
    ```
4.  **Start the development server**:
    ```sh
    npm run dev
    ```
    The backend server will be running on `http://localhost:3001`.

### Frontend Setup

1.  **Navigate to the client directory**:
    ```sh
    cd client
    ```
2.  **Install dependencies**:
    ```sh
    npm install
    ```
3.  **Start the development server**:
    ```sh
    npm start
    ```
    The client application will open in your browser at `http://localhost:3000`.

## Project Structure

The repository is structured as a monorepo with two main folders: `client` and `server`.

```
.
├── client/       # React frontend application
│   ├── public/
│   └── src/
│       ├── components/ # Reusable UI components (Dashboard, Navbar, etc.)
│       ├── context/    # React context for global state (CartContext)
│       ├── hooks/      # Custom hooks (useGetProducts, useGetToken, etc.)
│       ├── models/     # TypeScript interfaces
│       └── pages/      # Page components (Home, Admin, Auth, etc.)
└── server/       # Node.js/Express backend API
    └── src/
        ├── middlewares/ # Express middleware (token verification)
        ├── models/      # Mongoose schemas (User, Product, Order)
        ├── routes/      # API Endpoints (admin, order, product, user)
        └── index.ts     # Main server entry point
```

## API Endpoints

The backend exposes the following RESTful API endpoints. Admin-protected routes require a valid JWT from an admin user.

### User Routes (`/user`)
- `POST /register`: Register a new user.
- `POST /login`: Authenticate a user and receive a JWT.
- `GET /profile/:userID`: Get a user's profile information.
- `PUT /profile/:userID`: Update a user's profile information.
- `GET /orders-list/:userID`: Retrieve the order history for a specific user.

### Product Routes (`/product`)
- `GET /`: Get a list of all products.
- `GET /:id`: Get details for a single product by ID.
- `POST /` (Admin): Add a new product.
- `PUT /:id` (Admin): Update an existing product.
- `DELETE /:id` (Admin): Delete a product.

### Order Routes (`/order`)
- `POST /`: Create a new order (for both guests and authenticated users).
- `GET /` (Admin): Get a list of all orders.
- `GET /:id` (Admin): Get details for a single order by ID.
- `PUT /:id` (Admin): Update the status of an order.
- `DELETE /:id` (Admin): Delete an order.

### Admin Routes (`/admin`)
- `GET /users`: Get a list of all registered users.
- `GET /users/:userID`: Get details for a single user by ID.
- `DELETE /users/:userID`: Delete a user account.
