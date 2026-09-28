# NER-LINK API

FastAPI + SQLAlchemy + SQLite backend for the dashboard pages in `src/pages/`.

## Run locally

From the repository root, activate the existing virtual environment (or create one and install `requirements.txt`), then run:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The SQLite database is stored at `backend/nerlink.db`. On first startup, the API creates its tables and seeds demo vehicles, incidents, alerts, routes, delivery trends, and field reports. Seeding is idempotent per table, so existing records are retained.

Interactive API documentation is available at `/docs`.

The frontend defaults to `http://127.0.0.1:8000/api/v1`. Set `VITE_API_BASE_URL` before starting Vite if the API uses another URL.

## Main endpoints

- `GET /api/v1/health`
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/vehicles`
- `GET /api/v1/incidents`
- `GET /api/v1/alerts` and `PATCH /api/v1/alerts/{alert_id}`
- `GET /api/v1/field-reports` and `POST /api/v1/field-reports`
- `PATCH /api/v1/field-reports/{report_id}`
- `GET /api/v1/routes` and `POST /api/v1/routes/analyse`
- `GET /api/v1/dashboard/gis-overview`
