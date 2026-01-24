# Contact Reader & Exporter App

## Description
This React Native application reads contacts from your device's storage (including SD card) and exports them to a text file with detailed information including:

- Contact names (first, middle, last)
- Phone numbers (with labels)
- Email addresses (with labels)
- Notes
- Social profiles (WhatsApp, Facebook, etc.)
- URL addresses
- Profile image availability

## Features

✅ **Permission Handling**: Requests and manages contact permissions
✅ **Complete Contact Data**: Extracts all available contact fields
✅ **Social Profiles**: Includes WhatsApp and other social media profiles
✅ **Formatted Export**: Creates a well-formatted text file
✅ **File Sharing**: Allows saving to SD card or sharing via system dialog
✅ **User-Friendly UI**: Clean interface with status indicators

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on Android:
```bash
npm run android
```

Or scan the QR code with Expo Go app.

## Required Permissions

The app requires the following Android permissions (already configured in app.json):
- `READ_CONTACTS` - To read contact information
- `WRITE_EXTERNAL_STORAGE` - To write files to SD card
- `READ_EXTERNAL_STORAGE` - To read from external storage

## How to Use

1. **Grant Permission**: Tap "Request Contacts Permission" button when you first open the app
2. **Load Contacts**: Tap "Load Contacts from Device" to read all contacts
3. **Export Data**: Tap "Export to Text File" to create and save the text file
4. **Save to SD Card**: Use the sharing dialog to save the file to your SD card or any location

## Exported File Format

The exported text file includes:
- Header with export date and total contacts
- Detailed information for each contact:
  - Name (full, first, middle, last)
  - Phone numbers (all with labels)
  - Email addresses (all with labels)
  - Notes
  - Social profiles (service, username, URL)
  - URL addresses
  - Contact ID
  - Profile image availability

## File Location

Exported files are saved with timestamp:
- Format: `contacts_export_YYYY-MM-DD-HHmmss.txt`
- Initial location: App's document directory
- Can be moved to SD card via the sharing dialog

## Technical Details

**Built with:**
- React Native / Expo
- expo-contacts: For reading contact data
- expo-file-system: For file operations
- expo-sharing: For file sharing/saving

**Platform Support:**
- Android (Primary)
- iOS (Limited - iOS restricts social profile access)

## Notes

- Social profiles like WhatsApp are available if stored in the contact
- Profile images are noted but not exported (only availability is indicated)
- The app works with contacts from phone memory and SD card
- Export time depends on the number of contacts

## Troubleshooting

**No contacts showing:**
- Ensure permission is granted
- Check if contacts exist on the device
- Try syncing contacts with your Google account

**Cannot save to SD card:**
- Use the share dialog to save to any location
- Ensure storage permission is granted
- Try using a file manager app to access the exported file

**Social profiles not showing:**
- Social profiles must be saved in the contact
- Some apps don't store profile info in contacts
- WhatsApp profiles are typically available if linked

## License

This project is for educational purposes (College Lab Exercise 13).
