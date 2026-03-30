# GreenCart

**GreenCart** is a modern full-stack e-commerce web application designed to offer a seamless shopping and merchant management experience. Built entirely on the MERN stack (MongoDB, Express.js, React, Node.js), this platform supports distinct roles for buyers and sellers—allowing customers to browse, cart, and purchase products while sellers can list and manage their inventories.

## Key Features

- **User Authentication**: Secure Login & Registration using JSON Web Tokens (JWT) and BcryptJS.
- **Two Unique Portals**:
  - **Buyer Dashboard**: View categories, search products, add to cart, configure shipping addresses, and review order history.
  - **Seller Portal**: A dedicated interface for merchants to add new products, manage their listings, and track incoming orders.
- **Shopping Cart & Checkout**: Interactive client-side cart integrated with Stripe for secure, industry-standard payment processing.
- **Rich Media Storage**: Integration with Cloudinary via Multer to handle product image uploads effectively.
- **Responsive Navigation**: Smooth transitions using React Router v7.
- **Clean UI/UX**: Designed using Vite, TailwindCSS, and customizable React Hot Toast notifications.

## Tech Stack

### Frontend Components (Client)
- **Framework:** React 19 / Vite
- **Styling:** TailwindCSS 4
- **State/Routing:** React Router v7
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

### Backend Framework (Server)
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database Layer:** MongoDB with Mongoose
- **Payments:** Stripe
- **Image Uploads:** Multer & Cloudinary
- **Security:** bcryptjs, JSON Web Tokens (jsonwebtoken), CORS

## Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Database (Local or MongoDB Atlas)
- Cloudinary Account (for image uploads)
- Stripe Account (for payments)

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone 
   cd GreenCart_03/GreenCart
   ```

2. **Install all dependencies:**
   This project leverages a unified build script to install packages in all necessary directories (`client`, `server`, and root).
   ```bash
   npm run install-all
   ```

3. **Configure Environment Variables:**
   - Go to the `server/` directory and create a `.env` file. Keep your sensitive keys here (MongoDB URI, Stripe Secret Key, Cloudinary configuration, JWT Secret, etc.).
   - If required, create a `.env` in the `client/` side for API base URLs or Stripe public keys.

### Running the Application Structure

To spin up both the React frontend and the Node server concurrently, run:

```bash
# In the root 'GreenCart' directory run:
npm run dev
```
Wait for the Node log indicating successful DB connection and the Vite port to become active. Then, navigate to the indicated `localhost` port in your web browser.

## Project Structure

```text
GreenCart/
├── client/          # All frontend code (React, Tailwind, Vite)
│   ├── src/         
│   │   ├── components/  # Reusable UI parts & navbars
│   │   ├── context/     # React Context for state management
│   │   └── pages/       # Dedicated pages for User and Seller roles
├── server/          # Node.js backend logic
│   ├── ...          # Models, Controllers, Middleware, Routes
│   ├── .env         # Secret tokens 
│   └── server.js    # Entry point referencing express app
└── package.json     # Orchestration scripts using concurrently
```
