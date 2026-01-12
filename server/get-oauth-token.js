/**
 * Simple script to get OAuth 2.0 refresh token for Office 365
 * 
 * Usage:
 * 1. Fill in CLIENT_ID and CLIENT_SECRET below (from Azure Portal)
 * 2. Run: node server/get-oauth-token.js
 * 3. Open the URL in your browser
 * 4. Sign in and authorize
 * 5. Copy the code from the redirect URL
 * 6. Paste it here when prompted
 * 7. You'll get a refresh token to add to your .env file
 */

const readline = require('readline');
const https = require('https');

// ============================================
// STEP 1: Load from .env file (DO NOT hardcode secrets!)
// ============================================
require('dotenv').config();

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = process.env.OAUTH_REDIRECT_URI || 'https://landmarkenergy.co.uk/oauth-callback.html';
const TENANT_ID = process.env.OAUTH_TENANT_ID || 'landmarkenergy.co.uk';

// ============================================
// STEP 2: Run this script
// ============================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n🔐 Office 365 OAuth 2.0 Token Generator\n');
  
  // Check if credentials are set
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.log('❌ ERROR: Please set OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET in your .env file!');
    console.log('   Add these to .env:');
    console.log('   OAUTH_CLIENT_ID=your-client-id');
    console.log('   OAUTH_CLIENT_SECRET=your-client-secret');
    console.log('   OAUTH_TENANT_ID=your-tenant-id (optional, defaults to domain)');
    rl.close();
    return;
  }

  // Step 1: Generate authorization URL
  const authUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_mode=query&` +
    `scope=${encodeURIComponent('https://graph.microsoft.com/Mail.Send offline_access')}`;

  console.log('📋 Step 1: Open this URL in your browser:');
  console.log('\n' + authUrl + '\n');
  console.log('📋 Step 2: Sign in with your Office 365 account');
  console.log('📋 Step 3: Authorize the app');
  console.log('📋 Step 4: After redirect, copy the "code" parameter from the URL');
  console.log('   Example: http://localhost/?code=0.ABC123...\n');

  const authCode = await question('Paste the code here: ');

  // Step 2: Exchange code for tokens
  console.log('\n🔄 Exchanging code for tokens...\n');

  const tokenData = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: authCode.trim(),
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
    scope: 'https://graph.microsoft.com/Mail.Send offline_access'
  });

  const options = {
    hostname: 'login.microsoftonline.com',
    path: `/${TENANT_ID}/oauth2/v2.0/token`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': tokenData.toString().length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const tokens = JSON.parse(data);

          if (tokens.error) {
            console.error('❌ Error:', tokens.error_description || tokens.error);
            reject(new Error(tokens.error));
            return;
          }

          console.log('✅ Success! Here are your tokens:\n');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('Add these to your .env file:\n');
          console.log(`OAUTH_CLIENT_ID=${CLIENT_ID}`);
          console.log(`OAUTH_CLIENT_SECRET=${CLIENT_SECRET}`);
          console.log(`OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
          console.log(`OAUTH_USER_EMAIL=your-email@landmarkenergy.co.uk`);
          console.log(`EMAIL_FROM="Landmark Energy Website <your-email@landmarkenergy.co.uk>"`);
          console.log(`CONTACT_EMAIL=elliot@landmarkenergy.co.uk`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          console.log('⚠️  IMPORTANT: Keep your refresh token secret!');
          console.log('   The access token expires, but refresh token is long-lived.\n');

          resolve(tokens);
        } catch (error) {
          console.error('❌ Error parsing response:', error);
          console.error('Response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });

    req.write(tokenData.toString());
    req.end();
  });
}

main()
  .then(() => {
    rl.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error.message);
    rl.close();
    process.exit(1);
  });
