-- AlterTable
ALTER TABLE "TutorProfile"
  ADD COLUMN IF NOT EXISTS "headline" TEXT,
  ADD COLUMN IF NOT EXISTS "bio_long" TEXT,
  ADD COLUMN IF NOT EXISTS "intro_video_url" TEXT,
  ADD COLUMN IF NOT EXISTS "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "experience_years" INTEGER,
  ADD COLUMN IF NOT EXISTS "languages" JSONB,
  ADD COLUMN IF NOT EXISTS "education" JSONB,
  ADD COLUMN IF NOT EXISTS "avatar_url" TEXT,
  ADD COLUMN IF NOT EXISTS "id_verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "profile_draft" JSONB,
  ADD COLUMN IF NOT EXISTS "is_published" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TutorProfile_is_published_idx" ON "TutorProfile"("is_published");
CREATE INDEX IF NOT EXISTS "TutorProfile_id_verified_idx" ON "TutorProfile"("id_verified");
