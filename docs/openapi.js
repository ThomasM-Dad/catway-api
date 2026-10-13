// Description OpenAPI 3 de l'API, affichée par Swagger UI sur /docs

const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const jsonContent = (schema) => ({ "application/json": { schema } });
const requestBody = (name) => ({
  required: true,
  content: jsonContent(ref(name)),
});
const response = (description, schema) =>
  schema ? { description, content: jsonContent(schema) } : { description };
const errorRef = (name) => ({ $ref: `#/components/responses/${name}` });
const param = (name) => ({ $ref: `#/components/parameters/${name}` });

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "API du port de plaisance de Russell",
    version: "1.0.0",
    description:
      "API privée de gestion des catways (appontements), de leurs réservations et des utilisateurs de la capitainerie.\n\n" +
      "**Authentification** : toutes les routes, sauf `/login` et `/logout`, demandent d'être connecté. " +
      "Connectez-vous d'abord sur la page d'accueil de l'application : le cookie `token` est ensuite envoyé automatiquement par le navigateur, y compris depuis cette page de documentation.\n\n" +
      "**Identifiants dans les URL** : un catway est identifié par son numéro (`catwayNumber`), un utilisateur par son adresse e-mail, une réservation par son identifiant `_id`. " +
      "Les réservations sont une sous-ressource des catways : `/catways/{id}/reservations/{idReservation}`.",
  },
  servers: [{ url: "/" }],
  security: [{ cookieAuth: [] }],
  tags: [
    { name: "Authentification" },
    { name: "Utilisateurs" },
    { name: "Catways" },
    { name: "Réservations" },
  ],
  paths: {
    "/login": {
      post: {
        tags: ["Authentification"],
        summary: "Se connecter",
        description:
          "Vérifie l'adresse e-mail et le mot de passe. En cas de succès, un cookie `token` est posé dans le navigateur.",
        security: [],
        requestBody: requestBody("Login"),
        responses: {
          200: response("Connexion réussie", {
            type: "object",
            properties: { user: ref("User") },
          }),
          401: response(
            "Adresse e-mail ou mot de passe incorrect",
            ref("Error"),
          ),
        },
      },
    },
    "/logout": {
      get: {
        tags: ["Authentification"],
        summary: "Se déconnecter",
        description: "Supprime le cookie `token`.",
        security: [],
        responses: {
          200: response("Déconnexion réussie", ref("Message")),
        },
      },
    },
    "/me": {
      get: {
        tags: ["Authentification"],
        summary: "Récupérer l'utilisateur connecté",
        description:
          "Renvoie le nom d'utilisateur et l'adresse e-mail de la personne connectée. Utilisé par le tableau de bord.",
        responses: {
          200: response("Utilisateur connecté", {
            type: "object",
            properties: { user: ref("User") },
          }),
          401: errorRef("Unauthorized"),
        },
      },
    },

    "/users": {
      get: {
        tags: ["Utilisateurs"],
        summary: "Lister les utilisateurs",
        responses: {
          200: response("Liste des utilisateurs", {
            type: "array",
            items: ref("User"),
          }),
          401: errorRef("Unauthorized"),
        },
      },
      post: {
        tags: ["Utilisateurs"],
        summary: "Créer un utilisateur",
        description:
          "Le mot de passe fait au moins 6 caractères et l'adresse e-mail doit être unique.",
        requestBody: requestBody("UserInput"),
        responses: {
          201: response("Utilisateur créé", ref("User")),
          400: errorRef("BadRequest"),
          401: errorRef("Unauthorized"),
        },
      },
    },
    "/users/{email}": {
      parameters: [param("Email")],
      get: {
        tags: ["Utilisateurs"],
        summary: "Récupérer le détail d'un utilisateur",
        responses: {
          200: response("Utilisateur", ref("User")),
          401: errorRef("Unauthorized"),
          404: errorRef("NotFound"),
        },
      },
      put: {
        tags: ["Utilisateurs"],
        summary: "Modifier un utilisateur",
        description: "Les champs absents de la requête ne sont pas modifiés.",
        requestBody: requestBody("UserUpdate"),
        responses: {
          200: response("Utilisateur modifié", ref("User")),
          400: errorRef("BadRequest"),
          401: errorRef("Unauthorized"),
          404: errorRef("NotFound"),
        },
      },
      delete: {
        tags: ["Utilisateurs"],
        summary: "Supprimer un utilisateur",
        responses: {
          204: response("Utilisateur supprimé"),
          401: errorRef("Unauthorized"),
          404: errorRef("NotFound"),
        },
      },
    },

    "/catways": {
      get: {
        tags: ["Catways"],
        summary: "Lister les catways",
        responses: {
          200: response("Liste des catways", {
            type: "array",
            items: ref("Catway"),
          }),
          401: errorRef("Unauthorized"),
        },
      },
      post: {
        tags: ["Catways"],
        summary: "Créer un catway",
        requestBody: requestBody("CatwayInput"),
        responses: {
          201: response("Catway créé", ref("Catway")),
          400: errorRef("BadRequest"),
          401: errorRef("Unauthorized"),
        },
      },
    },
    "/catways/{id}": {
      parameters: [param("CatwayId")],
      get: {
        tags: ["Catways"],
        summary: "Récupérer le détail d'un catway",
        responses: {
          200: response("Catway", ref("Catway")),
          401: errorRef("Unauthorized"),
          404: errorRef("NotFound"),
        },
      },
      put: {
        tags: ["Catways"],
        summary: "Modifier l'état d'un catway",
        description:
          "Seul `catwayState` est modifiable : le numéro et le type ne peuvent pas être changés.",
        requestBody: requestBody("CatwayUpdate"),
        responses: {
          200: response("Catway modifié", ref("Catway")),
          400: errorRef("BadRequest"),
          401: errorRef("Unauthorized"),
          404: errorRef("NotFound"),
        },
      },
      delete: {
        tags: ["Catways"],
        summary: "Supprimer un catway",
        responses: {
          204: response("Catway supprimé"),
          401: errorRef("Unauthorized"),
          404: errorRef("NotFound"),
        },
      },
    },

    "/catways/{id}/reservations": {
      parameters: [param("CatwayId")],
      get: {
        tags: ["Réservations"],
        summary: "Lister les réservations d'un catway",
        responses: {
          200: response("Liste des réservations", {
            type: "array",
            items: ref("Reservation"),
          }),
          401: errorRef("Unauthorized"),
          404: errorRef("NotFound"),
        },
      },
      post: {
        tags: ["Réservations"],
        summary: "Créer une réservation",
        description:
          "La date de fin doit être postérieure à la date de début. Une réservation ne peut pas chevaucher une autre réservation du même catway.",
        requestBody: requestBody("ReservationInput"),
        responses: {
          201: response("Réservation créée", ref("Reservation")),
          400: errorRef("BadRequest"),
          401: errorRef("Unauthorized"),
          404: errorRef("NotFound"),
          409: errorRef("Conflict"),
        },
      },
    },
    "/catways/{id}/reservations/{idReservation}": {
      parameters: [param("CatwayId"), param("ReservationId")],
      get: {
        tags: ["Réservations"],
        summary: "Récupérer le détail d'une réservation",
        responses: {
          200: response("Réservation", ref("Reservation")),
          401: errorRef("Unauthorized"),
          404: errorRef("NotFound"),
        },
      },
      put: {
        tags: ["Réservations"],
        summary: "Modifier une réservation",
        description:
          "Les champs absents de la requête ne sont pas modifiés. Le catway ne peut pas être changé.",
        requestBody: requestBody("ReservationUpdate"),
        responses: {
          200: response("Réservation modifiée", ref("Reservation")),
          400: errorRef("BadRequest"),
          401: errorRef("Unauthorized"),
          404: errorRef("NotFound"),
          409: errorRef("Conflict"),
        },
      },
      delete: {
        tags: ["Réservations"],
        summary: "Supprimer une réservation",
        responses: {
          204: response("Réservation supprimée"),
          401: errorRef("Unauthorized"),
          404: errorRef("NotFound"),
        },
      },
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
        description:
          "Cookie posé par `POST /login`. Connectez-vous d'abord sur la page d'accueil de l'application.",
      },
    },
    parameters: {
      Email: {
        name: "email",
        in: "path",
        required: true,
        description: "Adresse e-mail de l'utilisateur",
        schema: { type: "string", format: "email" },
      },
      CatwayId: {
        name: "id",
        in: "path",
        required: true,
        description: "Numéro du catway (`catwayNumber`)",
        schema: { type: "integer", example: 1 },
      },
      ReservationId: {
        name: "idReservation",
        in: "path",
        required: true,
        description: "Identifiant `_id` de la réservation",
        schema: { type: "string" },
      },
    },
    responses: {
      BadRequest: response(
        "Données invalides (champ manquant, valeur incorrecte, doublon...)",
        ref("Error"),
      ),
      Unauthorized: response(
        "Non connecté : utilisez `POST /login` ou connectez-vous sur la page d'accueil",
        ref("Error"),
      ),
      NotFound: response("Ressource introuvable", ref("Error")),
      Conflict: response(
        "Le catway est déjà réservé sur cette période",
        ref("Error"),
      ),
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          message: { type: "string", example: "Catway introuvable" },
        },
      },
      Message: {
        type: "object",
        properties: {
          message: { type: "string", example: "Déconnexion réussie" },
        },
      },
      Login: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "capitaine@russell.fr",
          },
          password: { type: "string", format: "password" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          username: { type: "string", example: "Capitaine" },
          email: {
            type: "string",
            format: "email",
            example: "capitaine@russell.fr",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UserInput: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", example: "Capitaine" },
          email: {
            type: "string",
            format: "email",
            example: "capitaine@russell.fr",
          },
          password: { type: "string", format: "password", minLength: 6 },
        },
      },
      UserUpdate: {
        type: "object",
        properties: {
          username: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password", minLength: 6 },
        },
      },
      Catway: {
        type: "object",
        properties: {
          _id: { type: "string" },
          catwayNumber: { type: "integer", example: 1 },
          catwayType: { type: "string", enum: ["long", "short"] },
          catwayState: { type: "string", example: "bon état" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CatwayInput: {
        type: "object",
        required: ["catwayNumber", "catwayType", "catwayState"],
        properties: {
          catwayNumber: { type: "integer", example: 25 },
          catwayType: { type: "string", enum: ["long", "short"] },
          catwayState: { type: "string", example: "bon état" },
        },
      },
      CatwayUpdate: {
        type: "object",
        required: ["catwayState"],
        properties: {
          catwayState: { type: "string", example: "En cours de réparation" },
        },
      },
      Reservation: {
        type: "object",
        properties: {
          _id: { type: "string" },
          catwayNumber: { type: "integer", example: 1 },
          clientName: { type: "string", example: "Thomas Martin" },
          boatName: { type: "string", example: "Carolina" },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ReservationInput: {
        type: "object",
        required: ["clientName", "boatName", "startDate", "endDate"],
        properties: {
          clientName: { type: "string", example: "Thomas Martin" },
          boatName: { type: "string", example: "Carolina" },
          startDate: { type: "string", format: "date", example: "2026-11-01" },
          endDate: { type: "string", format: "date", example: "2026-11-10" },
        },
      },
      ReservationUpdate: {
        type: "object",
        properties: {
          clientName: { type: "string" },
          boatName: { type: "string" },
          startDate: { type: "string", format: "date" },
          endDate: { type: "string", format: "date" },
        },
      },
    },
  },
};
