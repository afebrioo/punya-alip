/**
 * =======================================================================
 * GAME ENGINE: 14 TEKA-TEKI ALIP UNTUK RARA ("cwtch")
 * =======================================================================
 */

import { gameConfig } from './config.js';
import { sound } from './audio.js';
import { launchCelebration } from './confetti.js';

class GameEngine {
  constructor() {
    this.container = null;
    this.currentStep = -1; // -1: Intro, 0..13: Questions 1..14, 14: Chest, 15: Reveal
    this.collectedLetters = [];
    this.totalLetters = ["C", "W", "T", "C", "H"];
  }

  init(containerElement) {
    this.container = containerElement;
    this.loadState();
    this.render();
  }

  saveState() {
    try {
      const state = {
        currentStep: this.currentStep,
        collectedLetters: this.collectedLetters
      };
      localStorage.setItem("alip_rara_game_state_v2", JSON.stringify(state));
    } catch (e) {}
  }

  loadState() {
    try {
      const saved = localStorage.getItem("alip_rara_game_state_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentStep === 'number') {
          this.currentStep = parsed.currentStep;
          this.collectedLetters = parsed.collectedLetters || [];
        }
      }
    } catch (e) {}
  }

  resetProgress() {
    this.currentStep = -1;
    this.collectedLetters = [];
    localStorage.removeItem("alip_rara_game_state_v2");
    sound.playPop();
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.currentStep === -1) {
      this.renderLanding();
    } else if (this.currentStep >= 0 && this.currentStep < gameConfig.questions.length) {
      this.renderQuestion(this.currentStep);
    } else if (this.currentStep === gameConfig.questions.length) {
      this.renderChest();
    } else {
      this.renderReveal();
    }
  }

  // 1. Landing Screen
  renderLanding() {
    this.container.innerHTML = `
      <div class="art-card">
        <div class="scene-art">
          <div class="scene-icon-bubble">🏖️</div>
          <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--sunset-coral); margin-bottom: 6px;">
            Jimbaran Beach Quest
          </div>
          <h1 class="scene-title">14 Teka-Teki Pantai untuk Rara</h1>
          <p class="scene-desc">
            Ada sebuah peti harta karun terkunci di tepi pantai Jimbaran. Jawab 14 teka-teki santai ini untuk mengumpulkan 5 kepingan huruf rahasianya!
          </p>
        </div>

        <div style="background: #fdf0d5; border: 2px solid var(--ink); border-radius: 14px; padding: 12px 14px; margin-bottom: 20px; font-size: 0.88rem; line-height: 1.45;">
          <strong>🎯 Aturan Main:</strong><br>
          • Ada 14 pertanyaan seputar obrolan & kenangan kita.<br>
          • Setiap milestone jawaban benar akan membuka kepingan huruf.<br>
          • Susun hurufnya di akhir untuk membuka peti harta karun!
        </div>

        <button id="btn-start" class="btn-primary">
          <span>Mulai Tebak-Tebakan</span>
          <span>🌊</span>
        </button>
      </div>
    `;

    document.getElementById("btn-start")?.addEventListener("click", () => {
      sound.playPop();
      sound.startOceanAmbience();
      sound.playBgm();
      this.currentStep = 0;
      this.saveState();
      this.render();
    });
  }

  // Header tracker huruf & progress bar 14 pertanyaan
  renderProgressHeader(currentIdx) {
    const totalQ = gameConfig.questions.length;
    const progressPercent = Math.round(((currentIdx + 1) / totalQ) * 100);

    const slots = this.totalLetters.map((l, idx) => {
      if (idx < this.collectedLetters.length) {
        return `<div class="letter-slot">${this.collectedLetters[idx]}</div>`;
      }
      return `<div class="letter-slot empty">?</div>`;
    }).join("");

    return `
      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 800; color: var(--ink-light); margin-bottom: 6px;">
          <span>Pertanyaan ${currentIdx + 1} dari ${totalQ}</span>
          <span>${progressPercent}% Selesai</span>
        </div>
        <div style="width: 100%; height: 10px; background: #e9ecef; border: 2px solid var(--ink); border-radius: 10px; overflow: hidden;">
          <div style="width: ${progressPercent}%; height: 100%; background: var(--sunset-coral); transition: width 0.3s ease;"></div>
        </div>
      </div>

      <div class="letters-banner">
        <span>Kepingan Huruf:</span>
        <div class="letters-slots">${slots}</div>
      </div>
    `;
  }

  // 2. Render Single Question Card (0..13)
  renderQuestion(index) {
    const q = gameConfig.questions[index];
    if (!q) return;

    const optionsHtml = q.options.map((opt, i) => `
      <button class="choice-btn" data-val="${opt.toLowerCase()}">
        <span>${opt}</span>
        <span style="font-size: 1.1rem; opacity: 0.7;">✨</span>
      </button>
    `).join("");

    this.container.innerHTML = `
      <div class="art-card">
        ${this.renderProgressHeader(index)}

        <div class="puzzle-box" style="margin-top: 10px;">
          <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--sunset-coral); margin-bottom: 6px;">
            Pertanyaan #${q.id}
          </div>
          <p class="puzzle-question" style="font-size: 1.1rem; margin-bottom: 16px;">
            "${q.question}"
          </p>
          <div class="options-grid">
            ${optionsHtml}
          </div>
        </div>

        <div id="feedback-box" class="feedback-msg"></div>

        <button id="btn-next-question" class="btn-primary" style="display: none; margin-top: 14px;">
          <span>${index === gameConfig.questions.length - 1 ? "Ke Peti Harta Karun 🎁" : "Lanjut Pertanyaan Berikutnya ➔"}</span>
        </button>
      </div>
    `;

    this.bindQuestionEvents(index, q);
  }

  bindQuestionEvents(index, q) {
    const buttons = this.container.querySelectorAll(".choice-btn");
    const feedbackBox = document.getElementById("feedback-box");
    const nextBtn = document.getElementById("btn-next-question");
    const targetAnswer = q.answer.trim().toLowerCase();

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        sound.playPop();
        const selectedVal = btn.dataset.val.trim().toLowerCase();

        buttons.forEach((b) => b.classList.remove("correct", "wrong"));

        if (selectedVal === targetAnswer) {
          btn.classList.add("correct");
          sound.playChime();
          feedbackBox.className = "feedback-msg show success";

          let rewardNotice = "";
          if (q.letterUnlocked) {
            if (!this.collectedLetters.includes(q.letterUnlocked) || (q.letterUnlocked === "C" && this.collectedLetters.filter(x => x === "C").length < 2)) {
              this.collectedLetters.push(q.letterUnlocked);
              rewardNotice = `<br><span style="color: var(--sunset-coral); font-weight: 800;">✨ Kamu berhasil mendapatkan kepingan huruf: "${q.letterUnlocked}"!</span>`;
            }
          }

          feedbackBox.innerHTML = `🎉 ${q.feedback}${rewardNotice}`;
          nextBtn.style.display = "flex";
          this.saveState();
        } else {
          btn.classList.add("wrong");
          feedbackBox.className = "feedback-msg show error";
          feedbackBox.innerHTML = "❌ Kurang tepat nih, coba inget-inget lagi!";
        }
      });
    });

    nextBtn?.addEventListener("click", () => {
      sound.playPop();
      this.currentStep++;
      this.saveState();
      this.render();
    });
  }

  // 3. Render Peti Harta Karun (Chest stage)
  renderChest() {
    this.container.innerHTML = `
      <div class="art-card">
        <div class="letters-banner" style="margin-bottom: 16px;">
          <span>5 Kepingan Huruf:</span>
          <div class="letters-slots">
            ${this.totalLetters.map((l) => `<div class="letter-slot">${l}</div>`).join("")}
          </div>
        </div>

        <div class="chest-container">
          <div id="chest-art-btn" class="chest-box-art">
            <div style="font-size: 5rem; filter: drop-shadow(3px 4px 0px var(--ink));">🎁</div>
          </div>

          <h2 class="scene-title">${gameConfig.finalChest.heading}</h2>
          <p class="scene-desc">${gameConfig.finalChest.subheading}</p>

          <div style="display: flex; gap: 8px; justify-content: center; margin: 16px 0;" id="chest-letter-chips">
            ${this.totalLetters.map((l) => `
              <button 
                type="button" 
                class="word-box-slot filled tap-letter-btn" 
                data-char="${l}" 
                style="font-size: 1.4rem; width: 44px; height: 52px; cursor: pointer; user-select: none;"
                title="Ketuk untuk memasukkan ${l}"
              >
                ${l}
              </button>
            `).join("")}
          </div>

          <div style="margin: 14px 0 10px; display: flex; gap: 8px;">
            <input 
              id="secret-word-input" 
              type="text" 
              placeholder="${gameConfig.finalChest.placeholder}" 
              maxlength="10"
              autocomplete="off"
              style="flex: 1; padding: 14px 16px; border: 2.5px solid var(--ink); border-radius: 12px; font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; text-align: center; letter-spacing: 4px; text-transform: lowercase; box-shadow: 2px 2px 0px var(--ink); outline: none;"
            />
            <button 
              id="btn-backspace" 
              type="button"
              class="btn-secondary" 
              style="width: 52px; margin-top: 0; padding: 0; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;"
              title="Hapus huruf terakhir"
            >
              ⌫
            </button>
          </div>

          <div id="chest-feedback" class="feedback-msg"></div>

          <button id="btn-unlock-chest" class="btn-primary" style="margin-top: 14px;">
            <span>Buka Peti Karun</span>
            <span>🗝️</span>
          </button>
        </div>
      </div>
    `;

    const input = document.getElementById("secret-word-input");
    const unlockBtn = document.getElementById("btn-unlock-chest");
    const chestArt = document.getElementById("chest-art-btn");
    const feedback = document.getElementById("chest-feedback");
    const backspaceBtn = document.getElementById("btn-backspace");
    const tapLetterBtns = this.container.querySelectorAll(".tap-letter-btn");

    tapLetterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        sound.playPop();
        const char = btn.dataset.char;
        if (input.value.length < 10) {
          input.value += char.toLowerCase();
          feedback.className = "feedback-msg";
          feedback.innerHTML = "";
        }
      });
    });

    backspaceBtn?.addEventListener("click", () => {
      sound.playPop();
      if (input.value.length > 0) {
        input.value = input.value.slice(0, -1);
      }
    });

    const handleUnlock = () => {
      sound.playPop();
      const val = (input.value || "").trim().toLowerCase();
      const target = gameConfig.finalWord.toLowerCase();

      if (val === target) {
        chestArt.classList.add("shake");
        feedback.className = "feedback-msg show success";
        feedback.innerHTML = "✨ Kunci cocok! Peti sedang terbuka...";

        sound.playChime();
        setTimeout(() => {
          this.currentStep = 15;
          this.saveState();
          this.render();
        }, 1200);
      } else {
        feedback.className = "feedback-msg show error";
        feedback.innerHTML = "❌ Kata sandi belum tepat. Coba susun 5 huruf: C - W - T - C - H!";
        input.focus();
      }
    };

    unlockBtn?.addEventListener("click", handleUnlock);
    input?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleUnlock();
    });

    setTimeout(() => input?.focus(), 300);
  }

  // 4. Final Reveal ("cwtch")
  renderReveal() {
    launchCelebration();
    sound.playChime();
    sound.playBgm();

    this.container.innerHTML = `
      <div class="art-card">
        <div class="reveal-wrapper">
          <div class="reveal-heading">Harta Karun Terbuka</div>

          <div class="cwtch-display">
            <div class="cwtch-word">${gameConfig.finalWord}</div>
          </div>

          <div style="font-size: 1.2rem; font-weight: 700; color: var(--ink); margin-top: 6px;">
            🤍
          </div>

          <div class="music-playing-pill">
            <div class="sound-wave-bars">
              <div class="sound-bar"></div>
              <div class="sound-bar"></div>
              <div class="sound-bar"></div>
              <div class="sound-bar"></div>
            </div>
            <span>${gameConfig.bgm.title || "Now Playing: Lagu Kita"}</span>
          </div>

          <div style="margin-top: 26px;">
            <button id="btn-play-again" class="btn-secondary">
              <span>Mainkan Lagi dari Awal 🔄</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-play-again")?.addEventListener("click", () => {
      this.resetProgress();
    });
  }
}

export const game = new GameEngine();
