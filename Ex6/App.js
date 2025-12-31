import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(null);

  const validatePhoneNumber = () => {
    let cleanedNumber = phoneNumber.replace(/[\s-]/g, '');
    
    // Remove +91 or 91 prefix if present
    if (cleanedNumber.startsWith('+91')) {
      cleanedNumber = cleanedNumber.substring(3);
    } else if (cleanedNumber.startsWith('91') && cleanedNumber.length === 12) {
      cleanedNumber = cleanedNumber.substring(2);
    }
    
    // Check if phone number is empty
    if (!cleanedNumber) {
      setValidationMessage('Please enter a phone number');
      setIsValid(false);
      return;
    }

    // Check if it contains only digits
    if (!/^\d+$/.test(cleanedNumber)) {
      setValidationMessage('Phone number should contain only digits');
      setIsValid(false);
      return;
    }

    // Check if length is exactly 10 digits
    if (cleanedNumber.length !== 10) {
      setValidationMessage(`Indian mobile numbers must be exactly 10 digits. Current length: ${cleanedNumber.length}`);
      setIsValid(false);
      return;
    }

    // Check if first digit is 6, 7, 8, or 9
    const firstDigit = cleanedNumber[0];
    if (!['6', '7', '8', '9'].includes(firstDigit)) {
      setValidationMessage('Mobile numbers must start with 6, 7, 8, or 9');
      setIsValid(false);
      return;
    }

    // If all validations pass
    setValidationMessage(`✓ Valid Indian mobile number!\nNumber: +91 ${cleanedNumber}`);
    setIsValid(true);
  };

  const clearInput = () => {
    setPhoneNumber('');
    setValidationMessage('');
    setIsValid(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Number Validator</Text>
      <Text style={styles.subtitle}>Validate Indian mobile numbers</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Validation Rules:</Text>
        <Text style={styles.infoText}>• Must be exactly 10 digits</Text>
        <Text style={styles.infoText}>• Must start with 6, 7, 8, or 9</Text>
        <Text style={styles.infoText}>• Optional: +91 or 91 prefix</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter mobile number (e.g., 9876543210)"
        placeholderTextColor="#808080"
        keyboardType="numeric"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        maxLength={15}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.validateButton} 
          onPress={validatePhoneNumber}
        >
          <Text style={styles.buttonText}>Validate</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={clearInput}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {validationMessage !== '' && (
        <View style={[
          styles.messageBox, 
          isValid ? styles.successBox : styles.errorBox
        ]}>
          <Text style={[
            styles.messageText,
            isValid ? styles.successText : styles.errorText
          ]}>
            {validationMessage}
          </Text>
        </View>
      )}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#b0b0b0',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#64b5f6',
  },
  infoText: {
    fontSize: 14,
    color: '#c0c0c0',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    height: 50,
    borderWidth: 2,
    borderColor: '#404040',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  validateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 120,
  },
  clearButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 120,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageBox: {
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
  },
  successBox: {
    backgroundColor: '#1b5e20',
  },
  errorBox: {
    backgroundColor: '#8b0000',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
  },
  successText: {
    color: '#a5d6a7',
  },
  errorText: {
    color: '#ffcdd2',
  },
});
