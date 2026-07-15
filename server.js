}
});

// Send Email API – non-blocking
// Send Email API
app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and Email are required."
        });
    }
    try {

    // Respond immediately
    res.json({
        success: true,
        message: "Email queued for sending"
    });
        const { name, email, message } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and Email are required."
            });
        }

    // Send email in the background (do not await)
    try {
await transporter.sendMail({

from: `"Aditya Web Solutions" <${process.env.EMAIL}>`,

to: email,

subject: "Thank You for Contacting Aditya Web Solutions",

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

                    <p>
                        Thank you for contacting us.
                    </p>

                    <p>
                        We have successfully received your enquiry.
                    </p>

                    <p>
                        Our team will contact you shortly.
                    </p>

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
        console.log(`✅ Email sent to ${email}`);

        res.json({
            success: true,
            message: "Email Sent Successfully"
        });

} catch (err) {
        console.error(`❌ Failed to send email to ${email}:`, err);

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to send email"
        });

}

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {

console.log(`Server Running on Port ${PORT}`);

});
