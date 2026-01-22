import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// 1. FIXED DIMENSIONS: This is the secret to making it scroll.
// If these are percentages, zthe ScrollView collapses.
const GRAPH_HEIGHT = 250; 
const BAR_WIDTH = 40;
const BAR_MARGIN = 10;

const Bar = ({ value, label, maxValue }) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const percentage = maxValue > 0 ? (value / maxValue) : 0;
    
    Animated.spring(animatedHeight, {
      toValue: percentage,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [value, maxValue]);

  // Interpolate based on the FIXED GRAPH_HEIGHT minus room for text
  const heightStyle = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, GRAPH_HEIGHT - 50] 
  });

  return (
    <View style={styles.barContainer}>
      <Text style={styles.valueLabel}>{value}</Text> 
      <View style={styles.barWrapper}>
        <Animated.View style={[styles.barAnimatedContainer, { height: heightStyle }]}>
          <LinearGradient
            colors={['#00D2FF', '#3A7BD5']}
            style={styles.barGradient}
          />
        </Animated.View>
      </View>
      <Text style={styles.axisLabel} numberOfLines={1} ellipsizeMode="tail">{label}</Text>
    </View>
  );
};

export default function App() {
  const [inputText, setInputText] = useState('Walking:29, Cycling:15, Car:35, Bus:18, Train:3');
  const [data, setData] = useState([
    { label: 'Walking', value: 29 },
    { label: 'Cycling', value: 15 },
    { label: 'Car', value: 35 },
    { label: 'Bus', value: 18 },
    { label: 'Train', value: 3 },
  ]);
  const [isFocused, setIsFocused] = useState(false);

  const handleGenerate = () => {
    Keyboard.dismiss();
    const parts = inputText.split(',');
    
    const newData = parts.map((part, index) => {
      // Check for "Label:Value" format
      if (part.includes(':')) {
        const [labelStr, valStr] = part.split(':');
        const num = parseInt(valStr.trim(), 10);
        return {
          label: labelStr.trim(),
          value: isNaN(num) ? 0 : num
        };
      } else {
        // Fallback for just numbers
        const num = parseInt(part.trim(), 10);
        return {
          label: `Result ${index + 1}`,
          value: isNaN(num) ? 0 : num
        };
      }
    });

    setData(newData);
  };

  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <Text style={styles.headerTitle}>Bar Graph Visualizer</Text>

        <View style={styles.inputSection}>
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="e.g. Walk:10, Run:20"
            placeholderTextColor="#666"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
            <LinearGradient colors={['#00D2FF', '#3A7BD5']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Update Graph</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 2. THE SCROLL VIEW CONTAINER */}
        <View style={styles.graphWrapper}>
          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
          >
            {data.map((item, index) => (
              <Bar 
                key={`${index}-${item.label}`} 
                value={item.value} 
                label={item.label}
                maxValue={maxValue} 
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputFocused: {
    borderColor: '#00D2FF',
  },
  generateButton: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // 3. GRAPH STYLES
  graphWrapper: {
    height: GRAPH_HEIGHT + 40, // Container must be tall enough for labels
    backgroundColor: '#181818',
    borderRadius: 12,
    paddingTop: 20,
  },
  scrollContent: {
    // IMPORTANT: Do not use flex: 1 here. 
    // flexDirection: 'row' is required for horizontal items.
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  barContainer: {
    width: BAR_WIDTH,
    marginHorizontal: BAR_MARGIN,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '100%',
    height: GRAPH_HEIGHT - 50, // Fixed height for the "track"
    justifyContent: 'flex-end',
  },
  barAnimatedContainer: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barGradient: {
    flex: 1,
  },
  valueLabel: {
    color: '#00D2FF',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  axisLabel: {
    color: '#666',
    fontSize: 10,
    marginTop: 6,
  }
});