import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFPercentage } from 'react-native-responsive-fontsize';
import ipv4 from '../ipv4';

import Logo from '../../src/logo';
import { useSearchState, useSearchDispatch } from '../SearchContext';

const searchScreen = ({ navigation }) => {
  const { searchQuery, jobs, loading, refreshing } = useSearchState();
  const { dispatch, getAllData } = useSearchDispatch();
  const [role, setRole] = useState('');
  const [jobseekerId, setJobseekerId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

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
        console.error('Error fetching user data:', error);
        Alert.alert(
          'Authentication Error',
          'Could not retrieve user information. Please log in again.'
        );
      }
    };
    getUserData();
  }, []);

  // Clear jobs then fetch new data on search
  const handleSearch = () => {
    if (!authToken) {
      Alert.alert(
        'Authentication Error',
        'Authentication token is missing. Please log in again.'
      );
      return;
    }
    dispatch({ type: 'CLEAR_JOBS' }); // Clear jobs before new search
    getAllData(searchQuery, authToken);
  };

  // Clear jobs then fetch new data on pull-to-refresh
  const onRefresh = () => {
    if (!authToken) {
      Alert.alert(
        'Authentication Error',
        'Authentication token is missing. Please log in to refresh.'
      );
      dispatch({ type: 'SET_REFRESHING', payload: false });
      return;
    }
    dispatch({ type: 'SET_REFRESHING', payload: true });
    dispatch({ type: 'CLEAR_JOBS' }); // Clear jobs before refresh
    getAllData(searchQuery, authToken);
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

      if (response.ok) {
        Alert.alert('Success', 'Job saved successfully!');
      } else {
        Alert.alert('Error', 'Job could not be saved.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
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
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search jobs or companies..."
          value={searchQuery}
          onChangeText={(text) =>
            dispatch({ type: 'SET_SEARCH_QUERY', payload: text })
          }
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {!loading && jobs.length === 0 && searchQuery.trim().length > 0 && (
        <Text style={styles.emptyText}>🚫 No jobs found</Text>
      )}

      {!loading && searchQuery.trim().length === 0 && (
        <Text style={styles.emptyText}>🔍 Start typing and press Search</Text>
      )}

      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item?.job_id?.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: RFPercentage(2),
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
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
  loadingText: {
    textAlign: 'center',
    fontSize: RFPercentage(2),
    marginVertical: 10,
  },
  saveButton: {
    marginLeft: 10,
    backgroundColor: 'grey',
    padding: 8,
    borderRadius: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 80,
    fontSize: RFPercentage(2.5),
    color: '#9ca3af',
  },
});

export default searchScreen;