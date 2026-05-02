var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/app.ts
import { toNodeHandler } from "better-auth/node";
import express7 from "express";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TutorProfile {\n  id               String          @id @default(uuid())\n  headline         String? // Professional hook (e.g., "Senior Software Engineer @ TechCorp | 5yrs Teaching Next.js")\n  bio              String? // Short bio\n  bio_long         String? // Rich text - detailed teaching methodology\n  intro_video_url  String? // Link to 30-second YouTube/Vimeo introduction\n  badges           String[]        @default([]) // ["Verified", "Fast Responder", "Top 1%"]\n  experience_years Int? // Quantifiable professional background\n  languages        Json? // Array of objects: [{ lang: "English", level: "Native" }]\n  education        Json? // Array: [{ degree: "B.S.", field: "Computer Science", school: "MIT", year: 2020, verified: true }]\n  avatar_url       String? // High-resolution avatar\n  id_verified      Boolean         @default(false) // Verification status for ID documents\n  hourlyRate       Decimal\n  averageRate      Decimal         @default(0.00)\n  experience       Int\n  profile_draft    Json? // Draft data for unsaved changes\n  is_published     Boolean         @default(false) // Publish status for profile\n  studentId        String          @unique // Legacy field - can be deprecated\n  createdAt        DateTime        @default(now()) @db.Timestamp(6)\n  updatedAt        DateTime        @default(now()) @updatedAt @db.Timestamp(6)\n  availabilities   Availability[]\n  bookings         Booking[]\n  Student          User            @relation(fields: [studentId], references: [id])\n  tutorSubjects    TutorSubjects[]\n\n  @@index([hourlyRate])\n  @@index([averageRate])\n  @@index([is_published])\n  @@index([id_verified])\n}\n\nmodel Booking {\n  id          String        @id @default(uuid())\n  studentId   String\n  tutorId     String\n  totalPrice  Decimal\n  startTime   DateTime\n  endTime     DateTime\n  meetingLink String?\n  status      Booked_Status @default(pending)\n  Student     User          @relation(fields: [studentId], references: [id])\n  Tutor       TutorProfile  @relation(fields: [tutorId], references: [id])\n  reviews     Reviews[]\n\n  @@index([totalPrice])\n}\n\nmodel Availability {\n  id        String       @id @default(uuid())\n  tutorId   String\n  dayOfWeek Week\n  startTime String\n  endTime   String\n  Tutor     TutorProfile @relation(fields: [tutorId], references: [id])\n\n  @@unique([tutorId, dayOfWeek, startTime, endTime])\n  @@index([dayOfWeek, startTime, endTime])\n}\n\nmodel Category {\n  id            Int             @id @default(autoincrement())\n  categoryName  String\n  description   String?\n  icon          String?\n  isTrending    Boolean         @default(false)\n  learnerCount  Int             @default(0)\n  startingPrice Decimal?\n  tags          String[]        @default([])\n  tutorSubjects TutorSubjects[]\n}\n\nmodel TutorSubjects {\n  tutorId    String\n  categoryId Int\n  category   Category     @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  Tutor      TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n\n  @@id([tutorId, categoryId])\n}\n\nmodel Reviews {\n  id        String  @id @default(uuid())\n  comment   String\n  bookingId String\n  rating    Decimal @default(0.00)\n  booking   Booking @relation(fields: [bookingId], references: [id])\n\n  @@index([rating])\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime\n  User                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime\n  ipAddress String?\n  userAgent String?\n  userId    String\n  User      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n}\n\nmodel User {\n  id            String        @id\n  name          String\n  email         String        @unique\n  password      String?\n  role          Role?         @default(STUDENT)\n  isBanned      Boolean?      @default(false)\n  emailVerified Boolean       @default(false)\n  image         String?\n  createdAt     DateTime      @default(now())\n  updatedAt     DateTime\n  Account       Account[]\n  bookings      Booking[]\n  Session       Session[]\n  tutorProfile  TutorProfile?\n\n  @@index([name])\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime\n\n  @@index([identifier])\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum Booked_Status {\n  pending\n  confirmed\n  completed\n  cancelled\n}\n\nenum Week {\n  sat\n  sun\n  mon\n  tue\n  wed\n  thu\n  fri\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"headline","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"bio_long","kind":"scalar","type":"String"},{"name":"intro_video_url","kind":"scalar","type":"String"},{"name":"badges","kind":"scalar","type":"String"},{"name":"experience_years","kind":"scalar","type":"Int"},{"name":"languages","kind":"scalar","type":"Json"},{"name":"education","kind":"scalar","type":"Json"},{"name":"avatar_url","kind":"scalar","type":"String"},{"name":"id_verified","kind":"scalar","type":"Boolean"},{"name":"hourlyRate","kind":"scalar","type":"Decimal"},{"name":"averageRate","kind":"scalar","type":"Decimal"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"profile_draft","kind":"scalar","type":"Json"},{"name":"is_published","kind":"scalar","type":"Boolean"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"availabilities","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"Student","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"tutorSubjects","kind":"object","type":"TutorSubjects","relationName":"TutorProfileToTutorSubjects"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"totalPrice","kind":"scalar","type":"Decimal"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"meetingLink","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"Booked_Status"},{"name":"Student","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"Tutor","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"BookingToReviews"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"dayOfWeek","kind":"enum","type":"Week"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"Tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"categoryName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"isTrending","kind":"scalar","type":"Boolean"},{"name":"learnerCount","kind":"scalar","type":"Int"},{"name":"startingPrice","kind":"scalar","type":"Decimal"},{"name":"tags","kind":"scalar","type":"String"},{"name":"tutorSubjects","kind":"object","type":"TutorSubjects","relationName":"CategoryToTutorSubjects"}],"dbName":null},"TutorSubjects":{"fields":[{"name":"tutorId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"Int"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorSubjects"},{"name":"Tutor","kind":"object","type":"TutorProfile","relationName":"TutorProfileToTutorSubjects"}],"dbName":null},"Reviews":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Decimal"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReviews"}],"dbName":null},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"User","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"User","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"Account","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToUser"},{"name":"Session","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"}],"dbName":null},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewsScalarFieldEnum: () => ReviewsScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  TutorSubjectsScalarFieldEnum: () => TutorSubjectsScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  TutorProfile: "TutorProfile",
  Booking: "Booking",
  Availability: "Availability",
  Category: "Category",
  TutorSubjects: "TutorSubjects",
  Reviews: "Reviews",
  Account: "Account",
  Session: "Session",
  User: "User",
  Verification: "Verification"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var TutorProfileScalarFieldEnum = {
  id: "id",
  headline: "headline",
  bio: "bio",
  bio_long: "bio_long",
  intro_video_url: "intro_video_url",
  badges: "badges",
  experience_years: "experience_years",
  languages: "languages",
  education: "education",
  avatar_url: "avatar_url",
  id_verified: "id_verified",
  hourlyRate: "hourlyRate",
  averageRate: "averageRate",
  experience: "experience",
  profile_draft: "profile_draft",
  is_published: "is_published",
  studentId: "studentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorId: "tutorId",
  totalPrice: "totalPrice",
  startTime: "startTime",
  endTime: "endTime",
  meetingLink: "meetingLink",
  status: "status"
};
var AvailabilityScalarFieldEnum = {
  id: "id",
  tutorId: "tutorId",
  dayOfWeek: "dayOfWeek",
  startTime: "startTime",
  endTime: "endTime"
};
var CategoryScalarFieldEnum = {
  id: "id",
  categoryName: "categoryName",
  description: "description",
  icon: "icon",
  isTrending: "isTrending",
  learnerCount: "learnerCount",
  startingPrice: "startingPrice",
  tags: "tags"
};
var TutorSubjectsScalarFieldEnum = {
  tutorId: "tutorId",
  categoryId: "categoryId"
};
var ReviewsScalarFieldEnum = {
  id: "id",
  comment: "comment",
  bookingId: "bookingId",
  rating: "rating"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  role: "role",
  isBanned: "isBanned",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Booked_Status = {
  pending: "pending",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
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
  baseURL: process.env.BETTER_AUTH_URL || "https://skill-bridge-server-tau.vercel.app",
  trustedOrigins: [
    process.env.APP_URL,
    process.env.BETTER_AUTH_URL,
    "https://skill-bridge-client-sage.vercel.app",
    "https://skill-bridge-client-ex6c.vercel.app",
    "http://localhost:3000",
    "http://localhost:5000"
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: false
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none"
    }
  },
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
    autoSignIn: false,
    sendResetPassword: async (payload, request) => {
      const { user, token } = payload;
      const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
      try {
        const info = await transporter.sendMail({
          from: '"SkillBridge" <skill@bridge.com>',
          to: `${user.email}`,
          subject: "Reset your SkillBridge password",
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; padding:24px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">Skill Bridge</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin-top:0; color:#111827;">Reset your password</h2>

              <p style="color:#4b5563; font-size:16px; line-height:1.6;">
                We received a request to reset the password for your <strong>SkillBridge</strong> account.
                Click the button below to choose a new password.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:32px 0;">
                <a
                  href="${resetUrl}"
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
                  Reset Password
                </a>
              </div>

              <p style="color:#6b7280; font-size:14px; line-height:1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; font-size:14px;">
                <a href="${resetUrl}" style="color:#4f46e5;">${resetUrl}</a>
              </p>

              <p style="color:#9ca3af; font-size:13px; margin-top:32px;">
                This link will expire in <strong>1 hour</strong>. If you didn't request a password reset,
                you can safely ignore this email \u2014 your password will not be changed.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:16px; text-align:center; font-size:12px; color:#9ca3af;">
              \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Skill Bridge. All rights reserved.
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
        console.log("Password reset email sent:", info.messageId);
      } catch (err) {
        console.log("Password reset email failed", err);
        throw err;
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectURI: "https://skill-bridge-server-tau.vercel.app/api/auth/callback/google"
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
var LEGACY_TUTOR_PROFILE_SELECT = {
  id: true,
  bio: true,
  hourlyRate: true,
  averageRate: true,
  experience: true,
  studentId: true,
  createdAt: true,
  updatedAt: true,
  Student: {
    select: {
      id: true,
      name: true,
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
};
var SAFE_SORT_FIELDS = /* @__PURE__ */ new Set([
  "createdAt",
  "updatedAt",
  "hourlyRate",
  "averageRate",
  "experience"
]);
var resolveSafeSortBy = (sortBy) => {
  if (typeof sortBy !== "string") return "createdAt";
  return SAFE_SORT_FIELDS.has(sortBy) ? sortBy : "createdAt";
};
var resolveSafeSortOrder = (sortOrder) => {
  if (sortOrder === "asc" || sortOrder === "desc") {
    return sortOrder;
  }
  return "desc";
};
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
    select: LEGACY_TUTOR_PROFILE_SELECT
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
  const safeSortBy = resolveSafeSortBy(sortBy);
  const safeSortOrder = resolveSafeSortOrder(sortOrder);
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
    select: {
      id: true,
      bio: true,
      hourlyRate: true,
      averageRate: true,
      experience: true,
      studentId: true,
      createdAt: true,
      updatedAt: true,
      Student: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      tutorSubjects: {
        include: {
          category: true
        }
      }
    },
    skip,
    take: Number(limit),
    orderBy: {
      [safeSortBy]: safeSortOrder
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
    select: LEGACY_TUTOR_PROFILE_SELECT
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
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id }
      });
      if (!dbUser) {
        return res.status(401).json({
          success: false,
          message: "user not found"
        });
      }
      const isEmailVerified = Boolean(dbUser.emailVerified || session.user.emailVerified);
      if (!isEmailVerified) {
        return res.status(403).json({
          success: false,
          message: "email verification required. Please verify your email"
        });
      }
      const userRole = (dbUser.role || "STUDENT").toUpperCase();
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: userRole,
        emailVerified: isEmailVerified
      };
      if (roles.length > 0 && !roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "forbidden! you don't have permissions to access this resource"
        });
      }
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
var createCategory = async (payload) => {
  const startingPrice = payload.startingPrice !== void 0 && payload.startingPrice !== null ? new prismaNamespace_exports.Decimal(payload.startingPrice) : void 0;
  return prisma.category.create({
    data: {
      categoryName: payload.categoryName,
      description: payload.description,
      icon: payload.icon,
      isTrending: payload.isTrending,
      learnerCount: payload.learnerCount,
      startingPrice,
      tags: payload.tags ?? []
    }
  });
};
var updateCategory = async (id, payload) => {
  const startingPrice = payload.startingPrice !== void 0 && payload.startingPrice !== null ? new prismaNamespace_exports.Decimal(payload.startingPrice) : void 0;
  return prisma.category.update({
    where: { id },
    data: {
      ...payload.categoryName !== void 0 ? { categoryName: payload.categoryName } : {},
      ...payload.description !== void 0 ? { description: payload.description } : {},
      ...payload.icon !== void 0 ? { icon: payload.icon } : {},
      ...payload.isTrending !== void 0 ? { isTrending: payload.isTrending } : {},
      ...payload.learnerCount !== void 0 ? { learnerCount: payload.learnerCount } : {},
      ...startingPrice !== void 0 ? { startingPrice } : {},
      ...payload.tags !== void 0 ? { tags: payload.tags } : {}
    }
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
  updateCategory,
  getAllCategories,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  const { categoryName, description, icon, isTrending, learnerCount, startingPrice, tags } = req.body;
  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required" });
  }
  const category = await categoryService.createCategory({
    categoryName,
    description,
    icon,
    isTrending,
    learnerCount: learnerCount !== void 0 ? Number(learnerCount) : void 0,
    startingPrice,
    tags: Array.isArray(tags) ? tags : typeof tags === "string" && tags.trim() ? tags.split(",").map((tag) => tag.trim()).filter(Boolean) : void 0
  });
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category
  });
};
var updateCategory2 = async (req, res) => {
  const id = Number(req.params.id);
  const { categoryName, description, icon, isTrending, learnerCount, startingPrice, tags } = req.body;
  const category = await categoryService.updateCategory(id, {
    categoryName,
    description,
    icon,
    isTrending,
    learnerCount: learnerCount !== void 0 ? Number(learnerCount) : void 0,
    startingPrice,
    tags: Array.isArray(tags) ? tags : typeof tags === "string" && tags.trim() ? tags.split(",").map((tag) => tag.trim()).filter(Boolean) : void 0
  });
  res.status(200).json({
    success: true,
    message: "Category updated successfully",
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
  updateCategory: updateCategory2,
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
router5.patch(
  "/:id",
  authMiddleware_default("ADMIN" /* ADMIN */),
  categoryController.updateCategory
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
router6.get("/:tutorId/availability", availabilityController.getAvailabilityByDate);
var availableRouter = router6;

// src/modules/user/user.router.ts
import express6 from "express";
var router7 = express6.Router();
router7.patch(
  "/role",
  authMiddleware_default(),
  catchAsync_default(async (req, res) => {
    const userId = req.user.id;
    const { role } = req.body;
    if (!role || !["STUDENT", "TUTOR", "ADMIN"].includes(role)) {
      return sendResponse_default(res, {
        statusCode: 400,
        success: false,
        message: "Invalid role provided",
        data: null
      });
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "User role updated successfully",
      data: updatedUser
    });
  })
);
router7.get(
  "/me",
  authMiddleware_default(),
  catchAsync_default(async (req, res) => {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true
      }
    });
    if (!user) {
      return sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
        data: null
      });
    }
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully",
      data: user
    });
  })
);
var userRouter = router7;

// src/lib/app.ts
var app = express7();
app.use(express7.json());
var allowedOrigins = [
  process.env.APP_URL,
  "https://skill-bridge-client-sage.vercel.app",
  "https://skill-bridge-client-ex6c.vercel.app",
  "http://localhost:3000",
  "http://localhost:5000"
].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true
}));
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/users", userRouter);
app.use("/api/tutors", createTutor2);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", userReview);
app.use("/api/admin/users", adminRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/availability", availableRouter);
app.get("/", (req, res) => {
  res.send("Ronaldo is the goat");
});
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
var server_default = app_default;
var PORT = process.env.PORT || 5e3;
var main = async () => {
  try {
    await prisma.$connect();
    console.log("connected to database successfully");
    app_default.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("An error occurred", error);
    prisma.$disconnect();
    process.exit(1);
  }
};
if (process.env.VERCEL !== "1") {
  main();
}
export {
  server_default as default
};
