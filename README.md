# Centro de Capacitación G&G Frontend

Frontend application for the **Centro de Capacitación G&G** platform. The system supports public course browsing, student virtual classrooms, teacher course management, and administrator operations.

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Package manager:** pnpm
- **Routing:** React Router
- **UI:** Tailwind CSS + shadcn/ui
- **Backend as a Service:** Supabase
- **Authentication:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **File storage:** Supabase Storage
- **Deployment target:** Vercel

## Main Roles

The application is organized around three business roles:

- **Student:** views courses, enrolls, accesses the virtual classroom, downloads materials and certificates.
- **Teacher:** manages assigned courses, uploads materials/recipes, publishes announcements, grades assignments, and closes courses.
- **Admin:** manages users, roles, courses, cupos, payments, reports, and platform configuration.

Supabase also has technical roles such as `anon`, `authenticated`, and `service_role`. Do not confuse those with the application roles above.

## Prerequisites

Before working on the project, install:

- Node.js LTS
- pnpm
- Git
- A Supabase account
- Optional: Docker Desktop, only if running Supabase locally

Check versions:

```bash
node -v
pnpm -v
git --version
```

If pnpm is not installed:

```bash
npm install -g pnpm
```

## Repository Setup

Clone the repository:

```bash
git clone <REPOSITORY_URL>
cd CDCGG-Frontend/centro-gg-frontend
```

Install dependencies:

```bash
pnpm install
```

Run the project:

```bash
pnpm run dev
```

The app should run at:

```txt
http://localhost:5173
```

## Environment Variables

Create a local environment file:

```bash
cp .env.example .env.local
```

If `.env.example` does not exist, create it with the following variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Then create `.env.local` and fill it with the real values from Supabase:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Important:

- Never commit `.env` or `.env.local`.
- Never use the Supabase `service_role` key in the frontend.
- The frontend must only use `VITE_SUPABASE_ANON_KEY`.

## Project Structure

This repository contains a single frontend app inside `centro-gg-frontend/`.

```txt
CDCGG-Frontend/
├── README.md                 # Root documentation (this file)
├── .gitignore                # Root gitignore rules
└── centro-gg-frontend/        # Main frontend application (Vite + React + TS)
    ├── public/                # Static assets served as-is (favicons, static svg, etc.)
    ├── src/                   # Application source code
    │   ├── assets/             # Imported assets used by the app (images, svg, etc.)
    │   ├── auth/               # Auth-related constants/helpers (e.g., role definitions)
    │   ├── components/         # Reusable UI building blocks (composition components)
    │   │   ├── nav/             # Navigation UI (header, sidebars, menus)
    │   │   ├── router/          # Routing components (router, protected routes)
    │   │   └── ui/              # Low-level UI primitives (shadcn/ui components)
    │   ├── hooks/              # Reusable React hooks
    │   ├── lib/                # Shared low-level utilities/helpers (framework-agnostic when possible)
    │   ├── pages/              # Route-level pages grouped by area/role
    │   │   ├── landing/         # Public pages (home, course browsing, course detail)
    │   │   ├── auth/            # Auth pages (login, register, redirects/callbacks)
    │   │   ├── student/         # Student area pages
    │   │   ├── teacher/         # Teacher area pages
    │   │   ├── admin/           # Admin area pages
    │   │   └── other/           # Generic pages (unauthorized, error, etc.)
    │   ├── providers/          # React Context providers / app-level state wiring
    │   │   └── auth/            # Auth provider + auth hook/types
    │   ├── services/           # External integrations and API clients (e.g., Supabase client, auth service)
    │   ├── types/              # Shared TypeScript types/interfaces used across the app
    │   └── utils/              # App utilities (e.g., query client, shared helpers)
    ├── supabase/               # Supabase project config (CLI config + migrations)
    ├── .env.example            # Example environment variables
    ├── package.json            # App scripts/dependencies (pnpm)
    ├── vite.config.ts          # Vite configuration (including path alias)
    ├── tsconfig*.json          # TypeScript configuration
    └── vercel.json             # Deployment configuration (Vercel)
```

## Important Folders

### `centro-gg-frontend/src/pages`

**Route-level pages**. Each subfolder groups pages by area/role:

- `landing/`: public browsing (home, courses, course details)
- `auth/`: login/register + OAuth redirect/callback pages
- `student/`, `teacher/`, `admin/`: private pages for each role
- `other/`: generic system pages like unauthorized and error states

Rule of thumb: if a component is tied to a URL route and represents a full screen, it belongs in `pages/`.

### `centro-gg-frontend/src/components`

**Reusable UI components** used by multiple pages.

- `ui/`: low-level primitives (shadcn/ui). Keep them presentational and generic.
- `nav/`: navigation building blocks (header, sidebars).
- `router/`: routing helpers/components (e.g., protected routes and router setup).

Rule of thumb: if it’s reused across routes and not tied to one specific page, it belongs here.

### `centro-gg-frontend/src/providers`

**Application providers** (React Context) that wire global concerns:

- auth/session state
- global wrappers (toasts, React Query provider, theme provider, etc.)

Keep provider composition in a single entry (e.g., an `AppProviders` component) so `main.tsx` stays clean.

### `centro-gg-frontend/src/services`

**Integration layer** for external services and clients:

- Supabase client initialization
- authentication service functions
- any future API wrappers

Rule of thumb: if it talks to the outside world (HTTP, Supabase, storage, auth), it belongs here—not inside pages/components.

### `centro-gg-frontend/supabase`

**Supabase configuration and migrations**.

- `config.toml`: local/CLI project configuration
- `migrations/`: SQL migrations tracked in git

This is not a separate Node app; treat it as infrastructure/config that supports the frontend.

### `centro-gg-frontend/public` vs `centro-gg-frontend/src/assets`

- `public/`: files served directly by the web server (stable URLs, no bundling)
- `src/assets/`: assets imported by the code (bundled/optimized by Vite)

## Supabase Setup

### 1. Login to Supabase

From the project root:

```bash
pnpm dlx supabase@latest login
```

### 2. Link the local project to Supabase

Get the project ref from your Supabase dashboard.

```bash
pnpm dlx supabase@latest link --project-ref YOUR_PROJECT_REF
```

### 3. Create a migration

```bash
pnpm dlx supabase@latest migration new initial_schema
```

This creates a file like:

```txt
supabase/migrations/<timestamp>_initial_schema.sql
```

Copy the schema SQL into that file.

### 4. Apply migrations to remote Supabase

```bash
pnpm dlx supabase@latest db push
```

### 5. Pull remote changes, only if needed

```bash
pnpm dlx supabase@latest db pull
```

Prefer creating migrations locally instead of manually modifying the database in the Supabase dashboard.

## Supabase CLI Notes

If the local Supabase CLI install fails with pnpm on Windows, use:

```bash
pnpm dlx supabase@latest <command>
```

Examples:

```bash
pnpm dlx supabase@latest --version
pnpm dlx supabase@latest init
pnpm dlx supabase@latest db push
```

## Supabase Auth

The project should use Supabase Auth for:

- email and password login
- Google OAuth login
- password recovery
- session handling

Google OAuth requires configuration in both:

1. Google Cloud Console
2. Supabase Dashboard > Authentication > Providers > Google

The frontend can trigger Google login with:

```ts
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

## Application Roles

Application roles are stored in the database, not decided by the login provider.

Recommended roles:

```txt
student
teacher
admin
```

New users should be created as `student` by default.

Only an administrator should assign:

- `teacher`
- `admin`

## First Admin User

After applying the initial database migration, the first admin must be assigned manually from the Supabase SQL Editor.

Get the user UUID from:

```txt
Supabase Dashboard > Authentication > Users
```

Then run:

```sql
insert into public.user_roles (user_id, role)
values ('USER_UUID_HERE', 'admin');
```

## React Router Route Plan

Recommended public routes:

```txt
/
/courses
/courses/:courseId
/login
/register
/auth/callback
/unauthorized
```

Recommended student routes:

```txt
/student
/student/courses
/student/courses/:courseId/classroom
/student/payments
/student/certificates
/student/profile
```

Recommended teacher routes:

```txt
/teacher
/teacher/courses
/teacher/courses/:courseId
/teacher/courses/:courseId/materials
/teacher/courses/:courseId/announcements
/teacher/courses/:courseId/grades
```

Recommended admin routes:

```txt
/admin
/admin/users
/admin/courses
/admin/payments
/admin/reports
```

## Path Alias

The project should use `@` as an alias for `src`.

Example import:

```ts
import { supabase } from "@/shared/lib/supabase";
```

`vite.config.ts` should include:

```ts
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Also configure `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## Common Commands

Install dependencies:

```bash
pnpm install
```

Start development server:

```bash
pnpm run dev
```

Build project:

```bash
pnpm run build
```

Preview production build:

```bash
pnpm run preview
```

Add package:

```bash
pnpm add package-name
```

Add development package:

```bash
pnpm add -D package-name
```

Remove package:

```bash
pnpm remove package-name
```

Run Supabase command:

```bash
pnpm dlx supabase@latest <command>
```

## UI Components

This project uses shadcn/ui components.

To add new components:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
```

Recommended components for this project:

```bash
pnpm dlx shadcn@latest add button input label card form select dialog sheet dropdown-menu table badge separator textarea toast tabs progress avatar alert skeleton
```

## Styling

The project uses:

- Tailwind CSS
- shadcn/ui CSS variables
- Manrope for headlines
- Inter for body text

Brand colors:

```txt
Primary:   #DD2817
Secondary: #858688
Tertiary:  #0073D1
```

## Development Workflow

Before starting work:

```bash
git pull origin main
pnpm install
pnpm run dev
```

Create a new branch:

```bash
git checkout -b feature/name-of-feature
```

Commit changes:

```bash
git add .
git commit -m "feat: describe change"
```

Push branch:

```bash
git push origin feature/name-of-feature
```

Then create a Pull Request.

## Suggested Branch Naming

```txt
feature/student-classroom
feature/google-login
feature/admin-users
feature/course-materials
fix/login-redirect
fix/supabase-policy
chore/project-setup
```

## Suggested Commit Prefixes

```txt
feat: new feature
fix: bug fix
chore: project setup or maintenance
docs: documentation changes
style: formatting or CSS-only changes
refactor: internal code improvement
test: tests
```

Examples:

```bash
git commit -m "feat: add student virtual classroom page"
git commit -m "fix: correct google auth callback route"
git commit -m "chore: add supabase initial migration"
```

## Git Ignore Rules

The following should not be committed:

```gitignore
node_modules/
dist/
.env
.env.local
.env.development.local
.env.production.local
.vercel/
coverage/
supabase/.temp/
supabase/.branches/
```

The following should be committed:

```txt
package.json
pnpm-lock.yaml
src/
public/
supabase/config.toml
supabase/migrations/
supabase/functions/
.env.example
components.json
README.md
```

## Security Rules

- Do not expose the Supabase `service_role` key in the frontend.
- Use RLS policies to protect all sensitive tables.
- Do not rely only on hidden buttons in React for authorization.
- Students should only access their own data and materials from enrolled courses.
- Teachers should only manage assigned courses.
- Admins should manage global users, courses, payments, and reports.
- Storage buckets for course materials and certificates should be private.

## Typical Feature Flow

### Student virtual classroom

1. Student logs in.
2. App loads user role.
3. Student opens `/student/courses/:courseId/classroom`.
4. Frontend requests course materials from Supabase.
5. Supabase RLS validates that the student is enrolled.
6. App displays recipes/materials, announcements, course info, and assignments.

### Teacher material upload

1. Teacher logs in.
2. App validates teacher role.
3. Teacher opens course management page.
4. Teacher uploads recipe/material.
5. Supabase RLS validates that the teacher is assigned to the course.
6. Material appears in the student classroom.

### Admin user management

1. Admin logs in.
2. App validates admin role.
3. Admin opens users page.
4. Admin assigns teacher/admin role or blocks/unblocks accounts.
5. Supabase RLS validates admin permissions.

## Troubleshooting

### `supabase is not recognized`

Use:

```bash
pnpm dlx supabase@latest --version
```

Then run commands with:

```bash
pnpm dlx supabase@latest <command>
```

### Supabase CLI binary fails on Windows with pnpm

Use `pnpm dlx` instead of a local CLI install:

```bash
pnpm dlx supabase@latest db push
```

### Environment variables are undefined

Make sure:

- the file is named `.env.local`
- variables start with `VITE_`
- the dev server was restarted after editing the env file

### React alias `@` does not work

Check:

- `vite.config.ts`
- `tsconfig.app.json`
- import path spelling

### Data is not returned from Supabase

Check:

- table name
- selected columns
- active session
- RLS policies
- user role
- whether the user is enrolled or assigned to the course
