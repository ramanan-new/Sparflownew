# Sparflow (Separated frontend & backend)

This repository now contains two separate parts:

- `backend/` — Express.js API, Sequelize models and SQLite database. Run this to serve the API and (optionally) serve the frontend static assets.
- `frontend/` — Static frontend (HTML/CSS/JS) that calls the backend API.

## Run backend

1. Open terminal and install dependencies for backend:

```bash
cd /workspaces/Sparflownew/backend
npm install
npm run dev
```

The backend will run on `http://localhost:3000` and will serve the frontend static files from `../frontend` by default.

## Run frontend separately (optional)

You can also serve the `frontend/` folder using any static server (or open `frontend/index.html` directly). For example:

```bash
cd /workspaces/Sparflownew/frontend
# using Python's simple server
python3 -m http.server 5000
# then open http://localhost:5000
```

## Notes

- The backend stores its SQLite DB at `backend/database.sqlite`.
- For production, configure a persistent DB and a proper session store.
# Sparflow (demo)

Lightweight demo e-commerce app (Express + SQLite) with a static frontend.

Run:

```bash
cd /workspaces/Sparflownew
npm install
npm run dev
```

This will start the server on http://localhost:3000

Features included:
- Product listings and categories
- Product detail page
- Shopping cart (client-side localStorage)
- Checkout creating orders in SQLite
- User registration/login (session)
- Simple payment options UI (GPay / PhonePe / Navi) with placeholder logos
# Sparflow