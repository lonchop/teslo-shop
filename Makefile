build:
	docker build -f php-fpm.Dockerfile -t foodscan-php:latest .
	docker build -f nginx.Dockerfile -t foodscan-nginx:latest .

run:
	docker compose -f docker-compose.yml up -d --build postgres pgadmin

deps:
	docker exec -u 1000 -i foodscan-php /bin/sh -c "composer install --ignore-platform-req=ext-http"
	docker exec -u 1000 -i foodscan-php /bin/sh -c "php artisan migrate --seed"
	docker run --rm -v .:/var/www/html -u root -i node:alpine /bin/sh -c "cd /var/www/html && yarn install && yarn run build"
	docker exec -u 1000 -i foodscan-php /bin/sh -c "php artisan storage:link"

perms:
	docker exec -u root -i teslo-shop-postgres /bin/sh -c "chown -R postgres:www-data /var/lib/postgresql/data/*"
	docker exec -u postgres -i teslo-shop-postgres /bin/sh -c "chmod -R g+rw /var/lib/postgresql/data/*"

down:
	docker compose -f docker-compose.yml down
