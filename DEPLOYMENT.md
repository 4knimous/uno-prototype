# Guide de déploiement UNO

## Déploiement local (développement)

```bash
# Cloner le projet
git clone https://github.com/votre-username/uno-prototype.git
cd uno-prototype

# Installer Node.js (16+) si nécessaire

# Lancer le serveur de développement
npm start
# ou
node server.js

# Ouvrir http://localhost:5173 dans le navigateur
```

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