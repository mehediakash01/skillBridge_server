
import express, { Router } from "express"
import { tutorController } from "./tutor.controller.js";
import sessionAuth, { UserRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();
// create tutor profile
  router.post('/profile',
    sessionAuth(UserRole.TUTOR),
    tutorController.createTutor)
    // get tutor own profile
    router.get("/profile/me",
      sessionAuth(UserRole.TUTOR),
      tutorController.getMyProfile)
// update tutor availability
      router.put("/availability",tutorController.updateTutorAvailability)

export  const createTutor:Router = router