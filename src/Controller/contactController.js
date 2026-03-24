import Contact from "../models/ContactModel.js";
import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // ✅ Basic Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (message.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message is too short",
      });
    }

    // ✅ Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ===============================
    // 📩 1. Email to YOU
    // ===============================
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `📩 New message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:10px;">
            
            <h2 style="text-align:center;">📩 New Contact Message</h2>
            <hr/>

            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Message:</strong></p>
            <div style="background:#f4f4f4;padding:10px;border-radius:5px;">
              ${message}
            </div>

          </div>
        </div>
      `,
    });

    // ===============================
    // 📩 2. Auto-reply to USER
    // ===============================
    await transporter.sendMail({
      from: `"Abhinesh Bhardwaj" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thank you for contacting me 🙌",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:10px;">
            
            <h2>Hello ${name} 👋</h2>

            <p>Thank you for visiting my portfolio and reaching out.</p>

            <p>
              I appreciate your interest and will review your message shortly.
              I am a passionate MERN Stack Developer focused on building 
              responsive and user-friendly web applications.
            </p>

            <p>
              I am currently open to job opportunities and freelance projects. 
              If you're looking for a developer, I would love to connect with you.
            </p>

            <br/>

            <p><strong>Your Message:</strong></p>
            <div style="background:#f4f4f4;padding:10px;border-radius:5px;">
              ${message}
            </div>

            <br/>

            <p>Best Regards,</p>
            <p><strong>Abhinesh Bhardwaj</strong></p>
            <p>MERN Stack Developer</p>

            <hr/>
            <p style="font-size:12px;color:gray;">
              This is an automated response. I will get back to you soon.
            </p>

          </div>
        </div>
      `,
    });

    // ✅ Final Response
    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (err) {
    console.error("Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};