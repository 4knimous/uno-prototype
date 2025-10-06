// Simplified UNO core engine in vanilla JS (no deps)

// === Moteur principal du jeu UNO (vanilla JS, sans dépendance) ===
// Ce fichier contient toute la logique du jeu : création du deck, gestion des joueurs, règles, etc.

export const COLORS = ["red", "yellow", "green", "blue"]; // wilds use color "black"
// Liste des couleurs de base utilisées dans UNO. Les jokers utilisent la couleur "black".
export const VALUES = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "skip",
  "reverse",
  "draw2",
];

// === Génère un deck complet de cartes UNO mélangé ===

export function createDeck() {
  const deck = [];
  // Colored cards
  for (const color of COLORS) {
    // one 0 per color
    deck.push({ color, value: "0", type: "number" });
    // two of 1-9, skip, reverse, draw2
    for (const value of VALUES.filter((v) => v !== "0")) {
      deck.push({ color, value, type: valueType(value) });
      deck.push({ color, value, type: valueType(value) });
    }
  }
  // Wilds: 4 +4 and 4 color change
  for (let i = 0; i < 4; i++) {
    deck.push({ color: "black", value: "wild", type: "wild" });
    deck.push({ color: "black", value: "wild4", type: "wild4" });
  }
  return shuffle(deck);

// Détermine le type d'une carte à partir de sa valeur (nombre, action, etc.)
}

function valueType(value) {
  if (/^\d+$/.test(value)) return "number";
  if (value === "skip") return "skip";
  if (value === "reverse") return "reverse";
  if (value === "draw2") return "draw2";

// Mélange un tableau (deck de cartes) de façon aléatoire
  return "number";
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];

// === Classe principale représentant une partie de UNO ===
  }
  return a;
    // Vérifie le nombre de joueurs (2 à 10)
}

export class Game {
    // Initialise les joueurs (main vide au départ)
  constructor(playerNames = ["Joueur 1", "Joueur 2"]) {
    if (playerNames.length < 2 || playerNames.length > 10) {
      throw new Error("Nombre de joueurs 2–10");
    }
    this.players = playerNames.map((name, i) => ({ id: i, name, hand: [] }));
    this.direction = 1; // 1: clockwise, -1: counter-clockwise
    this.turn = 0; // index in players
    this.topColor = null; // active color (incl. chosen after wild)
    this.topValue = null; // active value/symbol
    this.deck = createDeck();
    // Distribution initiale : 7 cartes par joueur
    this.discard = [];
    this.mustDraw = 0; // penalties to apply
    this.canPlayAfterDraw = true; // simplified rule

    // Retourne la première carte pour démarrer la partie (jamais un +4)
    // Deal 7
    for (let r = 0; r < 7; r++) {
      for (const p of this.players) p.hand.push(this.drawFromDeck());
    }

    // Flip first card to start
    let first = this.drawFromDeck();
    while (first.type === "wild4") {
      // avoid starting with +4 for simplicity
      this.deck.push(first);
    // Applique l'effet de la première carte si c'est une action
      this.deck = shuffle(this.deck);
      first = this.drawFromDeck();
    }
    this.discard.push(first);
    this.setActiveFromTop(first);
  // Pioche une carte du deck (remélange si vide)

    // Apply first card effect if action
    if (first.type === "reverse") this.direction *= -1;
    if (first.type === "skip") this.advanceTurn();
    if (first.type === "draw2") this.mustDraw += 2;
  // Remélange la défausse pour reconstituer le deck (sauf la carte du dessus)
  }

  drawFromDeck() {
    if (this.deck.length === 0) this.restockDeck();
    return this.deck.pop();
  }

  // Met à jour la couleur/valeur active à partir de la carte du dessus
  restockDeck() {
    // keep the top discard, reshuffle the rest
    const top = this.discard.pop();
    this.deck = shuffle(this.discard);
    this.discard = [top];
  }

  setActiveFromTop(card) {
    if (card.color === "black") {
      // wild must have chosenColor stored on card.chosenColor
      this.topColor = card.chosenColor || COLORS[Math.floor(Math.random() * COLORS.length)];
  // Retourne le joueur courant
      this.topValue = card.value;
    } else {
      this.topColor = card.color;
      this.topValue = card.value;
  // Passe au(x) joueur(s) suivant(s) selon la direction et le nombre de sauts
    }
  }

  currentPlayer() {
    return this.players[this.turn];
  // Vérifie si une carte est jouable sur la pile actuelle
  }

  advanceTurn(skips = 1) {
    const n = this.players.length;
    this.turn = (this.turn + skips * this.direction + n) % n;
  }
  // Retourne la liste des cartes jouables pour un joueur donné

  isPlayable(card) {
    if (!card) return false;
    if (card.color === "black") return true;
  // Fait piocher le joueur courant (gère les pénalités)
    return card.color === this.topColor || card.value === this.topValue;
  }

  playableCards(playerIndex) {
    return this.players[playerIndex].hand.filter((c) => this.isPlayable(c));
  }

  draw(playerIndex) {
    if (playerIndex !== this.turn) throw new Error("Pas votre tour");
    let toDraw = Math.max(1, this.mustDraw);
    const drawn = [];
  // Joue une carte de la main du joueur (gère tous les effets)
    while (toDraw-- > 0) drawn.push(this.drawFromDeck());
    this.mustDraw = 0;
    this.players[playerIndex].hand.push(...drawn);
    this.lastDrawnCount = drawn.length;
    return drawn;
  }

  play(playerIndex, cardIndex, chosenColor = null) {
    if (playerIndex !== this.turn) throw new Error("Pas votre tour");
    const hand = this.players[playerIndex].hand;
    // Retire la carte de la main et gère la couleur choisie pour les jokers
    const card = hand[cardIndex];
    if (!card) throw new Error("Carte invalide");
    if (this.mustDraw > 0 && card.type !== "draw2" && card.type !== "wild4") {
      throw new Error("Vous devez encaisser la pénalité");
    }
    if (!this.isPlayable(card)) throw new Error("Carte non jouable");

    // Remove from hand & apply wildcard color if needed
    hand.splice(cardIndex, 1);
    if (card.color === "black") {
    // Applique les effets de la carte jouée
      if (!chosenColor || !COLORS.includes(chosenColor)) {
        throw new Error("Choisissez une couleur pour le Joker");
      }
      card.chosenColor = chosenColor;
    }
    this.discard.push(card);
    this.setActiveFromTop(card);

    // Effects
    switch (card.type) {
      case "reverse":
        this.direction *= -1;
        break;
      case "skip":
        this.advanceTurn();
        break;
      case "draw2":
        this.mustDraw += 2;
        this.advanceTurn();
    // Vérifie la victoire (main vide)
        break;
      case "wild4":
    // Passe au joueur suivant si la carte n'est pas une action qui l'a déjà fait
        this.mustDraw += 4;
        this.advanceTurn();
        break;
      default:
        break;
    }

  // Retourne l'état public de la partie (pour l'affichage)
    // Win check
    const winner = hand.length === 0 ? playerIndex : null;

    // Advance to next player if not special that already advanced
    if (card.type !== "skip" && card.type !== "draw2" && card.type !== "wild4") {
      this.advanceTurn();
    }

    return { winner };
  }

  state(publicFor = null) {
    // Return a serializable public state. If publicFor is number, include that player's hand fully.
    return {
      players: this.players.map((p, idx) => ({
        id: p.id,
        name: p.name,
        handCount: p.hand.length,
        hand: publicFor === idx ? p.hand.slice() : undefined,
      })),
      turn: this.turn,
      direction: this.direction,
      top: this.discard[this.discard.length - 1],
      topColor: this.topColor,
      topValue: this.topValue,
      mustDraw: this.mustDraw,
    };
  }
}
