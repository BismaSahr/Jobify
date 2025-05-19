import Logo from '../../logo';
import ipv4 from '../../ipv4';
import React, { useState, useContext } from 'react';
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
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { StackActions, NavigationActions } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';

const EmployeerSignup = ({ navigation }) => {

    const { signup } = useContext(AuthContext);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');

const handleSubmit = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-Z0-9\s&()\-]{2,}$/;
  const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9\-]+\.[a-z]{2,}(\S*)?$/;

  if (!companyName || !email || !password || !industry || !website) {
    Alert.alert('Validation Error', 'All fields are required.');
    return;
  }

  if (!nameRegex.test(companyName)) {
    Alert.alert(
      'Validation Error',
      'Company Name must be at least 2 characters and contain only letters, numbers, and symbols like &()-.'
    );
    return;
  }

  if (!emailRegex.test(email)) {
    Alert.alert('Validation Error', 'Please enter a valid email address.');
    return;
  }

  if (password.length < 8) {
    Alert.alert('Validation Error', 'Password must be at least 8 characters long.');
    return;
  }

  if (website && !urlRegex.test(website)) {
    Alert.alert('Validation Error', 'Please enter a valid website URL.');
    return;
  }

  // Call the signup function from AuthContext
  const userData = {
    companyName,
    email,
    password,
    industry,
    website,
  };

  const { success, userId, userRole } = await signup(userData, 'employer');

  if (success) {
    Alert.alert('Success', 'Employer registration successful!');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'EmployerTab',
            params: { userId, role: userRole },
          },
        ],
      })
    );
  } else {
    Alert.alert('Error', 'There was an issue during registration.');
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
      <View style={styles.mainContainer}>
       <Text style={styles.title}>Employer Signup</Text>
        <View style={styles.container}>
          <View style={styles.form}>


            <TextInput
              style={styles.input}
              placeholder="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
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
    mainContainer:{

      flex :1,
      justifyContent: 'center',
      padding:30,

    },
  container: {
   flex:1,
  },
  form: {

    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
   title: {
     fontSize: RFValue(34),
     fontWeight: 'bold',
     marginTop: RFPercentage(0),
     marginBottom: RFPercentage(6),
     color: 'blue',
     textAlign: 'center',
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
