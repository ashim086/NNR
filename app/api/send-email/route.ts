import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface BookingData {
    fromAddress: string;
    toAddress: string;
    moveDate: string;
    phone: string;
    email: string;
    houseSize: string;
    queries: string;
}

export async function POST(request: NextRequest) {
    try {
        const data: BookingData = await request.json();

        // Create transporter using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD, // Use App Password for Gmail
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: "magarashim69086@gmail.com",
            subject: `New Booking Request - ${data.houseSize} from ${data.email}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
                        🚚 New Removal Booking Request
                    </h2>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #555;">Customer Details</h3>
                        <p><strong>📧 Email:</strong> ${data.email}</p>
                        <p><strong>📞 Phone:</strong> ${data.phone}</p>
                    </div>
                    
                    <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #555;">Moving Details</h3>
                        <p><strong>📍 From:</strong> ${data.fromAddress}</p>
                        <p><strong>📍 To:</strong> ${data.toAddress}</p>
                        <p><strong>📅 Move Date:</strong> ${data.moveDate}</p>
                        <p><strong>🏠 Property Size:</strong> ${data.houseSize}</p>
                    </div>
                    
                    ${data.queries && data.queries !== "No additional queries" ? `
                    <div style="background: #fff9e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #555;">Additional Notes</h3>
                        <p>${data.queries}</p>
                    </div>
                    ` : ""}
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px;">
                        <p>This email was sent from Namaste Nepal Removals booking form.</p>
                    </div>
                </div>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error("Email sending error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send email" },
            { status: 500 }
        );
    }
}
