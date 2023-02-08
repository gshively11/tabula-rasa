build:
	@docker build -t tabula-rasa .

run:
	@docker run -P -p 3000:3000 tabula-rasa
