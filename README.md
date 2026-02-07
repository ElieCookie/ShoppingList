## Local Development (Docker Only)

# 1. Build the images

docker build -t shop-api:v1 ./api
docker build -t shop-ui:v1 ./ui

# 2. Run the Database

docker run -d --name mysql-db -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 mysql:8

# 3. Run the API (connecting to the DB)

docker run -d --name shop-api -p 3000:3000 -e DB_HOST=host.docker.internal shop-api:v1

# 4. Run the UI

docker run -d --name shop-ui -p 8080:80 shop-ui:v1

## Kubernetes Local Deployment (Minikube)

# 1. Start Environment

minikube start
minikube addons enable ingress
eval $(minikube docker-env)

# 2. Build images directly into Minikube

docker build -t shop-api:v1 ./api
docker build -t shop-ui:v1 ./ui

# 3. Install via Helm (Local Folder)

helm install shop-release ./helm-chart \
 --set images.api=shop-api:v1 \
 --set images.webui=shop-ui:v1 \
 --set secret.rootPassword="password" \
 --set ingress.enabled=true \
 --set ingress.host="shop.local"

# 4. Bridge to Browser

# Keep this running in a separate tab!

minikube tunnel

## Production: Hosting Helm on GHCR

# 1. Package the chart

# This creates a file like shop-master-0.1.0.tgz

helm package ./helm-chart

# 2. Login to GitHub Container Registry

# Use a Classic PAT with 'write:packages' scope

export CR_PAT=YOUR_PERSONAL_ACCESS_TOKEN
echo $CR_PAT | helm registry login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# 3. Push the chart

helm push shop-master-0.1.0.tgz oci://ghcr.io/YOUR_GITHUB_USERNAME/charts

# 4. Install from the Cloud

helm install my-release oci://ghcr.io/YOUR_GITHUB_USERNAME/charts/shop-master \
 --version 0.1.0 \
 --set secret.rootPassword="password"

## API Readme

# Shopping List API

A NestJS backend providing a RESTful API for a shopping list application.

## Tech Stack

- NestJS
- TypeORM / MySQL
- Swagger (available at /api/docs)

## Environment Variables

- `DB_HOST`: Database hostname (default: localhost)
- `DB_PASSWORD`: Root password for MySQL

## WebUI Readme

# Shopping List Frontend

A Vue.js application that serves as the user interface.

## Tech Stack

- Vue.js / Vite
- Nginx (for serving and proxying)

## Internal Proxy

Nginx is configured to proxy requests from `/api/*` to the backend service at port 80.
