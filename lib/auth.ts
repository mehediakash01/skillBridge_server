import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  },
});

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
    requireEmailVerification:true,
    autoSignIn:false
  }, 
    socialProviders: {
        google: { 
          prompt:"select_account consent",
          accessType:"offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
  emailVerification:{
    sendOnSignUp:true,
    autoSignInAfterVerification:true,
    sendVerificationEmail:async({user,url,token,}, request)=> {
        
 try{
           const verificationUrl=`${process.env.APP_URL}/verify-email?token=${token}`
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
                Thanks for signing up for <strong> Skill Bridge</strong> 🎉  
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
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; font-size:14px;">
                <a href="${verificationUrl}" style="color:#4f46e5;">
                  ${verificationUrl}
                </a>
              </p>

              <p style="color:#9ca3af; font-size:13px; margin-top:32px;">
                If you didn’t create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:16px; text-align:center; font-size:12px; color:#9ca3af;">
              © ${new Date().getFullYear()}  Skill Bridge. All rights reserved.
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

 }
 catch(err){
    console.log("mail submission failed",err);
    throw err

 }

 
        
    },
  }
 
});