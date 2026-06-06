# SMAA Docker Setup Guide

This guide explains how to run the SMAA application using Docker and access it from a smartphone on your network.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed
- Network connection between your PC and smartphone

## Running with Docker

### 1. Start the Docker Containers

Navigate to the project root directory and run:

```bash
docker-compose up -d
```

This command will:
- Start MySQL database on port 3306
- Start phpMyAdmin on port 8081
- Start the backend API on port 8080
- Start the frontend on port 80

Wait 10-15 seconds for all services to start properly.

### 2. Verify Services Are Running

Check if all containers are running:

```bash
docker-compose ps
```

You should see all 4 services in the "Up" state.

## Accessing from Your PC

Once Docker is running:

- **Frontend (Web App):** http://localhost/
- **Backend API:** http://localhost:8080/api
- **phpMyAdmin:** http://localhost:8081
  - Username: `root`
  - Password: `root`
  - Server: `db`

## Accessing from a Smartphone on the Same Network

To access the application from a smartphone, you need to use your PC's IP address on the local network.

### Finding Your PC's IP Address

**On Windows (PowerShell):**
```powershell
ipconfig
```

Look for "IPv4 Address" under your active network adapter (e.g., `192.168.x.x` or `10.0.x.x`).

**On Linux/Mac:**
```bash
ifconfig
# or
ip addr
```

### Accessing from Smartphone

Once you have your PC's IP (e.g., `192.168.1.100`):

- **Frontend (Web App):** http://192.168.1.100/
- **Backend API:** http://192.168.1.100:8080/api
- **phpMyAdmin:** http://192.168.1.100:8081

**Important:** Replace `192.168.1.100` with your actual PC IP address.

The frontend automatically detects the hostname and port from the request, so it will work seamlessly from any device on your network.

## Database Access

### Using phpMyAdmin (GUI)

1. Open http://localhost:8081 (from PC) or http://YOUR_PC_IP:8081 (from smartphone)
2. Login with:
   - Username: `root`
   - Password: `root`
   - Server: `db`

### Using Command Line

Connect to MySQL directly:

```bash
docker exec -it proyecto-ing-db-1 mysql -u root -p
```

When prompted for password, enter: `root`

## Database Configuration

- **Database Name:** `smaa_db`
- **Root User:** `root`
- **Root Password:** `root`
- **Host (from backend):** `db` (Docker network)
- **Host (from PC/external):** `localhost:3306`
- **Port:** `3306`

The schema and initial data are created automatically when the backend starts.

## Stopping the Application

To stop all containers:

```bash
docker-compose down
```

To stop and remove all volumes (including database data):

```bash
docker-compose down -v
```

## Troubleshooting

### Cannot connect from smartphone

1. **Check if services are running:**
   ```bash
   docker-compose ps
   ```

2. **Check firewall:** Make sure Windows Firewall allows port 80, 8080, and 8081
   - Go to Windows Defender Firewall → Allow an app through firewall
   - Add `Docker Desktop` or allow ports 80, 8080, 8081

3. **Verify network connection:** Both PC and smartphone should be on the same WiFi network

4. **Check PC's IP:** Make sure you're using the correct IP address
   ```powershell
   ipconfig
   ```

### Database connection errors

1. **Check database logs:**
   ```bash
   docker-compose logs db
   ```

2. **Restart the database:**
   ```bash
   docker-compose restart db
   ```

3. **Check if port is in use:**
   ```powershell
   netstat -ano | findstr :3306
   ```

### Backend API not responding

1. **Check backend logs:**
   ```bash
   docker-compose logs backend
   ```

2. **Restart backend:**
   ```bash
   docker-compose restart backend
   ```

## Security Notes

This configuration is suitable for **development only**. For production use:

- Change default passwords (`root`)
- Set up proper user roles and permissions
- Use environment variables for sensitive data
- Enable authentication and CORS properly
- Use HTTPS instead of HTTP
- Run behind a reverse proxy (nginx, Apache)

## Additional Commands

### View logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f frontend
```

### Rebuild containers

```bash
docker-compose build
docker-compose up -d
```

### Clean up unused Docker resources

```bash
docker system prune -a
```

## Testing the Application

### From PC

1. Open http://localhost in your browser
2. Navigate to "Funcionario" panel
3. Use example data:
   - Folio: `SMAA-2026-0001`
   - Patente: `ABCD12`

### From Smartphone

1. Replace `localhost` with your PC's IP address
2. Same steps as above
3. The application is fully responsive and designed for mobile viewing

## Backend API Endpoints

The backend API is available at:

- **Local:** http://localhost:8080/api
- **Network:** http://YOUR_PC_IP:8080/api

Common endpoints:
- POST `/usuarios/login` - Login
- POST `/declaraciones` - Create travel declaration
- GET `/fiscalizacion/folio/{folio}` - Search by folio
- GET `/reportes/resumen` - Get report summary
- GET `/auditoria` - Get audit log

Refer to the backend code for complete API documentation.
