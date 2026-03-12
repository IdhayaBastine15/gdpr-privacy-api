.PHONY: up down logs build migrate test shell-backend shell-db seed-admin

## Start all services (build if needed)
up:
	docker compose up --build

## Start in detached mode
up-d:
	docker compose up --build -d

## Stop all services
down:
	docker compose down

## Stop and remove volumes (wipes database)
down-v:
	docker compose down -v

## View live logs
logs:
	docker compose logs -f

## View backend logs only
logs-backend:
	docker compose logs -f backend

## Rebuild all images without cache
build:
	docker compose build --no-cache

## Run Alembic migrations inside the backend container
migrate:
	docker compose exec backend alembic upgrade head

## Run pytest inside the backend container
test:
	docker compose exec backend pytest tests/ -v

## Open a shell in the backend container
shell-backend:
	docker compose exec backend sh

## Open a psql shell in the database container
shell-db:
	docker compose exec db psql -U $${POSTGRES_USER:-gdpr_user} -d $${POSTGRES_DB:-gdpr_db}

## Create an admin user (usage: make seed-admin EMAIL=admin@example.com PASSWORD=secret)
seed-admin:
	docker compose exec backend python -m scripts.create_admin --email $(EMAIL) --password $(PASSWORD)

## Local backend dev (no Docker)
dev-backend:
	cd gdpr-privacy-api && uvicorn app.main:app --reload --port 8000

## Local frontend dev (no Docker)
dev-frontend:
	cd frontend && npm run dev
