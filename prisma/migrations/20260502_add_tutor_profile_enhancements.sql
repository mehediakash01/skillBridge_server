/**
 * Migration: Add Tutor Profile Enhancement Fields
 * 
 * This migration adds comprehensive fields to the TutorProfile model
 * to support the new Tutor Profile Input System.
 * 
 * To run this migration:
 * npm run prisma:migrate dev -- --name add_tutor_profile_enhancements
 */

-- CreateEnum for verification status (optional)
CREATE TYPE IF NOT EXISTS "VerificationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable TutorProfile
ALTER TABLE "TutorProfile"
  ADD COLUMN "headline" VARCHAR(150),
  ADD COLUMN "bio_long" TEXT,
  ADD COLUMN "intro_video_url" VARCHAR(500),
  ADD COLUMN "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "experience_years" INTEGER,
  ADD COLUMN "languages" JSONB,
  ADD COLUMN "education" JSONB,
  ADD COLUMN "avatar_url" VARCHAR(500),
  ADD COLUMN "id_verified" BOOLEAN DEFAULT false,
  ADD COLUMN "profile_draft" JSONB,
  ADD COLUMN "is_published" BOOLEAN DEFAULT false;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_tutor_profile_published" ON "TutorProfile"("is_published");
CREATE INDEX IF NOT EXISTS "idx_tutor_profile_id_verified" ON "TutorProfile"("id_verified");
CREATE INDEX IF NOT EXISTS "idx_tutor_profile_hourly_rate" ON "TutorProfile"("hourlyRate");
CREATE INDEX IF NOT EXISTS "idx_tutor_profile_experience" ON "TutorProfile"("experience_years");

-- Add comment documentation
COMMENT ON COLUMN "TutorProfile"."headline" IS 'Professional hook/tagline (e.g., "Senior Software Engineer @ TechCorp | 5yrs Teaching Next.js")';
COMMENT ON COLUMN "TutorProfile"."bio_long" IS 'Detailed teaching methodology and approach (rich text, 50-1000 characters)';
COMMENT ON COLUMN "TutorProfile"."intro_video_url" IS 'Link to 30-second YouTube/Vimeo introduction video';
COMMENT ON COLUMN "TutorProfile"."badges" IS 'Array of achievement badges: ["Verified", "Fast Responder", "Top 1%", "Certified", "Super Tutor"]';
COMMENT ON COLUMN "TutorProfile"."experience_years" IS 'Years of professional experience in teaching field';
COMMENT ON COLUMN "TutorProfile"."languages" IS 'JSON array: [{ lang: "English", level: "Native" }, ...]';
COMMENT ON COLUMN "TutorProfile"."education" IS 'JSON array: [{ degree: "B.S.", field: "CS", school: "MIT", year: 2020, verified: true }, ...]';
COMMENT ON COLUMN "TutorProfile"."avatar_url" IS 'URL to high-resolution profile avatar (min 200x200px, recommended 400x400px)';
COMMENT ON COLUMN "TutorProfile"."id_verified" IS 'Whether tutor has verified their identity through ID documents';
COMMENT ON COLUMN "TutorProfile"."profile_draft" IS 'Auto-saved draft data for profile creation workflow';
COMMENT ON COLUMN "TutorProfile"."is_published" IS 'Whether profile is publicly visible to students';
