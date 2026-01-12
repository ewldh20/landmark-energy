# Landmark Energy Website

A modern React + TypeScript website for Landmark Energy - a UK company that helps farms monetise off-cycle crops for renewable fuel production and RTFC (Renewable Transport Fuel Certificates).

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Backend**: Node.js + Express + TypeScript
- **Email**: Nodemailer (configurable for Gmail, SMTP, etc.)

## Features

- Clean, modern design optimized for farmers and land managers
- Clear explanation of services without being too technical
- Responsive design for mobile, tablet, and desktop
- Contact form with email functionality
- Smooth scrolling navigation
- Type-safe codebase with TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- An email account for sending contact form emails (Gmail or SMTP)

### Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and configure your email settings. You have two options:

   **Option 1: Gmail (for development)**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-app-password
   EMAIL_FROM="Landmark Energy Website <your-email@gmail.com>"
   CONTACT_EMAIL=elliot@landmarkenergy.co.uk
   ```
   
   > **Note**: For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

   **Option 2: SMTP (for production)**
   ```env
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@example.com
   SMTP_PASSWORD=your-password
   EMAIL_FROM="Landmark Energy Website <your-email@example.com>"
   CONTACT_EMAIL=elliot@landmarkenergy.co.uk
   ```

4. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend on `http://localhost:4050` (Vite dev server)
   - Backend on `http://localhost:4051` (Express API)

   The frontend is automatically proxied to the backend API.

### Development Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend (port 4050)
- `npm run dev:server` - Start only the backend (port 4051)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
landmark-energy/
├── src/
│   ├── components/       # React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Benefits.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── App.tsx          # Main app component
│   ├── App.css          # Component styles
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── server/
│   ├── index.ts         # Express server
│   └── email.ts         # Email sending logic
├── index.html           # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## Email Configuration

### Gmail Setup (Development)

1. Enable 2-Factor Authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use that password in your `.env` file as `EMAIL_APP_PASSWORD`

### Production Email Services

For production, consider using:
- **SendGrid** - Free tier: 100 emails/day
- **Mailgun** - Free tier: 5,000 emails/month
- **AWS SES** - Very cheap, pay per email
- **Postmark** - Great deliverability

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Deploy Options

1. **Vercel** (Recommended for frontend)
   - Connect your GitHub repo
   - Vercel will auto-detect Vite and deploy
   - Add backend as a serverless function or deploy separately

2. **Netlify**
   - Similar to Vercel, great for static sites
   - Can use Netlify Functions for the API

3. **Traditional Hosting**
   - Upload `dist/` folder to your web server
   - Deploy backend separately (Node.js hosting like Railway, Render, or your own server)

4. **Full Stack Hosting**
   - **Railway** - Easy deployment for both frontend and backend
   - **Render** - Free tier available
   - **Heroku** - Paid, but reliable

## Customization

### Colors

Edit CSS variables in `src/index.css`:

```css
:root {
    --primary-color: #2d5016;      /* Main brand color */
    --primary-dark: #1f350f;       /* Darker shade */
    --accent-color: #6ba83a;        /* Accent/highlight color */
}
```

### Content

All content is in the React components in `src/components/`. Edit the text directly in the component files.

## Troubleshooting

### Email not sending?

1. Check your `.env` file is configured correctly
2. For Gmail, make sure you're using an App Password, not your regular password
3. Check server logs for error messages
4. Test with a simple SMTP service first

### Port 4050 already in use?

Edit `vite.config.ts` to use a different port, or kill the process using port 4050.

### TypeScript errors?

Run `npm run type-check` to see detailed error messages.

## License

All rights reserved - Landmark Energy 2024

## Contact

For questions about the website, email: elliot@landmarkenergy.co.uk
