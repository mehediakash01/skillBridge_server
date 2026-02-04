// create tutor profile
import express, { Router } from "express"
import { tutorController } from "./tutor.controller.js";
import sessionAuth, { UserRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

  router.post('/profile',
    sessionAuth(UserRole.TUTOR),
    tutorController.createTutor)

export  const createTutor:Router = router