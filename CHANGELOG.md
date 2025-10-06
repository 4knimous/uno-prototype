## Changelog

### Version 1.0.0 (2025-10-06)

#### Fonctionnalités ajoutées
- Moteur de règles UNO complet en JavaScript vanilla
- Interface web locale avec affichage responsive (mobile/desktop)
- Intelligence artificielle pour bots avec stratégie avancée
- Support des cartes actions : Skip, Reverse, +2, Joker, +4
- Gestion des pénalités et empilement de cartes +2/+4
- Serveur de développement local intégré
- Code entièrement commenté en français pour faciliter la maintenance

#### Règles implémentées
- Jeu 2-4 joueurs (1 humain + bots)
- Correspondance par couleur ou valeur
- Cartes noires (jokers) jouables à tout moment
- Pioche automatique si aucune carte jouable
- Changement de direction et saut de tour
- Victoire par épuisement de la main

#### Architecture
- Séparation claire entre logique métier (logic.js) et interface (main.js)
- Pas de dépendances front-end, JavaScript pur
- Code modulaire et extensible
- Documentation complète