import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { pick } from '@react-native-documents/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import ipv4 from '../../ipv4';
import Toast from '../../Toast'; // Import the Toast component

const JobApplicationForm = ({ route, navigation }) => {
  const { job_id, employer_id } = route.params;
  const [jobSeeker_id, setJobSeeker_Id] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedId = await AsyncStorage.getItem('userId');
        const storedToken = await AsyncStorage.getItem('token');
        if (storedId) setJobSeeker_Id(parseInt(storedId));
        if (storedToken) setAuthToken(storedToken);
      } catch (error) {
        console.error('Error retrieving user data:', error);
        Alert.alert(
          'Authentication Error',
          'Could not retrieve user information. Please log in again.'
        );
      }
    };
    getUserData();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 30) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to pick your resume.',
            buttonPositive: 'Grant',
            buttonNegative: 'Deny',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const pickResume = async () => {
    const permissionGranted = await requestStoragePermission();
    if (!permissionGranted) {
      Alert.alert(
        'Permission Denied',
        'Storage permission is required to pick resume.'
      );
      return;
    }

    try {
      const [file] = await pick({
        type: [
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/msword', // .doc
          'application/pdf', // .pdf
        ],
      });

      console.log('Picked file:', file);
      setResumeFile(file);
    } catch (err) {
      console.warn('Document pick error:', err);
      if (err?.message !== 'User canceled') {
        Alert.alert('Error', 'Failed to pick resume.');
      }
    }
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleDismissToast = () => {
    setToastVisible(false);
    setToastMessage('');
    setToastType('');
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !phone || !resumeFile || !authToken) {
      if (!authToken) {
        Alert.alert(
          'Authentication Error',
          'Authentication token is missing. Please log in again.'
        );
      } else {
        Alert.alert(
          'Missing Fields',
          'Please fill all fields and select a resume'
        );
      }
      return;
    }

    const formData = new FormData();
    formData.append('job_id', job_id);
    formData.append('employer_id', employer_id);
    formData.append('jobseeker_id', jobSeeker_id);
    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('cover_letter', coverLetter);
    formData.append('resume', {
      uri: resumeFile.uri,
      name: resumeFile.name,
      type: resumeFile.type || 'application/octet-stream',
    });

    try {
      const response = await fetch(
        `http://${ipv4.ip}:3000/api/job-applications/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        showToast('Application submitted successfully!', 'success');
        setTimeout(() => {
          navigation.goBack(); // Navigate back after successful submission and toast
        }, 2000);
      } else {
        showToast(result.error || 'Something went wrong', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Upload failed', 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.Keyboardcontainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Job Application</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Cover Letter</Text>
          <TextInput
            style={styles.textArea}
            value={coverLetter}
            onChangeText={setCoverLetter}
            multiline
            numberOfLines={4}
            placeholder="Optional"
          />
          <Text style={styles.label}>Resume</Text>
          <TouchableOpacity onPress={pickResume} style={styles.resumeButton}>
            <Text
              style={[
                styles.resumeText,
                { color: resumeFile ? 'black' : '#999' },
              ]}
            >
              {resumeFile?.name || 'Pick Resume (.docx/.pdf)'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Application</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onDismiss={handleDismissToast}
      />
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
  title: {
    fontSize: RFValue(28),
    fontWeight: 'bold',
    marginBottom: RFPercentage(3),
    color: 'blue',
    textAlign: 'center',
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
  label: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: '#333',
    marginTop: RFPercentage(1),
    marginBottom: RFPercentage(0.5),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: RFPercentage(1.5),
    borderRadius: RFValue(8),
    marginBottom: RFPercentage(1.5),
    fontSize: RFValue(14),
    color: '#333',
    backgroundColor: 'white',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: RFPercentage(1.5),
    borderRadius: RFValue(8),
    minHeight: RFPercentage(12),
    marginBottom: RFPercentage(2),
    fontSize: RFValue(14),
    color: '#333',
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
  resumeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: RFPercentage(1.5),
    borderRadius: RFValue(8),
    marginBottom: RFPercentage(1.5),
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  resumeText: {
    color: '#333',
    fontSize: RFValue(14),
  },
  submitButton: {
    marginTop: RFPercentage(2),
    backgroundColor: 'blue',
    padding: RFPercentage(2),
    borderRadius: RFValue(8),
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
});

export default JobApplicationForm;