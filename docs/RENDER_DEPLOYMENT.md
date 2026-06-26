# Render Deployment Guide — Backend

This guide walks you through deploying the **AI Email Generator backend** to [Render](https://render.com).

---

## Prerequisites

- A Render account (free tier works for testing)
- A GitHub repository containing this project
- A Google Gemini API key

---

## Step 1: Create a PostgreSQL Database

1. Go to **Render Dashboard → New → PostgreSQL**.
2. Set:
   - **Name**: `ai-email-db`
   - **Database**: `ai_email_db`
   - **User**: `postgres`
   - **Region**: Closest to your users
   - **Plan**: Free (or Starter for production)
3. Click **Create Database**.
4. Copy the **Internal Database URL** (starts with `postgresql://`). Convert it to JDBC format:
   ```
   jdbc:postgresql://<host>:5432/ai_email_db
   ```

---

## Step 2: Create a Web Service

1. Go to **Render Dashboard → New → Web Service**.
2. Connect your GitHub repository.
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `ai-email-backend` |
| **Region** | Same as database |
| **Root Directory** | `backend` |
| **Runtime** | Docker |
| **Instance Type** | Free (or Starter) |

---

## Step 3: Environment Variables

Add the following in the Render **Environment** tab:

| Variable | Value |
|----------|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | `jdbc:postgresql://<render-host>:5432/ai_email_db` |
| `DATABASE_USERNAME` | `postgres` |
| `DATABASE_PASSWORD` | *(from Render DB dashboard)* |
| `JWT_SECRET` | *(Base64-encoded secret, generate with `openssl rand -base64 64`)* |
| `JWT_EXPIRATION` | `86400000` |
| `GEMINI_API_KEY` | *(your Google Gemini API key)* |
| `GEMINI_MODEL` | `gemini-1.5-flash` |
| `PORT` | `8080` |

> **Note**: Render automatically sets the `PORT` env var. The `application-prod.yml` reads it via `${PORT:8080}`.

---

## Step 4: Health Check

Configure the health check in Render:

| Setting | Value |
|---------|-------|
| **Health Check Path** | `/actuator/health` |

The `/actuator/health` endpoint is exposed in `application.yml` and returns the database connection status.

---

## Step 5: Deploy

1. Click **Create Web Service**.
2. Render will build the Docker image and start the container.
3. Monitor the deploy logs for successful startup.
4. Verify:
   - `https://<your-service>.onrender.com/actuator/health` → `{"status":"UP"}`
   - `https://<your-service>.onrender.com/swagger-ui.html` → Swagger UI

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection refused | Verify `DATABASE_URL` uses the **Internal** Render DB host |
| `PORT` binding error | Ensure `application-prod.yml` has `server.port: ${PORT:8080}` |
| JWT errors | Regenerate a proper Base64 secret with at least 64 bytes |
| Build fails | Check Docker build logs for Maven dependency errors |
