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
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import ipv4 from '../../ipv4';
import Toast from '../../Toast'; // Import the Toast component

const EditJobScreen = ({ route, navigation }) => {
  const { employer_id, jobId } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [jobTypeOpen, setJobTypeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const [jobType, setJobType] = useState('full-time');
  const [jobTypeItems, setJobTypeItems] = useState([
    { label: 'Full-Time', value: 'full-time' },
    { label: 'Part-Time', value: 'part-time' },
    { label: 'Contract', value: 'contract' },
    { label: 'Internship', value: 'internship' },
  ]);

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedAuthToken = await AsyncStorage.getItem('token');
        if (storedAuthToken) setAuthToken(storedAuthToken);
        setLoading(false);
      } catch (error) {
        console.error('Error retrieving user data:', error);
        setLoading(false);
        Alert.alert('Authentication Error', 'Please log in again.');
        navigation.navigate('SignIn');
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (authToken) {
      const fetchData = async () => {
        try {
          const [locRes, catRes] = await Promise.all([
            fetch(`http://${ipv4.ip}:3000/api/jobs/locations`, {
              headers: { Authorization: `Bearer ${authToken}` },
            }),
            fetch(`http://${ipv4.ip}:3000/api/jobs/categories`, {
              headers: { Authorization: `Bearer ${authToken}` },
            }),
          ]);

          if (!locRes.ok || !catRes.ok) throw new Error('Failed to load data');

          const [locData, catData] = await Promise.all([
            locRes.json(),
            catRes.json(),
          ]);

          setLocations(locData.map(loc => ({
            label: `${loc.city}, ${loc.country}`,
            value: loc.location_id,
          })));

          setCategories(catData.map(cat => ({
            label: cat.category_name,
            value: cat.category_id,
          })));
        } catch (error) {
          Alert.alert('Error', 'Failed to load locations or categories.');
        }
      };

      const fetchJobDetails = async () => {
        try {
          const res = await fetch(`http://${ipv4.ip}:3000/api/jobs/jobGet/${jobId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });

          if (!res.ok) throw new Error('Job not found');
          const data = await res.json();

          setTitle(data.title);
          setDescription(data.description);
          setRequirements(data.requirements || '');
          setSalary(data.salary_range || '');
          setDeadline(data.deadline);
          setJobType(data.job_type || 'full-time');
          setSelectedCategory(data.category_id);
          setSelectedLocation(data.location_id);
        } catch (error) {
          Alert.alert('Error', 'Unable to load job details.');
        }
      };

      fetchData();
      fetchJobDetails();
    }
  }, [authToken, jobId]);

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

    if (!authToken) {
      Alert.alert('Authentication Error', 'Please log in again.');
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
      const res = await fetch(`http://${ipv4.ip}:3000/api/jobs/update/${jobId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('Job updated successfully', 'success');
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        const responseText = await res.text();
        showToast(`Failed to update job: ${responseText}`, 'error');
      }
    } catch (err) {
      showToast('Network or server error', 'error');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading job details...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.Keyboardcontainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Edit Job</Text>

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
              value={deadline ? new Date(deadline) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <DropDownPicker
            open={jobTypeOpen}
            value={jobType}
            items={jobTypeItems}
            setOpen={setJobTypeOpen}
            setValue={setJobType}
            setItems={setJobTypeItems}
            style={styles.dropdown}
            placeholder="Select Job Type"
          />

          <DropDownPicker
            open={categoryOpen}
            value={selectedCategory}
            items={categories}
            setOpen={setCategoryOpen}
            setValue={setSelectedCategory}
            setItems={setCategories}
            style={styles.dropdown}
            placeholder="Select Category"
            zIndex={3000}
            zIndexInverse={1000}
          />

          <DropDownPicker
            open={locationOpen}
            value={selectedLocation}
            items={locations}
            setOpen={setLocationOpen}
            setValue={setSelectedLocation}
            setItems={setLocations}
            style={styles.dropdown}
            placeholder="Select Location"
            zIndex={2000}
            zIndexInverse={2000}
          />

          <Button title="Update Job" onPress={handleSubmit} color="blue" />
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
  },
  dropdown: {
    marginBottom: 15,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditJobScreen;