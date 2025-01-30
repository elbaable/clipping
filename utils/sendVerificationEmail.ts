import nodemailer from "nodemailer";

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

export const sendVerificationEmail = async (user: any) => {
  const verificationToken = generateVerificationToken(user._id); // Create a token for verification

  // Generate the verification URL
  const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;

  // Email message
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Email Verification",
    html: `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", user.email);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

// Helper function to generate verification token (using JWT or any method)
const generateVerificationToken = (userId: string) => {
  const token = Buffer.from(userId).toString("base64");
  return token;
};
