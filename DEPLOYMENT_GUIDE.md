# CatchClients Deployment Guide

This guide will help you deploy your CatchClients CRM application to Vercel with MongoDB Atlas and enable real authentication with Google OAuth and email functionality.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
3. A [Google Cloud Console](https://console.cloud.google.com) project for OAuth
4. A [Resend](https://resend.com) account for email functionality

---

## Step 1: Set Up MongoDB Atlas

### Create a MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a new account
3. Create a new cluster (free tier M0 is sufficient to start)
4. Choose your cloud provider and region
5. Click "Create Cluster"

### Configure Database Access

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username and generate a secure password (save this!)
5. Select "Built-in Role" → "Atlas Admin" or "Read and write to any database"
6. Click "Add User"

### Configure Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note:** For production, restrict this to your Vercel deployment IPs
4. Click "Confirm"

### Get Your Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" as the driver
4. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
5. Replace `<password>` with your actual database user password
6. Add the database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/catchclients_crm`

---

## Step 2: Set Up Google OAuth

### Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Configure OAuth Consent Screen:
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in the required fields:
     - App name: "CatchClients"
     - User support email: your email
     - Developer contact email: your email
   - Click "Save and Continue"
   - Add scopes: `email`, `profile`, `openid`
   - Click "Save and Continue"

5. Create OAuth 2.0 Client ID:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Name: "CatchClients Web"
   - Add Authorized JavaScript origins:
     - `http://localhost:3000` (for local development)
     - `https://your-vercel-domain.vercel.app` (your production URL)
   - Add Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for local)
     - `https://your-vercel-domain.vercel.app/api/auth/callback/google` (for production)
   - Click "Create"
   - **Save your Client ID and Client Secret**

---

## Step 3: Set Up Resend for Emails

### Create Resend Account

1. Go to [Resend](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Get API Key

1. In the Resend dashboard, go to "API Keys"
2. Click "Create API Key"
3. Name it "CatchClients Production"
4. Click "Create"
5. **Copy and save the API key** (you won't see it again!)

### Configure Domain (Optional but Recommended)

1. Go to "Domains" in Resend
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the DNS configuration instructions
5. Once verified, you can send emails from `noreply@yourdomain.com`

**Note:** Without a custom domain, you can still send emails but they'll come from Resend's shared domain.

---

## Step 4: Deploy to Vercel

### Connect Your Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" → "Project"
4. Import your repository
5. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `next build`
   - Output Directory: `.next`

### Add Environment Variables

Before deploying, add these environment variables in Vercel:

1. Click "Environment Variables" during setup
2. Add the following variables:

\`\`\`bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/catchclients_crm
MONGODB_DB=catchclients_crm

# NextAuth
NEXTAUTH_SECRET=<generate-a-random-secret-here>
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Resend Email
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=CatchClients <noreply@yourdomain.com>
\`\`\`

**To generate NEXTAUTH_SECRET:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

Or use this online tool: https://generate-secret.vercel.app/32

### Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

---

## Step 5: Initialize Database

### Run Database Setup Scripts

After deployment, you need to initialize your MongoDB database:

1. Clone your repository locally
2. Copy `.env.example` to `.env.local`
3. Add all your environment variables to `.env.local`
4. Run the setup script:

\`\`\`bash
npm install
npm run dev
\`\`\`

5. Visit `http://localhost:3000` and navigate to `/api/setup-db` (you may need to create this endpoint or run the scripts manually)

**Or manually create collections in MongoDB Atlas:**

1. Go to your MongoDB Atlas cluster
2. Click "Browse Collections"
3. Create the following collections:
   - `users`
   - `accounts` (for NextAuth)
   - `sessions` (for NextAuth)
   - `contacts`
   - `companies`
   - `deals`
   - `tasks`
   - `notes`
   - `activities`

---

## Step 6: Test Your Deployment

### Test Authentication

1. Visit your deployed URL
2. Click "Sign In"
3. Try "Continue with Google" - it should redirect to Google OAuth
4. After authorization, you should be redirected back to your dashboard

### Test Email Registration

1. Click "Sign Up"
2. Fill in the registration form with your email
3. Submit the form
4. Check your email for the welcome message
5. You should receive an email from Resend

### Test Password Reset

1. Go to login page
2. Click "Forgot Password"
3. Enter your email
4. Check your email for the reset link
5. Click the link and reset your password

---

## Production Checklist

Before going live, ensure:

- ✅ MongoDB Atlas IP whitelist is configured properly
- ✅ Google OAuth redirect URIs include your production domain
- ✅ NEXTAUTH_URL is set to your production domain
- ✅ NEXTAUTH_SECRET is a strong random string
- ✅ Resend domain is verified (or using default)
- ✅ All environment variables are set in Vercel
- ✅ Test authentication flow completely
- ✅ Test email sending for welcome and password reset
- ✅ Database collections are created
- ✅ Enable Vercel Analytics (optional)

---

## Troubleshooting

### Google OAuth Errors

**Error:** `redirect_uri_mismatch`
- **Solution:** Make sure your redirect URI in Google Console exactly matches: `https://your-domain.vercel.app/api/auth/callback/google`

**Error:** `access_denied`
- **Solution:** Check OAuth consent screen is published or add your email to test users

### Email Not Sending

**Error:** `Invalid API key`
- **Solution:** Double-check your RESEND_API_KEY in Vercel environment variables

**Error:** `Domain not verified`
- **Solution:** Either verify your domain in Resend or use the default sending domain

### MongoDB Connection Issues

**Error:** `MongoServerError: bad auth`
- **Solution:** Verify your MongoDB username and password in the connection string

**Error:** `Connection timeout`
- **Solution:** Check Network Access settings in MongoDB Atlas - ensure 0.0.0.0/0 is whitelisted

### NextAuth Issues

**Error:** `NEXTAUTH_URL is not defined`
- **Solution:** Add NEXTAUTH_URL to your Vercel environment variables

**Error:** `Invalid session`
- **Solution:** Ensure NEXTAUTH_SECRET is the same across all deployments

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGODB_DB` | Yes | Database name | `catchclients_crm` |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT encryption | `generated-random-string` |
| `NEXTAUTH_URL` | Yes | Your application URL | `https://app.vercel.app` |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret | `GOCSPX-xxxxx` |
| `RESEND_API_KEY` | Yes | Resend API key for emails | `re_xxxxx` |
| `EMAIL_FROM` | Yes | Sender email address | `CatchClients <noreply@domain.com>` |

---

## Support

For issues or questions:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Check the [NextAuth.js Documentation](https://next-auth.js.org)
- Check the [MongoDB Documentation](https://docs.mongodb.com)
- Contact support at your deployment platform

---

## Security Notes

1. **Never commit `.env` or `.env.local` files** to version control
2. **Rotate your secrets regularly** (especially NEXTAUTH_SECRET and API keys)
3. **Use strong passwords** for MongoDB users
4. **Restrict MongoDB IP access** to only your Vercel IPs in production
5. **Enable 2FA** on all service accounts (Google, MongoDB, Vercel, Resend)
6. **Monitor your usage** on all platforms to detect unusual activity

---

Your CatchClients CRM is now deployed and ready for production use!
