import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from 'nodemailer'
import { verifyEmailTemplate } from "../utils/EmailTemplate/emailTemplate";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_NAME,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    trustedOrigins: [process.env.APP_URL!],

    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },

    emailVerification: {
        sendOnSignUp : true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verficationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
                const info = await transporter.sendMail({
                    from: '"Blog App by Prisma" <naeeim@gmail.com>',
                    to: user.email,
                    subject: "Please Verify your email",
                    html: verifyEmailTemplate(verficationUrl, user.name) 
                });

                console.log("Message sent:", info.messageId);
            } catch (error: any) {
                console.error("Error sending verification email:", error);
                throw new Error("Could not send verification email");
            }
        }, 
        autoSignInAfterVerification : true
    }, 

    socialProviders: {
        google: { 
            prompt : "select_account consent",
            accessType : "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    }
});