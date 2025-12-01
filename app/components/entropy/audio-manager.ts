"use client";

class AudioManager {
  private static instance: AudioManager;
  private ambient: HTMLAudioElement | null = null;
  private typingSounds: HTMLAudioElement[] = [];
  private isMuted: boolean = false;
  private initialized: boolean = false;

  private constructor() {
    if (typeof window !== "undefined") {
      this.ambient = new Audio("/sounds/drone.mp3");
      this.ambient.loop = true;
      this.ambient.volume = 0.2;

      const soundFiles = ['type_1.mp3'];
      
      soundFiles.forEach(file => {
        const audio = new Audio(`/sounds/${file}`);
        audio.volume = 0.4;
        this.typingSounds.push(audio);
      });
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public initialize() {
    if (this.initialized) return;
    this.initialized = true;
    this.startAmbient();
  }

  public startAmbient() {
    if (this.ambient && !this.isMuted) {
      this.ambient.play().catch((e) => {
        console.log("Audio autoplay blocked, waiting for interaction:", e);
      });
    }
  }

  public stopAmbient() {
    if (this.ambient) {
      this.ambient.pause();
    }
  }

  public playTypingSound() {
    if (this.isMuted || this.typingSounds.length === 0) return;

    const sound = this.typingSounds[Math.floor(Math.random() * this.typingSounds.length)];

    if (sound) {
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = 0.3 + Math.random() * 0.2;
      clone.playbackRate = 0.9 + Math.random() * 0.2;

      clone.play().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }
}

export const audioManager = AudioManager.getInstance();
