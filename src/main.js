// === UNO - Interface et logique principale ===
// Ce fichier gère l'affichage, l'interaction utilisateur et la logique de partie côté client pour le jeu UNO.
// Chaque section/fonction est commentée pour faciliter la compréhension et la maintenance par d'autres développeurs.

import { Game, COLORS } from "./uno/logic.js";


// === Sélection des éléments du DOM ===
// On récupère les éléments HTML nécessaires pour afficher le jeu et interagir avec l'utilisateur.

const playersContainer = document.getElementById("players");
const discardTopEl = document.getElementById("discardTop");
const currentPlayerEl = document.getElementById("currentPlayer");
const directionEl = document.getElementById("direction");
const messageEl = document.getElementById("message");
const drawBtn = document.getElementById("drawBtn");
const passBtn = document.getElementById("passBtn");
const modalOverlay = document.getElementById("modalOverlay");

// === Noms des joueurs selon la plateforme ===
// On adapte le nombre de bots selon la taille de l'écran (mobile ou desktop).

const PLAYERS_DESKTOP = ["Vous", "Bot A", "Bot B", "Bot C"];
const PLAYERS_MOBILE = ["Vous", "Bot A", "Bot B"];

// === Gestion du mode compact (mobile) ===
// Permet d'adapter l'affichage pour les petits écrans.

const COMPACT_BREAKPOINT = "(max-width: 720px)";
const compactQuery = window.matchMedia ? window.matchMedia(COMPACT_BREAKPOINT) : null;
let compactLayout = compactQuery ? compactQuery.matches : false;

const headerEl = document.querySelector(".app-header");

// Retourne la hauteur de la fenêtre utile (utile pour le responsive)

function getViewportHeight() {
  return window.visualViewport ? window.visualViewport.height : window.innerHeight;
}

// Met à jour les variables CSS personnalisées pour la hauteur de l'app et du header

// Active ou désactive la classe CSS pour le mode compact (mobile)
function updateViewportMetrics() {
  const viewportHeight = Math.round(getViewportHeight());
  document.documentElement.style.setProperty("--app-height", `${viewportHeight}px`);
  // === Gestion du clic sur le bouton "Piocher" ===
  // Permet au joueur de piocher une carte ou plusieurs si pénalité
  if (headerEl) {
    const headerHeight = Math.round(headerEl.getBoundingClientRect().height);

// Retourne la liste des noms de joueurs selon le mode (mobile ou desktop)
    document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
  }
}

// === Variables de jeu ===
// game : instance de la partie en cours
// lastTurn : mémorise le dernier joueur actif pour l'affichage

updateViewportMetrics();

// Dictionnaires pour afficher les noms des couleurs et valeurs en français

// On écoute les changements de taille d'écran pour adapter l'affichage

// === Démarre une nouvelle partie ===

  // === IA des bots : choisit l'action optimale pour un bot donné ===
  // idx : index du joueur bot
  // Retourne un objet décrivant l'action effectuée (jouer, piocher, passer...)
// names : tableau des noms de joueurs
// infoMessage : message optionnel à afficher au lancement

window.addEventListener("resize", updateViewportMetrics);
window.addEventListener("orientationchange", updateViewportMetrics);
if (window.visualViewport) {
  // Affiche le popup de tour et un message d'accueil
  window.visualViewport.addEventListener("resize", updateViewportMetrics);
}

function applyResponsiveMode() {
  if (document.body) {
    document.body.classList.toggle("compact-layout", compactLayout);
  }

// Vérifie si le nombre de joueurs correspond au mode d'affichage (mobile/desktop)
// Redémarre la partie si besoin (ex : changement d'orientation)
}

function currentPlayerNames() {
  return compactLayout ? PLAYERS_MOBILE : PLAYERS_DESKTOP;
}

let game = null;
let lastTurn = null;
const COLOR_NAMES = { red: "Rouge", yellow: "Jaune", green: "Vert", blue: "Bleu", black: "Joker" };
const VALUE_NAMES = { skip: "Passe", reverse: "Inversion", draw2: "+2", wild: "Joker", wild4: "Joker +4" };



// === Décrit une carte sous forme de texte lisible ===
// card : objet carte {color, value, ...}
// Retourne une chaîne lisible pour l'utilisateur (ex : "Rouge +2", "Joker -> Bleu")
// Message d'accueil initial selon le mode
function startNewGame(names, infoMessage = null) {
  game = new Game(names);

// Gère le changement de mode compact (écouteur d'événement)
  lastTurn = null;
  render();
  showTurnPopup();
  if (infoMessage) {
    message(infoMessage);

// === Ferme la fenêtre modale (popup) ===
  } else {
    message("A vous de jouer.");
  }
}

function ensurePlayersForLayout(layoutChanged = false) {

// === Redémarre la partie avec les mêmes joueurs ===
  if (!game) return false;
  const desired = currentPlayerNames();
  if (game.players.length === desired.length) return false;

// === Affiche le résumé de victoire dans une modale ===
// winnerIndex : index du joueur gagnant
// Affiche les mains restantes, l'historique des cartes jouées, etc.
  // === Fonction principale d'affichage de l'état du jeu ===
  // Met à jour l'affichage des joueurs, des cartes, du tour, etc.
  const info = layoutChanged
    ? (compactLayout ? "Mode mobile : vous affrontez 2 bots." : "Mode bureau : 3 bots reviennent.")
    : null;
  startNewGame(desired, info);
  return true;
}

applyResponsiveMode();

const initialInfo = compactLayout ? "Mode mobile : vous affrontez 2 bots." : null;
startNewGame(currentPlayerNames(), initialInfo);

if (compactQuery) {
  const handleCompactChange = (event) => {
    compactLayout = event.matches;
    updateViewportMetrics();
    applyResponsiveMode();
    const changed = ensurePlayersForLayout(true);
    if (!changed) {
      render();
    }
  };
  if (compactQuery.addEventListener) {
    compactQuery.addEventListener("change", handleCompactChange);
  } else {
    compactQuery.addListener(handleCompactChange);
  }
}

function describeCard(card) {
  if (!card) return "";
  const valueLabel = VALUE_NAMES[card.value] ?? card.value;
  if (card.color === "black") {
    const chosenName = card.chosenColor ? (COLOR_NAMES[card.chosenColor] ?? card.chosenColor) : null;
    return chosenName ? `${valueLabel} -> ${chosenName}` : valueLabel;
  }
  const colorLabel = COLOR_NAMES[card.color] ?? card.color;
  return `${colorLabel} ${valueLabel}`;
}

function closeModal() {

  // === Demande à l'utilisateur de choisir une couleur (pour les jokers) ===
  modalOverlay.classList.add("hidden");

  // === Tente de jouer une carte de la main du joueur ===
  // index : index de la carte à jouer dans la main du joueur
  modalOverlay.setAttribute("aria-hidden", "true");
  modalOverlay.innerHTML = "";
  modalOverlay.onclick = null;
}

function restartGame() {
  startNewGame(currentPlayerNames());
}

async function showVictorySummary(winnerIndex) {
  const isPlayer = winnerIndex === 0;
  const winnerName = game.players[winnerIndex]?.name ?? "Un joueur";
  modalOverlay.classList.remove("hidden");
  modalOverlay.setAttribute("aria-hidden", "false");
  modalOverlay.innerHTML = "";
  modalOverlay.onclick = null;

  const modal = document.createElement("div");
  modal.className = "modal victory";
  const title = document.createElement("h2");
  title.className = "title";
  title.textContent = isPlayer ? "Victoire !" : "Defaite";
  const subtitle = document.createElement("p");
  subtitle.className = "subtitle";
  subtitle.textContent = isPlayer ? "Super partie, bravo !" : `${winnerName} remporte la manche.`;
  modal.appendChild(title);
  modal.appendChild(subtitle);

  const summaryList = document.createElement("ul");
  summaryList.className = "summary-list";
  game.players.forEach((p) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${p.name}</strong> — ${p.hand.length} carte${p.hand.length > 1 ? "s" : ""}`;
    summaryList.appendChild(item);
  });
  modal.appendChild(summaryList);

  const handsDetails = document.createElement("details");
  handsDetails.className = "cards-details";
  const handsSummary = document.createElement("summary");
  handsSummary.textContent = "Voir les mains restantes";
  handsDetails.appendChild(handsSummary);
  const handsList = document.createElement("ul");
  handsList.className = "cards-list";
  game.players.forEach((p) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = p.name;
    const span = document.createElement("span");
    span.textContent = p.hand.length ? p.hand.map(describeCard).join(", ") : "aucune carte";
    li.appendChild(strong);
    li.appendChild(document.createElement("br"));
    li.appendChild(span);
    handsList.appendChild(li);
  });
  handsDetails.appendChild(handsList);
  modal.appendChild(handsDetails);

  const historyDetails = document.createElement("details");
  historyDetails.className = "cards-details";
  const historySummary = document.createElement("summary");
  historySummary.textContent = "Historique des cartes jouees";
  historyDetails.appendChild(historySummary);
  const historyList = document.createElement("ol");
  historyList.className = "cards-scroll";
  game.discard.forEach((card, index) => {
    const entry = document.createElement("li");
    entry.textContent = `${index + 1}. ${describeCard(card)}`;
    historyList.appendChild(entry);
  });
  historyDetails.appendChild(historyList);
  modal.appendChild(historyDetails);

  const actions = document.createElement("div");
  actions.className = "actions";
  const closeBtn = document.createElement("button");
  closeBtn.className = "btn btn-secondary";
  closeBtn.textContent = "Fermer";
  const replayBtn = document.createElement("button");
  replayBtn.className = "btn";
  replayBtn.textContent = "Rejouer";
  actions.appendChild(closeBtn);
  actions.appendChild(replayBtn);
  modal.appendChild(actions);

  modalOverlay.appendChild(modal);

  return new Promise((resolve) => {
    setTimeout(() => { modal.classList.add("exit"); }, 1200);
    setTimeout(() => {
      modalOverlay.classList.add("hidden");
      modalOverlay.setAttribute("aria-hidden", "true");
      modalOverlay.innerHTML = "";
      resolve();
    }, 1500);
  });
}

function showActionModal(title, subtitle = "") {
  modalOverlay.classList.remove("hidden");
  modalOverlay.setAttribute("aria-hidden", "false");
  modalOverlay.innerHTML = "";
  const modal = document.createElement("div"); modal.className = "modal action";
  const h = document.createElement("h2"); h.className = "title"; h.textContent = title;
  const s = document.createElement("p"); s.className = "subtitle"; s.textContent = subtitle;
  modal.appendChild(h); modal.appendChild(s);
  modalOverlay.appendChild(modal);
  return new Promise((resolve) => {
    setTimeout(() => { modal.classList.add("exit"); }, 1200);
    setTimeout(() => {
      modalOverlay.classList.add("hidden");
      modalOverlay.setAttribute("aria-hidden", "true");
      modalOverlay.innerHTML = "";
      resolve();
    }, 1500);
  });
}
// === Affiche une modale d'action temporaire (ex : +2, Passe, etc.) ===
// title : titre de la modale (ex : "+2", "PASSER")
// subtitle : sous-titre optionnel


function colorClass(color) { return `card ${color}`; }
// Retourne la classe CSS pour une carte selon sa couleur

function cardLabel(c) {
  switch (c.value) {
    case "skip": return "⦸";
    case "reverse": return "⇄";
    case "draw2": return "+2";
    case "wild": return "★";
    case "wild4": return "+4";
    default: return c.value;
  }
}
// Retourne le label à afficher sur une carte selon sa valeur


function layoutFan(handEl, { spacing = 52, spread = 65, small = false } = {}) {
  const children = Array.from(handEl.children);
  const count = children.length;
  if (!count) return;

  const spacingValue = compactLayout ? Math.max(16, spacing * 0.52) : spacing;
  const spreadValue = compactLayout ? Math.max(18, spread * 0.6) : spread;
  const step = count > 1 ? spreadValue / (count - 1) : 0;
  const base = -spreadValue / 2;

  children.forEach((el, index) => {
    const angle = base + index * step;
    const x = (index - (count - 1) / 2) * spacingValue;
    el.style.transform = `translateX(${x}px) rotate(${angle}deg)`;
    el.style.zIndex = 100 + index;
  });

  let height = compactLayout ? (small ? 110 : 180) : (small ? 170 : 260);
  if (compactLayout && !small) {
    const container = handEl.closest('.player');
    const header = container ? container.querySelector('header') : null;
    const containerHeight = container ? container.clientHeight : 0;
    const headerHeight = header ? header.offsetHeight : 0;
    const available = containerHeight - headerHeight - 12;
    if (available > height) {
      height = available;
    }
  }
  handEl.style.height = `${height}px`;
}
// Dispose les cartes d'une main en éventail (effet visuel)
// handEl : élément DOM de la main
// spacing, spread, small : options d'affichage




function render() {
  playersContainer.dataset.layout = compactLayout ? "stacked" : "table";
  const state = game.state(0);
  // top card
  const top = state.top; const color = top.color === "black" ? state.topColor : top.color;
  discardTopEl.className = color ? colorClass(color) : "card placeholder";
  discardTopEl.textContent = cardLabel(top);

  // header status
  currentPlayerEl.textContent = state.players[state.turn].name;
  directionEl.textContent = state.direction === 1 ? "→" : "←";
  // update draw button label with penalties
  drawBtn.textContent = state.mustDraw > 0 ? `Piocher (${state.mustDraw})` : "Piocher";

  // players/seats
  playersContainer.innerHTML = "";
  state.players.forEach((p, idx) => {
    const section = document.createElement("section");
    const seat = ["seat-bottom","seat-left","seat-top","seat-right"][idx % 4];
    section.className = `player ${seat}` + (idx === state.turn ? " turn" : "");
    const header = document.createElement("header");
    const title = document.createElement("strong"); title.textContent = p.name;
    const count = document.createElement("span"); count.className = "badge"; count.textContent = `${p.handCount} carte${p.handCount>1?"s":""}`;
    header.appendChild(title); header.appendChild(count);
    const hand = document.createElement("div"); hand.className = "hand " + (idx === 0 ? "me" : "enemy");
    if (idx === 0) {
      (p.hand || []).forEach((c, i) => { const btn = document.createElement("button"); btn.className = colorClass(c.color === "black"?"black":c.color); btn.textContent = cardLabel(c); btn.onclick = async ()=>{ await tryPlay(i); }; hand.appendChild(btn); });
      layoutFan(hand, { spacing: 52, spread: 65 });
    } else {
      for (let i=0;i<p.handCount;i++){ const back = document.createElement("div"); back.className = "card small placeholder"; back.textContent = "UNO"; hand.appendChild(back);} 
      const isSide = (idx % 4 === 1 || idx % 4 === 3);
      layoutFan(hand, { spacing: isSide ? 24 : 28, spread: isSide ? 38 : 42, small: true });
    }
    section.appendChild(header); section.appendChild(hand);
    playersContainer.appendChild(section);
  });

  const myTurn = game.turn === 0;
  drawBtn.disabled = !myTurn;

}

async function askColor() { return await showColorPicker(); }

async function tryPlay(index) {
  if (game.turn !== 0) return;
  const my = game.players[0]; const card = my.hand[index];
  let chosen = null;
  if (card.color === "black") { chosen = await askColor(); if (!chosen) return; }
  try {
    const type = card.type;
    const res = game.play(0, index, chosen);
    message("");
    render();
    if (res.winner !== null) {
      await showVictorySummary(res.winner);
      return;
    }
    showTurnPopup();
    if (type === "reverse") await showActionModal("INVERSION", "Le sens change");
    if (type === "skip") await showActionModal("PASSER", "Le joueur suivant saute son tour");
    if (type === "draw2") await showActionModal("+2", "Le joueur suivant pioche 2");
    if (type === "wild4") await showActionModal("+4", "Le joueur suivant pioche 4");
    await maybeBotTurn();
  } catch (e) { message(e.message, true); }
}

drawBtn.onclick = async () => {
  if (game.turn !== 0) return;
  try {
    const drawn = game.draw(0);
    const playable = drawn.length === 1 && drawn[0].color !== "black" && game.isPlayable(drawn[0]);
    const subtitle = drawn.length > 1 ? `Vous piochez ${drawn.length} cartes` : "Vous avez tire une carte";
    await showActionModal("PIOCHE", subtitle);
    if (playable) {
      message("La carte piochee est jouable.");
    } else {
      game.advanceTurn();
      message("Tour passe apres pioche.");
    }
    render();
    showTurnPopup();
    if (!playable) await maybeBotTurn();
  }
  catch (e) { message(e.message, true); }
};




function botAction(idx) {
  const player = game.players[idx];
  const hand = player.hand;

  if (game.mustDraw > 0) {
    const stackIndex = hand.findIndex((card) => card.type === "draw2" || card.type === "wild4");
    if (stackIndex >= 0) {
      const played = hand[stackIndex];
      const chosen = played.color === "black" ? COLORS[Math.floor(Math.random() * COLORS.length)] : null;
      const result = game.play(idx, stackIndex, chosen);
      return { type: result.winner === idx ? "win" : "play", played, drawnCount: 0 };
    }
    const drawn = game.draw(idx);
    game.advanceTurn();
    return { type: "passPenalty", drawnCount: drawn.length };
  }

  let bestIndex = -1;
  let bestScore = -1;
  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];
    if (!game.isPlayable(card)) continue;
    const priority =
      card.type === "wild4"
        ? 5
        : card.type === "draw2"
        ? 4
        : card.type === "reverse" || card.type === "skip"
        ? 3
        : card.color === game.topColor
        ? 2
        : 1;
    if (priority > bestScore) {
      bestScore = priority;
      bestIndex = i;
    }
  }

  if (bestIndex >= 0) {
    const played = hand[bestIndex];
    const chosen = played.color === "black" ? COLORS[Math.floor(Math.random() * COLORS.length)] : null;
    const result = game.play(idx, bestIndex, chosen);
    return { type: result.winner === idx ? "win" : "play", played, drawnCount: 0 };
  }

  const drawn = game.draw(idx);
  const playerHand = game.players[idx].hand;
  const lastIndex = playerHand.length - 1;
  const justDrawn = drawn[drawn.length - 1];
  if (justDrawn && game.isPlayable(justDrawn)) {
    const played = playerHand[lastIndex];
    const chosen = played.color === "black" ? COLORS[Math.floor(Math.random() * COLORS.length)] : null;
    const result = game.play(idx, lastIndex, chosen);
    return { type: result.winner === idx ? "win" : "play", played, drawnCount: drawn.length };
  }

  game.advanceTurn();
  return { type: "pass", drawnCount: drawn.length };
}


// === Gère le tour des bots de façon asynchrone ===
// Appelle botAction, affiche les modales selon l'action, relance le bot si ce n'est pas au joueur humain
async function maybeBotTurn() {
  if (game.turn === 0) return;
  const idx = game.turn;
  const actor = game.players[idx];
  await new Promise((resolve) => setTimeout(resolve, 450));
  const res = botAction(idx);
  render();
  if (res.type === "win") {
    await showVictorySummary(idx);
    return;
  }
  if (res.type === "play") {
    const t = res.played?.type;
    if (t === "reverse") await showActionModal("INVERSION", "Le sens change");
    if (t === "skip") await showActionModal("PASSER", "Tour sauté");
    if (t === "draw2") await showActionModal("+2", "Pioche 2");
    if (t === "wild4") await showActionModal("+4", "Pioche 4");
  } else if (res.type === "passPenalty") {
    if (res.drawnCount > 0) {
      await showActionModal(
        "PIOCHE",
        `${actor.name} pioche ${res.drawnCount} carte${res.drawnCount > 1 ? "s" : ""}`
      );
    }
  } else if (res.type === "pass") {
    if (res.drawnCount > 0) {
      await showActionModal(
        "PIOCHE",
        `${actor.name} pioche ${res.drawnCount} carte${res.drawnCount > 1 ? "s" : ""}`
      );
    }
    await showActionModal("PASSER", `${actor.name} ne peut pas jouer`);
  }
  if (game.turn === 0) {
    message("A vous de jouer.");
  } else {
    await maybeBotTurn();
  }
}


// === Affiche un popup à chaque changement de tour ===
function showTurnPopup() {
  if (lastTurn === null || lastTurn !== game.turn) {
    const name = game.players[game.turn].name; showActionModal("Au tour de", name); lastTurn = game.turn;
  }
}


// === Affiche un message dans la zone dédiée (erreur ou info) ===
function message(text, isError = false) { messageEl.textContent = text; messageEl.style.color = isError ? "#b00020" : "#555"; }





