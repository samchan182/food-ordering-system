# Google OAuth Login — How It Works

## Overview

This app uses Google OAuth 2.0 to authenticate users. Instead of building a custom username/password system, we delegate authentication entirely to Google. Users log in with their existing Google account, and Google tells our server who they are.

---

## The Login Flow

```
1. User clicks "Login with Google"
         |
         v
2. Browser redirects to Google's login page
   (carrying our Client ID so Google knows which app is asking)
         |
         v
3. User logs in on Google's page and grants permission
         |
         v
4. Google redirects back to our server at:
   /auth/google/callback?code=XXXX
         |
         v
5. Our server sends the code + Client Secret to Google's token endpoint
   to exchange it for the user's profile info
         |
         v
6. Google returns the user's name, email, and profile
         |
         v
7. User is now logged in — session is saved
```

---

## Key Files

| File | Role |
|---|---|
| `config/passport.js` | Configures the Google OAuth strategy with Client ID and Secret |
| `routes/auth.js` | Defines `/auth/google`, `/auth/google/callback`, `/auth/logout`, `/auth/me` |
| `middleware/requireAuth.js` | Blocks unauthenticated users from protected routes (e.g. checkout) |
| `server.js` | Sets up session and initializes Passport |
| `.env` | Stores credentials — never committed to git |

---

## Credentials Explained

These are generated when you register your app on [Google Cloud Console](https://console.cloud.google.com).

**Client ID**
A public identifier for your app. Sent to Google when the login flow starts so Google knows which application is requesting access.

**Client Secret**
A private key shared only between your server and Google. Used in step 5 above to prove the token exchange request is genuinely coming from your server.

**Authorized JavaScript Origins**
The domain your frontend runs on (e.g. `http://localhost:3000`). Prevents other websites from initiating OAuth flows using your Client ID.

**Authorized Redirect URIs**
The exact URL Google is allowed to send users back to after login. Must match `callbackURL` in `config/passport.js` exactly:
```
http://localhost:3000/auth/google/callback
```

---

## The China Problem

Google's servers are blocked in mainland China by the Great Firewall. This affects the OAuth flow at **step 5** — after Google redirects back to your app, your Node.js server needs to make an outbound HTTPS request to `oauth2.googleapis.com` to exchange the auth code for user info. This request times out because Node.js cannot reach Google's servers directly.

The error looks like this:
```
InternalOAuthError: Failed to obtain access token
oauthError: { code: 'ETIMEDOUT' }
```

Note: your **browser** can reach Google through a VPN, but your **Node.js server process** makes its own separate outbound connections that bypass the VPN tunnel by default.

---

## The Solution

Route all outbound HTTPS requests from Node.js through the VPN's local proxy.

### 1. Install the proxy agent

```bash
npm install https-proxy-agent
```

### 2. Add the proxy to `.env`

```env
HTTPS_PROXY=http://127.0.0.1:7890
```

Replace `7890` with whatever port your VPN app exposes for its HTTP proxy:

| VPN App | Default Proxy Port |
|---|---|
| Clash / ClashX | `7890` |
| V2RayU | `1087` |
| Shadowsocks | `1086` or `1080` |
| Surge | `6152` |

To verify the correct port works, run:
```bash
curl -x http://127.0.0.1:7890 https://www.google.com -I
```
You should get `HTTP/2 200` back. If it times out, try a different port.

### 3. Patch the global HTTPS agent in `server.js`

Add this at the top of `server.js`, after `import 'dotenv/config'`:

```js
import { HttpsProxyAgent } from 'https-proxy-agent';
import https from 'https';

if (process.env.HTTPS_PROXY) {
  const agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
  https.globalAgent = agent;
}
```

This patches Node's global HTTPS agent so every outbound request — including the internal ones made by Passport — goes through the proxy. The `if` check means this only activates when `HTTPS_PROXY` is set, so the code works without modification when deployed to a server outside China.

---

## Security Notes

- **Never commit `.env` to git.** It contains your Client Secret. Verify `.env` is listed in `.gitignore`.
- The Client Secret should only ever exist on your server — never in frontend code.
- `SESSION_SECRET` in `.env` should be a long random string in production.
