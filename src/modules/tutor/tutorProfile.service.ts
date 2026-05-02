/**
 * Tutor Profile Service
 * Business logic for tutor profile operations
 */

import { prisma } from "@/lib/prisma";
import type { TutorProfile, Prisma } from "@prisma/client";
import type {
  Step1Data,
  Step2Data,
  Step3Data,
  ProfileDraft,
} from "../../../client/src/types/tutor-profile";

export class TutorProfileService {
  /**
   * Get tutor profile with all related data
   */
  static async getTutorProfile(userId: string) {
    return prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
        tutorSubjects: {
          include: { category: true },
        },
        availabilities: true,
        bookings: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
          },
        },
        Student: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  /**
   * Create new tutor profile
   */
  static async createTutorProfile(
    userId: string,
    data: {
      headline: string;
      bio_long: string;
      intro_video_url?: string;
      avatar_url?: string;
      experience_years: number;
      languages: Array<{ lang: string; level: string }>;
      education: Array<{
        degree: string;
        field: string;
        school: string;
        year?: number;
        verified: boolean;
      }>;
      hourlyRate: number;
      subjects: number[];
      availability: Array<{
        dayOfWeek: string;
        startTime: string;
        endTime: string;
      }>;
      badges?: string[];
      payoutMethod?: string;
    }
  ) {
    return prisma.tutorProfile.create({
      data: {
        userId,
        headline: data.headline,
        bio: data.headline, // Use headline as short bio
        bio_long: data.bio_long,
        intro_video_url: data.intro_video_url,
        avatar_url: data.avatar_url,
        experience_years: data.experience_years,
        languages: JSON.stringify(data.languages),
        education: JSON.stringify(data.education),
        badges: data.badges || [],
        hourlyRate: data.hourlyRate,
        experience: data.experience_years,
        studentId: userId, // Legacy field
        is_published: false,
        tutorSubjects: {
          create: data.subjects.map((categoryId) => ({
            categoryId,
          })),
        },
        availabilities: {
          create: data.availability.map((slot) => ({
            dayOfWeek: slot.dayOfWeek as Prisma.Week,
            startTime: slot.startTime,
            endTime: slot.endTime,
          })),
        },
      },
      include: {
        tutorSubjects: { include: { category: true } },
        availabilities: true,
      },
    });
  }

  /**
   * Update tutor profile
   */
  static async updateTutorProfile(
    userId: string,
    data: Partial<{
      headline: string;
      bio_long: string;
      intro_video_url: string;
      avatar_url: string;
      experience_years: number;
      languages: Array<{ lang: string; level: string }>;
      education: Array<{
        degree: string;
        field: string;
        school: string;
        year?: number;
        verified: boolean;
      }>;
      hourlyRate: number;
      badges: string[];
      subjects: number[];
      availability: Array<{
        dayOfWeek: string;
        startTime: string;
        endTime: string;
      }>;
      payoutMethod: string;
      is_published: boolean;
    }>
  ) {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error("Tutor profile not found");
    }

    // Handle subject updates
    if (data.subjects) {
      await prisma.tutorSubjects.deleteMany({
        where: { tutorId: profile.id },
      });
    }

    // Handle availability updates
    if (data.availability) {
      await prisma.availability.deleteMany({
        where: { tutorId: profile.id },
      });
    }

    return prisma.tutorProfile.update({
      where: { userId },
      data: {
        headline: data.headline,
        bio_long: data.bio_long,
        intro_video_url: data.intro_video_url,
        avatar_url: data.avatar_url,
        experience_years: data.experience_years,
        languages: data.languages ? JSON.stringify(data.languages) : undefined,
        education: data.education ? JSON.stringify(data.education) : undefined,
        hourlyRate: data.hourlyRate,
        badges: data.badges,
        is_published: data.is_published,
        tutorSubjects: data.subjects ? {
          create: data.subjects.map((categoryId) => ({
            categoryId,
          })),
        } : undefined,
        availabilities: data.availability ? {
          create: data.availability.map((slot) => ({
            dayOfWeek: slot.dayOfWeek as Prisma.Week,
            startTime: slot.startTime,
            endTime: slot.endTime,
          })),
        } : undefined,
      },
      include: {
        tutorSubjects: { include: { category: true } },
        availabilities: true,
      },
    });
  }

  /**
   * Publish tutor profile
   */
  static async publishTutorProfile(userId: string) {
    const profile = await this.getTutorProfile(userId);

    if (!profile) {
      throw new Error("Tutor profile not found");
    }

    if (!this.validateProfileCompletion(profile)) {
      throw new Error("Profile is not complete. Please fill all required fields.");
    }

    return prisma.tutorProfile.update({
      where: { userId },
      data: { is_published: true },
    });
  }

  /**
   * Save profile draft
   */
  static async saveDraft(userId: string, draft: ProfileDraft) {
    return prisma.tutorProfile.update({
      where: { userId },
      data: {
        profile_draft: JSON.stringify(draft),
      },
    });
  }

  /**
   * Get profile draft
   */
  static async getDraft(userId: string) {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { profile_draft: true },
    });

    if (!profile?.profile_draft) {
      return null;
    }

    return JSON.parse(profile.profile_draft as string) as ProfileDraft;
  }

  /**
   * Search published tutors
   */
  static async searchTutors(
    filters: {
      categoryId?: number;
      minRate?: number;
      maxRate?: number;
      minExperience?: number;
      languages?: string[];
      page?: number;
      limit?: number;
    } = {}
  ) {
    const {
      categoryId,
      minRate,
      maxRate,
      minExperience,
      page = 1,
      limit = 10,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.TutorProfileWhereInput = {
      is_published: true,
      ...(categoryId && {
        tutorSubjects: {
          some: { categoryId },
        },
      }),
      ...(minRate && { hourlyRate: { gte: minRate } }),
      ...(maxRate && { hourlyRate: { lte: maxRate } }),
      ...(minExperience && { experience_years: { gte: minExperience } }),
    };

    const [tutors, total] = await Promise.all([
      prisma.tutorProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          tutorSubjects: { include: { category: true } },
          Student: {
            select: { name: true, image: true },
          },
          bookings: {
            where: { status: "completed" },
            select: { reviews: true },
          },
        },
      }),
      prisma.tutorProfile.count({ where }),
    ]);

    return {
      tutors: tutors.map((tutor) => ({
        ...tutor,
        languages: tutor.languages
          ? JSON.parse(tutor.languages as string)
          : [],
        education: tutor.education
          ? JSON.parse(tutor.education as string)
          : [],
        avgRating:
          tutor.bookings.reduce(
            (sum, booking) =>
              sum +
              booking.reviews.reduce(
                (revSum, rev) => revSum + Number(rev.rating),
                0
              ) /
                (booking.reviews.length || 1),
            0
          ) / (tutor.bookings.length || 1),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get tutor availability for a specific date
   */
  static async getTutorAvailability(tutorId: string, date: Date) {
    const dayOfWeek = [
      "sun",
      "mon",
      "tue",
      "wed",
      "thu",
      "fri",
      "sat",
    ][date.getDay()] as Prisma.Week;

    return prisma.availability.findMany({
      where: {
        Tutor: { id: tutorId },
        dayOfWeek,
      },
    });
  }

  /**
   * Validate profile completion
   */
  static validateProfileCompletion(
    profile: Partial<TutorProfile> & {
      tutorSubjects?: any[];
      availabilities?: any[];
    }
  ): boolean {
    const requiredFields = [
      "headline",
      "bio_long",
      "experience_years",
      "hourlyRate",
      "avatar_url",
    ];

    for (const field of requiredFields) {
      const value = profile[field as keyof TutorProfile];
      if (!value) return false;
    }

    // Check if has languages, education, subjects, and availability
    if (
      !profile.languages ||
      !profile.education ||
      !profile.tutorSubjects?.length ||
      !profile.availabilities?.length
    ) {
      return false;
    }

    return true;
  }

  /**
   * Calculate tutor statistics
   */
  static async getTutorStats(userId: string) {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
        bookings: {
          include: {
            reviews: true,
          },
        },
      },
    });

    if (!profile) {
      throw new Error("Tutor profile not found");
    }

    const completedBookings = profile.bookings.filter(
      (b) => b.status === "completed"
    );
    const totalReviews = completedBookings.reduce(
      (sum, b) => sum + b.reviews.length,
      0
    );
    const avgRating =
      totalReviews > 0
        ? completedBookings.reduce(
            (sum, b) =>
              sum +
              b.reviews.reduce((revSum, rev) => revSum + Number(rev.rating), 0),
            0
          ) / totalReviews
        : 0;

    return {
      totalStudents: new Set(profile.bookings.map((b) => b.studentId)).size,
      totalBookings: profile.bookings.length,
      completedBookings: completedBookings.length,
      totalReviews,
      avgRating: avgRating.toFixed(2),
      hourlyRate: profile.hourlyRate,
      experience: profile.experience_years,
      isProfessional: profile.is_published,
    };
  }
}
