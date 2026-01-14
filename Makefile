.PHONY: up down init-db logs dev test

up:
	docker compose up -d
	npm run dev

down:
	docker compose down

logs:
	docker compose logs -f

build:
	docker compose up -d --build

init-db:
	npx ts-node src/scripts/init-db.ts

test:
	npm test

fixers:
	npm run lint:fix
	npx sonarqube-scanner
