# Habitify

A habit- and task-tracking web app with reminders and analytics.

## Features

- **User Authentication** (JWT-backed signup & login)
- **Task Management** (create, edit, delete, recur, complete)
- **Habit Tracking** (daily/weekly check-ins & streaks)
- **Reminders** (cron-scheduled email/SMS stubs)
- **Analytics** (Chart.js charts of completion vs. time range)
- **Settings** (daily reminder times & monthly goals)
- **Protected Routes** (React Router v6 + `<PrivateRoute>`)

---

## Tech Stack

- **Frontend:** React, React Router v6, Axios, Chart.js
- **Backend:** Node.js, Express, Mongoose, MongoDB
- **Auth:** bcrypt + JSON Web Tokens
- **Scheduling:** node-cron
- **Testing:** Jest & React Testing Library (frontend), Jest & Supertest (backend)
- **Deployment:** Netlify (frontend), Heroku (backend)

---

## Getting Started

### Prerequisites

- [Node.js ≥ 16.x](https://nodejs.org/)
- [npm](https://npmjs.com/) or [yarn](https://yarnpkg.com/)
- Local MongoDB (for dev) or a MongoDB Atlas URI

### Clone & Install

```bash
git clone https://github.com/afradZ/habitify.git
cd habitify

