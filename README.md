# GDPR Privacy Manager

A full-stack, production-ready GDPR compliance application. Users can view, correct, export, and erase their personal data. Administrators monitor GDPR requests through a dedicated dashboard.

Built with **FastAPI + PostgreSQL** on the backend and **React + TypeScript + Tailwind CSS** on the frontend. Runs as three Docker services with a single command.

---

## GDPR Rights Implemented

| Article | Right | Endpoint | Page |
|---------|-------|----------|------|
| Article 15 | Right of Access | `GET /me/data` | Dashboard |
| Article 16 | Right to Rectification | `PUT /me/data` | Edit Data |
| Article 17 | Right to Erasure | `DELETE /me/data` | Delete Account |
| Article 20 | Right to Data Portability | `GET /me/export` | Export Data |
| Article 7 | Right to Withdraw Consent | `PUT /me/consents` | Dashboard |
| Article 13 | Audit Trail | `GET /me/audit-logs` | My Activity |

---

## Tech Stack

**Backend**
- FastAPI (async)
- PostgreSQL 16
- SQLAlchemy (async) + asyncpg
- Alembic migrations
- python-jose (JWT)
- passlib + bcrypt (password hashing)
- pytest + httpx (testing)

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui components
- Recharts (analytics charts)
- Axios (HTTP client)
- React Hook Form + Zod (validation)
- React Router v6

**Infrastructure**
- Docker + Docker Compose
- Nginx (frontend serving)
- PostgreSQL (persistent volume)

---

## Quick Start (Docker)

**Prerequisites:** Docker and Docker Compose installed.

```bash
# Clone the repo
git clone https://github.com/yourusername/gdpr-privacy-app.git
cd gdpr-privacy-app

# Copy environment file
cp .env.example .env

# Start all services (db + backend + frontend)
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

---

## Local Development Setup

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your local DATABASE_URL and SECRET_KEY

# Run migrations
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
gdpr-privacy-app/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + middleware
│   │   ├── config.py            # Pydantic Settings
│   │   ├── database.py          # Async SQLAlchemy engine
│   │   ├── models/
│   │   │   ├── user.py          # User model (UUID PK, PII fields)
│   │   │   ├── consent.py       # Consent model (4 types)
│   │   │   └── audit_log.py     # AuditLog model (8 action types)
│   │   ├── auth/
│   │   │   ├── router.py        # /auth/register, /login, /me
│   │   │   ├── schemas.py       # Pydantic request/response models
│   │   │   └── utils.py         # JWT + bcrypt helpers
│   │   ├── gdpr/
│   │   │   ├── router.py        # /me/data, /me/export, /me/consents
│   │   │   └── schemas.py
│   │   └── admin/
│   │       ├── router.py        # /admin/users, /stats, /audit-logs
│   │       └── schemas.py
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_gdpr.py
│   │   ├── test_consents.py
│   │   ├── test_audit.py
│   │   └── test_admin.py
│   ├── alembic/                 # Database migrations
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx    # My data + consent toggles
│   │   │   ├── AuditLog.tsx     # Activity history + chart
│   │   │   ├── EditData.tsx     # Rectification form
│   │   │   ├── Export.tsx       # JSON/CSV download
│   │   │   ├── DeleteAccount.tsx # Multi-step erasure flow
│   │   │   └── AdminDashboard.tsx
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── DataCard.tsx
│   │   │   ├── ConsentToggle.tsx
│   │   │   ├── AuditTable.tsx
│   │   │   └── ActivityChart.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # JWT stored in memory (not localStorage)
│   │   ├── services/
│   │   │   └── api.ts           # Typed Axios API client
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
├── Makefile
└── README.md
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | None | Create account, returns JWT |
| POST | `/auth/login` | None | Login, returns JWT |
| GET | `/auth/me` | JWT | Get current user profile |

### GDPR (User)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/me/data` | JWT | Get all personal data (Art. 15) |
| PUT | `/me/data` | JWT | Update personal data (Art. 16) |
| DELETE | `/me/data` | JWT | Anonymise account (Art. 17) |
| GET | `/me/export` | JWT | Export data as JSON (Art. 20) |
| GET | `/me/consents` | JWT | Get consent status |
| PUT | `/me/consents` | JWT | Toggle a consent (Art. 7) |
| GET | `/me/audit-logs` | JWT | Get activity history |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/users` | Admin JWT | List all users |
| GET | `/admin/audit-logs` | Admin JWT | All audit logs |
| GET | `/admin/stats` | Admin JWT | Dashboard statistics |

Full interactive docs at **http://localhost:8000/docs**

---

## Key Design Decisions

### JWT Stored in Memory, Not localStorage
Storing JWT in `localStorage` is vulnerable to XSS attacks — any injected script can read it. This app stores the token in React state (memory only). It is cleared on page refresh, which is intentional for a privacy-focused application.

### Anonymisation Over Hard Delete
GDPR Article 17 requires that personal data is no longer identifiable — it does not mandate hard deletion. Hard-deleting database rows breaks audit trails and referential integrity. This app anonymises PII:

```
email      → anon_<uuid>@deleted.gdpr
first_name → [REDACTED]
last_name  → [REDACTED]
phone      → [REDACTED]
address    → [REDACTED]
```

Audit log entries are preserved for legal compliance.

### UUID Primary Keys
Sequential integer IDs leak user count and are predictable in URLs. UUIDs are opaque and safe for a privacy application.

### Consent as a Separate Table
GDPR Article 7 requires proof of consent — what was consented to, when, and from where. A dedicated `consents` table with timestamps satisfies this requirement and enables audit-ready consent history.

### Async SQLAlchemy
FastAPI is async-native. Using `asyncpg` + async SQLAlchemy maximises throughput under concurrent load, important for GDPR endpoints that may be called in bulk during data subject requests.

---

## Environment Variables

Copy `.env.example` to `.env` before running:

```env
# PostgreSQL
POSTGRES_DB=gdpr_db
POSTGRES_USER=gdpr_user
POSTGRES_PASSWORD=changeme

# Backend
DATABASE_URL=postgresql+asyncpg://gdpr_user:changeme@db:5432/gdpr_db
SECRET_KEY=your-64-char-random-hex-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Generate a secure secret key:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## Running Tests

```bash
# Backend tests
cd backend
pytest tests/ -v

# With coverage
pytest tests/ -v --cov=app --cov-report=term-missing
```

---

## Makefile Commands

```bash
make up        # docker-compose up --build
make down      # docker-compose down
make logs      # docker-compose logs -f
make migrate   # run alembic upgrade head in backend container
make test      # run pytest in backend container
make shell     # open shell in backend container
```

---

## Consent Types

| Type | Description | Default |
|------|-------------|---------|
| `essential` | Required for the service to function | Granted |
| `analytics` | Usage analytics and performance monitoring | Denied |
| `marketing` | Marketing communications | Denied |
| `third_party` | Data sharing with third parties | Denied |

---

## Audit Log Actions

Every sensitive action is recorded with timestamp and IP address:

| Action | Trigger |
|--------|---------|
| `REGISTER` | New account created |
| `LOGIN` | Successful login |
| `ACCESS` | User viewed their data |
| `RECTIFY` | User updated their data |
| `ANONYMISE` | Account deletion/erasure requested |
| `EXPORT` | Data export downloaded |
| `CONSENT_CHANGE` | Consent toggled on or off |

---

## Screenshots

> Add screenshots here after first run.

- `/dashboard` — Personal data overview with consent toggles
- `/my-activity` — Audit log table with activity chart
- `/edit` — Data rectification form
- `/export` — Export preview and download
- `/delete` — Multi-step erasure confirmation
- `/admin` — Admin stats dashboard with request trends

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## GDPR Compliance Disclaimer

This application demonstrates GDPR technical controls. It is not a substitute for legal advice. Consult a qualified data protection officer (DPO) for your specific compliance obligations.
