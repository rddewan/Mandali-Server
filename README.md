# Mandali - Church 
Church management SAAS

### Setup
- Development DB Seed `npm run seed:dev`
- Production DB Seed `npm run seed:prod`

### Command
- Run POSTGRES docker container  `docker-compose --env-file .env.development  up -d`
- Run DB migration `npx prisma migrate dev --name init`
- Run DB Seed ``