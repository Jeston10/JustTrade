import nodemailer from 'nodemailer';
import {WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";

export const transporter = process.env.NODEMAILER_EMAIL && process.env.NODEMAILER_PASSWORD
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        }
    })
    : null;

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    if (!transporter) {
        console.warn('Email transporter not configured - welcome email not sent');
        return;
    }

    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: `"JustTrade" <no-reply@justtrade.app>`,
        to: email,
        subject: `Welcome to JustTrade - your stock market toolkit is ready!`,
        text: 'Thanks for joining JustTrade',
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions);
}

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<void> => {
    if (!transporter) {
        console.warn('Email transporter not configured - news summary email not sent');
        return;
    }

    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"JustTrade News" <no-reply@justtrade.app>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from JustTrade`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};
