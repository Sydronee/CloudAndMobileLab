import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

export default function App() {
  const [db, setDb] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('UserDatabase.db');
        setDb(database);
        
        await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
          );
        `);

        // Check if users exist, if not insert some
        const result = await database.getAllAsync('SELECT * FROM users');
        if (result.length === 0) {
          await database.runAsync('INSERT INTO users (username, password) VALUES (?, ?)', 'admin', 'admin123');
          await database.runAsync('INSERT INTO users (username, password) VALUES (?, ?)', 'user', '1234');
          console.log('Dummy data inserted');
        }
      } catch (error) {
        console.error("Error initializing database", error);
        Alert.alert("Error", "Failed to initialize database");
      }
    };

    initDB();
  }, []);

  const handleLogin = async () => {
    if (!db) return;
    if (!username || !password) {
      Alert.alert('Validation', 'Please enter both username and password.');
      return;
    }

    try {
      const result = await db.getAllAsync(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password]
      );

      if (result.length > 0) {
        Alert.alert('Success', 'Login Successful!');
      } else {
        Alert.alert('Error', 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during login.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
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
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
