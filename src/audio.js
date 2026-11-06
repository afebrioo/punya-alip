/**
 * =======================================================================
 * AUDIO CONTROLLER (Web Audio Synthesizer + Custom BGM Player)
 * =======================================================================
 * 1. Menghasilkan suara deburan ombak pantai asli via Web Audio API 
 *    (bebas error kuota/file hilang).
 * 2. Menghasilkan chime kemenangan manis saat teka-teki terjawab.
 * 3. Memutar file BGM (lagu kustom) yang akan diberikan oleh Alip.
 */

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.waveGain = null;
    this.bgmAudio = null;
    this.bgmUrl = "";
    this.isBgmPlaying = false;
  }

  init(bgmUrl = "") {
    this.bgmUrl = bgmUrl;
    if (bgmUrl) {
      this.bgmAudio = new Audio(bgmUrl);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.7;
    }
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  // 🌊 Generator Deburan Ombak Pantai (Ambient Sea Waves)
  startOceanAmbience() {
    this.ensureContext();
    if (!this.audioCtx || this.waveGain || this.isMuted) return;

    try {
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // White/Pink noise generation
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.08;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter Lowpass untuk membentuk suara deburan air
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 350;

      // LFO (Low Frequency Oscillator) untuk memodulasi irama ombak maju-mundur
      const lfo = this.audioCtx.createOscillator();
      lfo.frequency.value = 0.18; // Siklus ombak tiap ~5.5 detik

      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.value = 280;

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Volume Gain Master Ombak
      this.waveGain = this.audioCtx.createGain();
      this.waveGain.gain.value = 0.28;

      whiteNoise.connect(filter);
      filter.connect(this.waveGain);
      this.waveGain.connect(this.audioCtx.destination);

      whiteNoise.start();
      lfo.start();
      this.isPlaying = true;
    } catch (e) {
      console.warn("Audio Context ombak tidak dapat dijalankan:", e);
    }
  }

  stopOceanAmbience() {
    if (this.waveGain) {
      try {
        this.waveGain.gain.setValueAtTime(this.waveGain.gain.value, this.audioCtx.currentTime);
        this.waveGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1);
        setTimeout(() => {
          this.waveGain = null;
        }, 1000);
      } catch (e) {
        this.waveGain = null;
      }
    }
    this.isPlaying = false;
  }

  // ✨ Chime Kemenangan Lembut (Harmonic Chords)
  playChime() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      const startTime = this.audioCtx.currentTime + idx * 0.12;
      const duration = 1.2;

      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(noteGain);
      noteGain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // 🔔 Efek Suara Tombol / Click Pop
  playPop() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  }

  // 🎵 Kontrol BGM Lagu Kustom
  setBgm(url) {
    this.bgmUrl = url;
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
    this.bgmAudio = new Audio(url);
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0.7;
    if (!this.isMuted) {
      this.bgmAudio.play().catch(() => {});
      this.isBgmPlaying = true;
    }
  }

  playBgm() {
    if (this.bgmAudio && !this.isMuted) {
      this.bgmAudio.play().catch(() => {});
      this.isBgmPlaying = true;
    }
  }

  pauseBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.isBgmPlaying = false;
    }
  }

  // 🔈 Toggle Mute Keseluruhan
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.waveGain) this.waveGain.gain.value = 0;
      if (this.bgmAudio) this.bgmAudio.pause();
    } else {
      if (this.waveGain) this.waveGain.gain.value = 0.28;
      if (this.bgmAudio && this.bgmUrl) this.bgmAudio.play().catch(() => {});
      else this.startOceanAmbience();
    }
    return this.isMuted;
  }
}

export const sound = new SoundManager();

