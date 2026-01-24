import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Platform 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Contacts from 'expo-contacts';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [contactCount, setContactCount] = useState(0);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Contacts.getPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const requestPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      Alert.alert('Success', 'Contacts permission granted!');
    } else {
      Alert.alert('Permission Denied', 'Cannot access contacts without permission.');
    }
  };

  const loadContacts = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant contacts permission first.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
          Contacts.Fields.Note,
          Contacts.Fields.Image,
          Contacts.Fields.UrlAddresses,
          Contacts.Fields.SocialProfiles,
        ],
      });

      if (data.length > 0) {
        setContacts(data);
        setContactCount(data.length);
        Alert.alert('Success', `Loaded ${data.length} contacts!`);
      } else {
        Alert.alert('No Contacts', 'No contacts found on this device.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to load contacts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatContactData = (contact) => {
    let output = '\n' + '='.repeat(60) + '\n';
    output += `Contact Name: ${contact.name || 'N/A'}\n`;
    output += '-'.repeat(60) + '\n';

    // First Name, Middle Name, Last Name
    if (contact.firstName) output += `First Name: ${contact.firstName}\n`;
    if (contact.middleName) output += `Middle Name: ${contact.middleName}\n`;
    if (contact.lastName) output += `Last Name: ${contact.lastName}\n`;

    // Phone Numbers
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      output += '\nPhone Numbers:\n';
      contact.phoneNumbers.forEach((phone, index) => {
        output += `  ${index + 1}. ${phone.number || 'N/A'}`;
        if (phone.label) output += ` (${phone.label})`;
        output += '\n';
      });
    } else {
      output += '\nPhone Numbers: None\n';
    }

    // Email Addresses
    if (contact.emails && contact.emails.length > 0) {
      output += '\nEmail Addresses:\n';
      contact.emails.forEach((email, index) => {
        output += `  ${index + 1}. ${email.email || 'N/A'}`;
        if (email.label) output += ` (${email.label})`;
        output += '\n';
      });
    } else {
      output += '\nEmail Addresses: None\n';
    }

    // Notes
    if (contact.note) {
      output += `\nNotes: ${contact.note}\n`;
    } else {
      output += '\nNotes: None\n';
    }

    // Social Profiles (WhatsApp, etc.)
    if (contact.socialProfiles && contact.socialProfiles.length > 0) {
      output += '\nSocial Profiles:\n';
      contact.socialProfiles.forEach((profile, index) => {
        output += `  ${index + 1}. Service: ${profile.service || 'Unknown'}\n`;
        if (profile.username) output += `     Username: ${profile.username}\n`;
        if (profile.url) output += `     URL: ${profile.url}\n`;
        if (profile.localizedProfile) output += `     Profile: ${profile.localizedProfile}\n`;
      });
    }

    // URL Addresses
    if (contact.urlAddresses && contact.urlAddresses.length > 0) {
      output += '\nURL Addresses:\n';
      contact.urlAddresses.forEach((url, index) => {
        output += `  ${index + 1}. ${url.url || 'N/A'}`;
        if (url.label) output += ` (${url.label})`;
        output += '\n';
      });
    }

    // Contact ID
    output += `\nContact ID: ${contact.id || 'N/A'}\n`;

    // Image availability
    if (contact.image) {
      output += 'Profile Image: Available\n';
    } else {
      output += 'Profile Image: Not Available\n';
    }

    return output;
  };

  const exportToFile = async () => {
    if (contacts.length === 0) {
      Alert.alert('No Data', 'Please load contacts first.');
      return;
    }

    setLoading(true);
    try {
      // Create file content
      let fileContent = '╔═══════════════════════════════════════════════════════════╗\n';
      fileContent += '║          CONTACTS EXPORT - DETAILED INFORMATION           ║\n';
      fileContent += '╚═══════════════════════════════════════════════════════════╝\n';
      fileContent += `\nExport Date: ${new Date().toLocaleString()}\n`;
      fileContent += `Total Contacts: ${contacts.length}\n`;
      fileContent += `Platform: ${Platform.OS}\n`;
      fileContent += '\n' + '='.repeat(60) + '\n';

      // Add each contact
      contacts.forEach((contact, index) => {
        fileContent += `\n[Contact ${index + 1} of ${contacts.length}]`;
        fileContent += formatContactData(contact);
      });

      fileContent += '\n' + '='.repeat(60) + '\n';
      fileContent += 'End of Contacts Export\n';
      fileContent += '='.repeat(60) + '\n';

      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fileName = `contacts_export_${timestamp}.txt`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Write to file
      await FileSystem.writeAsStringAsync(fileUri, fileContent, {
        encoding: 'utf8',
      });

      // Share the file
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Save or Share Contacts File',
          UTI: 'public.plain-text',
        });
        Alert.alert(
          'Success', 
          `Contacts exported successfully!\n\nFile: ${fileName}\n\nYou can now save it to your SD card or share it.`
        );
      } else {
        Alert.alert(
          'Saved', 
          `File saved to app directory:\n${fileUri}\n\nSharing not available on this device.`
        );
      }
    } catch (error) {
      Alert.alert('Error', `Failed to export contacts: ${error.message}`);
      console.error('Export error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Contact Reader & Exporter</Text>
        <Text style={styles.subtitle}>Export contacts to SD Card</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📱 This app reads contacts from your device including:
          </Text>
          <Text style={styles.bulletPoint}>• Names and phone numbers</Text>
          <Text style={styles.bulletPoint}>• Email addresses</Text>
          <Text style={styles.bulletPoint}>• Notes</Text>
          <Text style={styles.bulletPoint}>• Social profiles (WhatsApp, etc.)</Text>
          <Text style={styles.bulletPoint}>• Profile images (availability)</Text>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Permission Status:</Text>
          <Text style={[
            styles.statusValue, 
            hasPermission ? styles.granted : styles.denied
          ]}>
            {hasPermission === null ? 'Not Checked' : 
             hasPermission ? '✓ Granted' : '✗ Denied'}
          </Text>
        </View>

        {contactCount > 0 && (
          <View style={styles.statsBox}>
            <Text style={styles.statsText}>
              📊 Loaded Contacts: {contactCount}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {!hasPermission && (
            <Button
              title="Request Contacts Permission"
              onPress={requestPermission}
              color="#007AFF"
            />
          )}

          {hasPermission && (
            <>
              <View style={styles.buttonSpacing}>
                <Button
                  title={loading ? "Loading..." : "Load Contacts from Device"}
                  onPress={loadContacts}
                  disabled={loading}
                  color="#34C759"
                />
              </View>

              <View style={styles.buttonSpacing}>
                <Button
                  title={loading ? "Exporting..." : "Export to Text File"}
                  onPress={exportToFile}
                  disabled={loading || contacts.length === 0}
                  color="#FF9500"
                />
              </View>
            </>
          )}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}

        {contacts.length > 0 && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Preview (First {Math.min(contacts.length, 5)} Contacts):</Text>
            {contacts.slice(0, 5).map((contact, index) => (
              <View key={index} style={styles.contactCard}>
                <View style={styles.contactIcon}>
                  <Text style={styles.contactIconText}>
                    {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                  </Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name || 'Unknown Name'}</Text>
                  {contact.phoneNumbers && contact.phoneNumbers.length > 0 ? (
                    <Text style={styles.contactDetail}>📞 {contact.phoneNumbers[0].number}</Text>
                  ) : (
                    <Text style={styles.contactDetail}>📞 No phone number</Text>
                  )}
                  {contact.emails && contact.emails.length > 0 && (
                    <Text style={styles.contactDetail}>✉️ {contact.emails[0].email}</Text>
                  )}
                </View>
              </View>
            ))}
            <Text style={styles.moreText}>
              ...and {contacts.length - Math.min(contacts.length, 5)} more contacts
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginVertical: 3,
  },
  statusBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  granted: {
    color: '#34C759',
  },
  denied: {
    color: '#FF3B30',
  },
  statsBox: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  buttonSpacing: {
    marginVertical: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  previewSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactIconText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  moreText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
