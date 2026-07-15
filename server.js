const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
    res.send("Mail Server is Running");
});

// Gmail SMTP Transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// Verify connection at startup
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP connection failed:", error);
    } else {
        console.log("✅ SMTP connection successful");
    }
});

// Send Email API – non-blocking
app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and Email are required."
        });
    }

    // Respond immediately
    res.json({
        success: true,
        message: "Email queued for sending"
    });

    // Send email in the background
    try {
        const info = await transporter.sendMail({
            from: `"Aditya Web Solutions" <${process.env.EMAIL}>`,
            to: email,
            subject: "Thank You for Contacting Aditya Web Solutions",
            text: `Hello ${name},\n\nThank you for contacting us.\nWe have received your enquiry.\nOur team will contact you shortly.\n\nYour message: ${message || "No message provided."}\n\nRegards,\nAditya Web Solutions`,
            html: `
            <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden">
                <div style="background:#0d6efd;padding:20px;color:white;text-align:center">
                    <h2>Aditya Web Solutions</h2>
                </div>
                <div style="padding:25px">
                    <h3>Hello ${name}, 👋</h3>
                    <p>Thank you for contacting us.</p>
                    <p>We have successfully received your enquiry.</p>
                    <p>Our team will contact you shortly.</p>
                    <hr>
                    <h4>Your Message</h4>
                    <p>${message || "No message provided."}</p>
                    <br>
                    Regards,<br>
                    <b>Aditya Web Solutions</b>
                </div>
                <div style="background:#f5f5f5;padding:15px;text-align:center;font-size:13px">
                    © 2026 Aditya Web Solutions
                </div>
            </div>
            `
        });
        console.log(`✅ Email sent to ${email} (Message ID: ${info.messageId})`);
    } catch (err) {
        console.error(`❌ Failed to send email to ${email}:`, err);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
