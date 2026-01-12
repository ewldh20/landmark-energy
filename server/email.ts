import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  farmSize: string;
  location: string;
  message: string;
}

// Create transporter
// For development, you can use Gmail or another SMTP service
// For production, use a proper email service like SendGrid, Mailgun, etc.
const createTransporter = () => {
  // Option 1: Gmail (for development/testing)
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Use App Password, not regular password
      },
    });
  }

  // Option 2: SMTP (for production)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Option 3: Console log (for development without email setup)
  console.warn('⚠️  No email configuration found. Emails will be logged to console.');
  return {
    sendMail: async (options: any) => {
      console.log('📧 Email would be sent:', options);
      return { messageId: 'console-log' };
    },
  };
};

export const sendContactEmail = async (data: ContactFormData) => {
  const transporter = createTransporter();

  const emailBody = `
New contact form submission from Landmark Energy website

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Farm Size: ${data.farmSize ? `${data.farmSize} hectares` : 'Not provided'}
Location: ${data.location || 'Not provided'}

Message:
${data.message}
  `.trim();

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Landmark Energy Website" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL || 'elliot@landmarkenergy.co.uk',
    replyTo: data.email,
    subject: `New Contact Form Submission - ${data.name}`,
    text: emailBody,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Farm Size:</strong> ${data.farmSize ? `${data.farmSize} hectares` : 'Not provided'}</p>
      <p><strong>Location:</strong> ${data.location || 'Not provided'}</p>
      <hr>
      <h3>Message:</h3>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};
