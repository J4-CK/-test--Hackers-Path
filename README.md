# Hacker's Path

## Overview
This repository contains the source code for the Cybersecurity Learning Platform 'Hacker's Path', an educational web application designed to teach high school students fundamental cybersecurity concepts and skills. The platform is inspired by TryHackMe, Zybooks, and Duolingo, with lessons, quizzes, and interactive features.

---

## Technologies Used
- **Next.js** - React framework for building the front-end and handling server-side rendering.
- **Vercel** - Deployment platform that integrates directly with Next.js for hosting.
- **Supabase** - Backend-as-a-service for database management and authentication.

---

## Languages Used
- **HTML/CSS** - For structuring and styling web pages.
- **JavaScript** - For functionality and interactivity on the front-end and back-end.
- **POSTGRESQL** - For database queries in Supabase.

---

## Flow of Data
1. **User Interaction:** Users interact with the front-end through a browser.
2. **Authentication:** User data is validated and authenticated via Supabase.
3. **Database Access:** Supabase manages data storage, retrieving lessons, quizzes, and scores.
4. **Dynamic Rendering:** Next.js dynamically generates content based on the database inputs.
6. **Deployment and Hosting:** Vercel automates deployments and provides the hosting environment.

---

## Architecture and Interactions
1. **GitHub** - Central code repository for collaboration and version control.
2. **Next.js** - Framework used for both server-side rendering and static site generation.
3. **Vercel** - Automatically deploys code changes pushed to the GitHub repository.
4. **Supabase** - Provides backend services like authentication, database access, and API endpoints.

Workflow Example:
1. Code is pushed to **GitHub**.
2. **Vercel** detects changes and deploys the updated app.
3. The app interacts with the **Supabase** database to fetch or store user data.
4. **Logs and metrics** are sent to AWS CloudWatch or Elastic (optional).

---

## File Organization in Next.js

### Key Directories and Their Purposes
- **/pages** - Contains files corresponding to app routes.
  - Each file in this directory automatically maps to a route (e.g., `pages/index.js` maps to `/`).
  - Example:
    - `pages/index.js` - Home page.
    - `pages/lessons/[id].js` - Dynamic routing for lessons.

- **/api** - Used for API routes.
  - Files in this folder define serverless functions (handled by Vercel).
  - Example:
    - `pages/api/login.js` - Handles user login logic.

- **/components** - Reusable UI elements.
  - Example:
    - `components/Navbar.js` - Navigation bar displayed across pages.

- **/styles** - Global and component-specific CSS.
  - Example:
    - `styles/globals.css` - Application-wide styles.

- **/lib** - Contains reusable utility functions and helper files.
  - Example:
    - `lib/supabase.js` - Initializes and configures Supabase client.

- **/public** - Static assets such as images and icons.

- **/hooks** - Custom React hooks.
  - Example:
    - `hooks/useAuth.js` - Hook for handling authentication logic.

- **/utils** - Common utility functions.
  - Example:
    - `utils/validateInput.js` - Validates user input.

### Why This Structure?
- **Separation of Concerns:** Makes code modular and easier to maintain.
- **Routing Simplicity:** Next.js maps files directly to routes.
- **Serverless Functions:** API routes eliminate the need for a separate server, simplifying deployment.
- **Reusability:** Components, hooks, and utilities are designed for reuse, speeding up development.

---

## Running the Project Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository-name.git
   cd your-repository-name
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create an `.env.local` file with the following variables:
   ```plaintext
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

---

## Deployment
1. Push changes to the `main` branch in GitHub.
2. Vercel automatically detects changes and deploys the app.

---

## License
This project is licensed under the [test]
