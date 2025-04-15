# snapify

A minimalist Instagram-style backend built with Node.js, TypeScript, PostgreSQL, and Docker.

---

## ⚙️ Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** (via Drizzle ORM)
- **Zod** (validation)
- **JWT + Cookies** (auth)
- **Helmet** (security headers)
- **Docker** + **Docker Compose**
- **ESM** module setup
- Insomnia/Postman friendly

# Run with Docker Compose

docker compose up --build

# Push Schema (if needed)

docker exec -it snapify-backend sh
npx drizzle-kit push
