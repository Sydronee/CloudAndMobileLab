import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';

const QUIZ_DATA = [
  {
    questionText: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
    correctAnswerIndex: 1
  },
  {
    questionText: "Which element has the atomic number 1?",
    options: ["Helium", "Hydrogen", "Oxygen", "Carbon"],
    correctAnswerIndex: 1
  },
  {
    questionText: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    correctAnswerIndex: 1
  },
  {
    questionText: "What is the fastest land animal?",
    options: ["Lion", "Cheetah", "Gazelle", "Leopard"],
    correctAnswerIndex: 1
  },
  {
    questionText: "Which country is home to the Kangaroo?",
    options: ["New Zealand", "South Africa", "Australia", "Brazil"],
    correctAnswerIndex: 2
  },
  {
    questionText: "What is the boiling point of water at sea level?",
    options: ["90°C", "100°C", "110°C", "120°C"],
    correctAnswerIndex: 1
  },
  {
    questionText: "Which planet is closest to the Sun?",
    options: ["Venus", "Earth", "Mercury", "Mars"],
    correctAnswerIndex: 2
  },
  {
    questionText: "What is the main ingredient in Guacamole?",
    options: ["Tomato", "Onion", "Avocado", "Pepper"],
    correctAnswerIndex: 2
  },
  {
    questionText: "Who was the first person to walk on the Moon?",
    options: ["Buzz Aldrin", "Yuri Gagarin", "Michael Collins", "Neil Armstrong"],
    correctAnswerIndex: 3
  },
  {
    questionText: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    correctAnswerIndex: 1
  }
];

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const currentQuestion = QUIZ_DATA[currentQuestionIndex];

  const handleAnswerPress = (selectedIndex) => {
    // Check if answer is correct
    if (selectedIndex === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }

    // Move to next question or finish quiz
    if (currentQuestionIndex < QUIZ_DATA.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizFinished(false);
  };

  if (isQuizFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.resultContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.scoreText}>Your Score</Text>
          <Text style={styles.scoreBig}>
            {score} out of {QUIZ_DATA.length}
          </Text>
          <Text style={styles.percentageText}>
            {Math.round((score / QUIZ_DATA.length) * 100)}%
          </Text>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>Restart Quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.quizContainer}>
        <View style={styles.header}>
          <Text style={styles.questionCounter}>
            Question {currentQuestionIndex + 1}/{QUIZ_DATA.length}
          </Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswerPress(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  quizContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questionCounter: {
    fontSize: 18,
    color: '#9C27B0',
    fontWeight: '600',
    letterSpacing: 1,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  questionText: {
    fontSize: 26,
    color: '#E0E0E0',
    textAlign: 'center',
    lineHeight: 36,
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  optionText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  gameOverText: {
    fontSize: 40,
    color: '#9C27B0',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    color: '#B0B0B0',
    marginBottom: 10,
  },
  scoreBig: {
    fontSize: 48,
    color: '#E0E0E0',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 32,
    color: '#9C27B0',
    fontWeight: '600',
    marginBottom: 50,
  },
  restartButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  restartButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
