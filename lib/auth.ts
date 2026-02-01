import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";




export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
     user: {
        additionalFields: {
            role: {
                type: "string", 
                required: false,
                defaultValue: "STUDENT",
            },
            isBanned: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
        },
    },
    emailAndPassword: { 
    enabled: true, 
  }, 
 
});