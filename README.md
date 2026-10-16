# CampusConnect — Air University Kamra

A dedicated, university-focused social and academic intelligence platform built exclusively for **Air University Kamra**.

---

## 🚀 Overview

CampusConnect integrates the visual finesse and fluidity of contemporary social platforms with academic utility, moderated student feeds, and official institutional announcements.

### Key Capabilities
- **Pre-Moderated Community Feed**: Student submissions default to a `pending` quarantine state and only appear publicly after review by authorized moderators. Authors can track their submission status.
- **Institutional Notices**: Verified official announcements authored strictly by faculty heads and campus administration.
- **Academic Exam Bank**: Categorized repository for midterm and final past examination papers with department, semester, and course filtering.
- **Campus Voice Polls**: Privacy-preserving student voting with an air-gapped zero-knowledge anonymous ballot architecture.
- **Campus Life**: Comprehensive directories for co-curricular student societies and campus events.
- **Private Bookmarks & Student Feedback**: Confidential communication channels to administration and private bookmarks.

---

## 🏛️ Prepopulated AU Kamra Departments

1. **Computer Science** (`BSCS`)
2. **Cyber Security** (`BSCY`)
3. **Artificial Intelligence** (`BSAI`)
4. **Mechanical Engineering** (`BSME`)
5. **Business Administration** (`BBA`)
6. **Aeronautical Engineering** (`BSAE`)

*Email Domain:* Restricted to authorized institutional IDs ending in `.edu.pk` or `.edu`.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS v4 (Obsidian & slate dark surfaces)
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL 15+)
- **Authentication**: Supabase Auth (Google OAuth + `.edu` domain restriction)
- **Authorization**: PostgreSQL Row-Level Security (RLS) & security definer functions

---

## 💻 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🎭 Interactive Role Switcher (Prototype Mode)

The Phase 2 prototype includes a sticky top role bar allowing instant simulation of:
- **Student** (`Farhan Khattak` — Cyber Security)
- **Moderator** (`Dr. Tariq Mahmood` — CS Faculty)
- **Faculty Head** (`Prof. Asim Munir` — Aeronautical Engineering)
- **Campus Admin** (`AU IT Directorate`)
