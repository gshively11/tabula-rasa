build:
	@docker build -t tabula-rasa .

run:
	@docker run --init -p 3000:3000 -m 256m --cpus 0.75 tabula-rasa
