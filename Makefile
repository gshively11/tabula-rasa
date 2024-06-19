# Build the tabula-rasa app
build:
	@echo "Building tabula-rasa..."
	@docker build --target app -t tabula-rasa:latest-app .

# Run tests (except for E2E)
test:
	@echo "Running tests on tabula-rasa"
	@docker build --target builder -t tabula-rasa:latest-builder .
	@docker run --rm --init --name tabula-rasa tabula-rasa:latest-builder npm run test

# Run the latest build of the tabula-rasa app
run:
	@echo "Running tabula-rasa..."
	@docker run --privileged --rm --init --name tabula-rasa -p 3000:3000 -m 256m --cpus 0.75 -e NODE_ENV=production -v ${PWD}/db:/litefs tabula-rasa:latest-app run-tabula-rasa

# Open a shell in the currently running tabula-rasa container
shell:
	@echo "Starting shell in tabula-rasa container..."
	@docker exec -it tabula-rasa /bin/sh

# Clear all the data out of the database
db-reset:
	@echo "Resetting the database..."
	@docker exec -it tabula-rasa npm run db-reset --force

# Run E2E tests
e2e:
	@echo "Running E2E tests on tabula-rasa"
	@docker build --target e2e -t tabula-rasa:latest-e2e .
	@docker run --rm --init --name tabula-rasa -v ${PWD}/tests/__screenshots__:/home/node/app/tests/__screenshots__ --network host -e JWT_SECRET=e2e tabula-rasa:latest-e2e e2e

# Run E2E tests
e2e-update:
	@echo "Running E2E tests on tabula-rasa"
	@docker build --target e2e -t tabula-rasa:latest-e2e .
	@docker run --rm --init --name tabula-rasa -v ${PWD}/tests/__screenshots__:/home/node/app/tests/__screenshots__ --network host -e JWT_SECRET=e2e tabula-rasa:latest-e2e e2e-update

# Run E2E tests in CI environments
# In CI environments, we don't mount screenshots in a volume, and we don't run in host network mode
e2e-ci:
	@echo "Running E2E tests on tabula-rasa"
	@docker build --target e2e -t tabula-rasa:latest-e2e .
	@docker run --rm --init --name tabula-rasa -e JWT_SECRET=e2e -e CI=true tabula-rasa:latest-e2e e2e

# Hack to fix ownership perms on tests/__screenshots__/, which is mounted to
# docker and written to as root.
fix-perms:
	@echo "Fixing perms on tests/__screenshots__"
	@sudo chown -R $$(whoami) tests/__screenshots__
