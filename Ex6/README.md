# Phone Number Validator App

A React Native mobile application that validates Indian mobile numbers according to specific criteria.

## Features

- ✅ Validates phone numbers with specific area codes
- ✅ Checks total number length (6-8 digits including area code)
- ✅ Clean and intuitive user interface
- ✅ Real-time validation feedback
- ✅ Clear button to reset input

## Validation Rules

### Indian Mobile Number Format
- Must be exactly **10 digits** long
- Must start with **6, 7, 8, or 9**
- Optional country code: **+91** or **91** prefix (automatically removed for validation)

### Examples of Valid Mobile Numbers
- `9876543210` (10 digits starting with 9)
- `8123456789` (10 digits starting with 8)
- `7012345678` (10 digits starting with 7)
- `6987654321` (10 digits starting with 6)
- `+919876543210` (with +91 country code)
- `919876543210` (with 91 country code)

### Examples of Invalid Mobile Numbers
- `123456789` (doesn't start with 6, 7, 8, or 9)
- `98765432` (less than 10 digits)
- `98765432101` (more than 10 digits)
- `5123456789` (starts with 5, not valid for Indian mobile)

## Running the App

### Development Mode
```bash
npm start
# or
npx expo start
```

Then:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan the QR code with Expo Go app on your physical device

## Building APK with EAS

### Prerequisites
Make sure you have EAS CLI installed and are logged in:
```bash
npm install -g eas-cli
eas login
```

### Build APK Locally
To build an Android APK locally, run:
```bash
eas build --platform android --profile apk --local
```

This will:
1. Build the APK locally on your machine
2. Use the `apk` profile defined in `eas.json`
3. Generate a release APK that you can install on any Android device

### Alternative Build Profiles

**Production APK (cloud build):**
```bash
eas build --platform android --profile production
```

**Preview APK:**
```bash
eas build --platform android --profile preview
```

## Project Structure

```
Ex6/
├── App.js              # Main application component with validation logic
├── app.json            # Expo configuration
├── eas.json            # EAS Build configuration
├── package.json        # Dependencies
├── index.js            # Entry point
└── assets/             # Images and icons
```

## Technologies Used

- React Native
- Expo SDK 54
- EAS Build
- React Hooks (useState)

## Validation Logic

The app performs the following validation steps:
1. Removes spaces and dashes from input
2. Checks if input is not empty
3. Verifies input contains only digits
4. Matches against valid area codes
5. Validates total length (6-8 digits)
6. Displays appropriate success or error message
