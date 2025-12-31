import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';

export default function App() {
  const handleDialNumber = async () => {
    const phoneNumber = 'tel:1234567890';
    
    try {
      await Linking.openURL(phoneNumber);
    } catch (error) {
      Alert.alert('Error', 'Phone dialer is not available on this device');
    }
  };

  const handleOpenWebsite = async () => {
    const url = 'https://www.google.com';
    
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Cannot open browser');
    }
  };

  const handleSendSMS = async () => {
    const smsUrl = 'sms:1234567890';
    
    try {
      await Linking.openURL(smsUrl);
    } catch (error) {
      Alert.alert('Error', 'SMS is not available on this device');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Text style={styles.title}>Main Menu</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleDialNumber}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>📞 Dial Number</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleOpenWebsite}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>🌐 Open Website</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSendSMS}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>💬 Send SMS</Text>
      </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
