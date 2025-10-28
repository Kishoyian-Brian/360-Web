# 🐳 Docker Deployment Guide

## Quick Start

### Local Development
```bash
# Start all services (PostgreSQL + Redis + Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Production Deployment
```bash
# Build and start production container
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

## 🚀 Deployment Options

### 1. Railway (Docker)
1. Connect your GitHub repo to Railway
2. Railway will automatically detect Dockerfile
3. Set environment variables in Railway dashboard
4. Deploy!

### 2. DigitalOcean App Platform
1. Connect GitHub repo
2. Select Dockerfile as build method
3. Set environment variables
4. Deploy!

### 3. AWS ECS/Fargate
1. Build and push image to ECR
2. Create ECS service with your image
3. Set environment variables
4. Deploy!

### 4. Google Cloud Run
1. Build and push to Google Container Registry
2. Deploy to Cloud Run
3. Set environment variables
4. Deploy!

### 5. Azure Container Instances
1. Build and push to Azure Container Registry
2. Deploy to Container Instances
3. Set environment variables
4. Deploy!

## 🔧 Environment Variables

### Required Variables:
```
NODE_ENV=production
PORT=3000
API_PREFIX=api
CORS_ORIGIN=https://williamsmith.store
DATABASE_URL=postgresql://neondb_owner:npg_Rjk8dMDi2PEr@ep-raspy-wildflower-a907ry4p-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
```

### Optional Variables:
```
BCRYPT_ROUNDS=12
UPLOAD_MAX_SIZE=10485760
UPLOAD_PATH=uploads
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=360web <your-email@gmail.com>
ADMIN_EMAIL=alfredkaizen30@gmail.com
```

## 🏗️ Build Commands

### Build Image Locally
```bash
# Build the Docker image
docker build -t 360-web-backend .

# Run the container
docker run -p 3000:3000 --env-file .env 360-web-backend
```

### Multi-Platform Build
```bash
# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t 360-web-backend .
```

## 📊 Health Checks

The container includes health checks:
- **Endpoint**: `/api/health`
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3

## 🔒 Security Features

- **Non-root user**: Container runs as `nestjs` user
- **Minimal base image**: Alpine Linux
- **No unnecessary packages**: Only production dependencies
- **Health checks**: Automatic container restart on failure

## 📁 Volume Mounts

### Development
- `./uploads:/app/uploads` - File uploads

### Production
- `uploads_data:/app/uploads` - Persistent file storage

## 🌐 Network Configuration

- **Port**: 3000 (exposed)
- **Network**: Bridge mode
- **Health check**: Built-in HTTP health check

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use**:
   ```bash
   # Change port in docker-compose.yml
   ports:
     - "3001:3000"  # Use port 3001 instead
   ```

2. **Database connection failed**:
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps
   
   # Check database logs
   docker-compose logs postgres
   ```

3. **Permission denied**:
   ```bash
   # Fix uploads directory permissions
   sudo chown -R 1001:1001 uploads/
   ```

4. **Out of memory**:
   ```bash
   # Increase Docker memory limit
   # In Docker Desktop: Settings > Resources > Memory
   ```

## 📈 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Container Stats
```bash
# Resource usage
docker stats

# Specific container
docker stats 360-web-backend
```

## 🔄 Updates

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Or for production
docker-compose -f docker-compose.prod.yml up -d --build
```

### Update Dependencies
```bash
# Rebuild with no cache
docker-compose build --no-cache backend
docker-compose up -d backend
```

## 🎯 Admin Credentials

- **Email**: `alfredkaizen30@gmail.com`
- **Password**: `@gmail2020k`

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Docker Guide](https://docs.nestjs.com/recipes/docker)
