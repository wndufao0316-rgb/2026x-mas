/**
 * Elegant antique & classic sound effects synthesized purely via Web Audio API
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Book opening sound (gentle parchment & soft leather opening swish)
  playBookOpen() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const duration = 0.45;
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = Math.floor(sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      
      let b0 = 0, b1 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.98 * b0 + white * 0.08;
        b1 = 0.92 * b1 + white * 0.18;
        const t = i / sampleRate;
        const env = Math.sin(Math.PI * (t / duration));
        data[i] = (b0 + b1) * 0.4 * env;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + duration);
      filter.Q.setValueAtTime(0.7, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration + 0.05);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Soft, smooth paper page flip sound (부드러운 사르륵 종이 넘기는 소리)
  playPageFlip() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const duration = 0.36; // 360ms subtle realistic paper sliding duration
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = Math.floor(sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const output = buffer.getChannelData(0);

      // Generate soft pink/brown filtered noise with zero pop/click
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.12;
        b2 = 0.86 * b2 + white * 0.22;
        const pinkish = (b0 + b1 + b2) * 0.35;
        
        // Gentle smooth arch envelope
        const progress = i / bufferSize;
        const envelope = Math.sin(Math.PI * progress);
        output[i] = pinkish * envelope;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter 1: Lowpass filter sweeping like moving paper across surface
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1400, now);
      lowpass.frequency.linearRampToValueAtTime(2200, now + 0.12);
      lowpass.frequency.exponentialRampToValueAtTime(550, now + duration);
      lowpass.Q.setValueAtTime(0.7, now);

      // Filter 2: Highshelf to tame sharp high-frequencies (removes clicky "tak" sound)
      const highshelf = this.ctx.createBiquadFilter();
      highshelf.type = 'highshelf';
      highshelf.frequency.setValueAtTime(3000, now);
      highshelf.gain.setValueAtTime(-8, now);

      // Smooth Gain envelope with gradual fade-in and soft release
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.07);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(lowpass);
      lowpass.connect(highshelf);
      highshelf.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration + 0.05);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Gentle classical chime
  playChime() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.0001, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.035, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.85);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

export const sounds = new SoundEngine();
