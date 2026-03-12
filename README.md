# Food Delivery / Order Management Web App

It's a end-to-end online ordering system (menu → cart → checkout → order) built with **Node.js + Express + PostgreSQL** featuring:
- **Payment webhooks**
- **OAuth2 login**
- **Event-driven inventory/order updates via Redis + queue workers**
- **Dockerized AWS deployment** 
- **WeChat Mini-Program ordering interface (a lightweight application embedded within Tencent’s widely used 'super-app' ecosystem)**

## Physcial Order Printer Set up 
**Hardware model :** Epson TM-U220 series printer 

**Connection :**: Ethernet / local network

**Install the hareware driver :**
- We use <a href="https://support.epson.net/setupnavi/?LG2=EN&OSC=MI&PINF=menu&MKN=TM-U220&GROUP=">official Epson's driver </a> to give signal to printer to print the paper order to kitchen, <a href="https://download4.epson.biz/sec_pubs/bs/pdf/TM-U220_std_trg_en_revI.pdf">manual instruction guide </a> is for handling phscial hardware
- Be careful for your choice of Operating System (OS) when you download your driver
- **CRITICAL STEP - Naming:** In the "Name:" field, you **must** name the printer exactly as follows:
   `EPSON_TM_U220`
   *(Note: If you use a different name, you must update the `PRINTER_NAME` constant in the backend configuration file, otherwise the `lp` command will fail to find the destination).*


## Demo Features

- Customer:
  - Browse menu, add to cart, checkout, view order status
  - OAuth2 login (Google) + JWT session
  - Payment checkout (webhook-driven confirmation)
- Kitchen/Admin:
  - Order queue dashboard (new → preparing → ready → completed)
  - Inventory management (stock levels, low-stock alerts)
- Platform:
  - Event-driven updates with Redis + Worker queue to prevent overselling
  - DB migrations + seed data
  - Structured logging, health checks, tests, CI-ready
  - Containerized (Docker Compose) + production deployment notes (AWS)

---

## Architecture (High Level)

**Services**
- `api` (Express): REST APIs, auth, checkout, webhooks
- `db` (PostgreSQL): persistent store
- `redis`: event bus + queue backend
- `worker`: background jobs (inventory reservation, webhook processing, reconciliation)
- (optional) `web` (React/Next.js): UI

**Event Flow**
1. User places an order → API writes `orders` + `order_items`
2. API publishes event `order.created`
3. Worker reserves inventory (atomic) and updates status
4. Payment provider sends webhook → API verifies signature → publishes `payment.succeeded`
5. Worker confirms order and transitions state

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Queue / Cache**: Redis + BullMQ (or equivalent)
- **Auth**: OAuth2 (Google) + JWT
- **Payments**: Stripe webhook pattern (or equivalent)
- **Migrations**: Prisma / Knex (choose one and keep consistent)
- **Tests**: Jest + Supertest (API), Playwright/Cypress (E2E optional)
- **DevOps**: Docker, Docker Compose, GitHub Actions
- **Deployment**: AWS (RDS + ECS/EC2), 99.9% uptime target

---

## Repository Structure

```txt
.
├── apps
│   ├── api                 # Express app (REST, auth, webhooks)
│   ├── worker              # Queue workers (BullMQ)
│   └── web                 # (optional) React/Next.js frontend
├── packages
│   ├── db                  # DB schema/migrations + client
│   ├── shared              # shared types, utils
│   └── config              # env validation, lint configs
├── docker                  # docker files, compose overrides
├── .github/workflows       # CI pipelines
├── docs                    # architecture, API docs, runbooks
└── README.md
