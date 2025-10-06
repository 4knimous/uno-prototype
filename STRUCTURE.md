# Structure du projet UNO

```
uno-prototype/
├── .gitignore              # Fichiers à ignorer par Git
├── CHANGELOG.md            # Historique des versions
├── CONTRIBUTING.md         # Guide de contribution
├── DEPLOYMENT.md           # Guide de déploiement
├── LICENSE                 # Licence MIT
├── README.md               # Documentation principale
├── package.json            # Configuration npm
├── server.js               # Serveur de développement local
├── public/                 # Fichiers statiques
│   ├── index.html          # Interface principale
│   └── css/                # Feuilles de style
│       ├── base.css        # Styles de base
│       ├── buttons.css     # Styles des boutons
│       ├── cards.css       # Styles des cartes
│       ├── layout.css      # Mise en page
│       └── modal.css       # Styles des modales
└── src/                    # Code source JavaScript
    ├── main.js             # Interface utilisateur et gestion du jeu
    ├── bot_smart.js        # Intelligence artificielle des bots
    └── uno/                # Moteur de règles UNO
        └── logic.js        # Logique pure du jeu (sans UI)
```

## Description des fichiers principaux

### Fichiers de configuration
- **package.json** : Métadonnées du projet, scripts npm, dépendances
- **.gitignore** : Exclusions pour le contrôle de version
- **server.js** : Serveur HTTP simple pour le développement local

### Documentation
- **README.md** : Guide complet du projet
- **CONTRIBUTING.md** : Instructions pour contribuer
- **DEPLOYMENT.md** : Guide de déploiement
- **CHANGELOG.md** : Historique des modifications

### Code source
- **src/uno/logic.js** : Moteur de règles UNO pur (réutilisable côté serveur)
- **src/main.js** : Interface utilisateur, rendu, interactions
- **src/bot_smart.js** : IA avancée pour les bots

### Interface utilisateur
- **public/index.html** : Page principale de l'application
- **public/css/** : Styles modulaires pour l'interface

## Points d'entrée

- **Développement** : `node server.js` puis http://localhost:5173
- **Production** : Servir le dossier `public/` via un serveur web
- **Tests manuels** : Ouvrir `public/index.html` directement dans un navigateur