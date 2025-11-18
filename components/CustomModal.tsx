import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type ModalButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type CustomModalProps = {
  visible: boolean;
  title: string;
  message: string;
  buttons?: ModalButton[];
  onClose?: () => void;
};

export function CustomModal({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
}: CustomModalProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  const handleButtonPress = (button: ModalButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  };

  const getButtonStyle = (style?: 'default' | 'cancel' | 'destructive') => {
    switch (style) {
      case 'cancel':
        return { color: textSecondaryColor };
      case 'destructive':
        return { color: '#EF4444' };
      default:
        return { color: primaryColor };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, { backgroundColor: cardColor }]}>
              <View style={styles.content}>
                <ThemedText style={styles.title}>{title}</ThemedText>
                <ThemedText style={[styles.message, { color: textSecondaryColor }]}>
                  {message}
                </ThemedText>
              </View>
              <View style={[styles.buttonContainer, buttons.length > 2 && styles.buttonContainerVertical]}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      buttons.length <= 2 && styles.buttonHorizontal,
                      buttons.length > 2 && styles.buttonVertical,
                      index > 0 && buttons.length <= 2 && styles.buttonBorderLeft,
                      index > 0 && buttons.length > 2 && styles.buttonBorderTop,
                    ]}
                    onPress={() => handleButtonPress(button)}
                  >
                    <ThemedText
                      style={[
                        styles.buttonText,
                        getButtonStyle(button.style),
                        button.style === 'cancel' && styles.buttonTextCancel,
                      ]}
                    >
                      {button.text}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  modalContainer: {
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  buttonContainerVertical: {
    flexDirection: 'column',
  },
  button: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHorizontal: {
    flex: 1,
  },
  buttonVertical: {
    width: '100%',
  },
  buttonBorderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(128, 128, 128, 0.2)',
  },
  buttonBorderTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonTextCancel: {
    fontWeight: '400',
  },
});
