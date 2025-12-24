# Tick MNGsys — Ticketing System (Django + SQLite)

A role-based ticketing web application for managing internal/external support requests. Users can create and track tickets, admins assign them to engineers, and engineers resolve them via a dedicated workspace. Includes dashboards with ticket analytics (status, priority, category, time windows).

## Demo
▶️ Demo video (1:40): https://youtu.be/269aH_s_Q-w

## Screenshots
<details>
  <summary>Click to expand</summary>

  <br/>

  <img width="1142" height="587" alt="Authentification Page" src="https://github.com/user-attachments/assets/2b5eaa0e-9506-4fb8-b7d9-a897ac14f562" />
  <img width="1133" height="576" alt="Dashboard 1" src="https://github.com/user-attachments/assets/7b33e10e-ec1b-4889-ad50-b8563e6eb1a5" />
  <img width="574" height="518" alt="Dashboard 2" src="https://github.com/user-attachments/assets/cac174db-d532-43fa-96aa-cf091c081ce7" />
  <img width="1145" height="582" alt="Ticket List" src="https://github.com/user-attachments/assets/24bfe34a-f5b0-4fae-af62-b8417693dc47" />

</details>

---

## Key Features

### Authentication & Roles
- Role-based access: **Client / Engineer / Admin**
- Secure login/logout + session handling
- Profile management + password change

### Ticket Lifecycle (End-to-End)
- Create tickets with **priority, category, status**
- Ticket assignment workflow: **Admin assigns → Engineer works → Ticket resolved/closed**
- Users can track ticket progress and receive updates as tickets move through statuses

### Ticket Management UX
- Ticket list view with:
  - **search + filtering**
  - **pagination**
  - confirmation for destructive actions (delete)
- Ticket details page with editing restrictions (e.g., editable while not closed)

### Engineer Workspace
- Dedicated “workspace” view showing only assigned tickets
- Quick search to find tickets and update their status while working

### Dashboard & Analytics
- Summary cards: total tickets + counts by status (pending/open/closed)
- Charts for:
  - Ticket distribution by **status**
  - Ticket distribution by **priority**
  - Ticket distribution by **category**
  - Trends over selectable time windows (e.g., last 7/30/90 days, 6 months, 1 year)
- Designed for monitoring workload and support performance

---

## Tech Stack
- **Backend:** Python, Django
- **Database:** SQLite
- **Frontend:** Django templates + Bootstrap (UI)
- **Charts/Dashboard:** Chart.js / React chart components (where applicable)

---

## Project Structure (high-level)
- `users/` – authentication, profiles, role-based registration/flows
- `ticket/` – ticket model, views, templates (CRUD + assignment + engineer workflow)
- `dashboard/` – dashboard views + analytics/charts
- `templates/` – UI pages
- `static/` – CSS/JS/assets
- `django_project/` – project settings/urls/wsgi/asgi
- `manage.py` – Django entry point

---

## Getting Started (Local)

### 1) Clone
```bash
git clone https://github.com/CojocaruClaudiu/TickMNGsys.git
cd TickMNGsys
```
2) Create & activate a virtual environment
```
bash
Copy code
python -m venv .venv
Activate:

Windows (PowerShell):

powershell
Copy code
.\.venv\Scripts\Activate.ps1
macOS / Linux:

bash
Copy code
source .venv/bin/activate
```

3) Install dependencies
```
bash
Copy code
pip install -r requirements.txt
```
5) Run migrations
```
bash
Copy code
python manage.py migrate
```
6) Create an admin user
```
bash
Copy code
python manage.py createsuperuser
```
7) Run the server
```
bash
Copy code
python manage.py runserver
Open:

http://127.0.0.1:8000/
```

Usage (Quick Demo Flow)
Register a Client account → create a new ticket

Login as Admin → assign the ticket to an Engineer

Login as Engineer → open the workspace → update ticket status → resolve/close

Visit the Dashboard to view ticket analytics (status/priority/category + time windows)

Configuration Notes
Media / profile images
The app uses Django MEDIA_ROOT for user profile images. For local development, ensure MEDIA_URL and MEDIA_ROOT are configured in settings.py, and that media is served in urls.py (development only).

Database
Default database is SQLite.
To switch to PostgreSQL/MySQL, update DATABASES in settings.py and rerun migrations.

