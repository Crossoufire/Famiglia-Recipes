import {z} from "zod";
import nodemailer from "nodemailer";
import {render} from "@react-email/render";
import {Options} from "nodemailer/lib/mailer";
import ErrorEmail from "~/lib/components/emails/ErrorsEmail";
import RegisterEmail from "~/lib/components/emails/RegisterEmail";
import PasswordResetEmail from "~/lib/components/emails/PasswordResetEmail";


interface EmailOptions {
    to: string;
    link: string;
    subject: string;
    username: string;
    template: "resetPassword" | "register";
}


// Password Reset and Verification Email
export const sendEmail = async (options: EmailOptions) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    let emailHtml: string;
    if (options.template === "register") {
        emailHtml = await render(RegisterEmail({ username: options.username, link: options.link }));
    }
    else {
        emailHtml = await render(PasswordResetEmail({ username: options.username, link: options.link }));
    }

    const mailOptions: Options = {
        to: options.to,
        html: emailHtml,
        subject: options.subject,
        from: process.env.MAIL_USERNAME,
    };

    await transporter.sendMail(mailOptions);
}


// Error email to Admin
export const sendAdminErrorMail = async (error: Error | z.ZodError, message: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const errorData = {
        message: message,
        stack: error.stack,
        errorName: error.name,
        errorMessage: error.message,
        timestamp: new Date().toISOString(),
    }

    const emailHtml = await render(ErrorEmail({ ctx: errorData }));

    const mailOptions: Options = {
        html: emailHtml,
        to: process.env.MAIL_USERNAME,
        from: process.env.MAIL_USERNAME,
        subject: "Famiglia-Recipes - An Error Occurred",
    };

    await transporter.sendMail(mailOptions);
}