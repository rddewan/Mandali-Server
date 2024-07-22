# Mandali - Church 
Church management SAAS

### Setup
- Development DB Seed `npm run seed:dev`
- Production DB Seed `npm run seed:prod`

### Command
- Run docker container dev  `docker-compose -f docker-compose-dev.yaml --env-file .env.development up --build`
- Run POSTGRES docker qa  `docker-compose -f docker-compose-qa.yaml --env-file .env.qa up --build`
- Run DB migration `npx prisma migrate dev --name init`
- Run DB Seed ``


### Generate Base64
-  openssl rand -base64 32