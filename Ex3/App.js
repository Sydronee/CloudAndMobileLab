import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [healthAdvice, setHealthAdvice] = useState('');

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    if (weightNum > 0 && heightNum > 0 && ageNum > 0) {
      const bmiValue = (weightNum / ((heightNum / 100) ** 2)).toFixed(2);
      setBmi(bmiValue);
      
      // Determine BMI category based on age and gender
      let categoryText = '';
      let advice = '';
      
      if (ageNum < 18) {
        // For children and teenagers, BMI interpretation is different
        categoryText = 'Consult pediatrician';
        advice = 'BMI for individuals under 18 should be evaluated using age and gender-specific percentile charts. Please consult with a healthcare provider.';
      } else {
        // Adult BMI categories
        if (bmiValue < 18.5) {
          categoryText = 'Underweight';
          advice = gender === 'male' 
            ? 'Consider increasing caloric intake with nutrient-rich foods and strength training.'
            : 'Ensure adequate nutrition. Consult a healthcare provider if you have concerns.';
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
          categoryText = 'Normal weight';
          advice = 'Great! Maintain your healthy lifestyle with balanced diet and regular exercise.';
        } else if (bmiValue >= 25 && bmiValue < 30) {
          categoryText = 'Overweight';
          advice = gender === 'male'
            ? 'Consider increasing physical activity and monitoring portion sizes. Men tend to carry weight around the abdomen.'
            : 'Focus on balanced nutrition and regular exercise. Women may benefit from strength training to boost metabolism.';
        } else {
          categoryText = 'Obese';
          advice = 'Consider consulting a healthcare provider for a personalized weight management plan.';
        }
        
        // Age-specific advice
        if (ageNum >= 65) {
          advice += ' Note: For seniors, slightly higher BMI may be protective.';
        }
      }
      
      setCategory(categoryText);
      setHealthAdvice(advice);
    } else {
      alert('Please enter valid values for all fields');
    }
  };

  const reset = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setGender('male');
    setBmi(null);
    setCategory('');
    setHealthAdvice('');
  };

  const getCategoryColor = () => {
    if (category === 'Underweight') return '#3498db';
    if (category === 'Normal weight') return '#2ecc71';
    if (category === 'Overweight') return '#f39c12';
    if (category === 'Obese') return '#e74c3c';
    return '#95a5a6';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>BMI Calculator</Text>
        <Text style={styles.subtitle}>Body Mass Index</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter weight"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter height"
            value={height}
            onChangeText={setHeight}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age (years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter age"
            value={age}
            onChangeText={setAge}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
              onPress={() => setGender('male')}
            >
              <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
              onPress={() => setGender('female')}
            >
              <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={calculateBMI}>
          <Text style={styles.buttonText}>Calculate BMI</Text>
        </TouchableOpacity>

        {bmi && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Your BMI</Text>
            <Text style={styles.bmiValue}>{bmi}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
            
            <View style={styles.healthAdviceContainer}>
              <Text style={styles.healthAdviceTitle}>Personalized Advice</Text>
              <Text style={styles.healthAdviceText}>{healthAdvice}</Text>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>BMI Categories:</Text>
              <Text style={styles.infoText}>• Underweight: &lt; 18.5</Text>
              <Text style={styles.infoText}>• Normal weight: 18.5 - 24.9</Text>
              <Text style={styles.infoText}>• Overweight: 25 - 29.9</Text>
              <Text style={styles.infoText}>• Obese: ≥ 30</Text>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={reset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  calculateButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  categoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  categoryText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#34495e',
    marginVertical: 2,
  },
  resetButton: {
    marginTop: 20,
    padding: 12,
  },
  resetButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  genderButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  genderButtonTextActive: {
    color: 'white',
  },
  healthAdviceContainer: {
    width: '100%',
    backgroundColor: '#e8f4f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  healthAdviceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  healthAdviceText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
});
