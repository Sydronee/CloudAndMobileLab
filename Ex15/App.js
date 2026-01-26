import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const initialUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Brian Smith', email: 'brian@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carmen Lee', email: 'carmen@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Diego Patel', email: 'diego@example.com', role: 'Editor', status: 'Active' },
];

export default function App() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUserId, setSelectedUserId] = useState(initialUsers[0].id);
  const [form, setForm] = useState(initialUsers[0]);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId),
    [selectedUserId, users]
  );

  useEffect(() => {
    if (selectedUser) {
      setForm(selectedUser);
    }
  }, [selectedUser]);

  const handleSelect = (user) => {
    setSelectedUserId(user.id);
  };

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = () => {
    setUsers((current) =>
      current.map((user) => (user.id === selectedUserId ? { ...user, ...form, id: user.id } : user))
    );
  };

  const handleReset = () => {
    if (selectedUser) {
      setForm(selectedUser);
    }
  };

  const renderRow = ({ item }) => {
    const isSelected = item.id === selectedUserId;
    return (
      <TouchableOpacity
        style={[styles.row, isSelected && styles.rowSelected]}
        onPress={() => handleSelect(item)}
      >
        <Text style={[styles.cell, styles.idCell]}>{item.id}</Text>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.email}</Text>
        <Text style={styles.cell}>{item.role}</Text>
        <Text style={styles.cell}>{item.status}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>User Admin</Text>

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell, styles.idCell]}>ID</Text>
            <Text style={[styles.cell, styles.headerCell]}>Name</Text>
            <Text style={[styles.cell, styles.headerCell]}>Email</Text>
            <Text style={[styles.cell, styles.headerCell]}>Role</Text>
            <Text style={[styles.cell, styles.headerCell]}>Status</Text>
          </View>
          <View style={styles.list}>
            {users.map((item) => {
              const isSelected = item.id === selectedUserId;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.row, isSelected && styles.rowSelected]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.cell, styles.idCell]}>{item.id}</Text>
                  <Text style={styles.cell}>{item.name}</Text>
                  <Text style={styles.cell}>{item.email}</Text>
                  <Text style={styles.cell}>{item.role}</Text>
                  <Text style={styles.cell}>{item.status}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.formCard}>
        <Text style={styles.formTitle}>Edit Selected User</Text>
        {!selectedUser && <Text style={styles.hint}>Select a user to edit.</Text>}
        {selectedUser && (
          <View style={styles.formContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
                style={styles.input}
                placeholder="Full name"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={form.email}
                onChangeText={(text) => handleChange('email', text)}
                style={styles.input}
                placeholder="name@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Role</Text>
              <TextInput
                value={form.role}
                onChangeText={(text) => handleChange('role', text)}
                style={styles.input}
                placeholder="Admin / Editor / Viewer"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <TextInput
                value={form.status}
                onChangeText={(text) => handleChange('status', text)}
                style={styles.input}
                placeholder="Active / Inactive"
              />
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 4016,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  list: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerRow: {
    backgroundColor: '#eef2ff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#c7d2fe',
  },
  rowSelected: {
    backgroundColor: '#e0f2fe',
  },
  cell: {
    flex: 1,
    color: '#111827',
  },
  idCell: {
    flex: 0.4,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: '700',
    color: '#1f2937',
  },
  formCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },
  hint: {
    color: '#6b7280',
  },
  formContent: {
    gap: 10,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9fafb',
    fontSize: 15,
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  resetButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
