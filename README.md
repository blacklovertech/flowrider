SuperFleet MVP

Run the demo locally

1. Install dependencies
   npm install

2. Start backend and frontend in parallel
   npm run dev:full

Backend
- Express server at http://localhost:3001
- POST /api/order → simple allocation over mock riders in server/data/riders.json
- GET /api/riders → returns mock riders

Frontend
- Vite dev server at http://localhost:5173
- Proxy forwards /api/* to backend
- Interactive API tester on the landing page calls /api/order

Docs
- Competition deliverables at docs/FounderX-SuperFleet-Deliverables.md

