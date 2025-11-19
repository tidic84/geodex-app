import { Audio } from 'expo-av';

// Sound configuration
const SOUNDS = {
  tap: { frequency: 800, duration: 50 },
  success: { frequency: 1200, duration: 100 },
  coins: { frequency: 1000, duration: 150 },
  upgrade: { frequency: 600, duration: 200 },
  error: { frequency: 300, duration: 150 },
  rare: { frequency: 1500, duration: 300 },
  legendary: { frequency: 2000, duration: 400 },
};

class SoundService {
  private isEnabled: boolean = true;
  private soundObjects: Map<string, Audio.Sound> = new Map();

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.log('Sound initialization error:', error);
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Generate a simple beep sound using oscillator simulation
  private async playTone(frequency: number, duration: number, volume: number = 0.3) {
    if (!this.isEnabled) return;

    try {
      // Create a simple sine wave audio
      const sampleRate = 44100;
      const numSamples = Math.floor(sampleRate * (duration / 1000));

      // For now, we'll use a simpler approach with system sounds
      // This is a placeholder - in production, you'd use actual audio files
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' + 'A'.repeat(100) },
        { shouldPlay: false, volume }
      );

      await sound.playAsync();

      // Cleanup after playing
      setTimeout(async () => {
        await sound.unloadAsync();
      }, duration + 100);
    } catch (error) {
      // Silently fail - sound is not critical
    }
  }

  async playTap() {
    if (!this.isEnabled) return;
    // Simple feedback for taps
  }

  async playSuccess() {
    if (!this.isEnabled) return;
    // Success sound
  }

  async playCoins() {
    if (!this.isEnabled) return;
    // Coin collection sound
  }

  async playUpgrade() {
    if (!this.isEnabled) return;
    // Upgrade sound
  }

  async playError() {
    if (!this.isEnabled) return;
    // Error sound
  }

  async playRareGem() {
    if (!this.isEnabled) return;
    // Rare gem discovery
  }

  async playLegendaryGem() {
    if (!this.isEnabled) return;
    // Legendary gem discovery
  }

  async playGeodeOpen() {
    if (!this.isEnabled) return;
    // Geode opening sound
  }

  async cleanup() {
    for (const sound of this.soundObjects.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    this.soundObjects.clear();
  }
}

export const soundService = new SoundService();
