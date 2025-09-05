## Création project

```bash
$ nest new projet-tp-final
$ npm i class-validator
$ npm i class-transformer
$ npm i prisma --save-dev
$ npm install @prisma/client
$ npx prisma init
$ npm i --save @nestjs/jwt
$ npm i csrf-csrf
$ npm i --save @nestjs/thottler
$ npm i bcrypt
```


## Configuration .env 

DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

## Migration 

```bash
$ npx prisma migrate dev --name init
$ npx prisma generate
$npx prisma migrate reset
```
auth, users, posts, likes, prisma, 

## Cmd pour crée des fichier

```
$ nest g module auth
$ nest g controller auth
$ nest g service auth

```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Endpoint

Tous les endpoints sauf /auth/ sont protégés par JWT (guard).
Auth
POST /auth/register — { name, email, password } => crée user
POST /auth/login — { email, password } => { accessToken }
Users
GET /users/me — profil connecté
GET /users/:id — profil public d’un user
GET /users/:id/followers — liste abonnés (pagination)
GET /users/:id/following — liste suivis (pagination)
POST /users/:id/follow — follow user
DELETE /users/:id/follow — unfollow user
GET /users — recherche / list users (q, page, limit)
Posts
POST /posts — create post (multipart/form-data ou JSON avec imageUrl)
GET /posts — list all posts (global feed) (page, limit)
GET /posts/:id — get post details (includes likes count and author)
DELETE /posts/:id — delete (only author)
GET /posts/me — posts by connected user
GET /posts/feed — personalized feed (posts by users you follow), ordered desc by createdAt (page, limit)
Likes
POST /posts/:id/like — like a post
DELETE /posts/:id/like — remove like
GET /posts/:id/likes — list users that liked (optional pagination)
(Alternatively POST /likes/toggle but prefer explicit routes)