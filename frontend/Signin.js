import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Logo from '../src/logo.js';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSignIn = () => {
    if (!email || !password || !role) {
      Alert.alert('Missing Info', 'Please fill all fields including role.');
    } else {
      console.log({ email, password, role });

      if (role.toLowerCase() === 'employer') {
        navigation.navigate('EmployeerDashboard');
      } else if (role.toLowerCase() === 'jobseeker') {
        navigation.navigate('JobSeekerDashboard');
      } else {
        Alert.alert('Invalid Role', 'Role must be either "employer" or "jobseeker".');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.Keyboardcontainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Sign In</Text>

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder='Role (e.g. "employer" or "jobseeker")'
            value={role}
            onChangeText={setRole}
          />

          <Button title="Sign In" onPress={handleSignIn} color="blue" />

          {/* Go Back Button */}
          <View style={{ marginTop: 10 }}>
            <Button title="Go Back" onPress={() => navigation.goBack()} color="#6c757d" />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  Keyboardcontainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
});

export default SignInScreen;
