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
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ipv4 from '../../components/ipv4.js';
import Logo from '../../components/logo.js';
import Toast from '../../components/Toast.js'; // Import your Toast component
import Images from '../../src/images/index.js';

const HomeScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState('');
  const [jobseekerId, setJobseekerId] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const navigation = useNavigation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        const storedId = await AsyncStorage.getItem('userId');
        const storedToken = await AsyncStorage.getItem('token');
        setRole(storedRole);
        setJobseekerId(parseInt(storedId));
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

  const fetchJobs = async () => {
    if (!authToken) return;
    try {
      setLoading(true);
      const response = await fetch(`http://${ipv4.ip}:3000/api/jobs/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch job data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (authToken) {
        fetchJobs();
      }
    }, [authToken])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
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

  const handleSave = async (jobId) => {
    if (!authToken) {
      Alert.alert(
        'Authentication Error',
        'Authentication token is missing. Please log in again.'
      );
      return;
    }
    try {
      const response = await fetch(`http://${ipv4.ip}:3000/api/saved`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          job_id: jobId,
          jobseeker_id: jobseekerId,
        }),
      });

      const result = await response.json(); // get the response body

      if (response.status === 201) {
        showToast(result.message || 'Job saved successfully!', 'success');
      } else if (response.status === 409) {
        showToast(result.message || 'You have already saved this job.', 'info'); // You might want a different type for info
      } else {
        showToast(result.error || 'Job could not be saved.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong.', 'error');
    }
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

          {role === 'jobseeker' && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSave(item.job_id)}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Image source={Images.Search} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : jobs.length === 0 ? (
        <Text style={styles.emptyText}>🚫 No jobs created yet</Text>
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
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFPercentage(2),
    marginTop: RFPercentage(2),
  },
  logoContainer: {
    alignItems: 'flex-start',
  },
  searchButton: {
    padding: 8,
    borderRadius: 10,
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
  saveButton: {
    marginLeft: 10,
    backgroundColor: 'grey',
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
  searchIcon: {
    width: RFPercentage(3),
    height: RFPercentage(3),
    resizeMode: 'contain',
    tintColor: 'blue',
  },
});

export default HomeScreen;