import express  from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser"

import 'dotenv/config';
import cloudinary from "cloudinary";
import Stripe from 'stripe';
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";



import connectDB from "./config/db.js";
// db connection
connectDB()

// stripe config
export const stripe = new Stripe(process.env.Secret_key);



// cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_SECRET
});


const app = express();
const PORT = process.env.PORT || 8080;

// middlewares
app.use(mongoSanitize());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes import

import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"

// route

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/order", orderRoutes);


// route
app.get("/", (req, res) => {
    return res.status(200).json(  
      "<h1> It's a slash route </h1>"
   )
})

// listen
app.listen(PORT, () => {
    console.log(`server servers on ${PORT} on ${process.env.NODE_ENV} mode`.bgMagenta.white)
})