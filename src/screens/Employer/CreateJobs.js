import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import ipv4 from '../../../components/ipv4';
import Toast from '../../../components/Toast'; // Import the Toast component

const CreateJobScreen = ({ navigation }) => {
  const [employer_id, setEmployer_id] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [jobType, setJobType] = useState('full-time');
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'

  // Load user data and token
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedAuthToken = await AsyncStorage.getItem('token');
        if (storedUserId) setEmployer_id(storedUserId);
        if (storedAuthToken) setAuthToken(storedAuthToken);
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };
    loadUserData();
  }, []);

  // Fetch locations after token is available
  useEffect(() => {
    if (!authToken) return;

    const fetchLocation = async () => {
      try {
        const response = await fetch(`http://${ipv4.ip}:3000/api/jobs/locations`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch locations');
        const data = await response.json();
        setLocations(
          data.map((loc) => ({
            label: `${loc.city}, ${loc.country}`,
            value: loc.location_id,
          }))
        );
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load locations.');
      }
    };

    fetchLocation();
  }, [authToken]);

  // Fetch categories after token is available
  useEffect(() => {
    if (!authToken) return;

    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://${ipv4.ip}:3000/api/jobs/categories`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(
          data.map((cat) => ({
            label: cat.category_name,
            value: cat.category_id,
          }))
        );
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load categories.');
      }
    };

    fetchCategories();
  }, [authToken]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDeadline(formattedDate);
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
    if (!title || !description || !selectedCategory || !selectedLocation || !deadline) {
      Alert.alert('Please fill all required fields');
      return;
    }

    if (!employer_id) {
      Alert.alert('Error', 'User ID missing. Please log in.');
      return;
    }

    const payload = {
      employer_id,
      category_id: selectedCategory,
      location_id: selectedLocation,
      title,
      description,
      requirements,
      salary_range: salary,
      job_type: jobType,
      deadline,
    };

    try {
      const res = await fetch(`http://${ipv4.ip}:3000/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('Job created successfully', 'success');
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        const responseText = await res.text();
        showToast(`Failed to create job: ${responseText}`, 'error');
      }
    } catch (err) {
      showToast('Network or server error', 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.Keyboardcontainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Create Job</Text>

          <TextInput
            style={styles.input}
            placeholder="Job Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TextInput
            style={styles.input}
            placeholder="Requirements"
            value={requirements}
            onChangeText={setRequirements}
            multiline
          />

          <TextInput
            style={styles.input}
            placeholder="Salary Range"
            value={salary}
            onChangeText={setSalary}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.input, { justifyContent: 'center' }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: deadline ? '#000' : '#999' }}>
              {deadline || 'Select Deadline Date'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Job Type Picker */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={jobType}
              onValueChange={setJobType}
              style={styles.picker}
            >
              <Picker.Item label="Full-Time" value="full-time" />
              <Picker.Item label="Part-Time" value="part-time" />
              <Picker.Item label="Contract" value="contract" />
              <Picker.Item label="Internship" value="internship" />
            </Picker>
          </View>

          {/* Category Picker */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value={null} />
              {categories.map((category) => (
                <Picker.Item key={category.value} label={category.label} value={category.value} />
              ))}
            </Picker>
          </View>

          {/* Location Picker */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedLocation}
              onValueChange={setSelectedLocation}
              style={styles.picker}
            >
              <Picker.Item label="Select Location" value={null} />
              {locations.map((location) => (
                <Picker.Item key={location.value} label={location.label} value={location.value} />
              ))}
            </Picker>
          </View>

          <Button title="Create Job" onPress={handleSubmit} color="blue" />
          <View style={{ marginTop: 10 }}>
            <Button title="Cancel" onPress={() => navigation.goBack()} color="#6c757d" />
          </View>
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
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'grey',
  },
});

export default CreateJobScreen;