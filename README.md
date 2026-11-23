# DriveBook

A car rental booking website. Customers sign in with Google, browse cars, pick their dates and book in a few clicks. Staff manage the fleet and the bookings from an admin dashboard.

**Live site:** https://trevorayunga.github.io/Drive-book/
**Repository:** https://github.com/trevorayunga/Drive-book
**Project board (kanban):**https://github.com/users/trevorayunga/projects/5/views/1



## Table of contents

1. [Features](#features)
2. [Requirements checklist](#requirements-checklist)
3. [Tech stack](#tech-stack)
4. [Screenshots](#screenshots)
5. [Getting started](#getting-started)
6. [Firebase setup](#firebase-setup)
7. [Scripts](#scripts)
8. [Project structure](#project-structure)
9. [Data model](#data-model)
10. [Testing](#testing)
11. [CI/CD and deployment](#cicd-and-deployment)
12. [Project management](#project-management)
13. [Security notes](#security-notes)
14. [Known limitations](#known-limitations)
15. [Author](#author)

## Features

### Customers
- Sign in with a Google account (social authentication).
- Browse available cars and filter them by type.
- View a car's details page with a photo gallery and description.
- Pick pickup and return dates. The site checks availability, so the same car can never be booked twice for the same dates.
- See the total price before confirming. Kenyan public holidays carry a small surcharge.
- Leave a phone number and an optional note with the booking. Contact details are stored privately.
- See a refundable security deposit (30% of the rental total). It is paid in person at pickup, and nothing is charged on the website.
- View all personal bookings under **My Bookings** and cancel a booking.
- Read the rental policy: deposit, extra charges, accident policy, cancellations and rules of use.
- Find the business contact details in the footer on every page.

### Admins
- Separate admin login (email and password) at `/admin/login`.
- Only accounts listed in the `admins` collection can open admin pages. The same rule is enforced by the Firestore security rules.
- **Dashboard:** totals for cars, bookings, active and cancelled bookings, and revenue, plus recent bookings.
- **Manage cars:** add, edit and delete cars. Make and model dropdowns are loaded from the NHTSA vehicle API, with a manual fallback when the API is unreachable.
- **Manage bookings:** view all bookings with the customer's phone number and note, filter by status, and confirm or cancel bookings. A cancelled booking cannot be confirmed again if the dates are taken.

## Requirements checklist

| Requirement | How it is met |
|---|---|
| Authentication (social) | Firebase Authentication with Google sign-in. Admins use email and password. |
| GitHub Actions and kanban | `ci.yml` runs lint, tests with a coverage threshold and a build on every push and pull request. `deploy.yml` publishes to GitHub Pages. Work is tracked on a GitHub Projects kanban board. |
| Firebase database (free) | Cloud Firestore on the free Spark plan. |
| Test coverage of at least 70% | Vitest and React Testing Library, with a 70% threshold enforced in CI. See [Testing](#testing) for the actual figures. |
| Data persistence | Cars, bookings and contact details are stored in Firestore and survive refreshes and logouts. |
| Tailwind CSS | All styling uses Tailwind CSS utility classes. |
| API implementation | NHTSA vPIC API (vehicle makes and models) and Nager.Date API (public holidays). |

## Tech stack

- **Front end:** React, React Router, Vite
- **Styling:** Tailwind CSS
- **Backend services:** Firebase Authentication and Cloud Firestore
- **External APIs:** [NHTSA vPIC](https://vpic.nhtsa.dot.gov/api/) and [Nager.Date](https://date.nager.at/)
- **Testing:** Vitest, React Testing Library, user-event
- **Quality and delivery:** ESLint, GitHub Actions, GitHub Pages

## Screenshots

Add your own screenshots to `docs/screenshots/` and keep the file names below, or edit the links.

| Cars | Car details |
|---|---|
| ![Cars](docs/screenshots/cars.png) | ![Car details](docs/screenshots/car-details.png) |

| Booking | My bookings |
|---|---|
| ![Booking](docs/screenshots/booking.png) | ![My bookings](docs/screenshots/my-bookings.png) |

| Admin dashboard | Manage cars |
|---|---|
| ![Admin dashboard](docs/screenshots/admin-dashboard.png) | ![Manage cars](docs/screenshots/manage-cars.png) |

## Getting started

### Prerequisites
- Node.js 20.19 or newer (22 recommended)
- A Firebase project (see [Firebase setup](#firebase-setup))

### Install and run

```bash
git clone https://github.com/trevorayunga/Drive-book.git
cd Drive-book
npm install
cp .env.example .env      # on Windows PowerShell: Copy-Item .env.example .env
```

Fill in `.env` with your Firebase web app values:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Start the dev server:

```bash
npm run dev
```

Open **http://localhost:5173/Drive-book/**. The site is served under `/Drive-book/` because that is its address on GitHub Pages.

## Firebase setup

1. Create a project in the [Firebase console](https://console.firebase.google.com) on the free Spark plan and add a **Web app** to get the config values for `.env`.
2. **Authentication > Sign-in method:** enable **Google** and **Email/Password**.
3. **Authentication > Settings > Authorized domains:** make sure `localhost` is listed, and add your deployed domain (for example `trevorayunga.github.io`).
4. **Firestore Database:** create a database, then open **Rules**, paste the contents of [`firestore.rules`](firestore.rules) and publish.
5. **Create an admin:**
   - Under **Authentication > Users**, add a user with an email and password.
   - Copy that user's UID.
   - In Firestore, create a document `admins/<UID>` with any field (for example `role: "admin"`).
6. **Add cars:** sign in at `/admin/login` and use **Manage cars**. Photo links must start with `http://`, `https://` or `/`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the tests in watch mode |
| `npm run test:coverage` | Run all tests once with a coverage report and the 70% threshold |

## Project structure

```
.github/workflows/   ci.yml (lint, test, build) and deploy.yml (GitHub Pages)
scripts/             seed-cars.js (optional sample data)
src/
  components/        Navbar, Footer, CarCard, CarGallery, BookingForm, CarForm
  config/            business.js (contact details), policy.js (rental policy text)
  context/           AuthContext (login state), AdminRoute (admin guard)
  lib/               booking logic, pricing, deposit, validation, phone and image helpers
  pages/             Home, Login, Cars, CarDetails, Book, MyBookings, Policy
  pages/admin/       AdminLogin, Dashboard, ManageCars, ManageBookings
  services/          Firestore and API wrappers (cars, bookings, admin, nhtsa, holidays)
firestore.rules      Firestore security rules
```

## Data model

```
cars/{carId}
  make, model, year, type, seats, pricePerDay,
  description, image (cover), images (list of photo links)

bookings/{bookingId}
  userId, userName, carId, carName, startDate, endDate,
  totalPrice, status ("confirmed" or "cancelled"), createdAt

bookingContacts/{bookingId}        same ID as the booking, private
  userId, phone, notes, createdAt

admins/{uid}                       presence of the document makes the user an admin
```

Dates are stored as ISO strings (`YYYY-MM-DD`). Prices are in Kenyan shillings (KES).

## Testing

```bash
npm run test:coverage
```

- Tests cover the booking logic (overlap check, pricing, validation), the services (with Firebase mocked), every page and component, the auth and admin guards, and the routing.
- External services (Firebase, NHTSA, Nager.Date) are mocked, so the tests run offline and need no `.env` file.
- CI fails if coverage drops below **70%** for statements, branches, functions or lines.
- At the time of writing: 33 test files, 177 tests, 100% statement coverage and about 99% branch coverage.

## CI/CD and deployment

**Continuous integration** (`.github/workflows/ci.yml`) runs on every push to `main`, `dev` and `trevor`, and on pull requests: install, lint, tests with coverage, then a production build.

**Deployment** (`.github/workflows/deploy.yml`) runs when `main` changes. It builds the site, adds a single-page-app fallback (`404.html`) and publishes it to GitHub Pages.

The deploy workflow reads the Firebase values from repository secrets (**Settings > Secrets and variables > Actions**):

`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`

## Project management

- Tasks are tracked as GitHub issues on a kanban board (Todo, In Progress, Done).
- Branch workflow: day-to-day work happens on `trevor`, stable work is merged into `dev` by pull request, and `dev` is merged into `main` by pull request. `main` is protected, so changes reach it only through a pull request that passes CI.
- Commit messages follow the `type: description` style (`feat:`, `fix:`, `test:`, `chore:`, `docs:`, `ci:`).

## Security notes

- Firestore rules allow public read on cars, and only admins can create, edit or delete them.
- Signed-in users can read bookings (needed for the availability check) and create their own. Customers can only cancel their own bookings. Admins can manage all of them.
- Phone numbers and notes live in a separate `bookingContacts` collection that only the booking's owner and admins can read.
- Firebase web configuration values are not secrets. They identify the project, and access is controlled by the security rules above.
- Admin credentials are not stored in this repository. They are shared privately with the assessor.

## Known limitations

- There are no online payments. The 30% deposit is collected in person at pickup, and the site only displays the amount.
- Car photos are saved as links, because Firebase Storage needs a paid plan. Use full `https://` links (or files under `public/`) for the deployed site.
- The rental policy text is a sample. Adjust it to match the real rental business.
- The NHTSA make and model list is US-oriented, so some local models are missing. The admin form lets you keep or type any model.

## Author

Ombaso Trevor Ayunga (https://github.com/trevorayunga)