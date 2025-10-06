// === Intelligence artificielle avancée pour le bot UNO ===
// Ce fichier propose une version "intelligente" du bot, qui choisit la meilleure carte à jouer selon la situation.

import { COLORS } from "./uno/logic.js";

// === Fonction principale d'action du bot ===
// game : instance de la partie UNO
// idx : index du joueur bot
// Retourne un objet décrivant l'action choisie (jouer, piocher, passer...)
export function botActionSmart(game, idx) {
  const hand = game.players[idx].hand;

  // Si le bot doit encaisser une pénalité, il essaie d'empiler un +2/+4 sinon il pioche
  if (game.mustDraw > 0) {
    const stackIndex = hand.findIndex((c) => c.type === "draw2" || c.type === "wild4");
    if (stackIndex >= 0) {
      const playedCard = hand[stackIndex];
      const chosen = playedCard.color === "black" ? COLORS[Math.floor(Math.random() * COLORS.length)] : null;
      const res = game.play(idx, stackIndex, chosen);
      if (res.winner === idx) return { type: "win", played: playedCard };
      return { type: "play", played: playedCard };
    } else {
      game.draw(idx);
      return { type: "passPenalty" };
    }
  }

  // Si aucune carte n'est jouable, le bot pioche et vérifie s'il peut jouer ensuite
  let hasPlayable = false;
  for (const c of hand) if (game.isPlayable(c)) { hasPlayable = true; break; }
  if (!hasPlayable) {
    game.draw(idx);
    const after = game.players[idx].hand;
    let canNow = false;
    for (const c of after) if (game.isPlayable(c)) { canNow = true; break; }
    if (!canNow) return { type: "draw" };
  }

  // Sélectionne la meilleure carte à jouer selon une heuristique (priorité aux +4, +2, etc.)
  let bestIndex = -1;
  let bestScore = -1;
  for (let i = 0; i < game.players[idx].hand.length; i++) {
    const c = game.players[idx].hand[i];
    if (!game.isPlayable(c)) continue;
    const score = c.type === "wild4" ? 5 : c.type === "draw2" ? 4 : (c.type === "reverse" || c.type === "skip") ? 3 : (c.color === game.topColor ? 2 : 1);
    if (score > bestScore) { bestScore = score; bestIndex = i; }
  }
  if (bestIndex >= 0) {
    const playedCard = game.players[idx].hand[bestIndex];
    const chosen = playedCard.color === "black" ? COLORS[Math.floor(Math.random() * COLORS.length)] : null;
    const res = game.play(idx, bestIndex, chosen);
    if (res.winner === idx) return { type: "win", played: playedCard };
    return { type: "play", played: playedCard };
  }
  return { type: "pass" };
}

// === Boucle asynchrone pour faire jouer le bot tant que ce n'est pas au joueur humain ===
// game : instance de la partie UNO
// showActionModal, render, message, updateHeader, showTurn : callbacks pour l'affichage et l'UI
export async function maybeBotLoop(game, { showActionModal, render, message, updateHeader, showTurn }) {
  if (game.turn === 0) return;
  const idx = game.turn;
  await new Promise((r) => setTimeout(r, 450));
  const res = botActionSmart(game, idx);
  render();
  if (typeof updateHeader === "function") updateHeader();
  if (res.type === "win") {
    await showActionModal("DEFAITE", `${game.players[idx].name} a gagné`);
    return;
  }
  if (res.type === "play") {
    const t = res.played?.type;
    if (t === "reverse") await showActionModal("INVERSION", "Le sens change");
    if (t === "skip") await showActionModal("PASSER", "Tour sauté");
    if (t === "draw2") await showActionModal("+2", "Pioche 2");
    if (t === "wild4") await showActionModal("+4", "Pioche 4");
  }
  if (res.type === "draw") {
    await showActionModal("PIOCHE", `${game.players[idx].name} pioche`);
  }
  if (res.type === "pass" || res.type === "passPenalty") {
    await showActionModal("PASSER", `${game.players[idx].name} passe son tour`);
    game.advanceTurn();
  }
  if (typeof showTurn === "function") showTurn();
  if (game.turn !== 0) {
    await maybeBotLoop(game, { showActionModal, render, message, updateHeader, showTurn });
  } else {
    await showActionModal("À VOUS DE JOUER", "C'est votre tour");
    message("À vous de jouer.");
  }
}
