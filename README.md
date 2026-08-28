# 🎓 CampusPulse — College Discovery Platform

> A production-grade, full-stack MVP built for students to discover, compare, and decide on colleges with confidence. Powered by **Next.js 14 (App Router), TypeScript, TailwindCSS, Prisma ORM, and NextAuth.js**.

---

## 🌟 Submission Overview

- **Track**: Track A — College Discovery Platform
- **Role**: Full Stack Engineer
- **GitHub Repository**: [https://github.com/lxakshaseth/College-Discovery-Platform](https://github.com/lxakshaseth/College-Discovery-Platform)

---

## 🔥 Key Features

### 1. 🔍 Search & Listing Engine (`/colleges`)
- **Real-Time Keyword Search**: Instant search across college names, cities, and states.
- **Global Command Palette (`⌘K`)**: Quick search modal accessible anywhere via `Ctrl+K` / `Cmd+K` keyboard shortcut.
- **Multi-Factor Filters**: Filter by state location, college type (`PUBLIC`, `PRIVATE`, `DEEMED`), minimum student rating, and max tuition fees.
- **Sorting Modes**: Sort by NIRF rankings, student rating, lowest annual fees, or alphabetical order.
- **Smart Highlights**: Dynamic visual indicators (`🔥 Top 10`, `⭐ Top Rated`, `💼 High CTC`).
- **Server Pagination**: Paginated grid (12 colleges per page) with SEO-friendly URL search query parameters.

### 2. 🏛️ Comprehensive College Details (`/colleges/[slug]`)
- **Header Profile**: College location, established year, NIRF rank badge, approvals (`AICTE`, `UGC`, `NAAC A++`), rating summary, and official website.
- **Interactive ROI & Degree Cost Estimator**: Calculates 4-year total cost, living expenses, scholarship waivers, net payback period, and 5-year wealth multiplier.
- **Courses & Fees Tab**: Tabular view of offered UG, PG, and Diploma degrees with duration and fee structures.
- **Placements & Salary CTC Tab**: Average package (LPA), highest package (LPA), placement rate (%), and top corporate recruiters.
- **Student Reviews Tab**: Live student review feed and interactive rating submission form.
- **Community Q&A Feed**: Discussion questions with upvoted answers from alumni and students.

### 3. ⚖️ Side-by-Side College Comparison Matrix (`/compare`)
- **2-3 College Comparison**: Compare 2 to 3 colleges side-by-side.
- **Metrics Evaluated**: Fees, NIRF rank, average CTC, highest CTC, placement rate %, top recruiters, approvals, and ratings.
- **Automated Metric Badges**: Automatic detection of **Most Affordable**, **Highest Rated**, and **Highest Salary** institutions.
- **Export & Print**: Instant CSV spreadsheet export and clean print layout for counseling discussions.
- **Sticky Compare Bar**: Persistent floating drawer (`CompareFloatingBar`) for selecting colleges on the go.

### 4. 🎯 Admission Rank Predictor Tool (`/predictor`)
- **Entrance Exam Support**: Supports `JEE Main`, `JEE Advanced`, `BITSAT`, `GATE`, and `CAT`.
- **NTA Percentile Converter**: Converts NTA percentile score to estimated All India Rank (AIR) in real time.
- **Match Probability Tiers**: Predicts **Safe High Match**, **Moderate Match**, and **Ambitious Reach** cutoff matches based on All India Rank (AIR) and domicile quotas.

### 5. 💬 Community Q&A Forum (`/discussions`)
- **Topic Tag Filtering**: Categorize questions by `#Admissions`, `#Placements`, `#HostelLife`, `#Fees`, and `#BranchComparison`.
- **Sorting Engine**: Sort discussions by newest, most upvoted answers, or highest engagement.
- **Upvote System**: Upvote helpful answers with live score counters.

### 6. 🔐 Authentication & Saved Wishlist (`/saved`, `/login`, `/register`)
- **NextAuth Credentials**: Secure email/password authentication with bcrypt password hashing.
- **Saved Wishlist**: One-click heart bookmarking to save colleges to user profile with quick-search filtering.
- **Saved Comparisons**: Save side-by-side comparison matrix sessions for future review.
- **One-Click Demo Student Login**: Instant trial button for quick evaluator review.

### 7. 🚀 SEO & Discoverability
- **Dynamic XML Sitemap (`/sitemap.xml`)**: Automated generator querying all college slugs.
- **Search Engine Crawler Rules (`/robots.txt`)**: Search indexing optimizations.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS + Radix UI / shadcn components |
| **State Management** | TanStack React Query + React Context + NextAuth SessionProvider |
| **Database** | SQLite (Local Dev) / PostgreSQL (Neon Production) |
| **ORM** | Prisma ORM |
| **Authentication** | NextAuth.js |

---

## 🗄️ Database Schema

The database consists of **7 interconnected models**:

```
User ──< Review
User ──< SavedCollege >── College
User ──< SavedComparison
College ──< Course
College ──< Placement
```

- **`User`**: User accounts, passwords, profile details.
- **`College`**: Name, slug, state, location, type, NIRF ranking, rating, fees range, approvals.
- **`Course`**: Degree programs, duration, fees, degree level (`UG`, `PG`, `DIPLOMA`, `PHD`).
- **`Placement`**: Batch year, average CTC, highest CTC, median CTC, placement rate %, recruiters list.
- **`Review`**: Rating (1-5), headline, content, verified student relation.
- **`SavedCollege`**: User wishlist relation.
- **`SavedComparison`**: User saved comparison sets.

---

## 🔌 API Endpoints Reference

### Public APIs
- `GET /api/colleges` — List colleges with search, filters, pagination, and sorting.
- `GET /api/colleges/[slug]` — Get complete college details with courses, placements, and reviews.
- `GET /api/colleges/[slug]/reviews` — Paginated student reviews.
- `GET /api/colleges/compare?ids=id1,id2,id3` — Side-by-side comparison data for 2-3 colleges.
- `GET /api/predictor?exam=JEE+Main&rank=12000` — Rank & cutoff matching recommendations.

### Protected APIs (Requires Auth)
- `POST /api/register` — Create a new student account.
- `GET /api/saved/colleges` — Fetch user's saved wishlist colleges.
- `POST /api/saved/colleges` — Bookmark a college.
- `DELETE /api/saved/colleges/[id]` — Remove a saved college.
- `GET /api/saved/comparisons` — Fetch user's saved comparisons.
- `POST /api/saved/comparisons` — Save a comparison matrix set.
- `DELETE /api/saved/comparisons/[id]` — Delete a saved comparison.
- `POST /api/colleges/[slug]/reviews` — Post a verified student review.

---

## 💻 Local Quickstart & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/lxakshaseth/College-Discovery-Platform.git
cd College-Discovery-Platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="college-discovery-mvp-super-secret-key-321"
```

### 4. Push Database Schema & Seed Data
```bash
npx prisma db push
npm run db:seed
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login Credentials

For quick testing during review, you can click **"One-Click Demo Student Login"** on `/login` or use:
- **Email**: `rahul@example.com`
- **Password**: `password123`

---

## 🚀 Production Deployment

1. **Vercel / Railway**: Deploy the Next.js app to Vercel or Railway.
2. **Neon PostgreSQL**: Set `DATABASE_URL` to your Neon PostgreSQL connection string and run `npx prisma db push && npm run db:seed`.

---

## 📝 License

This project is submitted as part of the College Discovery Platform engineering assessment.
