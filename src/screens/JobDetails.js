import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Logo from '../logo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobDetailScreen = ({ navigation, route }) => {
  const { job } = route.params;
  const [JobSeeker_id, setJobSeeker_id] = useState(null);
  const [role, setRole] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedRole = await AsyncStorage.getItem('role');
        const storedToken = await AsyncStorage.getItem('token');
        setJobSeeker_id(storedUserId);
        setRole(storedRole);
        setAuthToken(storedToken);
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

  const handleApply = () => {
    if (!authToken) {
      Alert.alert(
        'Authentication Error',
        'Authentication token is missing. Please log in again.'
      );
      return;
    }
    navigation.navigate('JobApplication', {
      job_id: job.job_id,
      employer_id: job.employer_id, // make sure this exists in job
      jobSeeker_id: JobSeeker_id,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <Text style={styles.header}>Title: {job.title}</Text>

      <View style={styles.detailBox}>
        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>
        </View>
        <Text style={styles.value}>{job.category_name || 'Unknown'}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Company:</Text>
        </View>
        <Text style={styles.value}>{job.company_name}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Website:</Text>
        </View>
        <Text style={styles.value}>{job.website}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Job Type:</Text>
        </View>
        <Text style={styles.value}>{job.job_type}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Salary:</Text>
        </View>
        <Text style={styles.value}>£{job.salary_range}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Deadline:</Text>
        </View>
        <Text style={styles.value}>{job.deadline}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
        </View>
        <Text style={styles.value}>{job.description}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Requirements:</Text>
        </View>
        <Text style={styles.value}>{job.requirements}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
        </View>
        <Text style={styles.value}>
          {job.city}, {job.country}
        </Text>
      </View>

      {role === 'jobseeker' && (
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyText}>Apply Now</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.applyText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', padding: 20 },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: RFPercentage(2),
    marginTop: RFPercentage(2),
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  detailBox: { backgroundColor: 'white', padding: 16, borderRadius: 12 },
  label: { fontWeight: 'bold', fontSize: 20, color: 'blue' },
  value: { fontSize: 15, color: '#444', marginBottom: 10 },
  applyButton: {
    backgroundColor: 'blue',
    padding: 16,
    marginTop: 30,
    alignItems: 'center',
    borderRadius: 8,
  },
  applyText: { color: 'white', fontSize: 16 },
  back: {
    backgroundColor: 'grey',
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 8,
    marginBottom: 80,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
});

export default JobDetailScreen;