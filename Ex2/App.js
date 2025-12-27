import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num) => {
    if (display === 'Error') {
      setDisplay(String(num));
      setNewNumber(false);
      return;
    }
    if (newNumber) {
      setDisplay(String(num));
      setNewNumber(false);
    } else {
      if (display.length < 12) {
        setDisplay(display === '0' ? String(num) : display + num);
      }
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op) => {
    const currentValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(currentValue);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '*':
        return prev * current;
      case '/':
        return prev / current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    const currentValue = parseFloat(display);
    
    if (previousValue !== null && operation) {
      const result = calculate(previousValue, currentValue, operation);
      const formattedResult = Number.isInteger(result) ? String(result) : result.toFixed(8).replace(/\.?0+$/, '');
      setDisplay(formattedResult);
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleSquare = () => {
    const value = parseFloat(display);
    setDisplay(String(value * value));
    setNewNumber(true);
  };

  const handleSquareRoot = () => {
    const value = parseFloat(display);
    if (value < 0) {
      setDisplay('Error');
    } else {
      setDisplay(String(Math.sqrt(value)));
    }
    setNewNumber(true);
  };

  const handleReciprocal = () => {
    const value = parseFloat(display);
    if (value === 0) {
      setDisplay('Error');
    } else {
      setDisplay(String(1 / value));
    }
    setNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
    setNewNumber(true);
  };

  const handleNegate = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  const Button = ({ label, onPress, style, textStyle }) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.displayContainer}>
        {previousValue !== null && operation && (
          <Text style={styles.subDisplay}>
            {previousValue} {operation}
          </Text>
        )}
        <Text style={styles.display} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <Button label="C" onPress={handleClear} style={styles.clearButton} />
          <Button label="⌫" onPress={handleBackspace} style={styles.functionButton} />
          <Button label="%" onPress={handlePercent} style={styles.functionButton} />
          <Button label="÷" onPress={() => handleOperation('/')} style={styles.operationButton} />
        </View>

        <View style={styles.row}>
          <Button label="7" onPress={() => handleNumber(7)} style={styles.numberButton} />
          <Button label="8" onPress={() => handleNumber(8)} style={styles.numberButton} />
          <Button label="9" onPress={() => handleNumber(9)} style={styles.numberButton} />
          <Button label="×" onPress={() => handleOperation('*')} style={styles.operationButton} />
        </View>

        <View style={styles.row}>
          <Button label="4" onPress={() => handleNumber(4)} style={styles.numberButton} />
          <Button label="5" onPress={() => handleNumber(5)} style={styles.numberButton} />
          <Button label="6" onPress={() => handleNumber(6)} style={styles.numberButton} />
          <Button label="−" onPress={() => handleOperation('-')} style={styles.operationButton} />
        </View>

        <View style={styles.row}>
          <Button label="1" onPress={() => handleNumber(1)} style={styles.numberButton} />
          <Button label="2" onPress={() => handleNumber(2)} style={styles.numberButton} />
          <Button label="3" onPress={() => handleNumber(3)} style={styles.numberButton} />
          <Button label="+" onPress={() => handleOperation('+')} style={styles.operationButton} />
        </View>

        <View style={styles.row}>
          <Button label="+/−" onPress={handleNegate} style={styles.numberButton} />
          <Button label="0" onPress={() => handleNumber(0)} style={styles.numberButton} />
          <Button label="." onPress={handleDecimal} style={styles.numberButton} />
          <Button label="=" onPress={handleEquals} style={styles.equalsButton} />
        </View>

        <View style={styles.row}>
          <Button label="x²" onPress={handleSquare} style={styles.specialButton} textStyle={styles.smallerText} />
          <Button label="√x" onPress={handleSquareRoot} style={styles.specialButton} textStyle={styles.smallerText} />
          <Button label="1/x" onPress={handleReciprocal} style={styles.specialButton} textStyle={styles.smallerText} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  displayContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  subDisplay: {
    fontSize: 24,
    color: '#888',
    textAlign: 'right',
    marginBottom: 5,
  },
  display: {
    fontSize: 64,
    color: '#fff',
    textAlign: 'right',
    fontWeight: '300',
    marginBottom: 10,
  },
  buttonsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    height: Math.min((width - 60) / 4, 85),
    backgroundColor: '#333',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '400',
  },
  smallerText: {
    fontSize: 20,
  },
  numberButton: {
    backgroundColor: '#505050',
  },
  operationButton: {
    backgroundColor: '#ff9f0a',
  },
  clearButton: {
    backgroundColor: '#d4d4d2',
  },
  equalsButton: {
    backgroundColor: '#34c759',
  },
  functionButton: {
    backgroundColor: '#a0a0a0',
  },
  specialButton: {
    backgroundColor: '#1c86ee',
  },
});
