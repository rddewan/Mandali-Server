# Mandali - Church 
Church management SAAS - API

# Course
* [https://mobileacademy/course](https://mobileacademy.io/courses/)

# Projects

| Project               | URL                                            |
| --------------------- | ---------------------------------------------- |
| BE API (NestJS)       | https://github.com/rddewan/Mandali-Server      |
| FE Admin (React)      | https://github.com/rddewan/Mandali-Admin-Panel |
| FE Mobile (Flutter)   | https://github.com/rddewan/mandali-mobile      |


### Setup Local Development
1. Install Docker : 
```bash 
https://www.docker.com/products/docker-desktop/
```
2. Build and Run Docker Image: 
```bash
docker-compose -f docker-compose-dev.yaml --env-file .env.development up --build
```
3. DB Seed:
 ```bash
 npm run seed:dev
```
4. Start Development Server
```bash
npm run start:dev
```


### Command
- Run docker container dev  `docker-compose -f docker-compose-dev.yaml --env-file .env.development up --build`
- Run POSTGRES docker qa  `docker-compose -f docker-compose-qa.yaml --env-file .env.qa up --build`
- Run DB migration `npx prisma migrate dev --name init`
- Development Run DB Seed `npm run seed:dev`
- Production DB Seed `npm run seed:prod`

### DB migration in Development
* `npm run prisma-migrate:dev` and follow the instruction
* `npx prisma generate` update prisma client after change in schema


### Generate Base64
-  openssl rand -base64 32