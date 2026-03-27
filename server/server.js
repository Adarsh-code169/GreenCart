import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect DB & Cloudinary
await connectDB();
await connectCloudinary();

// ✅ CORS CONFIG
const allowedOrigins = [
  "http://localhost:5173",
  "https://green-cart-topaz-beta.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
}));

// ❌ REMOVE THIS (causing crash)
// app.options('*', cors());

// ✅ Stripe webhook (RAW body BEFORE json)
app.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
);

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Test route
app.get('/', (req, res) => res.send("API is Working 🚀"));

// ✅ Routes
app.use("/api/user", userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// ✅ Fallback route (optional but safe)
app.get('/*', (req, res) => {
  res.send("API route not found");
});

// ✅ Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
