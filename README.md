## 🚀 How to Run this Project
#### Install the Chart:
Bash
`helm install shop-release oci://ghcr.io/eliecookie/shop-master --version 0.1.0 --set secret.rootPassword="admin"`

#### Enable Ingress & Network:
Bash
`minikube addons enable ingress`
`minikube tunnel`
Configure DNS (Local): Add 127.0.0.1 shop.local to your `/etc/hosts` file.

#### Access: Open http://shop.local in your browser. It will show you the main page. 
To access the livez and readyz please add the path: /api/livez or /api/readyz.

##### If you are on Linux, you may need to use $(minikube ip) instead of 127.0.0.1 in your hosts file.


## API Readme
### Shopping List API
A NestJS backend providing a RESTful API for a shopping list application.

### Tech Stack
- NestJS
- TypeORM / MySQL

### Endpoints

- GET `/items` (list all items)
- GET `/items/{id}` (fetch one item)
- POST `/items` (create; body: `{ "task": "..." }`, status defaults to "Todo", id generated as MAX(id)+1 within a transaction)
- PUT/PATCH `/items/{id}` (update task and/or status; valid statuses: "Todo", "In Progress", "Complete"; response shows updated_fields or "no changes")
- DELETE `/items/{id}` (remove item)
- GET `/livez`, GET `/readyz` (health probes)

### API Usage Examples with curl
Assuming service is running locally on port 3000.

#### List all items
```bash
curl http://localhost:3000/items
```

#### Get a specific item
```bash
curl http://localhost:3000/items/1
```

#### Create a new item
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"task": "Buy groceries"}'
```

#### Update an item (PATCH)
```bash
# Update only status
curl -X PATCH http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress"}'

# Update only task
curl -X PATCH http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"task": "Buy organic groceries"}'

# Update both task and status
curl -X PATCH http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"task": "Buy groceries and cook", "status": "Complete"}'
```

#### Delete an item
```bash
curl -X DELETE http://localhost:3000/items/1
```

#### Health checks
```bash
# Liveness probe
curl http://localhost:3000/livez

# Readiness probe
curl http://localhost:3000/readyz
```

### Running the API
#### Run locally

```bash
cd api
npm install
npm run start
```

Set environment variables as needed for your database configuration.

#### Build and run the NestJS API as a container

```bash
cd api
docker build -t shopping-list-api .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL=<database-url> \
  shopping-list-api
```

### Item Schema

Each item has the following structure:

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `id` | number | Unique identifier | Auto-generated |
| `task` | string | Task description | Required |
| `status` | string | Item status | `Todo` |

Valid status values: `Todo`, `In Progress`, `Complete`


### Environment Variables

- `DB_HOST`: Database hostname (default: localhost)
- `DB_PASSWORD`: Root password for MySQL

## WebUI Readme
### Shopping List Frontend
A Vue.js application that serves as the user interface.

### Tech Stack
- Vue.js / Vite
- Nginx (for serving and proxying)

### Internal Proxy
Nginx is configured to proxy requests from `/api/*` to the backend service at port 80.



