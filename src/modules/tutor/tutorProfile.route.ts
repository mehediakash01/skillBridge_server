/**
 * Tutor Profile API Routes
 * Handles profile creation, updates, and retrieval
 */

import { Router, Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import { catchAsync } from "@/utils/catchAsync";
import { sendResponse } from "@/utils/sendResponse";
import { authenticate } from "@/middlewares/authMiddleware";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const router = Router();

// Validation schemas
const CreateTutorProfileSchema = z.object({
  userId: z.string(),
  headline: z.string().min(10).max(150),
  bio: z.string().optional(),
  bio_long: z.string().min(50).max(1000),
  intro_video_url: z.string().url().optional(),
  badges: z.array(z.string()).default([]),
  experience_years: z.number().int().min(0).max(70),
  languages: z.array(
    z.object({
      lang: z.string(),
      level: z.enum(["Native", "Fluent", "Intermediate", "Beginner"]),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      field: z.string(),
      school: z.string(),
      year: z.number().int().optional(),
      verified: z.boolean().default(false),
    })
  ),
  avatar_url: z.string().url().optional(),
  hourlyRate: z.number().min(5).max(500),
  availability: z.array(
    z.object({
      dayOfWeek: z.enum(["sat", "sun", "mon", "tue", "wed", "thu", "fri"]),
      startTime: z.string(),
      endTime: z.string(),
    })
  ),
  payoutMethod: z.enum(["bank_transfer", "paypal", "stripe"]).optional(),
  experience: z.number().int().default(0),
  is_published: z.boolean().default(false),
});

/**
 * GET /api/tutor-profile/:userId
 * Retrieve tutor profile
 */
router.get(
  "/:userId",
  catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
        tutorSubjects: {
          include: { category: true },
        },
        availabilities: true,
      },
    });

    if (!profile) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Tutor profile not found",
      });
    }

    // Parse JSON fields
    const responseData = {
      ...profile,
      languages: profile.languages ? JSON.parse(profile.languages as string) : [],
      education: profile.education ? JSON.parse(profile.education as string) : [],
      profile_draft: profile.profile_draft
        ? JSON.parse(profile.profile_draft as string)
        : null,
    };

    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: responseData,
      message: "Profile retrieved successfully",
    });
  })
);

/**
 * POST /api/tutor-profile
 * Create tutor profile
 */
router.post(
  "/",
  authenticate,
  catchAsync(async (req: Request, res: Response) => {
    const validatedData = CreateTutorProfileSchema.parse(req.body);

    // Check if profile already exists
    const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId: validatedData.userId },
    });

    if (existingProfile) {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message: "Tutor profile already exists for this user",
      });
    }

    const profile = await prisma.tutorProfile.create({
      data: {
        userId: validatedData.userId,
        headline: validatedData.headline,
        bio: validatedData.bio || validatedData.headline,
        bio_long: validatedData.bio_long,
        intro_video_url: validatedData.intro_video_url,
        badges: validatedData.badges,
        experience_years: validatedData.experience_years,
        languages: JSON.stringify(validatedData.languages),
        education: JSON.stringify(validatedData.education),
        avatar_url: validatedData.avatar_url,
        hourlyRate: validatedData.hourlyRate,
        experience: validatedData.experience,
        is_published: validatedData.is_published,
        studentId: validatedData.userId, // Legacy field
        availabilities: {
          create: validatedData.availability.map((slot) => ({
            dayOfWeek: slot.dayOfWeek as Prisma.Week,
            startTime: slot.startTime,
            endTime: slot.endTime,
          })),
        },
      },
      include: {
        availabilities: true,
      },
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      data: profile,
      message: "Profile created successfully",
    });
  })
);

/**
 * PUT /api/tutor-profile/:userId
 * Update tutor profile
 */
router.put(
  "/:userId",
  authenticate,
  catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const validatedData = CreateTutorProfileSchema.partial().parse(req.body);

    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Tutor profile not found",
      });
    }

    // Handle availability updates
    let availabilityUpdateData: Prisma.AvailabilityCreateNestedManyWithoutTutorInput | undefined;
    if (validatedData.availability) {
      // Delete existing availabilities and create new ones
      await prisma.availability.deleteMany({
        where: { tutorId: profile.id },
      });

      availabilityUpdateData = {
        create: validatedData.availability.map((slot) => ({
          dayOfWeek: slot.dayOfWeek as Prisma.Week,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      };
    }

    const updated = await prisma.tutorProfile.update({
      where: { userId },
      data: {
        headline: validatedData.headline,
        bio: validatedData.bio,
        bio_long: validatedData.bio_long,
        intro_video_url: validatedData.intro_video_url,
        badges: validatedData.badges,
        experience_years: validatedData.experience_years,
        languages: validatedData.languages
          ? JSON.stringify(validatedData.languages)
          : undefined,
        education: validatedData.education
          ? JSON.stringify(validatedData.education)
          : undefined,
        avatar_url: validatedData.avatar_url,
        hourlyRate: validatedData.hourlyRate,
        experience: validatedData.experience,
        is_published: validatedData.is_published,
        ...(availabilityUpdateData && { availabilities: availabilityUpdateData }),
      },
      include: {
        availabilities: true,
        tutorSubjects: {
          include: { category: true },
        },
      },
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: updated,
      message: "Profile updated successfully",
    });
  })
);

/**
 * PATCH /api/tutor-profile/:userId/draft
 * Save profile draft
 */
router.patch(
  "/:userId/draft",
  authenticate,
  catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { draft } = req.body;

    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Tutor profile not found",
      });
    }

    const updated = await prisma.tutorProfile.update({
      where: { userId },
      data: {
        profile_draft: JSON.stringify(draft),
      },
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: updated,
      message: "Draft saved successfully",
    });
  })
);

/**
 * DELETE /api/tutor-profile/:userId
 * Delete tutor profile
 */
router.delete(
  "/:userId",
  authenticate,
  catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Tutor profile not found",
      });
    }

    await prisma.tutorProfile.delete({
      where: { userId },
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Profile deleted successfully",
    });
  })
);

/**
 * GET /api/tutor-profile/published
 * Get all published tutor profiles (for browsing)
 */
router.get(
  "/published/list",
  catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, category } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: Prisma.TutorProfileWhereInput = {
      is_published: true,
      ...(category && {
        tutorSubjects: {
          some: { categoryId: parseInt(category as string) },
        },
      }),
    };

    const [profiles, total] = await Promise.all([
      prisma.tutorProfile.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          tutorSubjects: { include: { category: true } },
          Student: { select: { name: true, email: true } },
        },
      }),
      prisma.tutorProfile.count({ where }),
    ]);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: {
        profiles,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      },
      message: "Published profiles retrieved",
    });
  })
);

export default router;
