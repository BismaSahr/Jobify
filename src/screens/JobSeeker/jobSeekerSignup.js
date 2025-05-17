import Logo from '../../logo';

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
import { AuthContext } from '../../AuthContext';



const jobSeekerSignup = ({ navigation }) => {
  const { signup } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [desiredJobTitles, setDesiredJobTitles] = useState('');
  const [education, setEducation] = useState('');

 const handleSubmit = async () => {
    const userData = {
      fullName,
      email,
      password,
      phone,
      location,
      skills,
      experienceLevel,
      desiredJobTitles,
      education,
    };

    const result = await signup(userData, 'jobseeker');

    if (result.success) {
      const fetchedUserId = result.userId;
      Alert.alert('Success', 'Registration successful!');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'JobSeekerTab',
              params: { userId: fetchedUserId, role: 'jobseeker' },
            },
          ],
        })
      );
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

         <View style={styles.mainContainer}>
        <Text style={styles.title}>Job Seeker Signup</Text>
          <View style={styles.form}>


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

export default jobSeekerSignup;
