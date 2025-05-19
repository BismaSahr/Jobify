import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../../src/logo.js';
import { CommonActions } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

const SignInScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSignIn = async () => {
    const result = await signIn(email, password, role);
    if (result.success) {
      const { userId, userRole } = result;

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: userRole === 'employer' ? 'EmployerTab' : 'JobSeekerTab',
              params: { userId, role: userRole },
            },
          ],
        })
      );
    }
  };

  const handleGoBack = () => {
    navigation.navigate('FirstScreen');
  };

  return (
    <KeyboardAvoidingView
      style={styles.Keyboardcontainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <View style={styles.mainContainer}>
        <Text style={styles.title}>Sign In</Text>
        <View style={styles.container}>
          <View style={styles.form}>
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

            {/* Picker wrapped in input style */}
            <View style={styles.input}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.picker}
                dropdownIconColor="#555"
              >
                <Picker.Item label="Select Role" value="" />
                <Picker.Item label="Employer" value="employer" />
                <Picker.Item label="Job Seeker" value="jobseeker" />
              </Picker>
            </View>

            <TouchableOpacity style={styles.buttonSignIn} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonGoBack} onPress={handleGoBack}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
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
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: RFPercentage(2),
    marginTop: RFPercentage(2),
  },
  container: {
    flex: 1,
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
    fontSize: RFValue(34),
    fontWeight: 'bold',
    marginTop: RFPercentage(2),
    marginBottom: RFPercentage(4),
    color: 'blue',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 60,
    color: 'grey',

  },
  buttonSignIn: {
    width: '100%',
    backgroundColor: 'blue',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonGoBack: {
    width: '100%',
    backgroundColor: '#6c757d',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
  },
});

export default SignInScreen;
