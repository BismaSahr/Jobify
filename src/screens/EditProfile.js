import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipv4 from '../ipv4';
import Toast from '../Toast'; // Import the Toast component

const EditProfile = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const route = useRoute();
  const { userId, role, item } = route.params;

  const [profile, setProfile] = useState({
    fullName: item?.full_name || '',
    email: item?.email || '',
    phone: item?.phone || '',
    location: item?.location || '',
    skills: item?.skills || '',
    experienceLevel: item?.experience_level || '',
    desiredJobTitles: item?.desired_job_titles || '',
    education: item?.education || '',
    companyName: item?.company_name || '',
    website: item?.website || '',
    industry: item?.industry || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
          Alert.alert(
            'Authentication Error',
            'Authentication token not found. Please log in again.'
          );
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        Alert.alert(
          'Authentication Error',
          'Could not retrieve authentication token.'
        );
      }
    };
    getAuthToken();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !role || !authToken) return;
      setLoading(true);
      try {
        const response = await fetch(
          `http://${ipv4.ip}:3000/api/profile?userId=${userId}&role=${role}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data?.profile) {
          const p = data.profile;
          setProfile({
            fullName: p.full_name || '',
            email: p.email || '',
            phone: p.phone || '',
            location: p.location || '',
            skills: p.skills || '',
            experienceLevel: p.experience_level || '',
            desiredJobTitles: p.desired_job_titles || '',
            education: p.education || '',
            companyName: p.company_name || '',
            website: p.website || '',
            industry: p.industry || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && role && !item && authToken) fetchProfile();
    else if (item) setProfile({
      fullName: item.full_name || '',
      email: item.email || '',
      phone: item.phone || '',
      location: item.location || '',
      skills: item.skills || '',
      experienceLevel: item.experience_level || '',
      desiredJobTitles: item.desired_job_titles || '',
      education: item.education || '',
      companyName: item.company_name || '',
      website: item.website || '',
      industry: item.industry || '',
    });
  }, [userId, role, item, authToken]);

  const handleInputChange = (name, value) => {
    setProfile((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate('SignIn');
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
    if (!authToken) {
      Alert.alert(
        'Authentication Error',
        'Authentication token is missing. Please log in again.'
      );
      return;
    }

    const payload = {
      userId,
      role,
      email: profile.email,
      ...(role === 'jobseeker'
        ? {
          full_name: profile.fullName,
          phone: profile.phone,
          location: profile.location,
          skills: profile.skills,
          experience_level: profile.experienceLevel,
          desired_job_titles: profile.desiredJobTitles,
          education: profile.education,
        }
        : {
          company_name: profile.companyName,
          website: profile.website,
          industry: profile.industry,
        }),
    };

    try {
      const response = await fetch(`http://${ipv4.ip}:3000/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(errorData.error || `HTTP error! status: ${response.status}`, 'error');
      } else {
        showToast('Profile updated successfully', 'success');
        if (navigation?.goBack) {
          setTimeout(() => {
            navigation.goBack();
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert('Delete Account', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!authToken) {
            Alert.alert(
              'Authentication Error',
              'Authentication token is missing. Please log in again.'
            );
            return;
          }
          try {
            const response = await fetch(`http://${ipv4.ip}:3000/api/profile`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({ userId, role }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              showToast(errorData.error || `HTTP error! status: ${response.status}`, 'error');
            } else {
              showToast('Account deleted successfully', 'success');
              navigation?.navigate('FirstScreen');
            }
          } catch (err) {
            console.error('Error deleting account:', err);
            showToast(err.message || 'Failed to delete account', 'error');
          }
        },
      },
    ]);
  };

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  return (
    <KeyboardAvoidingView
      style={styles.Keyboardcontainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Edit Profile</Text>
          {role === 'jobseeker' ? (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Full Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={profile.fullName}
                  onChangeText={(text) => handleInputChange('fullName', text)}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={profile.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Phone:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  value={profile.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Location:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Location"
                  value={profile.location}
                  onChangeText={(text) => handleInputChange('location', text)}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Skills:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Skills"
                  value={profile.skills}
                  onChangeText={(text) => handleInputChange('skills', text)}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Experience Level:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Experience Level"
                  value={profile.experienceLevel}
                  onChangeText={(text) => handleInputChange('experienceLevel', text)}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Desired Job Titles:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Desired Job Titles"
                  value={profile.desiredJobTitles}
                  onChangeText={(text) => handleInputChange('desiredJobTitles', text)}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Education:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Education"
                  value={profile.education}
                  onChangeText={(text) => handleInputChange('education', text)}
                />
              </View>
            </>
          ) : role === 'employer' ? (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Company Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Company Name"
                  value={profile.companyName}
                  onChangeText={(text) => handleInputChange('companyName', text)}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={profile.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Website:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Website"
                  value={profile.website}
                  onChangeText={(text) => handleInputChange('website', text)}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Industry:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Industry"
                  value={profile.industry}
                  onChangeText={(text) => handleInputChange('industry', text)}
                />
              </View>
            </>
          ) : null}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: 'grey' }]}
            onPress={handleLogout}
          >
            <Text style={styles.saveButtonText}>LogOut</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: 'red', marginBottom: 30 }]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.saveButtonText}>Delete Account</Text>
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
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
    marginBottom: RFPercentage(3),
  },
  label: {
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: RFValue(16),
    marginBottom: RFPercentage(0.5),
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: RFPercentage(1.5),
    marginBottom: RFPercentage(2),
    borderRadius: 8,
    fontSize: RFValue(14),
    color: '#34495e',
  },
  fieldContainer: {
    marginBottom: RFPercentage(2),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: RFPercentage(1.5),
  },
  button: {
    paddingVertical: RFPercentage(1.5),
    borderRadius: 8,
    fontSize: RFValue(16),
    fontWeight: 'bold',
    width: '100%',
    marginTop: RFPercentage(2),
  },
  loadingText: {
    fontSize: RFValue(18),
    textAlign: 'center',
    marginTop: RFPercentage(10),
    color: '#7f8c8d',
  },
  errorText: {
    fontSize: RFValue(18),
    textAlign: 'center',
    marginTop: RFPercentage(10),
    color: '#e74c3c',
  },
  noDataText: {
    fontSize: RFValue(18),
    textAlign: 'center',
    marginTop: RFPercentage(10),
    color: '#95a5a6',
  },
  saveButton: {
    backgroundColor: 'blue',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(16),
    fontWeight: '600',
  },
});

export default EditProfile;