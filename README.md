# Cloud And Mobile Lab

This repository contains various mobile application exercises.

## Apps List

### Ex1: HelloWorld
- **Directory**: [Ex1/HelloWorld](./Ex1/HelloWorld)
- **Description**: A simple React Native application that displays "Hello World!". It serves as an introductory project to verify the development environment setup.

### Ex2: Calculator
- **Directory**: [Ex2](./Ex2)
- **Description**: A fully functional calculator app.
- **Features**:
  - Basic arithmetic operations: Addition, Subtraction, Multiplication, Division.
  - Advanced functions: Square, Square Root, Reciprocal.
  - Error handling for invalid operations (e.g., division by zero).

### Ex3: BMI Calculator
- **Directory**: [Ex3](./Ex3)
- **Description**: An application to calculate Body Mass Index (BMI).
- **Features**:
  - Inputs for weight, height, age, and gender.
  - Calculates BMI value.
  - Provides BMI category (Underweight, Normal, Overweight, Obese) and health advice based on the calculated BMI.

### Ex4: Hello App
- **Directory**: [Ex4](./Ex4)
- **Description**: A greeting application.
- **Features**:
  - Takes user input for their name.
  - Displays a personalized greeting message (e.g., "Hello, [Name]!").

### Ex5: Registration Form
- **Directory**: [Ex5](./Ex5)
- **Description**: A user registration form application.
- **Features**:
  - Fields for Username, Password, Address, Gender, Age, Date of Birth, and State.
  - Date picker for Date of Birth.
  - Toggle for Dark Mode/Light Mode themes.

### Ex6: Phone Validator
- **Directory**: [Ex6](./Ex6)
- **Description**: A utility app to validate Indian mobile numbers.
- **Features**:
  - Validates if the number is exactly 10 digits.
  - Checks if the number starts with valid digits (6, 7, 8, or 9).
  - Handles optional prefixes like `+91` or `91`.

### Ex7: Menu App
- **Directory**: [Ex7](./Ex7)
- **Description**: A multi-functional menu application demonstrating system intents.
- **Features**:
  - **Dial Number**: Launches the phone dialer.
  - **Open Website**: Opens a URL in the browser.
  - **Send SMS**: Launches the SMS application.

### Ex8: Quiz App
- **Directory**: [Ex8](./Ex8)
- **Description**: An interactive quiz application.
- **Features**:
  - Multiple-choice questions on general knowledge.
  - Tracks score.
  - Displays final score and percentage at the end of the quiz.

### Ex9: Drawing App
- **Directory**: [Ex9](./Ex9)
- **Description**: A creative drawing application.
- **Features**:
  - **Tools**: Freehand drawing, Lines, Circles, Rectangles, Eraser.
  - **Color Picker**: Customize drawing colors using Hue, Saturation, and Lightness.
  - **Canvas**: Interactive drawing area.

### Ex10: Bar Graph Visualizer
- **Directory**: [Ex10](./Ex10)
- **Description**: A data visualization app.
- **Features**:
  - Accepts a comma-separated list of numbers as input.
  - Generates a scrollable animated bar chart representing the data.
  - Dynamically updates the graph based on user input.

### Ex11: File System Login
- **Directory**: [Ex11](./Ex11)
- **Description**: A login application demonstrating file system operations using `react-native-fs`.
- **Features**:
  - **File Initialization**: Automatically creates a local file (`user_data.txt`) with dummy credentials (e.g., `admin/1234`) on startup if it doesn't exist.
  - **Authentication**: Reads from the local file system to validate entered username and password against stored records.
  - **User Interface**: Simple login screen with inputs for credentials and status alerts.

## How to Run

To run any of the applications, navigate to the project directory and run the following commands:

```bash
npm install
npx expo start
```

To compile the app to an APK file, use:

```bash
npx expo build
```

and if you have EAS CLI installed, you can use:

```bash
eas build -p android --profile preview
```

or if you want to build locally:

```bash
eas build -p android --profile apk --local
```
