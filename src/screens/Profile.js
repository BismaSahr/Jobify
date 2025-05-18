import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import Logo from '../../src/logo';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import DefaultImg from '../../src/images/DefaultImg.jpg';
import Toast from '../../src/Toast';

import ipv4 from '../ipv4';

const Profile = ({ userId, role, navigation }) => {
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'

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

const handleImagePick = async () => {
  try {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.5 });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const formData = new FormData();
      formData.append('profileImage', {
        uri: asset.uri.startsWith('file://') ? asset.uri : 'file://' + asset.uri,
        type: asset.type,
        name: asset.fileName || 'profile.jpg',
      });
      formData.append('userId', userId);
      formData.append('role', role);

      const response = await fetch(`http://${ipv4.ip}:3000/api/profile/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json(); // Attempt to parse JSON regardless of status

      if (response.ok) {
        showToast(data.message, 'success');
        setProfile({ ...profile, profile_image: data.imagePath });
      } else {
        showToast(data.error || 'Failed to upload image.', 'error');
      }
    }
  } catch (error) {
    console.error('Image pick error:', error);
    showToast('Could not select image.', 'error');
  }
};
  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        if (!authToken) return;
        try {
          setLoading(true);
          const response = await fetch(
            `http://${ipv4.ip}:3000/api/profile?userId=${userId}&role=${role}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data && data.profile) {
            setProfile(data.profile);
            console.log("Image",profile.profile_image);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      if (authToken) {
        getData();
      }
      return () => {};
    }, [userId, role, authToken])
  );

  const Section = ({ label, value }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.infoText}>{value ? value : '-'}</Text>
    </View>
  );

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Something went wrong: {error.message}
        </Text>
      </View>
    );

  if (!profile)
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>No profile data found.</Text>
      </View>
    );

  return (
    <ScrollView style={styles.mainView}>
      <View style={styles.container}>
        <Logo />


<View style={styles.profileHeader}>
  <TouchableOpacity onPress={handleImagePick} style={styles.imageWrapper}>
    <Image
      source={
        profile.profile_image
          ? { uri:profile.profile_image}
          : DefaultImg
      }
      style={styles.profileImage}
    />
    <View style={styles.editIconContainer}>
      <Text style={styles.editIconText}>✎</Text>
    </View>
  </TouchableOpacity>

  <Text style={styles.nameText}>
    {role === 'jobseeker' ? profile.full_name : profile.company_name}
  </Text>
  <Text
    style={[
      styles.roleBadge,
      role === 'employer' ? styles.employerBadge : styles.jobseekerBadge,
    ]}
  >
    {role.toUpperCase()}
  </Text>
</View>


        <View style={styles.profileCard}>
          {role === 'jobseeker' ? (
            <>
              <Section label="Email" value={profile.email} />
              <Section label="Phone" value={profile.phone} />
              <Section label="Location" value={profile.location} />
              <Section label="Skills" value={profile.skills} />
              <Section
                label="Experience Level"
                value={profile.experience_level}
              />
              <Section
                label="Desired Job Titles"
                value={profile.desired_job_titles}
              />
              <Section label="Education" value={profile.education} />
            </>
          ) : (
            <>
              <Section label="Email" value={profile.email} />
              <Section label="Website" value={profile.website} />
              <Section label="Industry" value={profile.industry} />
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate('EditProfile', {
              userId,
              role,
              item: profile,
            })
          }
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onDismiss={handleDismissToast}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    padding: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: RFPercentage(2),
    marginTop: RFPercentage(3),
  },
  nameText: {
    fontSize: RFValue(20),
    fontWeight: '600',
    color: '#111827',
  },
  roleBadge: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: RFValue(12),
    fontWeight: '600',
    color: '#fff',
    overflow: 'hidden',
  },
  jobseekerBadge: {
    backgroundColor: '#10B981',
  },
  employerBadge: {
    backgroundColor: '#3B82F6',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: RFPercentage(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  fieldContainer: {
    marginBottom: RFPercentage(1.5),
  },
  label: {
    fontSize: RFValue(13),
    color: '#6B7280',
    fontWeight: '500',
  },
  infoText: {
    fontSize: RFValue(15),
    color: '#111827',
    fontWeight: '600',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: 'blue',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,

  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(16),
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: RFValue(16),
    marginTop: 10,
    color: '#6B7280',
  },
  errorText: {
    fontSize: RFValue(16),
    color: '#DC2626',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: RFValue(16),
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default Profile;