# food-ordering-system

## functionality ready to add

## Core service upgrades
API layer – Install Django REST Framework + djangorestframework‑simplejwt; expose /orders/, /inventory/, /payments/ with JWT auth.
GeeksforGeeks

Async jobs – Wire Celery with Redis; move e‑mail receipts, low‑stock alerts, nightly sales CSV to tasks.
Real Python

Realtime kitchen screen – Switch project to ASGI and add Django Channels; stream new orders via WebSocket.
Codez Up

Inventory webhooks – Create a /stripe/webhook/ endpoint; process invoice.paid to adjust stock atomically.
blog.theodo.com

Metrics & tracing – Add django-prometheus, scrape with Prometheus, visualise in Grafana dashboards.
hodovi.cc

# Container & local stack
Docker‑Compose – Define separate web, postgres, redis, celery, nginx services; volume map static files.
React and Django Tutorial
TestDriven.io

Environment parity – Follow a production‑ready compose template (health‑checks, Gunicorn, named volumes).
DEV Community

# CI/CD pipeline
GitHub Actions – Run pytest, build Docker image, push to Amazon ECR on every main push.
AWS Documentation
Everything DevOps

# AWS deployment (cloud badge)
Provision – Create ECR repo, ECS Fargate cluster + ALB (or use Elastic Beanstalk Docker platform for a quicker path).
AWS Documentation
FreeCodeCamp

Deploy – Actions job updates task definition and triggers a rolling deploy.
GitHub

Monitor – Forward Prometheus metrics to AWS Managed Grafana or self‑host in the cluster.
hodovi.cc

# Polishing touches
Seed demo data, write a README with docker compose up one‑liner.
GitHub

Document AWS costs + architecture diagram for recruiters.

# Web Dev
The Backend **Node + Express** framework, to decide which data to sent to browser. 
<br>
1. Entry point. Often ```server.js``` or ```app.js```, to set up Express, routes, and mmiddleware. 
2. Node does not understand how to read the user input data, so let Express to decide to use which **Routes** 

We can build the middleware from scratch, or use the NPM library as external package. 
