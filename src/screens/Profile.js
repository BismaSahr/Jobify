import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Logo from '../../src/logo';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipv4 from '../ipv4';

const Profile = ({ userId, role, navigation }) => {
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);

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
          <Text style={styles.nameText}>
            {role === 'jobseeker' ? profile.full_name : profile.company_name}
          </Text>
          <Text
            style={[
              styles.roleBadge,
              role === 'employer'
                ? styles.employerBadge
                : styles.jobseekerBadge,
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














//
//
//
//
//
//
//
//
//changes its styling to usual profile screen in market use // Profile.js
//
//import React, { useEffect, useState, useCallback } from 'react';
//
//import { View, Text, StyleSheet, Button } from 'react-native';
//
//import Logo from '../src/logo.js';
//
//import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
//
//import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
//
//
//
//const Profile = ({ userId, role, navigation }) => {
//
//const [profile, setProfile] = useState(null);
//
//const [loading, setLoading] = useState(true);
//
//const [error, setError] = useState(null);
//
//
//
//const getData = useCallback(async () => { // Use useCallback for the function
//
//try {
//
//setLoading(true);
//
//const response = await fetch(
//
//`http://192.168.0.104:3000/api/profile?userId=${userId}&role=${role}`,
//
//{
//
//method: 'GET',
//
//headers: {
//
//'Content-Type': 'application/json',
//
//},
//
//}
//
//);
//
//if (!response.ok) {
//
//throw new Error(`HTTP error! status: ${response.status}`);
//
//}
//
//const data = await response.json();
//
//
//
//if (data && data.profile) {
//
//setProfile(data.profile);
//
//}
//
//} catch (error) {
//
//console.error('Error fetching profile:', error);
//
//setError(error);
//
//} finally {
//
//setLoading(false);
//
//}
//
//}, [userId, role]); // Add dependencies to useCallback
//
//
//
//useFocusEffect(
//
//useCallback(() => {
//
//getData(); // Call getData when the screen focuses
//
//return () => {
//
//// Optional: Any cleanup you want to perform when the screen loses focus
//
//};
//
//}, [getData]) // Add getData to the dependency array of useFocusEffect
//
//);
//
//
//
//if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
//
//if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;
//
//if (!profile) return <Text style={styles.noDataText}>No profile data.</Text>;
//
//
//
//return (
//
//<View style={styles.mainView}>
//
//<Logo />
//
//<View style={styles.container}>
//
//<Text style={styles.title}>Profile</Text>
//
//<View style={styles.profileCard}>
//
//{role === 'jobseeker' ? (
//
//<>
//
//<Text style={styles.infoText}><Text style={styles.label}>Full Name:</Text> {profile.full_name}</Text>
//
//<Text style={styles.infoText}><Text style={styles.label}>Email:</Text> {profile.email}</Text>
//
//<Text style={styles.infoText}><Text style={styles.label}>Phone:</Text> {profile.phone}</Text>
//
//<Text style={styles.infoText}><Text style={styles.label}>Location:</Text> {profile.location}</Text>
//
//<Text style={styles.infoText}><Text style={styles.label}>Skills:</Text> {profile.skills}</Text>
//
//<Text style={styles.infoText}><Text style={styles.label}>Experience Level:</Text> {profile.experience_level}</Text>
//
//<Text style={styles.infoText}><Text style={styles.label}>Desired Job Titles:</Text> {profile.desired_job_titles}</Text>
//
//<Text style={styles.infoText}><Text style={styles.label}>Education:</Text> {profile.education}</Text>
//
//</>
//
//) : role === 'employer' ? (
//
//<>
//
//<Text style={styles.infoText}><Text style={styles.label}>Company Name:</Text> {profile.company_name}</Text>
//
//<Text style={styles.infoText}><Text style={styles.label}>Email:</Text> {profile.email}</Text>
//
//<Text style={styles.infoText}><Text style={styles.label}>Website:</Text> {profile.website}</Text>
//
//<Text style={styles.infoText}><Text style={styles.label}>Industry:</Text> {profile.industry}</Text>
//
//</>
//
//) : null}
//
//</View>
//
//<Button
//
//title="Edit Profile"
//
//onPress={() => navigation.navigate('EditProfile', { userId: userId, role: role, item: profile })}
//
//style={styles.editButton}
//
//color="blue" // Consistent button color
//
///>
//
//</View>
//
//</View>
//
//);
//
//};
//
//
//
//const styles = StyleSheet.create({
//
//mainView: {
//
//flex: 1,
//
//backgroundColor: '#fff', // Match RoleScreen background
//
//},
//
//container: {
//
//flex: 1,
//
//padding: 20,
//
//alignItems: 'center', // Center content horizontally
//
//},
//
//logoContainer: {
//
//alignItems: 'center',
//
//marginBottom: RFPercentage(3), // Space below the logo
//
//marginTop: RFPercentage(2),
//
//},
//
//title: {
//
//fontSize: RFValue(28),
//
//fontWeight: 'bold',
//
//marginBottom: RFPercentage(3),
//
//color: 'blue', // Match RoleScreen blue text
//
//textAlign: 'center',
//
//},
//
//profileCard: {
//
//backgroundColor: '#f8f9fa',
//
//padding: 20,
//
//borderRadius: 10,
//
//marginBottom: RFPercentage(3),
//
//width: '90%', // Adjust width as needed
//
//shadowColor: '#000',
//
//shadowOffset: { width: 0, height: 2 },
//
//shadowOpacity: 0.1,
//
//shadowRadius: 4,
//
//elevation: 2,
//
//},
//
//label: {
//
//fontWeight: 'bold',
//
//color: '#333',
//
//fontSize: RFValue(16),
//
//},
//
//infoText: {
//
//fontSize: RFValue(16),
//
//color: '#555',
//
//marginBottom: RFPercentage(1.5),
//
//},
//
//editButton: {
//
//backgroundColor: 'blue', // Match RoleScreen button color
//
//color: '#fff',
//
//paddingVertical: RFPercentage(1.5),
//
//borderRadius: 8,
//
//fontSize: RFValue(16),
//
//fontWeight: 'bold',
//
//width: '80%',
//
//},
//
//loadingText: {
//
//fontSize: RFValue(18),
//
//textAlign: 'center',
//
//marginTop: RFPercentage(10),
//
//color: '#777',
//
//},
//
//errorText: {
//
//fontSize: RFValue(18),
//
//textAlign: 'center',
//
//marginTop: RFPercentage(10),
//
//color: '#dc3545',
//
//},
//
//noDataText: {
//
//fontSize: RFValue(18),
//
//textAlign: 'center',
//
//marginTop: RFPercentage(10),
//
//color: '#999',
//
//},
//
//goBackButton: {
//
//backgroundColor: 'transparent',
//
//padding: 10,
//
//borderRadius: 50,
//
//alignItems: 'center',
//
//justifyContent: 'center',
//
//position: 'absolute',
//
//bottom: 20,
//
//},
//
//});
//
//
//
//export default Profile;