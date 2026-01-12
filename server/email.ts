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

  // Option 2: Office 365 with Microsoft Graph API (recommended - works when SMTP is disabled)
  // This will be handled separately in sendContactEmail function

  // Option 3: SMTP with password (fallback)
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

  // Option 4: Console log (for development without email setup)
  console.warn('⚠️  No email configuration found. Emails will be logged to console.');
  return {
    sendMail: async (options: any) => {
      console.log('📧 Email would be sent:', options);
      return { messageId: 'console-log' };
    },
  };
};

// Get access token using refresh token
const getAccessToken = async (): Promise<string> => {
  const https = require('https');
  const querystring = require('querystring');
  
  return new Promise((resolve, reject) => {
    // Use the same scope that was used to obtain the refresh token
    // The refresh token must be used with the same scope it was issued with
    const scope = 'https://graph.microsoft.com/Mail.Send offline_access';
    
    const postData = querystring.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      refresh_token: process.env.OAUTH_REFRESH_TOKEN,
      grant_type: 'refresh_token',
      scope: scope,
    });

    // For single-tenant apps, we MUST use the actual tenant GUID
    // Get it from: Azure Portal → Azure Active Directory → Overview → Tenant ID
    let tenantId = process.env.OAUTH_TENANT_ID;
    
    if (!tenantId) {
      reject(new Error('OAUTH_TENANT_ID is required in .env file. Get it from Azure Portal → Azure AD → Overview → Tenant ID'));
      return;
    }
    
    // Don't use 'common' for single-tenant apps - it will fail
    if (tenantId === 'common' || tenantId === 'landmarkenergy.co.uk') {
      reject(new Error('OAUTH_TENANT_ID must be the actual Tenant ID (GUID), not "common" or domain name. Get it from Azure Portal → Azure AD → Overview'));
      return;
    }
    
    const options = {
      hostname: 'login.microsoftonline.com',
      path: `/${tenantId}/oauth2/v2.0/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res: any) => {
      let data = '';
      res.on('data', (chunk: any) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const tokens = JSON.parse(data);
          if (tokens.error) {
            // If we get an error with 'common', try with the domain
            if (tenantId === 'common' && tokens.error === 'invalid_request') {
              console.log('⚠️  Retrying with tenant-specific endpoint...');
              // Retry logic would go here, but for now just reject
              reject(new Error(`${tokens.error}: ${tokens.error_description || tokens.error}`));
            } else {
              reject(new Error(`${tokens.error}: ${tokens.error_description || tokens.error}`));
            }
          } else {
            resolve(tokens.access_token);
          }
        } catch (error) {
          console.error('Error parsing token response:', data);
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

// Send email using Microsoft Graph API
const sendEmailViaGraph = async (data: ContactFormData, accessToken: string) => {
  const https = require('https');
  
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

  const htmlBody = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    <p><strong>Farm Size:</strong> ${data.farmSize ? `${data.farmSize} hectares` : 'Not provided'}</p>
    <p><strong>Location:</strong> ${data.location || 'Not provided'}</p>
    <hr>
    <h3>Message:</h3>
    <p>${data.message.replace(/\n/g, '<br>')}</p>
  `;

  const fromEmail = process.env.OAUTH_USER_EMAIL || process.env.EMAIL_FROM || 'elliot@landmarkenergy.co.uk';
  const toEmail = process.env.CONTACT_EMAIL || 'elliot@landmarkenergy.co.uk';

  const message = {
    message: {
      subject: `New Contact Form Submission - ${data.name}`,
      body: {
        contentType: 'HTML',
        content: htmlBody,
      },
      toRecipients: [
        {
          emailAddress: {
            address: toEmail,
          },
        },
      ],
      replyTo: [
        {
          emailAddress: {
            address: data.email,
            name: data.name,
          },
        },
      ],
    },
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(message);
    const options = {
      hostname: 'graph.microsoft.com',
      path: '/v1.0/me/sendMail',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
    };

    const req = https.request(options, (res: any) => {
      let data = '';
      res.on('data', (chunk: any) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 202) {
          resolve({ messageId: 'graph-api', response: 'Email sent via Microsoft Graph API' });
        } else {
          try {
            const error = JSON.parse(data);
            reject(new Error(error.error?.message || `Graph API error: ${res.statusCode}`));
          } catch {
            reject(new Error(`Graph API error: ${res.statusCode} - ${data}`));
          }
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

export const sendContactEmail = async (data: ContactFormData) => {
  // Try Microsoft Graph API first (for Office 365 when SMTP is disabled)
  if (process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET && process.env.OAUTH_REFRESH_TOKEN) {
    try {
      console.log('📧 Using Microsoft Graph API to send email...');
      const accessToken = await getAccessToken();
      const info = await sendEmailViaGraph(data, accessToken);
      console.log('✅ Email sent successfully via Microsoft Graph API');
      return info;
    } catch (error) {
      console.error('❌ Error sending email via Graph API:', error);
      // Fall through to try other methods
    }
  }

  // Fallback to other methods (Gmail, SMTP, etc.)
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
