import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import { pick } from '@react-native-documents/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipv4 from '../../../components/ipv4';
import Toast from '../../../components/Toast'; // Import the Toast component

const EditApplicationScreen = ({ route, navigation }) => {
  const { application } = route.params;

  const [fullName, setFullName] = useState(application.full_name || '');
  const [email, setEmail] = useState(application.email || '');
  const [phone, setPhone] = useState(application.phone || '');
  const [coverLetter, setCoverLetter] = useState(application.cover_letter || '');
  const [resumeFile, setResumeFile] = useState(application.resume || null);
  const [authToken, setAuthToken] = useState(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const getAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setAuthToken(token);
        } else {
          Alert.alert('Authentication Error', 'Authentication token not found. Please log in again.');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        Alert.alert('Authentication Error', 'Could not retrieve authentication token.');
      }
    };

    getAuthToken();
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
      Alert.alert('Permission Denied', 'Storage permission is required to pick resume.');
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

  const handleUpdate = async () => {
    if (!fullName || !email || !phone) {
      Alert.alert('Validation', 'Please fill all fields.');
      return;
    }

    if (!authToken) {
      Alert.alert('Authentication Error', 'Authentication token is not available. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('cover_letter', coverLetter);

    if (resumeFile && resumeFile.uri) {
      const fileExt = resumeFile.name?.split('.').pop() || 'pdf';
      formData.append('resume', {
        uri: resumeFile.uri,
        name: resumeFile.name,
        type: resumeFile.type || `application/${fileExt}`,
      });
    }

    try {
      const res = await fetch(
        `http://${ipv4.ip}:3000/api/job-applications/update/${application.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        showToast('Application updated successfully', 'success');
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        const err = await res.text();
        showToast(err || 'Failed to update application', 'error');
      }
    } catch (error) {
      console.log('Error:', error);
      showToast('Network/server error occurred', 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.Keyboardcontainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Edit Application</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Cover Letter"
            value={coverLetter}
            onChangeText={setCoverLetter}
            multiline
          />

          <TouchableOpacity onPress={pickResume} style={styles.input}>
            <Text style={{ color: resumeFile ? 'black' : '#999' }}>
              {resumeFile?.name || 'Pick Resume (.docx/.pdf)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <Toast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onDismiss={handleDismissToast}
        />
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
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
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
  updateButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditApplicationScreen;