# DigiFeed
### Description
Développement d'une API backend (NestJS + Prisma) permettant de gérer un réseau social simplifié.
L’application est sécurisée (authentification) et permet aux utilisateurs d’interagir entre eux via des posts, des likes et un système de suivi.

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

## Cmd pour crée des fichiers

```
$ nest g module auth
$ nest g controller auth
$ nest g service auth

```

## Project setup

```bash
$ npm install
```

## 

## Endpoint

### Tous les endpoints sauf /auth/ sont protégés par JWT (guard).

### Auth
- POST /auth/register — { name, email, password } => crée user
- POST /auth/login — { email, password } => { accessToken }

### Users
- GET /users/me — profil connecté
- GET /users/:id — profil public d’un user
- GET /users/:id/followers — liste abonnés
- GET /users/:id/following — liste suivis
- POST /users/:id/follow — follow user
- DELETE /users/:id/follow — unfollow user
- GET /users — recherche / list users (q, page, limit)

### Posts
- POST /posts — create post
- GET /posts — list all posts
- GET /posts/:id — get post details
- DELETE /posts/:id — delete
- GET /posts/me — posts by connected user
- GET /posts/feed — personalized feed (posts by users you follow), ordered desc by createdAt 

### Likes
- POST /likes — like a post with body : { "postId": 1 }
- DELETE likes/id — remove like
- GET /likes/:id/count — list users that liked