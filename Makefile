build:
	@echo "Building tabula-rasa..."
	@docker build --target app -t tabula-rasa:latest-app .

test:
	@echo "Running tests on tabula-rasa"
	@docker build --target base -t tabula-rasa:latest-base .
	@docker run --rm --init tabula-rasa:latest-base npm run test

run:
	@echo "Running tabula-rasa..."
	@docker run --rm --init -p 3000:3000 -m 256m --cpus 0.75 -e NODE_ENV=production tabula-rasa:latest-app
