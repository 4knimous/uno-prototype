# Guide de déploiement UNO

## Déploiement local (développement)

```bash
# Cloner le projet
git clone https://github.com/4knimous/uno-prototype.git
cd uno-prototype

# Installer Node.js (16+) si nécessaire

# Lancer le serveur de développement
npm start
# ou
node server.js

# Ouvrir http://localhost:5173 dans le navigateur
```

## Déploiement sur Vercel (RECOMMANDÉ)

### Méthode 1: Via l'interface Vercel (plus simple)
1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec votre compte GitHub
3. Cliquer "New Project"
4. Importer le dépôt `4knimous/uno-prototype`
5. Vercel détectera automatiquement la configuration
6. Cliquer "Deploy"

### Méthode 2: Via CLI Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Dans le dossier du projet
vercel

# Suivre les instructions
# Choisir "y" pour déployer
# Votre projet sera en ligne en quelques secondes !
```

Le fichier `vercel.json` est déjà configuré pour :
- Servir les fichiers statiques du dossier `public/`
- Utiliser Node.js pour le serveur
- Rediriger toutes les routes vers `server.js`

## Structure pour déploiement en production

### Option 1: Hébergement statique (Netlify, Vercel, GitHub Pages)
- Les fichiers `public/` peuvent être déployés directement
- Aucun serveur Node.js requis pour la version actuelle
- Parfait pour la version locale/prototype

### Option 2: Serveur Node.js (Heroku, Railway, etc.)
- Utiliser `server.js` comme point d'entrée
- Configurer `PORT` via variable d'environnement
- Idéal pour futures fonctionnalités backend

### Option 3: Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 5173
CMD ["npm", "start"]
```

## Variables d'environnement

- `PORT`: Port du serveur (défaut: 5173)
- `NODE_ENV`: Environnement (development/production)

## Optimisations futures

- Minification des assets
- Compression gzip
- CDN pour les ressources statiques
- Service Worker pour le cache