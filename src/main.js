/**
 * =======================================================================
 * ENTRY POINT (Main script)
 * =======================================================================
 */

import { gameConfig } from './config.js';
import { sound } from './audio.js';
import { game } from './game.js';

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("game-root");
  const audioBtn = document.getElementById("audio-toggle-btn");
  const audioIcon = document.getElementById("audio-icon");
  const audioText = document.getElementById("audio-text");

  // Inisialisasi audio BGM jika ada konfigurasi URL
  sound.init(gameConfig.bgm?.audioUrl || "");

  // Audio Toggle Button
  audioBtn?.addEventListener("click", () => {
    sound.ensureContext();
    const isMuted = sound.toggleMute();
    if (isMuted) {
      audioIcon.textContent = "🔇";
      audioText.textContent = "Mute";
      audioBtn.style.opacity = "0.75";
    } else {
      audioIcon.textContent = "🔊";
      audioText.textContent = "Suara";
      audioBtn.style.opacity = "1";
    }
  });

  // Jalankan Game Engine
  game.init(root);
});

