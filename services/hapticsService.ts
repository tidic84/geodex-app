import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

class HapticsService {
  private isEnabled: boolean = true;

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Light tap feedback - for button presses
  async lightTap() {
    if (!this.isEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Silently fail
    }
  }

  // Medium tap feedback - for confirmations
  async mediumTap() {
    if (!this.isEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Silently fail
    }
  }

  // Heavy tap feedback - for important actions
  async heavyTap() {
    if (!this.isEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      // Silently fail
    }
  }

  // Success notification
  async success() {
    if (!this.isEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Silently fail
    }
  }

  // Warning notification
  async warning() {
    if (!this.isEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      // Silently fail
    }
  }

  // Error notification
  async error() {
    if (!this.isEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      // Silently fail
    }
  }

  // Selection change feedback
  async selection() {
    if (!this.isEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      // Silently fail
    }
  }

  // Custom pattern for rare gems
  async rareGem() {
    if (!this.isEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 100);
    } catch (error) {
      // Silently fail
    }
  }

  // Custom pattern for legendary gems
  async legendaryGem() {
    if (!this.isEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 150);
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 300);
    } catch (error) {
      // Silently fail
    }
  }

  // Geode opening pattern
  async geodeOpen() {
    if (!this.isEnabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, 100);
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 200);
    } catch (error) {
      // Silently fail
    }
  }

  // Coin collection pattern
  async collectCoins() {
    if (!this.isEnabled || Platform.OS === 'web') return;
    try {
      for (let i = 0; i < 3; i++) {
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, i * 50);
      }
    } catch (error) {
      // Silently fail
    }
  }
}

export const hapticsService = new HapticsService();
