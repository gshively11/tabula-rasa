build:
	@echo "Building tabula-rasa..."
	@docker build --target app -t tabula-rasa:latest-app .

test:
	@echo "Running tests on tabula-rasa"
	@docker build --target base -t tabula-rasa:latest-base .
	@docker run --rm --init --name tabula-rasa -e DATABASE_URL="file:../db/default.db" tabula-rasa:latest-base npm run test

run:
	@echo "Running tabula-rasa..."
	@docker run --rm --init --name tabula-rasa -p 3000:3000 -m 256m --cpus 0.75 -e NODE_ENV=production -e DATABASE_URL="file:../db/default.db" tabula-rasa:latest-app

db-reset:
	@echo "Resetting the database..."
	@docker exec -it tabula-rasa npm run db-reset
