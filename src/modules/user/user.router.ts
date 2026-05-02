import express, { Router } from "express";
import sessionAuth from "../../middlewares/authMiddleware.js";
import { prisma } from "../../lib/prisma.js";
import sendResponse from "../../utils/sendResponse.js";
import catchAsync from "../../utils/catchAsync.js";

const router = express.Router();

// Update user role
router.patch(
  "/role",
  sessionAuth(),
  catchAsync(async (req, res) => {
    const userId = req.user!.id;
    const { role } = req.body;

    if (!role || !["STUDENT", "TUTOR", "ADMIN"].includes(role)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid role provided",
        data: null,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  })
);

// Get current user
router.get(
  "/me",
  sessionAuth(),
  catchAsync(async (req, res) => {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  })
);

export const userRouter: Router = router;
