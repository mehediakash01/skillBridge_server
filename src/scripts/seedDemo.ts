import { prisma } from "../lib/prisma.js";
import { UserRole } from "../middlewares/authMiddleware.js";
import bcrypt from "bcryptjs";

// Hash password with bcrypt (matches better-auth credential provider)
const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const seedDemo = async () => {
  try {
    console.log("****Demo accounts seeding started****");

    const demoAccounts = [
      {
        name: "Demo Student",
        email: "student@demo.com",
        password: "Demo@12345",
        role: UserRole.STUDENT,
      },
      {
        name: "Demo Tutor",
        email: "tutor@demo.com",
        password: "Demo@12345",
        role: UserRole.TUTOR,
      },
    ];

    for (const account of demoAccounts) {
      console.log(`\n****Processing ${account.role}: ${account.email}****`);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: account.email },
      });

      if (existingUser) {
        console.log(`User ${account.email} already exists. Checking credentials...`);
        
        // Check if credential exists
        const existingCredential = await prisma.account.findFirst({
          where: { 
            userId: existingUser.id,
            providerId: "credential",
          },
        });

        if (existingCredential) {
          console.log(`Credential already exists for ${account.email}. Skipping...`);
          continue;
        }
      }

      try {
        // Create user if not exists
        let newUser = existingUser;
        if (!newUser) {
          newUser = await prisma.user.create({
            data: {
              id: `user_${account.email.split("@")[0]}_demo`,
              name: account.name,
              email: account.email,
              role: account.role,
              emailVerified: true,
              updatedAt: new Date(),
            },
          });

          console.log(
            `****${account.role} demo account created and verified****`
          );
          console.log(`User ID: ${newUser.id}`);
        }

        // Hash password for credential
        const hashedPassword = await hashPassword(account.password);

        // Create Account record for credential authentication (matches better-auth credential provider)
        try {
          const credential = await prisma.account.create({
            data: {
              id: `credential_${newUser.id}`,
              accountId: newUser.email,
              userId: newUser.id,
              providerId: "credential",
              password: hashedPassword,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          console.log(`Credential created for ${account.email} (ID: ${credential.id})`);
        } catch (credentialErr: any) {
          if (credentialErr.code === 'P2002') {
            console.log(`Credential already exists for ${account.email}`);
          } else {
            console.error(`Error creating credential:`, credentialErr.message);
          }
        }

        // If tutor, create a complete tutor profile
        if (account.role === UserRole.TUTOR) {
          const existingProfile = await prisma.tutorProfile.findUnique({
            where: { studentId: newUser.id },
          });

          if (!existingProfile) {
            const tutorProfile = await prisma.tutorProfile.create({
              data: {
                studentId: newUser.id,
                headline: "Experienced Demo Tutor | 5+ Years | All Subjects",
                bio: "Welcome! I'm a demo tutor here to help you test the platform. I'm experienced in teaching and ready to help with any subject.",
                bio_long: "As a professional demo tutor, I specialize in making complex topics easy to understand. My teaching methodology focuses on interactive sessions, real-world applications, and personalized learning paths. I'm passionate about helping students achieve their goals.",
                badges: ["Verified", "Fast Responder"],
                experience_years: 5,
                languages: [
                  { lang: "English", level: "Native" },
                  { lang: "Spanish", level: "Fluent" },
                ],
                education: [
                  {
                    degree: "B.S.",
                    field: "Computer Science",
                    school: "Demo University",
                    year: 2019,
                    verified: true,
                  },
                ],
                id_verified: true,
                hourlyRate: 25,
                averageRate: 4.9,
                experience: 5,
                is_published: true,
                availabilities: {
                  create: [
                    {
                      dayOfWeek: "mon",
                      startTime: "09:00",
                      endTime: "17:00",
                    },
                    {
                      dayOfWeek: "tue",
                      startTime: "09:00",
                      endTime: "17:00",
                    },
                    {
                      dayOfWeek: "wed",
                      startTime: "09:00",
                      endTime: "17:00",
                    },
                    {
                      dayOfWeek: "thu",
                      startTime: "09:00",
                      endTime: "17:00",
                    },
                    {
                      dayOfWeek: "fri",
                      startTime: "09:00",
                      endTime: "17:00",
                    },
                    {
                      dayOfWeek: "sat",
                      startTime: "10:00",
                      endTime: "16:00",
                    },
                  ],
                },
              },
            });

            console.log("****Tutor profile created with full details and availabilities****");
            console.log("Tutor Profile ID:", tutorProfile.id);
          } else {
            console.log("Tutor profile already exists, skipping creation");
          }
        }
      } catch (accountErr) {
        console.error(`Error creating account for ${account.email}:`, accountErr);
      }
    }

    console.log("\n****Demo accounts seeding completed successfully****");
  } catch (err) {
    console.error("Error seeding demo accounts:", err);
    throw err;
  }
};

// Run the seed
seedDemo()
  .then(() => {
    console.log("Seed completed. Exiting...");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
