import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

const buttons = [
  ['C', '⌫', '/', '*'],
  ['7', '8', '9', '-'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '='],
  ['0', '.'],
];

export default function App() {
  const [display, setDisplay] = useState('');

  const appendValue = (value) => {
    if (['+', '-', '*', '/'].includes(value)) {
      const last = display.slice(-1);
      if (!display || ['+', '-', '*', '/'].includes(last)) {
        return;
      }
    }

    if (value === '.') {
      const parts = display.split(/[+\-*/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes('.')) return;
    }

    setDisplay((prev) => prev + value);
  };

  const clearDisplay = () => setDisplay('');

  const backspace = () => setDisplay((prev) => prev.slice(0, -1));

  const calculate = () => {
    try {
      if (!display) return;
      const last = display.slice(-1);
      if (['+', '-', '*', '/'].includes(last)) return;

      const result = Function(`"use strict"; return (${display})`)();
      setDisplay(Number.isFinite(result) ? String(result) : 'Error');
    } catch {
      setDisplay('Error');
    }
  };

  const handlePress = (value) => {
    if (value === 'C') {
      clearDisplay();
      return;
    }

    if (value === '⌫') {
      backspace();
      return;
    }

    if (value === '=') {
      calculate();
      return;
    }

    appendValue(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      <View style={styles.calculator}>
        <Text style={styles.display} numberOfLines={1} adjustsFontSizeToFit>
          {display || '0'}
        </Text>

        <View style={styles.buttonsGrid}>
          {buttons.flat().map((button, index) => {
            const isOperator = ['+', '-', '*', '/'].includes(button);
            const isEqual = button === '=';
            const isClear = button === 'C';
            const isWide = button === '0' || button === '.';

            return (
              <TouchableOpacity
                key={`${button}-${index}`}
                style={[
                  styles.button,
                  isOperator && styles.operator,
                  isEqual && styles.equal,
                  isClear && styles.clear,
                  isWide && styles.wide,
                ]}
                onPress={() => handlePress(button)}
              >
                <Text style={[
                  styles.buttonText,
                  (isOperator || isEqual || isClear) && styles.buttonTextLight,
                ]}>{button}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calculator: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  display: {
    backgroundColor: '#111827',
    color: '#fff',
    fontSize: 42,
    textAlign: 'right',
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 18,
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    width: '22%',
    height: 62,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  operator: {
    backgroundColor: '#f59e0b',
  },
  equal: {
    backgroundColor: '#10b981',
    width: '46%',
  },
  clear: {
    backgroundColor: '#ef4444',
  },
  wide: {
    width: '46%',
  },
  buttonText: {
    fontSize: 26,
    color: '#111827',
    fontWeight: '700',
  },
  buttonTextLight: {
    color: '#fff',
  },
});
