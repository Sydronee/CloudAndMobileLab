import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, SafeAreaView } from 'react-native';
import RNFS from 'react-native-fs';

const FILE_PATH = RNFS.DocumentDirectoryPath + '/user_data.txt';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    initializeFile();
  }, []);

  const initializeFile = async () => {
    try {
      const exists = await RNFS.exists(FILE_PATH);
      if (!exists) {
        // Create file with dummy accounts
        // admin -> 1234
        // user -> pass
        const dummyData = "admin\t1234\nuser\tpass";
        await RNFS.writeFile(FILE_PATH, dummyData, 'utf8');
        console.log('Dummy file created at:', FILE_PATH);
      } else {
        console.log('File already exists at:', FILE_PATH);
      }
    } catch (error) {
      console.error('Error initializing file:', error);
      Alert.alert('Error', 'Failed to initialize data file.');
    }
  };

  const handleLogin = async () => {
    try {
      const exists = await RNFS.exists(FILE_PATH);
      if (!exists) {
         Alert.alert('Error', 'User data file missing.');
         return;
      }

      const fileContent = await RNFS.readFile(FILE_PATH, 'utf8');
      const lines = fileContent.split('\n');
      
      let loginSuccess = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue; // Skip empty lines

        const parts = line.split('\t');
        if (parts.length >= 2) {
          const storedUser = parts[0].trim();
          const storedPass = parts[1].trim();

          if (storedUser === username && storedPass === password) {
            loginSuccess = true;
            break;
          }
        }
      }

      if (loginSuccess) {
        Alert.alert('Login Successful', `Welcome, ${username}!`);
      } else {
        Alert.alert('Login Failed', 'Invalid username or password.');
      }

    } catch (error) {
      console.error('Error reading file:', error);
      Alert.alert('Error', 'Failed to read user data.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>RNFS Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Button title="Login" onPress={handleLogin} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
