import Logo from '../src/logo.js';
import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';

const EmployeerSignup = ({ navigation }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');

  const handleSubmit = () => {
    if (!companyName || !contactPerson || !email || !password || !phone || !companySize || !industry) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
    } else {
      console.log({
        companyName,
        contactPerson,
        email,
        password,
        phone,
        companySize,
        industry,
        website,
      });
      navigation.navigate('Home');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.Keyboardcontainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <View>
    <Logo/>
    </View>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.form}>
            <Text style={styles.title}>Employer Signup</Text>

            <TextInput
              style={styles.input}
              placeholder="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Person Name"
              value={contactPerson}
              onChangeText={setContactPerson}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              keyboardType="phone-pad"
              onChangeText={setPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="Company Size (e.g. Small, Medium, Large)"
              value={companySize}
              onChangeText={setCompanySize}
            />
            <TextInput
              style={styles.input}
              placeholder="Industry"
              value={industry}
              onChangeText={setIndustry}
            />
            <TextInput
              style={styles.input}
              placeholder="Company Website (optional)"
              value={website}
              onChangeText={setWebsite}
            />

            <Button title="Sign Up" onPress={handleSubmit} color="blue" />
            <View style={{ marginTop: 10 }}>
              <Button title="Go Back" onPress={() => navigation.goBack()} color="#6c757d" />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  Keyboardcontainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  container: {
    alignItems: 'center',
  },
  form: {
    width: '85%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
});

export default EmployeerSignup;
