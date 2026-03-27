import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, htmlContent: string, options = {}) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent,
        attachments: options || []
    };

    return transporter.sendMail(mailOptions);
}