🛒 GreenCart – MERN E-commerce Platform

GreenCart is a full-stack MERN-based e-commerce platform designed to deliver a seamless online shopping experience. It allows users to browse products, manage carts, and place orders securely while providing sellers with dynamic product management capabilities.

📌 Features

🔐 Authentication & Authorization

JWT-based secure login/signup

Role-based access (User / Seller)

🛍️ Product Management

Add, update, delete products

Image upload functionality

Dynamic product rendering

🛒 Cart & Orders

Add to cart & update quantity

Seamless checkout process

Order tracking & management

👤 User Features

Profile management

Order history

📊 Seller Dashboard

Manage products & orders efficiently

🧑‍💻 Tech Stack

Frontend:

React.js

CSS - Tailwind 

Backend:

Node.js

Express.js

Database:

MongoDB (MongoDB Atlas)

Authentication:

JSON Web Tokens (JWT)

bcrypt

Deployment:

Vercel / Render

🏗️ Project Structure
GreenCart/
│
├── client/        # React frontend
├── server/        # Node.js backend
├── models/        # MongoDB schemas
├── routes/        # API routes
├── controllers/   # Business logic
└── config/        # DB & environment configs
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/Adarsh-code169/GreenCart.git
cd GreenCart
2️⃣ Install dependencies

Frontend

cd client
npm install

Backend

cd server
npm install
3️⃣ Environment Variables

Create a .env file in the server folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
4️⃣ Run the project

Backend

cd server
npm start

Frontend

cd client
npm run dev
📡 API Endpoints

/api/auth → Authentication routes

/api/products → Product management

/api/cart → Cart operations

/api/orders → Order handling

🎯 Key Highlights

⚡ Full-stack MERN architecture

🔒 Secure authentication system

📱 Fully responsive UI

🔄 Real-time updates with dynamic rendering

📦 Scalable and modular code structure
