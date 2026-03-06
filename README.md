# Food Delivery / Order Management Web App

It's a end-to-end online ordering system (menu → cart → checkout → order tracking) built with **Node.js + Express + PostgreSQL** featuring:
- **Payment webhooks**
- **OAuth2 login**
- **Event-driven inventory/order updates via Redis + queue workers**
- **Dockerized AWS deployment** 
- **WeChat Mini-Program interface (a lightweight application embedded within Tencent’s widely used 'super-app' ecosystem)**

## Set up 
- The Physcial Printer:
  - Epson TM-U220II series printer (Dot-matrix, due to the thermal printer is largerly affected by hot surface under kitchen environment)
  - We use <a href="https://epson.com/Support/Point-of-Sale/Receipt-Printers/Epson-TM-U220II-Series/s/SPT_C31CL26A9991">official Epson's driver SDK</a> to give signal to printer to print the paper order to kitchen. 


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
