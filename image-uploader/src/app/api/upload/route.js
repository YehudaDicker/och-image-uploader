import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    console.log("🚀 Upload API hit");

    const formData = await req.formData();
    const file = formData.get("file");
    const userEmail = formData.get("email"); // Get user’s email

    if (!file || !userEmail) {
      console.error("❌ Missing file or email!");
      return NextResponse.json(
        { error: "File and email are required" },
        { status: 400 }
      );
    }

    console.log("📧 Email provided:", userEmail);
    console.log("📁 File received:", file.name);

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("📧 Sending email...");

    await transporter.sendMail({
      from: `"${userEmail}" <${process.env.EMAIL_USER}>`, // Show user's email in "From" field
      to: "dickeryehuda@gmail.com",
      subject: "📷 New Screenshot Uploaded",
      text: `This image was uploaded by ${userEmail}`,
      attachments: [
        {
          filename: file.name,
          content: buffer,
        },
      ],
    });

    console.log("✅ Email sent successfully!");

    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
