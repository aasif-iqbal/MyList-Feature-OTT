# 1. Clone the repo
git clone <your-repo-url>
cd ott-mylist

# 2. Start MongoDB + API (auto builds & hot-reloads in dev)
docker-compose up --build

# API will be available at:
http://localhost:3000

### Local Development with Docker

```bash
# Start MongoDB + API (hot reload)
docker-compose up --build

# Run tests
docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm test

# Seed initial data
docker-compose run --rm app npm run seed
