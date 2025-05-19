import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ipv4 from '../../../components/ipv4';
import Logo from '../../../components/logo';
import Toast from '../../../components/Toast'; // Import your Toast component

const JobSeekerSaved = () => {
  const [jobseekerId, setJobseekerId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const navigation = useNavigation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedId = await AsyncStorage.getItem('userId');
        const storedToken = await AsyncStorage.getItem('token');
        if (storedId) setJobseekerId(parseInt(storedId));
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

  const fetchJobs = async () => {
    if (!jobseekerId || !authToken) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://${ipv4.ip}:3000/api/saved/${jobseekerId}/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch saved job data.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (jobseekerId && authToken) {
        fetchJobs();
      }
    }, [jobseekerId, authToken])
  );

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

  const handleRemove = async (jobId) => {
    if (!authToken) {
      Alert.alert(
        'Authentication Error',
        'Authentication token is missing. Please log in again.'
      );
      return;
    }
    try {
      const response = await fetch(
        `http://${ipv4.ip}:3000/api/saved/delete/${jobId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        showToast('Job removed successfully!', 'success');
        fetchJobs();
      } else {
        const errorText = await response.text();
        console.error('Remove failed:', errorText);
        showToast('Failed to remove saved job.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to remove saved job.', 'error');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.category}>📂 {item.category_name}</Text>
          <Text style={styles.info}>
            📍 {item.city}, {item.country}
          </Text>
          <Text style={styles.company}>🏢 {item.company_name}</Text>
          <Text style={styles.info}>🔗 {item.website}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate('JobDetail', { job: item })}
          >
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(item.job_id)}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>
      <Text style={styles.mainTitle}>Your Saved Jobs</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : jobs.length === 0 ? (
        <Text style={styles.emptyText}>🚫 No jobs Saved yet</Text>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderItem}
          keyExtractor={(item) => item.job_id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onDismiss={handleDismissToast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: RFPercentage(2),
    marginTop: RFPercentage(2),
  },
  mainTitle: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    marginTop: RFPercentage(2),
    marginBottom: RFPercentage(4),
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: RFPercentage(2.8),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  category: {
    fontSize: RFPercentage(2),
    color: 'blue',
    marginBottom: 4,
    fontWeight: '600',
  },
  company: {
    fontSize: RFPercentage(2),
    color: 'blue',
    fontWeight: '600',
    marginBottom: 4,
  },
  info: {
    fontSize: RFPercentage(2),
    color: '#4b5563',
    marginBottom: 4,
  },
  detailButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontSize: RFPercentage(1.8),
    fontWeight: '800',
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: RFPercentage(2.5),
    color: '#9ca3af',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JobSeekerSaved;