# OfferIQ — Full-Stack Compensation Intelligence Platform

OfferIQ is a modern full-stack compensation intelligence platform that helps software engineers understand the true value of their job offers.

Instead of focusing only on Total CTC, OfferIQ calculates **monthly in-hand salary, tax liability under both old and new tax regimes, year-wise compensation including RSU vesting, and long-term earnings**. The platform is designed with a modular architecture so future features like multi-offer comparison, AI-powered offer parsing, intelligent insights, and persistence can be added without changing the core calculation engine.

The current repository represents **Milestone 2**, a complete end-to-end vertical slice proving the entire application architecture.

```
React Frontend
        │
        ▼
Express REST API
        │
        ▼
Calculation Engine
        │
        ▼
Tax + Salary + RSU Calculations
        │
        ▼
JSON Response
        │
        ▼
Interactive Dashboard
```

---

# Features

### Currently Implemented

* ✅ Full React + TypeScript frontend
* ✅ Express.js REST API
* ✅ Pure calculation engine (framework-independent)
* ✅ Monthly in-hand salary calculation
* ✅ Old vs New Tax Regime comparison
* ✅ Multi-year RSU vesting calculation
* ✅ Year-wise compensation timeline
* ✅ API validation using Zod
* ✅ Type-safe frontend/backend contracts
* ✅ Integration tests
* ✅ Responsive dashboard
* ✅ Centralized error handling

---

# Tech Stack

| Layer         | Technology              |
| ------------- | ----------------------- |
| Frontend      | React, TypeScript, Vite |
| Styling       | Tailwind CSS            |
| Backend       | Node.js, Express.js     |
| Language      | TypeScript              |
| Validation    | Zod                     |
| Charts        | Recharts                |
| Animations    | Framer Motion           |
| Notifications | React Hot Toast         |
| Icons         | Lucide React            |
| Testing       | Vitest, Supertest       |

---

# Project Architecture

```
offeriq-fullstack/

backend/
│
├── src/
│   ├── engine/
│   │   ├── tax/
│   │   ├── salary/
│   │   ├── rsu/
│   │   └── calculation/
│   │
│   ├── routes/
│   ├── validation/
│   ├── middleware/
│   ├── app.ts
│   └── server.ts
│
└── tests/

frontend/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── App.tsx
```

---

# Application Flow

```
User enters offer details

        │

        ▼

React Form

        │

        ▼

POST /api/calculate

        │

        ▼

Zod Validation

        │

        ▼

Calculation Engine

        │

        ├──────────────► Tax Engine

        ├──────────────► Salary Engine

        └──────────────► RSU Vesting Engine

        │

        ▼

Calculation Result

        │

        ▼

React Dashboard
```

---

# Running the Project

## Backend

```bash
cd backend

npm install

npm test

npm run dev
```

The backend runs on:

```
http://localhost:4000
```

Health Check

```bash
curl http://localhost:4000/health
```

Expected Response

```json
{
  "status": "ok"
}
```

---

## Frontend

Open a second terminal.

```bash
cd frontend

npm install

npm run dev
```

The frontend typically runs on

```
http://localhost:5173
```

If the backend runs on a different port, create a `.env` file inside the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:4000
```

---

# API Example

## POST

```
/api/calculate
```

### Request

```json
{
  "baseSalary": 1800000,
  "joiningBonus": 200000,
  "performanceBonus": 180000,
  "rsuValue": 1200000
}
```

### Response

```json
{
  "monthlyInHand": 113420,
  "recommendedRegime": "New",
  "taxComparison": {
    "oldRegime": 282000,
    "newRegime": 214000
  },
  "yearlyCompensation": [
    {
      "year": 1,
      "cash": 2180000,
      "vestedStock": 300000
    }
  ]
}
```

---

# Engineering Decisions

### Pure Calculation Engine

The calculation engine is completely independent of Express and React, making it reusable, easily testable, and suitable for future integrations.

### Shared TypeScript Contracts

Frontend and backend share identical data structures, ensuring compile-time type safety and preventing API contract mismatches.

### Layered Architecture

The project separates presentation, API, validation, and business logic into independent modules, making each layer easier to maintain and test.

### API Validation vs Business Validation

The Zod schema validates request structure and data types at the API boundary.

Business-specific validation (such as compensation sanity checks and comparison rules) is intentionally reserved for the dedicated Validation Engine planned in the next milestone.

### Small Reusable Components

The frontend is built using focused, single-responsibility React components that are easy to understand, reuse, and extend.

---

# Testing

Current test coverage includes:

* ✅ Calculation Engine unit tests
* ✅ API integration tests
* ✅ Validation tests
* ✅ End-to-end backend request flow

The calculation engine has been independently tested with **18 passing unit tests**.

---

# Why a Walking Skeleton?

Rather than building every feature at once, OfferIQ follows an incremental **Walking Skeleton** architecture.

Each milestone delivers a complete vertical slice through the entire application:

```
UI

↓

API

↓

Business Logic

↓

Response
```

This approach provides:

* End-to-end functionality from the beginning
* Stable API contracts
* Easier debugging
* Independent feature development
* Safer refactoring
* Better testability

---

# Why OfferIQ?

Traditional CTC calculators typically focus only on total compensation.

OfferIQ is designed to help engineers make informed career decisions by considering:

* Monthly in-hand salary
* Tax optimization
* Joining bonuses
* Performance bonuses
* RSU vesting schedules
* Long-term compensation
* Intelligent offer comparison (planned)
* AI-powered offer parsing (planned)

---

# Roadmap

| Milestone           | Status     |
| ------------------- | ---------- |
| Calculation Engine  | ✅ Complete |
| Express REST API    | ✅ Complete |
| React Dashboard     | ✅ Complete |
| Validation Engine   | 🚧 Planned |
| Comparison Engine   | 🚧 Planned |
| Insights Engine     | 🚧 Planned |
| MongoDB Persistence | 🚧 Planned |
| Authentication      | 🚧 Planned |
| AI PDF Offer Parser | 🚧 Planned |

---

# Future Enhancements

### Milestone 3

* Validation Engine
* Multi-offer Comparison Engine
* Rule-Based Insights Engine

### Milestone 4

* MongoDB persistence
* Saved offer history

### Milestone 5

* AI-powered PDF offer parser (Gemini API)
* Automatic form population

### Milestone 6

* Authentication
* User accounts
* Personalized dashboards

---

# License

This project is built for educational purposes, portfolio demonstration, and interview discussions, showcasing modern full-stack software engineering practices, modular architecture, and scalable application design.
