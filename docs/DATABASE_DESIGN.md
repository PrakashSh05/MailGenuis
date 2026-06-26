# 🗄️ Database Design

The AI Email Generator uses **PostgreSQL 16**. The schema is managed automatically by Hibernate/JPA (`ddl-auto: update` in `dev` profile), but adheres to the following structural design.

---

## 1. `users` Table

**Purpose**: Stores authentication credentials, profile information, and application settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | **PK** | Unique identifier for the user |
| `email` | `VARCHAR(255)` | **Unique**, Not Null | User's email address (login credential) |
| `password_hash` | `VARCHAR(255)` | Not Null | BCrypt hashed password |
| `full_name` | `VARCHAR(255)` | Not Null | User's display name |
| `profile_picture_url` | `VARCHAR(1024)` | Nullable | Avatar image URL |
| `role` | `VARCHAR(50)` | Not Null | Authorization role (e.g., `ROLE_USER`) |
| `default_tone` | `VARCHAR(50)` | Nullable | Enum: `PROFESSIONAL`, `CASUAL`, etc. |
| `default_language` | `VARCHAR(50)` | Nullable | Enum: `ENGLISH`, `SPANISH`, etc. |
| `default_email_length` | `VARCHAR(50)` | Nullable | Enum: `SHORT`, `MEDIUM`, `LONG` |
| `dark_mode_enabled` | `BOOLEAN` | Default `false` | Legacy dark mode toggle |
| `theme_preference` | `VARCHAR(50)` | Default `'system'`| Theme: `dark`, `light`, or `system` |
| `created_at` | `TIMESTAMP` | Auto | Account creation time |
| `updated_at` | `TIMESTAMP` | Auto | Last profile update |

**Indexes**:
- `idx_users_email` (Unique) for fast authentication lookup.

---

## 2. `emails` Table

**Purpose**: Stores a history of emails generated and saved by the user.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | **PK** | Unique identifier for the email log |
| `user_id` | `UUID` | **FK** to `users.id` | The owner of the email |
| `subject` | `VARCHAR(500)` | Not Null | AI-generated email subject |
| `body` | `TEXT` | Not Null | AI-generated email body |
| `purpose` | `VARCHAR(1000)`| Nullable | The prompt/intent provided by the user |
| `recipient` | `VARCHAR(255)` | Nullable | Intended audience |
| `tone` | `VARCHAR(50)` | Not Null | The tone used for generation |
| `language` | `VARCHAR(50)` | Not Null | The language used for generation |
| `length` | `VARCHAR(50)` | Not Null | The length constraint used |
| `model_used` | `VARCHAR(100)` | Not Null | e.g., `gemini-1.5-flash` |
| `generation_time_ms`| `INTEGER` | Default `0` | AI API latency tracking |
| `is_saved` | `BOOLEAN` | Default `false` | True if explicitly saved by user |
| `is_favorite` | `BOOLEAN` | Default `false` | True if starred by user |
| `created_at` | `TIMESTAMP` | Auto | Generation time |
| `updated_at` | `TIMESTAMP` | Auto | Last update time (e.g., toggling favorite) |

**Indexes**:
- `idx_emails_user_id` for fast history retrieval.
- `idx_emails_created_at` for chronologically sorting the dashboard/history.

---

## 3. `user_templates` Table

**Purpose**: Stores custom prompt templates created by the user (Distinct from the static `prompt-library.json` system templates).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | **PK** | Unique identifier for the template |
| `user_id` | `UUID` | **FK** to `users.id` | The owner of the template |
| `name` | `VARCHAR(255)` | Not Null | Display name of the template |
| `prompt_template` | `TEXT` | Not Null | The actual prompt structure |
| `tone` | `VARCHAR(50)` | Nullable | Specific tone attached to the template |
| `created_at` | `TIMESTAMP` | Auto | Creation time |
| `updated_at` | `TIMESTAMP` | Auto | Last edit time |

**Constraints**:
- `UNIQUE(user_id, name)`: A user cannot have two templates with the same name.

**Indexes**:
- `idx_templates_user_id` for fast template retrieval.

---

## Entity Relationships

- **User (1) to Emails (Many)**: A user can generate and save unlimited emails. Deleting a user cascades to delete all their emails.
- **User (1) to Templates (Many)**: A user can create multiple custom templates. Deleting a user cascades to delete their custom templates.
