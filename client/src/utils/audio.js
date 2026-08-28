// Web Audio API Procedural Sound Engine for Athenaeum Library

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('athenaeum_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('athenaeum_muted', this.muted ? 'true' : 'false');
    return this.muted;
  }

  // Realistic Page Flip / Turn Sound
  playPageFlip() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.18; // 180ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brown/pink noise burst for crisp paper rustle
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = lastOut * env * 2.8;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.18);
      filter.Q.value = 1.2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      console.debug('Audio not supported or blocked:', e);
    }
  }

  // Book spine pulled / placed on wooden shelf
  playBookThud() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(38, this.ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  // Quill Pen Scratch for typing / creating
  playQuillScratch() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800 + Math.random() * 400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  // Wax Seal / Stamp Click for save or borrow
  playWaxStamp() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.12);

      gain1.gain.setValueAtTime(0.45, this.ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc1.start();
      osc1.stop(this.ctx.currentTime + 0.13);
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }

  // Paper Tear effect when deleting a book
  playTearPaper() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        const env = Math.pow(1 - i / bufferSize, 0.7);
        const modulation = Math.sin((i / bufferSize) * 40 * Math.PI) * 0.4 + 0.6;
        data[i] = white * env * modulation * 0.4;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      console.debug('Audio error:', e);
    }
  }
}

export const sound = new SoundEngine();
