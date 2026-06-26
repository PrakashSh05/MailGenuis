# Vercel Deployment Guide — Frontend

This guide walks you through deploying the **AI Email Generator frontend** to [Vercel](https://vercel.com).

---

## Prerequisites

- A Vercel account (free tier works)
- A GitHub repository containing this project
- The backend already deployed (e.g., on Render)

---

## Step 1: Import Project

1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Vercel auto-detects the **Vite** framework.

---

## Step 2: Build Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm ci` |

---

## Step 3: Environment Variables

Add the following in the Vercel **Environment Variables** tab:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://<your-backend>.onrender.com` |

> **Important**: Vite injects environment variables at **build time**. Any change to `VITE_API_BASE_URL` requires a redeploy.

---

## Step 4: SPA Routing (React Router)

Create or verify the `vercel.json` file in the `frontend/` directory to handle client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures all routes (e.g., `/dashboard`, `/generate`) are served by `index.html` instead of returning 404.

---

## Step 5: Deploy

1. Click **Deploy**.
2. Vercel builds the production bundle and serves it via its global CDN.
3. Verify:
   - `https://<your-app>.vercel.app/` → Landing page
   - `https://<your-app>.vercel.app/login` → Login page (no 404)
   - `https://<your-app>.vercel.app/dashboard` → Redirects to login (protected route)

---

## Custom Domain (Optional)

1. Go to **Project Settings → Domains**.
2. Add your custom domain.
3. Vercel automatically provisions an SSL certificate.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API calls return CORS errors | Ensure the backend `CorsConfig` allows the Vercel domain |
| Routes return 404 on refresh | Verify `vercel.json` has the rewrite rule |
| `VITE_API_BASE_URL` is `undefined` | Ensure the env var is set and redeploy |
| Build fails | Check Node version compatibility (requires Node 18+) |
