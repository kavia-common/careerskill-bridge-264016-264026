# SkillBridge LMS Frontend (React)

## Overview
This is the main web UI for SkillBridge LMS. It consumes the FastAPI backend via REST and uses a WebSocket for real-time notifications. The app is designed to be lightweight and uses environment variables for runtime configuration.

## Environment Variables
Create a .env file in the frontend_web_app directory (or export envs in your shell) with:

- REACT_APP_API_BASE: Base URL of the backend API (e.g., http://localhost:3001)
- REACT_APP_WS_URL: WebSocket base URL for notifications (e.g., ws://localhost:3001/ws/notifications)

Optional:
- REACT_APP_LOG_LEVEL: debug | info | warn | error (default info)

These variables are read by src/services/apiClient.js and src/services/wsClient.js to configure API and WebSocket endpoints.

## Start the App
- npm install
- npm start
The dev server runs on http://localhost:3000 and proxies requests directly to the backend URL you configured in REACT_APP_API_BASE.

## Main Screens
After authentication, the app provides quick access to the core learning flow:
- Dashboard: High-level overview and recommendations.
- Modules: Browse modules, open a module, view lessons, and take quizzes.
- Portfolio: View and edit portfolio items; add credentials or links.
- Mentorship: Browse mentors, view details, and request mentorship.
- Job Tools: Resume preview, interview simulator, and soft skills tips.
- Settings: Language, theme, and basic preferences.

## E2E Smoke Checklist (UI)
Use a fresh user session and verify happy-path interactions:
1. Register and Login: Create an account and confirm you land on Dashboard.
2. Modules List: Open Modules, ensure modules render.
3. Lesson View & Complete: Open a lesson and mark complete.
4. Quiz Start & Submit: Start a quiz from a module and submit answers; see a score.
5. Progress: Check Dashboard or Progress widget updates.
6. Mentorship Request: Open Mentorship, choose a mentor, and submit a request.
7. Portfolio CRUD: Open Portfolio, create an item, edit it, then delete it.
8. Notifications: Confirm notifications load; if configured, connect to WebSocket and observe updates.

## Developer Notes
- API methods are defined in src/services/apiClient.js.
- WebSocket helper is in src/services/wsClient.js and expects a JWT from localStorage key sb_token.
- Protected routes are enforced by routes/ProtectedRoute.jsx based on authentication state.
