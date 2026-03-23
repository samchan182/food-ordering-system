# Food Ordering System

A full-stack food ordering web app built with **Node.js + Express + PostgreSQL**. Customers browse a menu, add items to a cart, log in with Google, and place orders. The backend serves a REST API with session-based authentication and an auth-protected checkout flow.

---

## What Problem It Solves

Small restaurants typically rely on manual order-taking (paper, phone, or WhatsApp), which is slow and error-prone. This system replaces that with a self-serve web interface where:

- Customers browse the full menu, build a cart, and place orders themselves
- Orders are authenticated — only logged-in users can check out
- The backend is structured for future kitchen printer integration (Epson TM-U220) so orders print directly to the kitchen on placement
- The architecture is ready to add order persistence, payment processing, and inventory management as next steps

---

## What's Currently Built

| Feature | Status |
|---|---|
| Menu display from PostgreSQL | Done |
| Add to cart, calculate total | Done |
| Google OAuth2 login / logout | Done |
| Session management (Passport) | Done |
| Auth-protected checkout route | Done |
| Frontend SPA (vanilla JS + Tailwind) | Done |
| Order persistence to database | Placeholder — returns mock order ID |
| Epson kitchen printer integration | Placeholder — not yet connected |
| Payment processing | Not yet implemented |
| Inventory management | Not yet implemented |

---

## Framework & Modules

### Backend

| Package | Role |
|---|---|
| `express` | Web framework — handles routing, middleware, JSON responses |
| `passport` | Authentication middleware — manages login strategy and session |
| `passport-google-oauth20` | Google OAuth2 strategy — handles the full Google login flow |
| `express-session` | Session storage — keeps users logged in between requests |
| `pg` | PostgreSQL client — connects to the database and runs queries |
| `dotenv` | Loads environment variables from `.env` (API keys, secrets) |
| `morgan` | HTTP request logger — logs every incoming request to console |
| `https-proxy-agent` | Routes outbound HTTPS through a local proxy (required for China network environments) |

### Frontend

| Technology | Role |
|---|---|
| Vanilla JavaScript | Frontend logic — auth check, menu fetch, cart state, checkout |
| Tailwind CSS (CDN) | Styling — no build step required |
| Fetch API | Calls backend REST endpoints from the browser |

---

## Project Structure

```
food-ordering-system/
├── server.js                  # App entry point — middleware, routes, session setup
├── db.js                      # PostgreSQL connection pool
├── routes/
│   ├── auth.js                # GET /auth/google, /auth/google/callback, /auth/logout, /auth/me
│   ├── menu.js                # GET /api/menu
│   └── checkout.js            # POST /api/checkout (auth-protected)
├── controllers/
│   ├── menuController.js      # Calls menuModel, returns JSON
│   └── checkoutController.js  # Calls orderModel, returns orderId
├── models/
│   ├── menuModel.js           # SELECT all rows from menu_items table
│   └── orderModel.js          # Placeholder — createOrder() returns mock ID
├── middleware/
│   └── requireAuth.js         # Blocks unauthenticated requests with 401
├── config/
│   └── passport.js            # Google OAuth2 strategy configuration
├── public/
│   ├── index.html             # Single-page frontend with login + menu + cart views
│   └── app.js                 # Frontend JS — auth check, menu render, cart logic
├── docs/
│   └── google-oauth.md        # Detailed OAuth2 flow explanation
├── .env                       # API keys and secrets (gitignored)
└── package.json
```

---

## API Endpoints

| Method | Path | Auth Required | Description |
|---|---|---|---|
| GET | `/auth/google` | No | Redirect to Google login |
| GET | `/auth/google/callback` | No | Google OAuth callback |
| GET | `/auth/logout` | No | Destroy session, redirect home |
| GET | `/auth/me` | No | Returns current user info or `{ loggedIn: false }` |
| GET | `/api/menu` | No | Returns all menu items from database |
| POST | `/api/checkout` | Yes | Place an order |

---

## Database

PostgreSQL running locally. The app connects via `pg` Pool with credentials set in `db.js`.

Current schema:

```sql
-- Menu items table (in use)
menu_items (id, name, description, price, category)

-- Orders table (not yet implemented)
-- Planned: orders, order_items
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL running locally with a database named `food-ordering-db`
- A Google Cloud project with OAuth2 credentials

### Install

```bash
npm install
```

### Configure environment

Create a `.env` file in the project root:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=any-random-string
```

### Run

```bash
node server.js
```

Open `http://localhost:3000` in your browser.

---

## Physical Kitchen Printer Setup

**Hardware:** Epson TM-U220 series (Ethernet / local network connection)

**Driver:** Download from the [official Epson support page](https://support.epson.net/setupnavi/?LG2=EN&OSC=MI&PINF=menu&MKN=TM-U220&GROUP=). Select your OS carefully before downloading. Reference: [hardware manual](https://download4.epson.biz/sec_pubs/bs/pdf/TM-U220_std_trg_en_revI.pdf).

**Critical — printer naming:** When installing the driver, set the printer name to exactly:

```
EPSON_TM_U220
```

If you use a different name, update the `PRINTER_NAME` constant in the backend config, otherwise the `lp` command will not find the printer.

---

## Usage for Mainland China Users

Google OAuth requires outbound HTTPS access to Google's servers, which is blocked in mainland China. Use a US or Japan VPN and set your terminal proxy before starting the server.

**Step 1:** Connect your VPN (US or Japan server)

**Step 2:** Export proxy settings in your terminal:

```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
```

**Step 3:** Start the server in the same terminal session:

```bash
node server.js
```

The proxy is also handled programmatically in `server.js` via `https-proxy-agent` — it reads the `HTTPS_PROXY` environment variable and routes outbound OAuth requests through it automatically.
