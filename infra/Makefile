

deploy:
	terraform apply
	make export

export:
	terraform output --json > ../infrastructure.json
