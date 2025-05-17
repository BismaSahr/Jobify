import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipv4 from '../../ipv4';
import Logo from '../../logo';
import Toast from '../../Toast'; // Import the Toast component

const EmployerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [employer_id, setEmployerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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

  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedToken = await AsyncStorage.getItem('token');
      if (storedUserId) setEmployerId(storedUserId);
      if (storedToken) setAuthToken(storedToken);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  const fetchJobs = async () => {
    if (!authToken || !employer_id) return;
    setLoading(true);
    try {
      const response = await fetch(`http://${ipv4.ip}:3000/api/jobs/${employer_id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      Alert.alert('Error', 'Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const response = await fetch(`http://${ipv4.ip}:3000/api/jobs/delete/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        showToast('Job deleted successfully', 'success');
        fetchJobs(); // Refresh the list
      } else {
        const errorText = await response.text();
        console.error('Delete failed:', errorText);
        showToast(`Failed to delete the job: ${errorText}`, 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('An error occurred while deleting the job.', 'error');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (authToken && employer_id) {
        fetchJobs();
      }
    }, [authToken, employer_id])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.category}>📂 {item.category_name || 'Unknown'}</Text>
          <Text style={styles.info}>🕒 {item.job_type}</Text>
          <Text style={styles.info}>💷 £{item.salary_range}</Text>
          <Text style={styles.info}>⏳ {item.deadline}</Text>
          <Text style={styles.info}>📄 {item.description}</Text>
          <Text style={styles.info}>✅ {item.requirements}</Text>
          <Text style={styles.info}>📍 {item.city}, {item.country}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.edit]}
            onPress={() => navigation.navigate('EditJob', {
              employer_id: employer_id,
              jobId: item.job_id,
            })}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.delete]}
            onPress={() => handleDelete(item.job_id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
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

      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 40 }} />
      ) : jobs.length === 0 ? (
        <Text style={styles.emptyText}>🚫 No jobs created yet</Text>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderItem}
          keyExtractor={item => item.job_id.toString()}
        />
      )}

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateJob')}
      >
        <Text style={styles.createButtonText}>+ Create Job</Text>
      </TouchableOpacity>
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
  cardContent: {
    flexDirection: 'column',
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
  info: {
    fontSize: RFPercentage(2),
    color: '#4b5563',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
  },
  edit: {
    backgroundColor: 'blue',
  },
  delete: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: RFPercentage(1.8),
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: 'blue',
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: RFPercentage(2),
    fontWeight: '800',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: RFPercentage(2.5),
    color: '#9ca3af',
  },
});

export default EmployerJobs;