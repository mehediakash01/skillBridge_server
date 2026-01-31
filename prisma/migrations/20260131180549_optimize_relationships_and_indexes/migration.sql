-- DropIndex
DROP INDEX "TutorSubjects_tutorId_key";

-- AlterTable
ALTER TABLE "TutorSubjects" ADD CONSTRAINT "TutorSubjects_pkey" PRIMARY KEY ("tutorId", "categoryId");

-- CreateIndex
CREATE INDEX "Availability_dayOfWeek_startTime_endTime_idx" ON "Availability"("dayOfWeek", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Booking_totalPrice_idx" ON "Booking"("totalPrice");

-- CreateIndex
CREATE INDEX "Reviews_rating_idx" ON "Reviews"("rating");

-- CreateIndex
CREATE INDEX "TutorProfile_hourlyRate_idx" ON "TutorProfile"("hourlyRate");

-- CreateIndex
CREATE INDEX "TutorProfile_averageRate_idx" ON "TutorProfile"("averageRate");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");
