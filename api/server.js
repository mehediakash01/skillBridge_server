// src/lib/app.ts
import { toNodeHandler } from "better-auth/node";
import express6 from "express";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  trustedOrigins: [
    "https://skill-bridge-client-1h8j.vercel.app",
    "http://localhost:5000"
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT"
      },
      isBanned: {
        type: "boolean",
        required: false,
        defaultValue: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"SkillBridge" <skill@bridge.com>',
          to: `${user.email}`,
          subject: "Please verify your email",
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; padding:24px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">
                Skill Bridge
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin-top:0; color:#111827;">
                Verify your email address
              </h2>

              <p style="color:#4b5563; font-size:16px; line-height:1.6;">
                Thanks for signing up for <strong> Skill Bridge</strong> \u{1F389}  
                Please confirm your email address by clicking the button below.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:32px 0;">
                <a
                  href="${verificationUrl}"
                  target="_blank"
                  style="
                    background:#4f46e5;
                    color:#ffffff;
                    padding:14px 28px;
                    text-decoration:none;
                    border-radius:6px;
                    font-size:16px;
                    font-weight:bold;
                    display:inline-block;
                  "
                >
                  Verify Email
                </a>
              </div>

              <p style="color:#6b7280; font-size:14px; line-height:1.6;">
                If the button doesn\u2019t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; font-size:14px;">
                <a href="${verificationUrl}" style="color:#4f46e5;">
                  ${verificationUrl}
                </a>
              </p>

              <p style="color:#9ca3af; font-size:13px; margin-top:32px;">
                If you didn\u2019t create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:16px; text-align:center; font-size:12px; color:#9ca3af;">
              \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()}  Skill Bridge. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
        });
        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.log("mail submission failed", err);
        throw err;
      }
    }
  }
});

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong",
    error: err
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/modules/tutor/tutor.router.ts
import express from "express";

// src/utils/catchAsync.ts
var catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
var catchAsync_default = catchAsync;

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode || 200).json({
    success: data.success,
    message: data.message,
    data: data.data
  });
};
var sendResponse_default = sendResponse;

// src/modules/tutor/tutor.service.ts
var createOrUpdateUser = async (userId, payload) => {
  const { bio, hourlyRate, experience, categoryIds = [] } = payload;
  const tutorProfile = await prisma.tutorProfile.upsert({
    where: { studentId: userId },
    update: { bio, hourlyRate, experience },
    create: { studentId: userId, bio, hourlyRate, experience }
  });
  if (categoryIds.length > 0) {
    await prisma.$transaction([
      // Remove all existing subject links
      prisma.tutorSubjects.deleteMany({
        where: { tutorId: tutorProfile.id }
      }),
      // Insert new subject links
      prisma.tutorSubjects.createMany({
        data: categoryIds.map((categoryId) => ({
          tutorId: tutorProfile.id,
          categoryId
        })),
        skipDuplicates: true
      })
    ]);
  } else {
    await prisma.tutorSubjects.deleteMany({
      where: { tutorId: tutorProfile.id }
    });
  }
  return prisma.tutorProfile.findUnique({
    where: { id: tutorProfile.id },
    include: {
      tutorSubjects: {
        include: { category: true }
      }
    }
  });
};
var getTutorProfileById = async (id) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id
    },
    include: {
      Student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      tutorSubjects: {
        include: {
          category: true
        }
      },
      availabilities: true,
      bookings: true
    }
  });
  if (!tutor) return null;
  return {
    ...tutor,
    hourlyRate: Number(tutor.hourlyRate),
    averageRate: Number(tutor.averageRate)
  };
};
var timeToMinutes = (time) => {
  const parts = time.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid time format. Expected HH:MM");
  }
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  if (Number.isNaN(h) || Number.isNaN(m)) {
    throw new Error("Invalid time format. Expected HH:MM");
  }
  return h * 60 + m;
};
var hasOverlap = (slots) => {
  const sorted = slots.map((s) => ({
    ...s,
    start: timeToMinutes(s.startTime),
    end: timeToMinutes(s.endTime)
  })).sort((a, b) => a.start - b.start);
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].end > sorted[i + 1].start) {
      return true;
    }
  }
  return false;
};
var updateTutorAvailability = async (tutorUserId, slots) => {
  if (!Array.isArray(slots) || slots.length === 0) {
    throw new Error("Availability slots are required");
  }
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { studentId: tutorUserId }
  });
  if (!tutorProfile) {
    throw new Error("Create tutor profile first");
  }
  for (const slot of slots) {
    if (timeToMinutes(slot.startTime) >= timeToMinutes(slot.endTime)) {
      throw new Error(
        `Invalid time range on ${slot.dayOfWeek}`
      );
    }
  }
  const grouped = {};
  for (const slot of slots) {
    if (!grouped[slot.dayOfWeek]) {
      grouped[slot.dayOfWeek] = [];
    }
    grouped[slot.dayOfWeek].push(slot);
  }
  for (const day in grouped) {
    if (hasOverlap(grouped[day])) {
      throw new Error(
        `Overlapping availability detected on ${day}`
      );
    }
  }
  await prisma.$transaction([
    prisma.availability.deleteMany({
      where: { tutorId: tutorProfile.id }
    }),
    prisma.availability.createMany({
      data: slots.map((slot) => ({
        tutorId: tutorProfile.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime
      }))
    })
  ]);
};
var getAllTutors = async (query) => {
  const {
    page = 1,
    limit = 10,
    minRate,
    maxRate,
    experience,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const where = {};
  if (experience) {
    where.experience = Number(experience);
  }
  if (minRate || maxRate) {
    where.hourlyRate = {
      gte: minRate ? Number(minRate) : void 0,
      lte: maxRate ? Number(maxRate) : void 0
    };
  }
  const result = await prisma.tutorProfile.findMany({
    where,
    include: {
      Student: true
    },
    skip,
    take: Number(limit),
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const total = await prisma.tutorProfile.count({ where });
  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit)
    },
    data: result
  };
};
var getTutorByID = async (id) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id
    },
    include: {
      Student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      tutorSubjects: {
        include: {
          category: true
        }
      },
      availabilities: true,
      bookings: true
    }
  });
  if (!tutor) return null;
  return {
    ...tutor,
    hourlyRate: Number(tutor.hourlyRate),
    averageRate: Number(tutor.averageRate)
  };
};
var getTutorAvailability = async (tutorUserId) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { studentId: tutorUserId }
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }
  const availability = await prisma.availability.findMany({
    where: { tutorId: tutorProfile.id },
    orderBy: { startTime: "asc" }
  });
  const grouped = {};
  availability.forEach((slot) => {
    const day = slot.dayOfWeek;
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push({
      startTime: slot.startTime,
      endTime: slot.endTime
    });
  });
  return grouped;
};
var tutorService = {
  createOrUpdateUser,
  getTutorProfileById,
  updateTutorAvailability,
  getTutorAvailability,
  getAllTutors,
  getTutorByID
};

// src/modules/tutor/tutor.controller.ts
var createTutor = catchAsync_default(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const { id } = user;
    const tutorProfile = await tutorService.createOrUpdateUser(
      id,
      req.body
    );
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Tutor profile created successfully",
      data: tutorProfile
    });
  }
);
var getAllTutors2 = catchAsync_default(async (req, res) => {
  const result = await tutorService.getAllTutors(req.query);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "retrieve all tutor successfully",
    data: result
  });
});
var getTutorById = catchAsync_default(async (req, res) => {
  const tutorId = req.params.id;
  if (!tutorId) {
    throw new Error("TutorId is missing");
  }
  const result = await tutorService.getTutorByID(tutorId);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "retrieve  tutor details successfully",
    data: result
  });
});
var getMyProfile = catchAsync_default(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const { id } = user;
    const result = await tutorService.getTutorProfileById(id);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "successfully retrieved profile information",
      data: result
    });
  }
);
var updateTutorAvailability2 = catchAsync_default(
  async (req, res) => {
    const user = req.user;
    const { slots } = req.body;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const { id } = user;
    const result = await tutorService.updateTutorAvailability(id, slots);
    sendResponse_default(res, {
      success: true,
      statusCode: 200,
      message: "tutor set up availability successful",
      data: result
    });
  }
);
var getMyAvailability = catchAsync_default(
  async (req, res) => {
    const tutorUserId = req.user.id;
    const result = await tutorService.getTutorAvailability(tutorUserId);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Availability fetched successfully",
      data: result
    });
  }
);
var tutorController = {
  createTutor,
  getMyProfile,
  updateTutorAvailability: updateTutorAvailability2,
  getMyAvailability,
  getAllTutors: getAllTutors2,
  getTutorById
};

// src/middlewares/authMiddleware.ts
var sessionAuth = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "you are not authorized"
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "email verification required. Please verify your email"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role))
        return res.status(403).json({
          success: false,
          message: "forbidden! you don't have permissions to access this resources"
        });
      next();
    } catch (err) {
      next(err);
    }
  };
};
var authMiddleware_default = sessionAuth;

// src/modules/tutor/tutor.router.ts
var router = express.Router();
router.put(
  "/profile",
  authMiddleware_default("TUTOR" /* TUTOR */),
  tutorController.createTutor
);
router.get(
  "/profile/me",
  authMiddleware_default("TUTOR" /* TUTOR */),
  tutorController.getMyProfile
);
router.put(
  "/availability",
  authMiddleware_default("TUTOR" /* TUTOR */),
  tutorController.updateTutorAvailability
);
router.get(
  "/availability",
  authMiddleware_default("TUTOR" /* TUTOR */),
  tutorController.getMyAvailability
);
router.get("/", tutorController.getAllTutors);
router.get("/:id", tutorController.getTutorById);
var createTutor2 = router;

// src/modules/booking/booking.router.ts
import express2 from "express";

// generated/prisma/enums.ts
var Booked_Status = {
  pending: "pending",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled"
};

// src/modules/booking/booking.service.ts
var normalizeTime = (t) => {
  if (t instanceof Date) return t.toISOString().substring(11, 16);
  return t.substring(0, 5);
};
var createBooking = async (studentId, payload) => {
  const { tutorId, startTime, endTime } = payload;
  const bookingStart = new Date(startTime);
  const bookingEnd = new Date(endTime);
  if (isNaN(bookingStart.getTime()) || isNaN(bookingEnd.getTime())) {
    throw new Error("Invalid booking time");
  }
  if (bookingStart >= bookingEnd) {
    throw new Error("Invalid booking time range");
  }
  const weekMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const weekday = weekMap[bookingStart.getUTCDay()];
  const availabilities = await prisma.availability.findMany({
    where: { tutorId, dayOfWeek: weekday }
  });
  if (!availabilities.length) {
    throw new Error("Tutor has no availability on this day");
  }
  const parseStr = (t) => {
    const str = normalizeTime(t);
    const [h = 0, m = 0] = str.split(":").map(Number);
    return h * 60 + m;
  };
  const bookingStartMinutes = parseStr(bookingStart);
  const bookingEndMinutes = parseStr(bookingEnd);
  const matchedAvailability = availabilities.find((slot) => {
    const slotStart = parseStr(slot.startTime);
    const slotEnd = parseStr(slot.endTime);
    return slotStart <= bookingStartMinutes && slotEnd >= bookingEndMinutes;
  });
  if (!matchedAvailability) {
    throw new Error("Tutor not available at this time");
  }
  const conflict = await prisma.booking.findFirst({
    where: {
      tutorId,
      status: { not: Booked_Status.cancelled },
      AND: [
        { startTime: { lt: bookingEnd } },
        { endTime: { gt: bookingStart } }
      ]
    }
  });
  if (conflict) {
    throw new Error("This time slot is already booked");
  }
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId }
  });
  if (!tutor) {
    throw new Error("Tutor not found");
  }
  const hours = (bookingEnd.getTime() - bookingStart.getTime()) / (1e3 * 60 * 60);
  const totalPrice = Number(tutor.hourlyRate) * hours;
  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorId,
      startTime: bookingStart,
      endTime: bookingEnd,
      totalPrice,
      status: Booked_Status.confirmed
    }
  });
  return booking;
};
var getBookingDetails = async (bookingId) => {
  return prisma.booking.findUnique({
    where: {
      id: bookingId
    },
    include: { Tutor: true }
  });
};
var getOwnBooking = async (userId) => {
  return prisma.booking.findMany({
    where: {
      studentId: userId
    },
    orderBy: { startTime: "desc" },
    include: { Tutor: true }
  });
};
var getTutorBooking = async (tutorId) => {
  return prisma.booking.findMany({
    where: {
      tutorId
    },
    orderBy: { startTime: "asc" },
    include: { Student: true }
  });
};
var completeBooking = async (bookingId, tutorUserId) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { studentId: tutorUserId }
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.tutorId !== tutorProfile.id) {
    throw new Error("You are not allowed to update this booking");
  }
  if (booking.status !== Booked_Status.confirmed) {
    throw new Error("Only confirmed bookings can be completed");
  }
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: Booked_Status.completed
    }
  });
};
var cancelBooking = async (bookingId, userId, role) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.status === Booked_Status.completed || booking.status === Booked_Status.cancelled) {
    throw new Error("This booking cannot be cancelled");
  }
  if (role === "STUDENT" /* STUDENT */) {
    if (booking.studentId !== userId) {
      throw new Error("You are not allowed to cancel this booking");
    }
  }
  if (role === "TUTOR" /* TUTOR */) {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { id: userId }
    });
    if (!tutorProfile || booking.tutorId !== tutorProfile.id) {
      throw new Error("You are not allowed to cancel this booking");
    }
  }
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: Booked_Status.cancelled
    }
  });
};
var updateMeetingLink = async (bookingId, tutorUserId, meetingLink) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { studentId: tutorUserId }
  });
  if (!tutorProfile) throw new Error("Tutor profile not found");
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");
  if (booking.tutorId !== tutorProfile.id)
    throw new Error("You are not allowed to update this booking");
  if (booking.status === Booked_Status.completed)
    throw new Error("Cannot update a completed booking");
  if (booking.status === Booked_Status.cancelled)
    throw new Error("Cannot update a cancelled booking");
  return prisma.booking.update({
    where: { id: bookingId },
    data: { meetingLink }
  });
};
var bookingService = {
  createBooking,
  getOwnBooking,
  getTutorBooking,
  getBookingDetails,
  completeBooking,
  cancelBooking,
  updateMeetingLink
};

// src/modules/booking/booking.controller.ts
var createBooking2 = catchAsync_default(async (req, res) => {
  const studentId = req.user.id;
  const result = await bookingService.createBooking(studentId, req.body);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Booking created successfully",
    data: result
  });
});
var getOwnBooking2 = catchAsync_default(async (req, res) => {
  const studentId = req.user.id;
  const result = await bookingService.getOwnBooking(studentId);
  sendResponse_default(res, {
    success: true,
    message: "retrieving booking successful",
    statusCode: 200,
    data: result
  });
});
var getTutorBooking2 = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { studentId: userId }
  });
  if (!tutorProfile) {
    return sendResponse_default(res, {
      success: false,
      message: "Tutor profile not found",
      statusCode: 404,
      data: null
    });
  }
  const result = await bookingService.getTutorBooking(tutorProfile.id);
  sendResponse_default(res, {
    success: true,
    message: "Bookings retrieved",
    statusCode: 200,
    data: result
  });
});
var getBookingDetails2 = catchAsync_default(async (req, res) => {
  const bookingId = req.params.id;
  const result = await bookingService.getBookingDetails(bookingId);
  sendResponse_default(res, {
    success: true,
    message: "retrieving booking details successful",
    statusCode: 200,
    data: result
  });
});
var completeBooking2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const result = await bookingService.completeBooking(id, userId);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Booking marked as completed",
    data: result
  });
});
var cancelBooking2 = catchAsync_default(async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;
  const result = await bookingService.cancelBooking(
    bookingId,
    userId,
    role
  );
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Booking cancelled successfully",
    data: result
  });
});
var updateMeetingLink2 = catchAsync_default(async (req, res) => {
  const tutorUserId = req.user.id;
  const { meetingLink } = req.body;
  if (!meetingLink) {
    return sendResponse_default(res, { success: false, message: "Meeting link is required", statusCode: 400, data: null });
  }
  const result = await bookingService.updateMeetingLink(
    req.params.id,
    tutorUserId,
    meetingLink
  );
  sendResponse_default(res, { success: true, message: "Meeting link updated", statusCode: 200, data: result });
});
var bookingController = {
  createBooking: createBooking2,
  getOwnBooking: getOwnBooking2,
  getTutorBooking: getTutorBooking2,
  getBookingDetails: getBookingDetails2,
  completeBooking: completeBooking2,
  cancelBooking: cancelBooking2,
  updateMeetingLink: updateMeetingLink2
};

// src/modules/booking/booking.router.ts
var router2 = express2.Router();
router2.post(
  "/",
  authMiddleware_default("STUDENT" /* STUDENT */),
  bookingController.createBooking
);
router2.get(
  "/me",
  authMiddleware_default("STUDENT" /* STUDENT */),
  bookingController.getOwnBooking
);
router2.get(
  "/tutor",
  authMiddleware_default("TUTOR" /* TUTOR */),
  bookingController.getTutorBooking
);
router2.get("/:id", bookingController.getBookingDetails);
router2.patch("/:id/meeting-link", authMiddleware_default("TUTOR" /* TUTOR */), bookingController.updateMeetingLink);
router2.patch(
  "/:id/complete",
  authMiddleware_default("TUTOR" /* TUTOR */),
  bookingController.completeBooking
);
router2.patch(
  "/:id/cancel",
  authMiddleware_default("STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */),
  bookingController.cancelBooking
);
var bookingRouter = router2;

// src/modules/reviews/review.router.ts
import express3 from "express";

// src/modules/reviews/review.service.ts
var createReview = async (studentId, payload) => {
  const { bookingId, rating, comment } = payload;
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== studentId)
    throw new Error("You cannot review this booking");
  const canReview = booking.status === Booked_Status.completed || booking.status === Booked_Status.confirmed && !!booking.meetingLink;
  if (!canReview)
    throw new Error("You can only review after attending the session");
  const existingReview = await prisma.reviews.findFirst({ where: { bookingId } });
  if (existingReview) throw new Error("Review already submitted");
  const review = await prisma.reviews.create({
    data: { bookingId, rating, comment }
  });
  const allReviews = await prisma.reviews.findMany({
    where: { booking: { tutorId: booking.tutorId } }
  });
  const avg = allReviews.reduce((sum, r) => sum + Number(r.rating), 0) / allReviews.length;
  await prisma.tutorProfile.update({
    where: { id: booking.tutorId },
    data: { averageRate: avg }
  });
  return review;
};
var getReviewByBookingId = async (bookingId) => {
  return prisma.reviews.findFirst({ where: { bookingId } });
};
var reviewService = {
  createReview,
  getReviewByBookingId
};

// src/modules/reviews/review.controller.ts
var createReview2 = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await reviewService.createReview(userId, req.body);
  sendResponse_default(res, { statusCode: 201, success: true, message: "Review submitted successfully", data: result });
});
var getReviewByBookingId2 = catchAsync_default(async (req, res) => {
  const result = await reviewService.getReviewByBookingId(req.params.bookingId);
  sendResponse_default(res, { statusCode: 200, success: true, message: "Review retrieved", data: result });
});
var reviewController = {
  createReview: createReview2,
  getReviewByBookingId: getReviewByBookingId2
};

// src/modules/reviews/review.router.ts
var router3 = express3.Router();
router3.post("/", authMiddleware_default("STUDENT" /* STUDENT */), reviewController.createReview);
router3.get("/:bookingId", reviewController.getReviewByBookingId);
var userReview = router3;

// src/modules/admin/admin.router.ts
import express4 from "express";

// src/modules/admin/admin.service.ts
var updateUserStatus = async (userId, isBanned) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new Error("User not found");
  }
  return prisma.user.update({
    where: { id: userId },
    data: {
      isBanned
    }
  });
};
var getAllUser = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      image: true,
      createdAt: true
    }
  });
};
var getAllBookings = async () => {
  return prisma.booking.findMany({
    orderBy: { startTime: "desc" },
    include: {
      Student: {
        select: { id: true, name: true, email: true, image: true }
      },
      Tutor: {
        include: {
          Student: {
            select: { id: true, name: true, email: true }
          }
        }
      }
    }
  });
};
var getStats = async () => {
  const [totalUsers, totalTutors, totalStudents, totalBookings, completedBookings, totalCategories] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TUTOR" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "completed" } }),
    prisma.category.count()
  ]);
  const revenue = await prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: { status: "completed" }
  });
  return {
    totalUsers,
    totalTutors,
    totalStudents,
    totalBookings,
    completedBookings,
    totalCategories,
    totalRevenue: Number(revenue._sum.totalPrice ?? 0)
  };
};
var adminService = {
  getAllUser,
  updateUserStatus,
  getAllBookings,
  getStats
};

// src/modules/admin/admin.controller.ts
var getAllUser2 = catchAsync_default(async (req, res) => {
  const result = await adminService.getAllUser();
  sendResponse_default(res, {
    success: true,
    message: "Users retrieved successfully",
    statusCode: 200,
    data: result
  });
});
var updateUserStatus2 = async (req, res) => {
  const { id } = req.params;
  const { isBanned } = req.body;
  if (typeof isBanned !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isBanned must be boolean"
    });
  }
  const user = await adminService.updateUserStatus(id, isBanned);
  res.status(200).json({
    success: true,
    message: isBanned ? "User banned successfully" : "User unbanned successfully",
    data: user
  });
};
var getAllBookings2 = catchAsync_default(async (req, res) => {
  const result = await adminService.getAllBookings();
  sendResponse_default(res, {
    success: true,
    message: "Bookings retrieved successfully",
    statusCode: 200,
    data: result
  });
});
var getStats2 = catchAsync_default(async (req, res) => {
  const result = await adminService.getStats();
  sendResponse_default(res, {
    success: true,
    message: "Stats retrieved successfully",
    statusCode: 200,
    data: result
  });
});
var adminController = {
  getAllUser: getAllUser2,
  updateUserStatus: updateUserStatus2,
  getStats: getStats2,
  getAllBookings: getAllBookings2
};

// src/modules/admin/admin.router.ts
var router4 = express4.Router();
router4.get("/", authMiddleware_default("ADMIN" /* ADMIN */), adminController.getAllUser);
router4.patch("/:id", authMiddleware_default("ADMIN" /* ADMIN */), adminController.updateUserStatus);
router4.get("/stats", authMiddleware_default("ADMIN" /* ADMIN */), adminController.getStats);
router4.get("/bookings", authMiddleware_default("ADMIN" /* ADMIN */), adminController.getAllBookings);
var adminRouter = router4;

// src/modules/category/category.router.ts
import express5 from "express";

// src/modules/category/category.service.ts
var createCategory = async (categoryName) => {
  return prisma.category.create({
    data: { categoryName }
  });
};
var getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { categoryName: "asc" }
  });
};
var deleteCategory = async (id) => {
  return prisma.category.delete({
    where: { id }
  });
};
var categoryService = {
  createCategory,
  getAllCategories,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required" });
  }
  const category = await categoryService.createCategory(categoryName);
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category
  });
};
var getAllCategories2 = async (_req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json({
    success: true,
    message: "retrieving category successfully",
    data: categories
  });
};
var deleteCategory2 = async (req, res) => {
  const id = Number(req.params.id);
  const category = await categoryService.deleteCategory(id);
  res.status(200).json({
    success: true,
    message: "Category deleted",
    data: category
  });
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.router.ts
var router5 = express5.Router();
router5.get("/", categoryController.getAllCategories);
router5.post(
  "/",
  authMiddleware_default("ADMIN" /* ADMIN */),
  categoryController.createCategory
);
router5.delete(
  "/:id",
  authMiddleware_default("ADMIN" /* ADMIN */),
  categoryController.deleteCategory
);
var categoryRoutes = router5;

// src/modules/availability/available.router.ts
import { Router as Router3 } from "express";

// src/modules/availability/available.service.ts
var toMinutes = (date) => date.getUTCHours() * 60 + date.getUTCMinutes();
var normalizeTime2 = (t) => {
  if (t instanceof Date) return t.toISOString().substring(11, 16);
  return t.substring(0, 5);
};
var parseTimeToMinutes = (t) => {
  const str = normalizeTime2(t);
  const [hours = 0, minutes = 0] = str.split(":").map(Number);
  return hours * 60 + minutes;
};
var getAvailabilityByDateFromDB = async (tutorId, date) => {
  if (!date) throw new Error("Date is required");
  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) throw new Error("Invalid date format");
  const weekMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const weekday = weekMap[selectedDate.getUTCDay()];
  const availabilities = await prisma.availability.findMany({
    where: { tutorId, dayOfWeek: weekday }
  });
  if (!availabilities.length) return [];
  const startOfDay = new Date(selectedDate);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setUTCHours(23, 59, 59, 999);
  const bookings = await prisma.booking.findMany({
    where: {
      tutorId,
      status: { not: Booked_Status.cancelled },
      startTime: { gte: startOfDay, lte: endOfDay }
    }
  });
  const result = availabilities.map((slot) => {
    const startTimeStr = normalizeTime2(slot.startTime);
    const endTimeStr = normalizeTime2(slot.endTime);
    const slotStart = parseTimeToMinutes(slot.startTime);
    const slotEnd = parseTimeToMinutes(slot.endTime);
    const isBooked = bookings.some((booking) => {
      const bookingStart = toMinutes(booking.startTime);
      const bookingEnd = toMinutes(booking.endTime);
      return bookingStart < slotEnd && bookingEnd > slotStart;
    });
    const startDateTime = /* @__PURE__ */ new Date(`${date}T${startTimeStr}:00.000Z`);
    const endDateTime = /* @__PURE__ */ new Date(`${date}T${endTimeStr}:00.000Z`);
    return {
      id: slot.id,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      available: !isBooked
    };
  });
  return result;
};
var availabilityService = {
  getAvailabilityByDateFromDB
};

// src/modules/availability/available.controller.ts
var getAvailabilityByDate = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { date } = req.query;
    const result = await availabilityService.getAvailabilityByDateFromDB(
      tutorId,
      date
    );
    res.status(200).json({
      success: true,
      message: "Availability retrieved successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve availability"
    });
  }
};
var availabilityController = {
  getAvailabilityByDate
};

// src/modules/availability/available.router.ts
var router6 = Router3();
router6.get("/:tutorId", availabilityController.getAvailabilityByDate);
var availableRouter = router6;

// src/lib/app.ts
var app = express6();
app.use(globalErrorHandler_default);
app.use(express6.json());
app.use(cors(
  {
    origin: process.env.APP_URL || "http://localhost:5000",
    credentials: true
  }
));
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/tutors", createTutor2);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", userReview);
app.use("/api/admin/users", adminRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/availability", availableRouter);
app.get("/", (req, res) => {
  res.send("Ronaldo is the goat");
});
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 3e3;
var main = async () => {
  try {
    await prisma.$connect();
    console.log("connected to database successfully");
    app_default.listen(PORT, () => {
      console.log(`Server is running on ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("An error occurred", error);
    prisma.$disconnect();
    process.exit(1);
  }
};
main();
