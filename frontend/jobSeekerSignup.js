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

const jobSeekerSignup = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [desiredJobTitles, setDesiredJobTitles] = useState('');
  const [education, setEducation] = useState('');

  const handleSubmit = () => {
    if (!fullName || !email || !password) {
      Alert.alert('Validation Error', 'Full Name, Email, and Password are required.');
    } else {
      console.log('Signup Info:', {
        fullName,
        email,
        password,
        phone,
        location,
        skills,
        experienceLevel,
        desiredJobTitles,
        education,
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
        <Logo />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.form}>
            <Text style={styles.title}>Job Seeker Signup</Text>

            <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
            <TextInput style={styles.input} placeholder="Email" value={email} keyboardType="email-address" autoCapitalize="none" onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
            <TextInput style={styles.input} placeholder="Phone Number (optional)" value={phone} keyboardType="phone-pad" onChangeText={setPhone} />
            <TextInput style={styles.input} placeholder="Location (optional)" value={location} onChangeText={setLocation} />
            <TextInput style={styles.input} placeholder="Skills (comma-separated)" value={skills} onChangeText={setSkills} />
            <TextInput style={styles.input} placeholder="Experience Level (e.g., Entry-Level)" value={experienceLevel} onChangeText={setExperienceLevel} />
            <TextInput style={styles.input} placeholder="Desired Job Titles (optional)" value={desiredJobTitles} onChangeText={setDesiredJobTitles} />
            <TextInput style={styles.input} placeholder="Education (optional)" value={education} onChangeText={setEducation} />

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

export default jobSeekerSignup;
