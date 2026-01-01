# Docker Setup Guide

This guide explains how to run the E-Commerce application using Docker, both with Docker Compose (recommended) and with standalone Dockerfiles.

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed (for docker-compose method)
- Basic understanding of Docker concepts

---

## Option 1: Docker Compose (Recommended)

Docker Compose is the easiest way to run the entire stack (MongoDB + Backend + Frontend) together.

### Step 1: Navigate to Project Root

```bash
cd /path/to/E-Cart
```

### Step 2: Build and Start All Services

```bash
# Build images and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### Step 3: Verify Services are Running

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Step 4: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **MongoDB**: localhost:27017

### Step 5: Stop Services

```bash
# Stop services (keeps volumes)
docker-compose down

# Stop and remove volumes (clean slate - deletes database data)
docker-compose down -v
```

### Docker Compose Configuration

The `docker-compose.yml` automatically:
- Creates a Docker network (`ecommerce-network`) for service communication
- Creates a persistent volume (`mongodb_data`) for MongoDB data
- Sets up health checks for MongoDB and backend
- Configures environment variables
- Handles service dependencies (backend waits for MongoDB, frontend waits for backend)

### Environment Variables (Docker Compose)

You can override defaults by creating a `.env` file in the project root:

```env
MONGODB_URI=mongodb://mongodb:27017/vibe_commerce
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
VITE_API_BASE=http://localhost:4000
NODE_ENV=production
```

---

## Option 2: Standalone Dockerfiles

Run each service individually using Docker commands. Useful for custom setups or production deployments.

### Prerequisites for Standalone

- MongoDB must be running separately (either on host machine or in another container)

---

## Backend Docker Setup (Standalone)

### Step 1: Build the Backend Image

```bash
cd backend
docker build -t ecommerce-backend .
```

### Step 2: Create a Docker Network (if MongoDB is in another container)

```bash
# Create a network for services to communicate
docker network create ecommerce-network
```

### Step 3: Run MongoDB Container (if not using host MongoDB)

```bash
# Run MongoDB container
docker run -d \
  --name mongodb \
  --network ecommerce-network \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7

# Verify MongoDB is running
docker ps | grep mongodb
```

### Step 4: Run Backend Container

**Option A: MongoDB in Docker Container (same network)**

```bash
docker run -d \
  --name backend \
  --network ecommerce-network \
  -p 4000:4000 \
  -e MONGODB_URI=mongodb://mongodb:27017/vibe_commerce \
  -e PORT=4000 \
  -e CLIENT_ORIGIN=http://localhost:5173 \
  -e NODE_ENV=production \
  ecommerce-backend
```

**Option B: MongoDB on Host Machine**

```bash
# On Mac/Windows
docker run -d \
  --name backend \
  -p 4000:4000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/vibe_commerce \
  -e PORT=4000 \
  -e CLIENT_ORIGIN=http://localhost:5173 \
  -e NODE_ENV=production \
  ecommerce-backend

# On Linux (use host network)
docker run -d \
  --name backend \
  --network host \
  -e MONGODB_URI=mongodb://localhost:27017/vibe_commerce \
  -e PORT=4000 \
  -e CLIENT_ORIGIN=http://localhost:5173 \
  -e NODE_ENV=production \
  ecommerce-backend
```

**Option C: MongoDB on Remote Server**

```bash
docker run -d \
  --name backend \
  -p 4000:4000 \
  -e MONGODB_URI=mongodb://your-mongodb-host:27017/vibe_commerce \
  -e PORT=4000 \
  -e CLIENT_ORIGIN=http://localhost:5173 \
  -e NODE_ENV=production \
  ecommerce-backend
```

### Step 5: Verify Backend is Running

```bash
# Check container status
docker ps | grep backend

# View logs
docker logs -f backend

# Test health endpoint
curl http://localhost:4000/api/health
```

### Step 6: Stop Backend Container

```bash
# Stop container
docker stop backend

# Remove container
docker rm backend

# Remove image (optional)
docker rmi ecommerce-backend
```

---

## Frontend Docker Setup (Standalone)

### Step 1: Build the Frontend Image

**Important**: Vite environment variables are build-time only. Set `VITE_API_BASE` during build.

```bash
cd frontend

# Build with default API URL (http://localhost:4000)
docker build -t ecommerce-frontend .

# OR build with custom API URL
docker build -t ecommerce-frontend \
  --build-arg VITE_API_BASE=http://your-api-url:4000 .
```

### Step 2: Run Frontend Container

```bash
docker run -d \
  --name frontend \
  -p 5173:5173 \
  ecommerce-frontend
```

### Step 3: Verify Frontend is Running

```bash
# Check container status
docker ps | grep frontend

# View logs
docker logs -f frontend

# Open in browser
# http://localhost:5173
```

### Step 4: Stop Frontend Container

```bash
# Stop container
docker stop frontend

# Remove container
docker rm frontend

# Remove image (optional)
docker rmi ecommerce-frontend
```

---

## Complete Standalone Setup Example

Here's a complete example running all services with standalone Docker commands:

### Step 1: Create Network

```bash
docker network create ecommerce-network
```

### Step 2: Create Volume for MongoDB

```bash
docker volume create mongodb_data
```

### Step 3: Start MongoDB

```bash
docker run -d \
  --name mongodb \
  --network ecommerce-network \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7
```

### Step 4: Build Backend

```bash
cd backend
docker build -t ecommerce-backend .
cd ..
```

### Step 5: Start Backend

```bash
docker run -d \
  --name backend \
  --network ecommerce-network \
  -p 4000:4000 \
  -e MONGODB_URI=mongodb://mongodb:27017/vibe_commerce \
  -e PORT=4000 \
  -e CLIENT_ORIGIN=http://localhost:5173 \
  -e NODE_ENV=production \
  ecommerce-backend
```

### Step 6: Build Frontend

```bash
cd frontend
docker build -t ecommerce-frontend --build-arg VITE_API_BASE=http://localhost:4000 .
cd ..
```

### Step 7: Start Frontend

```bash
docker run -d \
  --name frontend \
  -p 5173:5173 \
  ecommerce-frontend
```

### Step 8: Clean Up (when done)

```bash
# Stop all containers
docker stop frontend backend mongodb

# Remove containers
docker rm frontend backend mongodb

# Remove network
docker network rm ecommerce-network

# Remove volume (WARNING: deletes database data)
docker volume rm mongodb_data

# Remove images (optional)
docker rmi ecommerce-frontend ecommerce-backend
```

---

## Database Seeding

### With Docker Compose

The backend automatically seeds the database on first startup. You should see logs like:
```
✓ Seeded 20 products successfully
```

### With Standalone Docker

The backend also automatically seeds on first startup. To manually seed:

```bash
# Execute seed script in running container
docker exec backend npm run seed:fakestore
```

### Clear Database

```bash
# With Docker Compose
docker-compose exec backend npm run clear:products

# With Standalone
docker exec backend npm run clear:products
```

---

## Troubleshooting

### Backend can't connect to MongoDB

1. **Check MongoDB is running**:
   ```bash
   docker ps | grep mongodb
   ```

2. **Verify network connectivity** (if using Docker network):
   ```bash
   docker network inspect ecommerce-network
   ```

3. **Check MongoDB URI**:
   - In docker-compose: Should be `mongodb://mongodb:27017/vibe_commerce`
   - Standalone with network: Should be `mongodb://mongodb:27017/vibe_commerce`
   - Standalone with host MongoDB: Use `host.docker.internal` (Mac/Windows) or `localhost` with `--network host` (Linux)

4. **View backend logs**:
   ```bash
   docker logs backend
   # or
   docker-compose logs backend
   ```

### Frontend can't reach Backend API

1. **Check API URL**: Ensure `VITE_API_BASE` matches your backend URL
2. **Verify backend is running**: `curl http://localhost:4000/api/health`
3. **Check CORS settings**: Backend `CLIENT_ORIGIN` should match frontend URL
4. **Rebuild frontend** if API URL changed (Vite vars are build-time)

### Port Already in Use

If ports 4000, 5173, or 27017 are already in use:

```bash
# Find process using port
# On Linux/Mac:
lsof -i :4000
# On Windows:
netstat -ano | findstr :4000

# Change ports in docker-compose.yml or use -p flag:
docker run -p 4001:4000 ...  # Maps host port 4001 to container port 4000
```

### Database Data Persistence

- **Docker Compose**: Data persists in `mongodb_data` volume automatically
- **Standalone**: Use `-v mongodb_data:/data/db` flag when running MongoDB
- **To reset**: Remove volume with `docker volume rm mongodb_data` (or `docker-compose down -v`)

---

## Production Considerations

### Security

1. **Use environment files**: Don't hardcode secrets in docker-compose.yml
2. **Non-root user**: Already configured in Dockerfiles
3. **Network isolation**: Services communicate via Docker network
4. **Resource limits**: Add to docker-compose.yml:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

### Performance

1. **Multi-stage builds**: Frontend already uses multi-stage build
2. **Layer caching**: Dockerfiles optimized for caching
3. **Health checks**: Configured for automatic restart

### Monitoring

```bash
# View resource usage
docker stats

# View logs
docker-compose logs -f

# Inspect containers
docker inspect backend
```

---

## Quick Reference

### Docker Compose Commands

```bash
docker-compose up -d              # Start in background
docker-compose down               # Stop and remove containers
docker-compose down -v            # Stop and remove containers + volumes
docker-compose ps                 # List services
docker-compose logs -f            # Follow logs
docker-compose restart backend    # Restart specific service
docker-compose build              # Rebuild images
docker-compose pull               # Pull base images
```

### Docker Commands

```bash
docker build -t image-name .      # Build image
docker run -d --name container    # Run container in background
docker stop container             # Stop container
docker rm container               # Remove container
docker logs -f container          # View logs
docker exec -it container sh      # Enter container shell
docker ps                         # List running containers
docker images                     # List images
docker network ls                 # List networks
docker volume ls                  # List volumes
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

