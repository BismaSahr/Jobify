import React, { useCallback, useEffect, useState } from 'react';
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
import RNFetchBlob from 'rn-fetch-blob';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { PermissionsAndroid, Platform } from 'react-native';
import ipv4 from '../../ipv4';
import Logo from '../../logo';
import Toast from '../../Toast'; // Import the Toast component

const JobSeekerApplication = () => {
  const [applications, setApplications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [jobSeekerId, setJobSeekerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const navigation = useNavigation();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        if (id) setJobSeekerId(parseInt(id));
        if (token) setAuthToken(token);
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

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to download the resume.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const downloadResume = async (url) => {
    try {
      if (!url) {
        Alert.alert('No Resume', 'No resume link found.');
        return;
      }
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot download without storage permission.');
        return;
      }

      const { config, fs } = RNFetchBlob;
      const date = new Date();
      const fileExt = url.split('.').pop();
      const dir = fs.dirs.DownloadDir;

      const filePath = `${dir}/resume_${Math.floor(date.getTime() + date.getSeconds() / 2)}.${fileExt}`;

      config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'Downloading resume',
        },
      })
        .fetch('GET', url)
        .then(res => {
          Alert.alert('Downloaded', 'Resume downloaded to: ' + res.path());
        })
        .catch(err => {
          console.error(err);
          Alert.alert('Error', 'Resume download failed.');
        });

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const fetchApplications = async () => {
    if (!jobSeekerId || !authToken) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://${ipv4.ip}:3000/api/job-applications/jobseeker/${jobSeekerId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch applications');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchApplications();
    }, [jobSeekerId, authToken])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
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

  const handleDelete = (appId) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this application?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          if (!authToken) {
            Alert.alert(
              'Authentication Error',
              'Authentication token is missing. Please log in again.'
            );
            return;
          }
          try {
            const res = await fetch(
              `http://${ipv4.ip}:3000/api/job-applications/${appId}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            const result = await res.json();
            if (res.ok) {
              showToast(result.message || 'Application deleted successfully!', 'success');
              setApplications((prev) => prev.filter((app) => app.id !== appId));
            } else {
              showToast(result.error || 'Failed to delete application', 'error');
            }
          } catch (err) {
            console.error(err);
            showToast('Failed to delete application', 'error');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.label}>🏢 {item.company_name}</Text>
          <Text style={styles.label}>🔗 {item.website}</Text>
          <Text style={styles.label}>👤 {item.full_name}</Text>
          <Text style={styles.label}>✉️ {item.email}</Text>
          <Text style={styles.label}>📞 {item.phone}</Text>
          <TouchableOpacity onPress={() => downloadResume(item.resume_link)}>
            <Text style={styles.resume}>
              📎 Resume: {item.resume_link || 'N/A'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.cover}>
            📝 Cover Letter: {item.cover_letter || 'N/A'}
          </Text>
          <Text style={styles.cover}>
            Applied at : <Text style={{ color: 'green' }}>{item.application_date}</Text>
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: RFPercentage(2) }}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate('EditApplication', { application: item })}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleDelete(item.id)}
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
      <Text style={styles.heading}>My Applications</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No applications found</Text>
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
  heading: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    marginBottom: RFPercentage(2),
    textAlign: 'center',
    color: '#111827',
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
    fontSize: RFPercentage(2.6),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  label: {
    fontSize: RFPercentage(2),
    color: '#4b5563',
    marginBottom: 4,
  },
  resume: {
    fontSize: RFPercentage(2),
    color: '#2563eb',
    marginBottom: 4,
  },
  cover: {
    fontSize: RFPercentage(2),
    fontStyle: 'italic',
    color: '#374151',
    marginBottom: 4,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
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
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: RFPercentage(4),
    color: '#6b7280',
    fontSize: RFPercentage(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JobSeekerApplication;