# Orion Terra

Orion Terra is a focused land marketplace built with Next.js, MongoDB, admin authentication, seller submissions, buyer inquiries, and admin-managed property listings.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Fill in the required values:

```bash
MONGODB_URI=
ADMIN_EMAIL=
ADMIN_PASSWORD=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Cloudinary credentials are used only by server-side admin upload routes. Do not create `NEXT_PUBLIC_*` variants for the Cloudinary API secret.

4. Seed local data if needed:

```bash
npm run seed
```

5. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Admin Workflows

Admin routes live under `/admin` and are protected by the Phase 6 JWT session cookie. The Phase 7 property tools support:

- property create/edit/delete
- publish/unpublish
- featured toggle
- Cloudinary image upload, reorder, and removal
- seller submission review and status updates
- creating draft property listings from approved seller submissions

Public property APIs only return `PUBLISHED` properties and do not expose private seller contact details.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run seed
```
