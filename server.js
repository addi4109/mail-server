const express = require("express");
const sgMail = require("@sendgrid/mail");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.send("Mail Server is Running");
});

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send Email API (non-blocking)
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

    // Build the email
    const msg = {
        to: email,
        from: process.env.FROM_EMAIL, // e.g., "noreply@yourdomain.com" or your verified sender
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
    };

    // Send in the background (non-blocking)
    try {
        await sgMail.send(msg);
        console.log(`✅ Email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error.response?.body || error.message);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
