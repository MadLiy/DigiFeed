# TP FINAL - Cahier des charges – Mini Réseau Social

## Objectif

Développer une API backend (NestJS + Prisma) permettant de gérer un réseau social simplifié.
L’application devra être sécurisée (authentification) et permettre aux utilisateurs d’interagir entre eux via des posts, des likes et un système de suivi.

Vous ne faites que la partie backend, en implémentant toutes les routes et les modeles les plus complets de maniere 
a correspondre à la demande du client suivante.
Libre à vous d'implémenter routes et paramtetres de la maniere la plus realiste possible

## Gestion des utilisateurs

- Les utilisateurs doivent pouvoir créer un compte et se connecter.
- Chaque utilisateur dispose d’un profil avec au moins : nom, email, date de création du compte.
- Un utilisateur doit pouvoir consulter son profil ainsi que celui des autres membres.
- Un utilisateur doit pouvoir suivre et ne plus suivre d’autres utilisateurs.
- Il doit être possible de voir la liste des personnes que l’on suit et de voir ses abonnés.

## Gestion des posts

- Un utilisateur connecté doit pouvoir publier un post (texte + éventuellement une image).
- Un utilisateur doit pouvoir supprimer uniquement ses propres posts.
- Les posts doivent contenir la date de publication et le nom de l’auteur.
- Tous les utilisateurs doivent pouvoir voir la liste des posts publiés.
- Un utilisateur doit pouvoir consulter uniquement les posts publiés par les personnes qu’il suit (feed personnalisé).

## Gestion des likes

- Un utilisateur connecté doit pouvoir aimer un post.
- Il doit être possible de retirer son like.
- Chaque post doit indiquer le nombre total de likes reçus.
- Un utilisateur ne peut liker un post qu’une seule fois.

## Sécurité & contraintes

- L’accès aux fonctionnalités principales (créer un post, liker, suivre quelqu’un, etc.) est réservé aux utilisateurs connectés.
- Chaque utilisateur ne peut modifier ou supprimer que ses propres données (ex: posts, like).
- Le système doit être conçu de manière à pouvoir évoluer si nécessaire (ex: ajout futur de commentaires ou de tags = architecture modulaire et code propre).
- Ajouter un readme détaillé sur le lancement de l'API en local
- Ajouter une journalisation des requêtes dans un fichier à la racine du projet
- BONUS (option) Implémenter un swagger (openapi) complet de l'API

## Attendus techniques

- L’API doit être développée avec NestJS et utiliser Prisma comme ORM.
- La base de données doit être relationnelle (PostgreSQL de préférence).
- Les relations entre les entités (utilisateurs, posts, likes, follow) doivent être correctement modélisées.
- Les données doivent être cohérentes et valides (ex: pas de follow en double, pas de like multiple).