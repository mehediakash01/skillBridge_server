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



const app:Application = express()
app.use(globalErrorHandler);
app.use(express.json())
app.use(cors({
  
  origin:process.env.APP_URL ||"http://localhost:5000",
    credentials:true
}
  
   
))
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
app.get('/',(req,res)=>{
    res.send("Ronaldo is the goat")
})
export default app