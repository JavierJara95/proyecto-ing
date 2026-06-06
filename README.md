# proyecto-ing

## Docker support

This repository includes a `docker-compose.yml` file to run the backend, MySQL database, and frontend together.

### Run with Docker

1. Install Docker and Docker Compose.
2. From the repository root, run:

```bash
docker compose up --build
```

3. Open the frontend in your browser at:

- `http://localhost`

The backend API will be available at:

- `http://localhost:8080/api`

### What was added

- `smaa-backend/Dockerfile`: builds the Spring Boot backend using Maven and runs it with Java 17.
- `smaa-backend/.dockerignore`: excludes build artifacts from the Docker context.
- `docker-compose.yml`: starts:
  - `db` (MySQL 8)
  - `backend` (Spring Boot)
  - `frontend` (Nginx serving `smaa-frontend` via a dedicated Dockerfile)

The backend now reads database connection values from environment variables so it works both locally and inside Docker.
