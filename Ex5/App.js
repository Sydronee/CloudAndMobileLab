import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  // Calculate date 13 years ago
  const getDefaultDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 13);
    return date;
  };

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    address: '',
    gender: '',
    age: '',
    dob: getDefaultDate(),
    state: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme colors
  const theme = {
    background: isDarkMode ? '#121212' : '#f5f5f5',
    cardBackground: isDarkMode ? '#1E1E1E' : '#fff',
    text: isDarkMode ? '#E0E0E0' : '#333',
    textSecondary: isDarkMode ? '#B0B0B0' : '#666',
    border: isDarkMode ? '#333' : '#ddd',
    primary: '#2196F3',
    inputBackground: isDarkMode ? '#2A2A2A' : '#fff',
    placeholder: isDarkMode ? '#666' : '#999',
  };

  const states = [
    'Select State',
    'Andhra Pradesh',
    'Karnataka',
    'Kerala',
    'Tamil Nadu',
    'Maharashtra',
    'Delhi',
    'Gujarat',
    'Rajasthan',
    'West Bengal'
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({ ...formData, dob: selectedDate });
    }
  };

  const handleSubmit = () => {
    setSubmittedData({ ...formData });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.formContainer}>
        {/* Dark Mode Toggle */}
        <TouchableOpacity 
          style={[styles.darkModeToggle, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <Text style={[styles.darkModeText, { color: theme.text }]}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>Registration Form</Text>

        {/* Username */}
        <Text style={[styles.label, { color: theme.text }]}>User Name</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.inputBackground, 
            borderColor: theme.border,
            color: theme.text 
          }]}
          placeholder="Enter username"
          placeholderTextColor={theme.placeholder}
          value={formData.username}
          onChangeText={(text) => handleInputChange('username', text)}
        />

        {/* Password */}
        <Text style={[styles.label, { color: theme.text }]}>Password</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.inputBackground, 
            borderColor: theme.border,
            color: theme.text 
          }]}
          placeholder="Enter password"
          placeholderTextColor={theme.placeholder}
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
          secureTextEntry
        />

        {/* Address */}
        <Text style={[styles.label, { color: theme.text }]}>Address</Text>
        <TextInput
          style={[styles.input, styles.textArea, { 
            backgroundColor: theme.inputBackground, 
            borderColor: theme.border,
            color: theme.text 
          }]}
          placeholder="Enter address"
          placeholderTextColor={theme.placeholder}
          value={formData.address}
          onChangeText={(text) => handleInputChange('address', text)}
          multiline
          numberOfLines={3}
        />

        {/* Gender */}
        <Text style={[styles.label, { color: theme.text }]}>Gender</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => handleInputChange('gender', 'Male')}
          >
            <View style={[styles.radioCircle, { borderColor: theme.primary }]}>
              {formData.gender === 'Male' && <View style={[styles.selectedRadio, { backgroundColor: theme.primary }]} />}
            </View>
            <Text style={[styles.radioText, { color: theme.text }]}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => handleInputChange('gender', 'Female')}
          >
            <View style={[styles.radioCircle, { borderColor: theme.primary }]}>
              {formData.gender === 'Female' && <View style={[styles.selectedRadio, { backgroundColor: theme.primary }]} />}
            </View>
            <Text style={[styles.radioText, { color: theme.text }]}>Female</Text>
          </TouchableOpacity>
        </View>

        {/* Age */}
        <Text style={[styles.label, { color: theme.text }]}>Age</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.inputBackground, 
            borderColor: theme.border,
            color: theme.text 
          }]}
          placeholder="Enter age"
          placeholderTextColor={theme.placeholder}
          value={formData.age}
          onChangeText={(text) => handleInputChange('age', text)}
          keyboardType="numeric"
        />

        {/* Date of Birth */}
        <Text style={[styles.label, { color: theme.text }]}>Date of Birth</Text>
        <TouchableOpacity 
          style={[styles.dateButton, { 
            backgroundColor: theme.inputBackground, 
            borderColor: theme.border 
          }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.dateText, { color: theme.text }]}>{formatDate(formData.dob)}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.dob}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={(() => {
              const date = new Date();
              date.setFullYear(date.getFullYear() - 13);
              return date;
            })()}
          />
        )}

        {/* State Picker */}
        <Text style={[styles.label, { color: theme.text }]}>State</Text>
        <View style={[styles.pickerContainer, { 
          backgroundColor: theme.inputBackground, 
          borderColor: theme.border 
        }]}>
          <Picker
            selectedValue={formData.state}
            onValueChange={(value) => handleInputChange('state', value)}
            style={[styles.picker, { color: theme.text }]}
            dropdownIconColor={theme.text}
          >
            {states.map((stateItem, index) => (
              <Picker.Item 
                key={index} 
                label={stateItem} 
                value={index === 0 ? '' : stateItem}
                color={isDarkMode ? '#E0E0E0' : '#333'}
              />
            ))}
          </Picker>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        {/* Display Submitted Data */}
        {submittedData && (
          <View style={[styles.resultContainer, { 
            backgroundColor: theme.cardBackground, 
            borderColor: theme.primary 
          }]}>
            <Text style={[styles.resultTitle, { color: theme.primary }]}>Submitted Information:</Text>
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, { color: theme.text }]}>User Name:</Text>
              <Text style={[styles.resultValue, { color: theme.textSecondary }]}>{submittedData.username}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, { color: theme.text }]}>Password:</Text>
              <Text style={[styles.resultValue, { color: theme.textSecondary }]}>{'*'.repeat(submittedData.password.length)}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, { color: theme.text }]}>Address:</Text>
              <Text style={[styles.resultValue, { color: theme.textSecondary }]}>{submittedData.address}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, { color: theme.text }]}>Gender:</Text>
              <Text style={[styles.resultValue, { color: theme.textSecondary }]}>{submittedData.gender}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, { color: theme.text }]}>Age:</Text>
              <Text style={[styles.resultValue, { color: theme.textSecondary }]}>{submittedData.age}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, { color: theme.text }]}>Date of Birth:</Text>
              <Text style={[styles.resultValue, { color: theme.textSecondary }]}>{formatDate(submittedData.dob)}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, { color: theme.text }]}>State:</Text>
              <Text style={[styles.resultValue, { color: theme.textSecondary }]}>{submittedData.state || 'Not selected'}</Text>
            </View>
          </View>
        )}
        
        <StatusBar style={isDarkMode ? "light" : "dark"} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRadio: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2196F3',
  },
  resultRow: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 140,
  },
  resultValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  darkModeToggle: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-end',
  },
  darkModeText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
