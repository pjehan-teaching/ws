# Web Temps Réel

**Durée totale :** 15 heures (2 jours)  
**Technologies :** TypeScript, Node.js, Socket.io

## Jour 1 (7h30)

### Séance 1 : Introduction au temps réel sur le web (1h30)

#### Objectifs
- Comprendre les besoins de communication en temps réel
- Découvrir les différentes techniques disponibles
- Installer l'environnement de développement
#### Contenu théorique (45 min)
- Qu'est-ce que le temps réel sur le web ?
- Cas d'usage concrets : chat, notifications, tableaux de bord, jeux multijoueurs
- Évolution historique des techniques de communication client-serveur
- Présentation du modèle requête-réponse HTTP classique
- Limitations du protocole HTTP pour le temps réel
#### Mise en pratique (45 min)
- Configuration de l'environnement de développement
    - Installation de Node.js et npm
    - Installation de TypeScript (`npm install -g typescript`)
    - Configuration de `tsconfig.json`
    - Installation des dépendances de base : `express`, `@types/express`, `@types/node`
- Création d'un serveur HTTP basique en TypeScript
- Mise en place d'une structure de projet
  ```
  /src
    /server
      server.ts
    /client
      index.html
  /dist
  tsconfig.json
  package.json
  ```

#### Ressources
- Documentation MDN : HTTP protocol
- Documentation officielle TypeScript
---

### Séance 2 : Polling (1h30)

#### Objectifs
- Comprendre le principe du polling
- Implémenter une solution de polling simple
- Analyser les avantages et inconvénients
#### Contenu théorique (30 min)
- Définition du polling (interrogation périodique)
- Fonctionnement : requêtes HTTP répétées à intervalle régulier
- Analyse du trafic réseau généré
- Cas d'usage appropriés
#### Mise en pratique (60 min)
- Création d'un endpoint API REST pour récupérer des données
  ```typescript
  app.get('/api/messages', (req, res) => {
    // Retourne les nouveaux messages
  });
  ```
- Implémentation côté client avec `setInterval()` et `fetch()`
- Création d'une interface simple affichant des messages en temps "quasi-réel"
- Observation du trafic réseau avec les DevTools
#### Analyse critique
- Latence importante entre les mises à jour
- Charge serveur élevée (nombreuses requêtes inutiles)
- Consommation de bande passante
- Simplicité d'implémentation
#### Ressources
- MDN : Fetch API
- MDN : setInterval
---

### Séance 3 : Long Polling (1h30)

#### Objectifs
- Comprendre le principe du long polling
- Migrer l'application de polling vers long polling
- Comparer les performances avec le polling simple
#### Contenu théorique (30 min)
- Définition du long polling
- Différence avec le polling classique
- Mécanisme de maintien de connexion
- Gestion du timeout
- Avantages par rapport au polling simple
#### Mise en pratique (60 min)
- Modification du serveur pour maintenir la connexion ouverte
  ```typescript
  app.get('/api/long-poll', (req, res) => {
    // Attendre un événement ou timeout
    waitForNewData()
      .then(data => res.json(data))
      .catch(() => res.status(204).end());
  });
  ```
- Implémentation d'un système de file d'attente côté serveur
- Modification du client pour gérer la reconnexion automatique
- Gestion des erreurs et timeouts
#### Analyse comparative
- Réduction du nombre de requêtes
- Diminution de la latence
- Complexité accrue de l'implémentation
- Problèmes potentiels : timeouts, gestion de la reconnexion
#### Exercice
- Créer un système de notifications avec long polling
- Implémenter un compteur d'utilisateurs connectés
---

### Séance 4 : Server-Sent Events (SSE) (1h30)

#### Objectifs
- Découvrir l'API Server-Sent Events
- Implémenter une communication unidirectionnelle serveur → client
- Identifier les cas d'usage appropriés
#### Contenu théorique (30 min)
- Présentation de l'API SSE
- Protocole et format des événements
- Différences avec le long polling
- Limitations : communication unidirectionnelle
- Reconnexion automatique native
#### Mise en pratique (60 min)
- Configuration du serveur pour SSE
  ```typescript
  app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Envoi d'événements
    const sendEvent = (data: any) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
  });
  ```
- Utilisation de l'API `EventSource` côté client
  ```typescript
  const eventSource = new EventSource('/events');
  eventSource.onmessage = (event) => {
    // Traiter les données
  };
  ```
- Création d'un tableau de bord temps réel (ex: flux d'actualités)
- Gestion des événements nommés
#### Analyse critique
- Communication unidirectionnelle uniquement
- Support natif du navigateur
- Reconnexion automatique
- Pas de support IE
#### Exercice
- Créer un système de monitoring temps réel affichant des métriques serveur
---

### Séance 5 : Introduction aux WebSockets (1h30)

#### Objectifs
- Comprendre le protocole WebSocket
- Découvrir la communication bidirectionnelle
- Implémenter un premier exemple avec WebSocket natif
#### Contenu théorique (45 min)
- Présentation du protocole WebSocket (RFC 6455)
- Handshake HTTP → Upgrade vers WebSocket
- Communication full-duplex
- Différences fondamentales avec HTTP
- Avantages par rapport aux solutions précédentes
- Format des frames WebSocket
#### Mise en pratique (45 min)
- Installation de `ws` : `npm install ws @types/ws`
- Création d'un serveur WebSocket basique
  ```typescript
  import { WebSocketServer } from 'ws';
  
  const wss = new WebSocketServer({ port: 8080 });
  
  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      // Traiter le message
    });
  });
  ```
- Connexion depuis le client avec l'API WebSocket native
  ```typescript
  const socket = new WebSocket('ws://localhost:8080');
  socket.onmessage = (event) => {
    // Traiter le message
  };
  ```
- Création d'un chat simple bidirectionnel
#### Ressources
- RFC 6455 : The WebSocket Protocol
- MDN : WebSocket API
- Documentation ws library
---

## Jour 2 (7h30)

### Séance 6 : Socket.io - Bases (2h00)

#### Objectifs
- Découvrir la bibliothèque Socket.io
- Comprendre ses avantages par rapport aux WebSockets natifs
- Mettre en place un projet avec Socket.io
#### Contenu théorique (45 min)
- Présentation de Socket.io
- Fonctionnalités supplémentaires : reconnexion automatique, fallback, broadcasting
- Architecture : namespace, rooms
- Gestion automatique des transports (WebSocket, long polling...)
- Événements personnalisés
- Différences entre Socket.io v4 et versions précédentes
#### Mise en pratique (75 min)
- Installation : `npm install socket.io @types/socket.io`
- Configuration du serveur Socket.io avec Express
  ```typescript
  import express from 'express';
  import { createServer } from 'http';
  import { Server } from 'socket.io';
  
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  
  io.on('connection', (socket) => {
    console.log('Client connecté');
    
    socket.on('message', (data) => {
      // Traiter et diffuser
      io.emit('message', data);
    });
  });
  ```
- Configuration du client Socket.io
  ```typescript
  import { io } from 'socket.io-client';
  
  const socket = io('http://localhost:3000');
  socket.on('message', (data) => {
    // Afficher le message
  });
  ```
- Refactorisation du chat précédent avec Socket.io
- Implémentation d'événements personnalisés
#### Exercice
- Ajouter des indicateurs de présence (utilisateur en train de taper)
- Implémenter un système de notifications
#### Ressources
- Documentation officielle Socket.io
- Socket.io Getting Started Guide
---

### Séance 7 : Communication multi-client avec Socket.io (2h30)

#### Objectifs
- Maîtriser les différents modes de diffusion
- Implémenter un système de rooms
- Gérer plusieurs utilisateurs simultanés
#### Contenu théorique (45 min)
- Broadcasting : `emit`, `broadcast`, `to()`
- Différence entre :
    - `socket.emit()` : envoyer au client actuel
    - `socket.broadcast.emit()` : envoyer à tous sauf l'émetteur
    - `io.emit()` : envoyer à tous les clients
    - `io.to(room).emit()` : envoyer à une room spécifique
- Concept de rooms et namespaces
- Gestion des utilisateurs connectés
- Stockage de données par socket (socket.data)
#### Mise en pratique (105 min)
- Implémentation d'un système de rooms pour le chat
  ```typescript
  socket.on('join-room', (roomName: string) => {
    socket.join(roomName);
    io.to(roomName).emit('user-joined', socket.id);
  });
  
  socket.on('leave-room', (roomName: string) => {
    socket.leave(roomName);
    io.to(roomName).emit('user-left', socket.id);
  });
  
  socket.on('room-message', (roomName: string, message: string) => {
    io.to(roomName).emit('room-message', {
      user: socket.id,
      message: message
    });
  });
  ```
- Création d'un système de salons de discussion multiples
- Liste des utilisateurs présents dans chaque room
- Système de gestion des noms d'utilisateurs
- Interface permettant de changer de salon
#### Projet pratique
- Application de chat multi-rooms avec :
    - Authentification simple (nom d'utilisateur)
    - Création/suppression de salons
    - Liste des participants par salon
    - Historique des messages (en mémoire)
    - Notifications de connexion/déconnexion
#### Ressources
- Socket.io : Rooms documentation
- Socket.io : Emit cheatsheet
---

### Séance 8 : Isolation des communications et cas avancés (2h00)

#### Objectifs
- Implémenter des communications privées
- Utiliser les namespaces pour isoler des fonctionnalités
- Gérer l'authentification et les autorisations
- Optimiser les performances
#### Contenu théorique (30 min)
- Namespaces vs Rooms
- Communications privées entre deux clients
- Middleware Socket.io pour l'authentification
- Gestion des erreurs et déconnexions
- Bonnes pratiques de sécurité
- Scalabilité avec Redis adapter
#### Mise en pratique (90 min)
- Implémentation de namespaces
  ```typescript
  const chatNamespace = io.of('/chat');
  const notificationNamespace = io.of('/notifications');
  
  chatNamespace.on('connection', (socket) => {
    // Logique spécifique au chat
  });
  ```
- Mise en place d'un middleware d'authentification
  ```typescript
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (isValidToken(token)) {
      socket.data.userId = getUserIdFromToken(token);
      next();
    } else {
      next(new Error('Authentication error'));
    }
  });
  ```
- Implémentation de messages privés
  ```typescript
  socket.on('private-message', (recipientId: string, message: string) => {
    io.to(recipientId).emit('private-message', {
      from: socket.id,
      message: message
    });
  });
  ```
- Typage TypeScript des événements
  ```typescript
  interface ServerToClientEvents {
    message: (data: MessageData) => void;
    userJoined: (userId: string) => void;
  }
  
  interface ClientToServerEvents {
    sendMessage: (message: string) => void;
  }
  
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);
  ```

#### Projet final
- Finalisation d'une application complète combinant :
    - Chat public et privé
    - Salons thématiques
    - Authentification
    - Notifications en temps réel
    - Tableau de bord d'administration
---

### Séance 9 : Synthèse et évaluation (1h00)

#### Objectifs
- Récapitulatif des techniques étudiées
- Comparaison et choix de la solution appropriée selon le contexte
- Évaluation pratique
#### Récapitulatif comparatif (30 min)

| Technique | Avantages | Inconvénients | Cas d'usage |
|-----------|-----------|---------------|-------------|
| **Polling** | Simple à implémenter | Latence élevée, charge serveur | Données peu critiques, mise à jour peu fréquente |
| **Long Polling** | Meilleure latence que polling | Complexité, gestion reconnexion | Notifications occasionnelles |
| **SSE** | Natif, reconnexion auto | Unidirectionnel | Flux de données serveur→client (feeds, logs) |
| **WebSocket** | Bidirectionnel, faible latence | Nécessite serveur compatible | Applications temps réel, jeux |
| **Socket.io** | Fonctionnalités avancées, fallback | Overhead supplémentaire | Applications professionnelles complexes |

#### Choix technologique selon le contexte
- Analyser les besoins : unidirectionnel vs bidirectionnel
- Considérer la compatibilité navigateur
- Évaluer la charge serveur attendue
- Prendre en compte la complexité d'implémentation
#### Évaluation pratique (30 min)
- Quiz sur les concepts théoriques
- Exercice pratique : implémenter une fonctionnalité temps réel selon un cahier des charges
- Discussion sur les choix techniques effectués
---

## Ressources complémentaires

### Documentation officielle
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Socket.io Documentation](https://socket.io/docs/)
- [MDN Web Docs - WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [MDN Web Docs - Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
### Bibliothèques utiles
- `ws` : WebSocket library pour Node.js
- `socket.io` : Bibliothèque de communication temps réel
- `express` : Framework web pour Node.js
- `typescript` : Superset typé de JavaScript
### Outils de développement
- Postman : test d'API REST
- DevTools navigateur : analyse du trafic réseau
- WebSocket King : client WebSocket pour tests
- Docker & Docker Compose : déploiement
---

## Évaluation finale

### Critères d'évaluation
- **Compréhension théorique** (30%) : capacité à expliquer le fonctionnement de chaque technique
- **Implémentation pratique** (50%) : qualité du code, respect des bonnes pratiques TypeScript
- **Analyse critique** (20%) : capacité à choisir la solution appropriée selon le contexte
### Livrables attendus
- Code source commenté du projet final
- Documentation technique (choix d'architecture, justification des technologies)
- Démonstration fonctionnelle
### Projet final suggéré
Application de collaboration en temps réel (au choix) :
- Système de visioconférence textuel avec salons
- Tableau blanc collaboratif
- Outil de gestion de projet avec notifications
- Plateforme de quiz en direct multijoueur