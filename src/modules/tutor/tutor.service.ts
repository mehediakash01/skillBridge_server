import { Week } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
// create or update tutor profile
const createOrUpdateUser = async (userId:string,

   payload: {
    bio: string;
    hourlyRate: number;
    experience: number;
  }
)=>{

    return prisma.tutorProfile.upsert({
        where:{
            studentId:userId
        },
        update:{
            
            bio:payload.bio,
            hourlyRate:payload.hourlyRate,
            experience:payload.experience
        },
        create:{
            studentId:userId,
            bio:payload.bio,
            hourlyRate:payload.hourlyRate,
            experience:payload.experience
        }
    })



}
// getting tutors profile by id
const getTutorProfileById = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id: id,   
    },
    include: {
      Student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      tutorSubjects: {
        include: {
          category: true,
        },
      },
      availabilities: true,
      bookings: true,
    },
  })

  if (!tutor) return null

  return {
    ...tutor,
    hourlyRate: Number(tutor.hourlyRate),
    averageRate: Number(tutor.averageRate),
  }
}


// denoted tutor availability input types
type AvailabilitySlotInput = {
  dayOfWeek: Week;
  startTime: string;
  endTime: string;
};
// convert time to minute
const timeToMinutes = (time: string): number => {
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

// validating overlap logic
const hasOverlap = (slots: AvailabilitySlotInput[]) => {
  const sorted = slots
    .map(s => ({
      ...s,
      start: timeToMinutes(s.startTime),
      end: timeToMinutes(s.endTime),
    }))
    .sort((a, b) => a.start - b.start);

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i]!.end > sorted[i + 1]!.start) {
      return true;
    }
  }
  return false;
};

// update tutor availability
const updateTutorAvailability = async(tutorUserId:string, slots:AvailabilitySlotInput[])=>{
     if (!Array.isArray(slots) || slots.length === 0) {
    throw new Error( "Availability slots are required");
  }
    const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { studentId: tutorUserId },
  });

  if (!tutorProfile) {
    throw new Error( "Create tutor profile first");
  }

  for (const slot of slots) {
    if (timeToMinutes(slot.startTime) >= timeToMinutes(slot.endTime)) {
      throw new Error(
     
        `Invalid time range on ${slot.dayOfWeek}`
      );
    }
  }

// group by day
  const grouped: Record<string, AvailabilitySlotInput[]> = {};
  for (const slot of slots) {
    if (!grouped[slot.dayOfWeek]) {
      grouped[slot.dayOfWeek] = [];
    }
    grouped[slot.dayOfWeek]!.push(slot);
  }
// checking overlap
    for (const day in grouped) {
    if (hasOverlap(grouped[day]!)) {
      throw new Error(
        
        `Overlapping availability detected on ${day}`
      );
    }
  }


   //  availability (transaction-safe)
  await prisma.$transaction([
    prisma.availability.deleteMany({
      where: { tutorId: tutorProfile.id },
    }),
    prisma.availability.createMany({
      data: slots.map(slot => ({
        tutorId: tutorProfile.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: new Date(`1970-01-01T${slot.startTime}:00Z`),
        endTime: new Date(`1970-01-01T${slot.endTime}:00Z`),
      })),
    }),
  ]);

  return grouped;

}

// getting all tutor data 
const getAllTutors = async (query: any) => {
  const {
    page = 1,
    limit = 10,
    minRate,
    maxRate,
    experience,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query

  const skip = (Number(page) - 1) * Number(limit)

  const where: any = {}

  if (experience) {
    where.experience = Number(experience)
  }

  if (minRate || maxRate) {
    where.hourlyRate = {
      gte: minRate ? Number(minRate) : undefined,
      lte: maxRate ? Number(maxRate) : undefined,
    }
  }

  const result = await prisma.tutorProfile.findMany({
    where,
    include: {
      Student: true,
    },
    skip,
    take: Number(limit),
    orderBy: {
      [sortBy]: sortOrder,
    },
  })

  const total = await prisma.tutorProfile.count({ where })

  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
    },
    data: result,
  }
}


// getting  tutor details by id
const getTutorByID = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id: id,   
    },
    include: {
      Student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      tutorSubjects: {
        include: {
          category: true,
        },
      },
      availabilities: true,
      bookings: true,
    },
  })

  if (!tutor) return null

  return {
    ...tutor,
    hourlyRate: Number(tutor.hourlyRate),
    averageRate: Number(tutor.averageRate),
  }
}


// get tutors own availability
export const getTutorAvailability = async (tutorUserId: string) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorUserId },
  });

  if (!tutorProfile) {
    throw new Error( "Tutor profile not found");
  }

  const availability = await prisma.availability.findMany({
    where: { tutorId: tutorProfile.id },
    orderBy: { startTime: "asc" },
  });

  const grouped: Record<string, { startTime: string; endTime: string }[]> = {};

  availability.forEach(slot => {
    const day = slot.dayOfWeek;
    if (!grouped[day]) grouped[day] = [];

    grouped[day].push({
      startTime: slot.startTime.toISOString().slice(11, 16),
      endTime: slot.endTime.toISOString().slice(11, 16),
    });
  });

  return grouped;
};


export const tutorService = {
    createOrUpdateUser,
    getTutorProfileById,
    updateTutorAvailability,
    getTutorAvailability,
    getAllTutors,
    getTutorByID
}