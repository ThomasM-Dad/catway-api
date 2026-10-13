# API du port de plaisance de Russell

API privée de gestion des **catways** (appontements), de leurs **réservations** et des **utilisateurs** de la capitainerie, accompagnée d'une application web (page d'accueil, tableau de bord et pages de gestion) qui la consomme.

## Accès à l'application

| | |
|---|---|
| **Application en ligne** | `https://catway-api-vwe0.onrender.com/` |
| **Documentation de l'API** | `https://catway-api-vwe0.onrender.com/docs/` |
| **Dépôt GitHub** | https://github.com/ThomasM-Dad/catway-api |

### Compte de test

| | |
|---|---|
| **E-mail** | `correcteur@russell.fr` |
| **Mot de passe** | `azerty123*` |

> **Premier chargement lent** : l'application est hébergée sur l'offre gratuite de Render, qui met le service en veille après 15 minutes sans visite. Le premier chargement peut donc prendre une trentaine de secondes. Les suivants sont instantanés.

## Fonctionnalités

- **Page d'accueil** : présentation de l'application, formulaire de connexion, lien vers la documentation.
- **Tableau de bord** : utilisateur connecté, date du jour, tableau des réservations en cours, menu de navigation et déconnexion.
- **Catways** : lister, créer, consulter, modifier l'état et supprimer.
- **Réservations** : gérées par catway, avec vérification des dates et détection des chevauchements.
- **Utilisateurs** : lister, créer, consulter, modifier et supprimer.
- **Authentification** : connexion par e-mail et mot de passe, session par cookie sécurisé.

## Technologies

- **Node.js** et **Express** (back-end)
- **MongoDB Atlas** avec **Mongoose** (base de données)
- **JWT** (cookie `httpOnly`) et **bcryptjs** (hachage des mots de passe)
- **Swagger UI** (documentation OpenAPI)
- **HTML / CSS / JavaScript** natif, avec `fetch` (front-end)
- **Render** (hébergement)

## Architecture

Le projet suit une architecture en couches : `routes → controllers → services → models`.

```
├── bin/www                 Démarrage du serveur
├── app.js                  Configuration Express
├── db/mongo.js             Connexion à MongoDB
├── routes/                 Définition des routes
├── controllers/            Gestion des requêtes et des réponses HTTP
├── services/               Logique métier
├── models/                 Schémas Mongoose (User, Catway, Reservation)
├── middlewares/auth.js     Protection des routes (vérification du JWT)
├── docs/openapi.js         Description OpenAPI de l'API
└── public/                 Application web (HTML, CSS, JavaScript)
```

## Routes de l'API

Toutes les routes, sauf `/login` et `/logout`, nécessitent d'être connecté.

| Méthode | Route | Description |
|---|---|---|
| POST | `/login` | Se connecter |
| GET | `/logout` | Se déconnecter |
| GET | `/me` | Utilisateur connecté |
| GET, POST | `/users` | Lister, créer des utilisateurs |
| GET, PUT, DELETE | `/users/:email` | Consulter, modifier, supprimer un utilisateur |
| GET, POST | `/catways` | Lister, créer des catways |
| GET, PUT, DELETE | `/catways/:id` | Consulter, modifier l'état, supprimer un catway |
| GET, POST | `/catways/:id/reservations` | Lister, créer les réservations d'un catway |
| GET, PUT, DELETE | `/catways/:id/reservations/:idReservation` | Consulter, modifier, supprimer une réservation |

Le détail complet (paramètres, corps de requête, codes de réponse) est disponible dans la documentation Swagger sur `/docs`.

## Déploiement

L'application est déployée sur **Render** (Web Service) à partir de la branche `main` :

- **Build Command** : `npm install`
- **Start Command** : `npm start`
- les variables d'environnement sont renseignées dans le tableau de bord Render ;
- l'accès réseau de MongoDB Atlas autorise les connexions depuis Render.