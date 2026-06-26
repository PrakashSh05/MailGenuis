# 🐙 GitHub Repository Setup Guide

This document provides recommendations for setting up the public GitHub repository for the AI Email Generator portfolio project.

---

## 1. Repository Details

- **Repository Name**: `ai-email-generator`
- **Description**: 🤖 Full-stack AI Email Generator — Generate, refine, and manage professional emails with Google Gemini AI. Built with Spring Boot 3, React 18, and PostgreSQL.
- **Topics/Tags**: `java`, `spring-boot`, `react`, `postgresql`, `gemini-api`, `ai-tools`, `docker`, `tailwindcss`, `jwt`, `portfolio-project`

---

## 2. `.gitignore` Configuration

Place this `.gitignore` at the root of your repository to ensure build artifacts and secrets are never committed.

```gitignore
# ==============================
# Environment Variables
# ==============================
.env
.env.local
.env.*.local

# ==============================
# Node.js / React (Frontend)
# ==============================
frontend/node_modules/
frontend/dist/
frontend/dist-ssr/
frontend/.eslintcache
frontend/coverage/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# ==============================
# Java / Maven (Backend)
# ==============================
backend/target/
backend/pom.xml.tag
backend/pom.xml.releaseBackup
backend/pom.xml.versionsBackup
backend/pom.xml.next
backend/release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar

# ==============================
# IDEs and Editors
# ==============================
.idea/
*.iws
*.iml
*.ipr
.vscode/
*.swp
*.swo

# ==============================
# OS Generated Files
# ==============================
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

---

## 3. Versioning Strategy & Releases

Use **Semantic Versioning** (SemVer) for repository tags: `v<MAJOR>.<MINOR>.<PATCH>`.

### Recommended Release Naming Convention
When cutting a release in GitHub, use the following format:

**Release Title**: `v1.0.0 — Initial Release`
**Release Description**:
```markdown
### ✨ Features
- AI Email Generation powered by Google Gemini 1.5
- Custom AI Actions (Improve, Shorten, Translate)
- Email History and Search
- Prompt Library and Custom Templates
- Full JWT Authentication
- Dark Mode Support
- Render and Vercel deployment configurations

### 📦 Assets
- Source code (zip/tar.gz)
```

---

## 4. Branching Strategy (Optional)

If demonstrating team workflows to interviewers, use a simplified Git Flow:
- `main` — Production-ready code (deployed to Render/Vercel)
- `develop` — Active development branch
- `feature/*` — E.g., `feature/oauth-integration`
- `fix/*` — E.g., `fix/jwt-expiration-bug`
