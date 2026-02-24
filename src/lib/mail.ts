import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (
    email: string,
    token: string,
    name: string
) => {
    const confirmLink = `${domain}/auth/verify-email?token=${token}`;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log("\n=========================================");
        console.log("✉️ [MOCK EMAIL] Verification Link Created");
        console.log(`To: ${email}`);
        console.log(`Link: ${confirmLink}`);
        console.log("=========================================\n");
        return;
    }

    // Configure Nodemailer for Gmail Account
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"Ri88 Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email address - Ri88",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; direction: rtl; text-align: right;">
                <h2 style="color: #333; text-align: center;">مرحباً ${name}!</h2>
                <p style="color: #555; font-size: 16px;">
                    شكراً لتسجيلك في منصة بوابتك. لتفعيل حسابك والبدء في استخدام كافة الخدمات مجاناً، يرجى تأكيد بريدك الإلكتروني.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmLink}" style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        تأكيد البريد الإلكتروني
                    </a>
                </div>
                <p style="color: #777; font-size: 14px;">
                    إذا لم تقم بإنشاء حساب على منصتنا، يمكنك تجاهل هذه الرسالة في أمان.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px; text-align: center;">
                    فريق دعم منصة Ri88
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[MAIL SERVER] Verification email sent successfully to ${email}`);
    } catch (error) {
        console.error(`[MAIL ERROR] Failed to send email to ${email}`, error);
        throw new Error("Failed to send verification email");
    }
};
