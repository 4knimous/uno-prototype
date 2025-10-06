# UNO — Prototype en ligne (base locale)

Ce projet est un prototype complet du jeu UNO, développé en JavaScript sans dépendances externes, avec une interface web locale pour affronter des bots. Il a été conçu pour être simple à comprendre, facile à étendre et prêt à évoluer vers un mode multijoueur en ligne.

## Objectif et raison du projet

L'objectif de ce projet est de :
- Proposer une base solide pour un UNO jouable en local, facilement testable et modifiable.
- Illustrer la séparation entre la logique métier (moteur de règles) et l'interface utilisateur.
- Permettre à tout développeur de comprendre, adapter ou enrichir le jeu (ajout de règles, d'IA, de fonctionnalités réseau, etc.).
- Servir de socle pour un futur UNO multijoueur en ligne.

## Technologies et code utilisé

- **JavaScript (ES6)** : tout le code est en JS moderne, sans framework ni dépendance côté client.
- **Node.js** : utilisé uniquement pour servir les fichiers statiques en développement.
- **Aucune dépendance front** : pas de React, pas de build, tout est lisible et modifiable directement.

### Structure des fichiers

- `public/` : Fichiers statiques (HTML, CSS)
  - `index.html` : Interface utilisateur principale
  - `styles.css` : Style de l'application
- `src/uno/logic.js` : Moteur de règles UNO (aucun accès DOM, pur JS)
- `src/main.js` : Logique d'interface locale, gestion du jeu, bots de base
- `src/bot_smart.js` : Intelligence artificielle avancée pour les bots (stratégie améliorée)
- `server.js` : Serveur HTTP statique pour le développement local

## Explication du code et de l'architecture

### 1. Moteur de règles (`src/uno/logic.js`)
- Gère la création et le mélange du deck, la distribution des cartes, l'application des règles (actions, pénalités, changement de sens, etc.).
- Ne dépend d'aucune interface : il peut être testé ou utilisé côté serveur pour un mode en ligne.
- Toutes les actions (piocher, jouer, vérifier la validité d'un coup) sont centralisées ici.

### 2. Interface locale (`public/index.html`, `src/main.js`)
- Affiche la main du joueur, les cartes des bots, le bouton pour piocher, etc.
- Gère les interactions utilisateur (cliquer sur une carte, choisir une couleur pour un joker, etc.).
- Utilise le moteur de règles pour valider chaque action.
- Les bots jouent automatiquement à leur tour.

### 3. Intelligence artificielle (`src/bot_smart.js`)
- Fournit une version "intelligente" du bot, qui choisit la meilleure carte à jouer selon la situation (priorité aux +4, +2, etc.).
- Peut être utilisée à la place du bot de base pour des parties plus stratégiques.

### 4. Serveur de développement (`server.js`)
- Sert uniquement à lancer le projet en local (aucune logique de jeu côté serveur).

## Comment lancer le projet

**Prérequis :** Node.js 16+ installé.

```bash
node server.js
```

Puis ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Contrôles et règles implémentées

- **Piocher** : bouton « Piocher » pour récupérer les pénalités ou passer son tour si aucune carte jouable.
- **Jouer une carte** : cliquez sur une carte de votre main. Pour un Joker, une invite demande la couleur.
- **Règles** :
  - Jeu 2–4 joueurs (1 humain + 3 bots par défaut)
  - Correspondance par couleur ou valeur
  - Cartes action : Passe ton tour (skip), Inversion (reverse), +2 (draw2), Joker (wild), Joker +4 (wild4)
  - Tirer 1 carte si aucune carte jouable, possibilité de jouer la carte tirée si elle correspond
  - Pas de « UNO » à annoncer, pas de score cumulé

## Pourquoi ce choix d'architecture ?

- **Lisibilité** : chaque fichier a une responsabilité claire.
- **Extensibilité** : il est facile d'ajouter des variantes de règles, de nouveaux types de bots, ou de brancher un backend réseau.
- **Réutilisabilité** : le moteur de règles peut être utilisé côté serveur pour un mode multijoueur sécurisé.
- **Simplicité** : aucun build, aucune dépendance, tout fonctionne en local immédiatement.

## Prochaines fonctionnalités à venir

- **Mode multijoueur en ligne** :
  - Backend Node.js + WebSocket (ex. socket.io)
  - Gestion de salons/parties, synchronisation d'état, validation des coups côté serveur
  - Adaptation du client web pour la connexion, la création et la gestion de parties
- **Amélioration de l'IA** :
  - Différents niveaux de difficulté pour les bots
  - Stratégies avancées (anticipation, blocage, etc.)
- **Animations et ergonomie** :
  - Effets visuels pour les actions, transitions de cartes, notifications
- **Gestion du score et du mode tournoi**
- **Support mobile amélioré**
- **Internationalisation (i18n)**

## Contribution

Toute contribution est la bienvenue ! N'hésitez pas à proposer des améliorations, corriger des bugs ou suggérer de nouvelles fonctionnalités.
NEO

---

**Auteur :** Matéo LESGUER (NEOSHY) — 2025

