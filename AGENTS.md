# AI Agent Instructions for proyecto-ing

## Project overview
- `smaa-backend`: Java Spring Boot 3.3.5 service using Java 17, JPA, validation, and MySQL.
- `smaa-frontend`: static HTML, CSS, and plain JavaScript that calls backend REST endpoints.
- No frontend package manager or build tool is present; the UI is served as static files.

## Code structure
- Backend root package: `cl.duoc.smaa`
- Controller classes: `smaa-backend/src/main/java/cl/duoc/smaa/controller`
- Service classes: `smaa-backend/src/main/java/cl/duoc/smaa/service`
- Repository interfaces: `smaa-backend/src/main/java/cl/duoc/smaa/repository`
- Domain models: `smaa-backend/src/main/java/cl/duoc/smaa/model`
- DTOs: `smaa-backend/src/main/java/cl/duoc/smaa/dto`
- Exception handling: `smaa-backend/src/main/java/cl/duoc/smaa/exception`

## Important conventions
- The backend exposes REST endpoints under `/api/*`.
- The frontend uses `http://localhost:8080/api` as the API base URL.
- MySQL connection is configured in `smaa-backend/src/main/resources/application.properties`.
- Spring Boot is configured with `spring.jpa.hibernate.ddl-auto=update`; database schema evolves on startup.
- CORS is enabled globally for frontend access.

## Run / build commands
- Start backend:
  - `mvn -f smaa-backend/pom.xml spring-boot:run`
- Run backend tests:
  - `mvn -f smaa-backend/pom.xml test`
- Build backend artifact:
  - `mvn -f smaa-backend/pom.xml package`

## When working in this repository
- Prefer backend changes in `smaa-backend` and frontend changes in `smaa-frontend`.
- Do not introduce a Node/npm toolchain unless the project explicitly requires it.
- For frontend fixes, work directly with the plain HTML/JS files under `smaa-frontend`.
- For backend fixes, keep changes consistent with Spring Boot controller/service/repository layers.

## Notes for AI agents
- If asked to add endpoints, use Spring MVC annotations in `controller` classes and delegate business logic to `service` classes.
- If asked to update data model behavior, adjust entity classes in `model` and repository methods in `repository`.
- If asked to fix UI behavior, update `smaa-frontend/js/app.js` and the relevant HTML page(s).
- No separate frontend framework or build step exists, so changes should stay within the existing static file structure.
