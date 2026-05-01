import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express"
import cors from "cors"
import { auth } from "./auth.js";
import globalErrorHandler from "../middlewares/globalErrorHandler.js";
import { createTutor } from "../modules/tutor/tutor.router.js";
import { bookingRouter } from "../modules/booking/booking.router.js";
import { userReview } from "../modules/reviews/review.router.js";
import { adminRouter } from "../modules/admin/admin.router.js";
import { categoryRoutes } from "../modules/category/category.router.js";
import { availableRouter } from "../modules/availability/available.router.js";



const app:Application = express()
app.use(express.json())
const allowedOrigins = [
  process.env.APP_URL,
  "https://skill-bridge-client-sage.vercel.app",
  "https://skill-bridge-client-ex6c.vercel.app",
  "http://localhost:3000",
  "http://localhost:5000"
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // allow server-to-server calls (no origin) and listed client origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true,
}))
app.all('/api/auth/{*any}', toNodeHandler(auth));
// tutor routes
app.use('/api/tutors',createTutor)
// booking routes
app.use('/api/bookings',bookingRouter)
// review routes
app.use("/api/reviews",userReview)
// admin routes
app.use("/api/admin/users",adminRouter)
app.use("/api/categories",categoryRoutes)
// availability routes
app.use("/api/availability",availableRouter)
app.get('/',(req,res)=>{
    res.send("Ronaldo is the goat")
})

// Global error handler must be last
app.use(globalErrorHandler);

export default app