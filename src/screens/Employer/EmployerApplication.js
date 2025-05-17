import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFPercentage } from 'react-native-responsive-fontsize';
import ipv4 from '../../ipv4';
import Logo from '../../logo';

const EmployerApplication = ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employerId, setEmployerId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedAuthToken = await AsyncStorage.getItem('token');
        if (storedUserId) setEmployerId(storedUserId);
        if (storedAuthToken) setAuthToken(storedAuthToken);
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (!employerId || !authToken) return;

    const getEmployerApplications = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://${ipv4.ip}:3000/api/job-applications/employer/${employerId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load applications');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    getEmployerApplications();
  }, [employerId, authToken]);

  // Group applications by job title
  const groupedByJob = applications.reduce((acc, app) => {
    const title = app.title || 'Untitled Job';
    if (!acc[title]) acc[title] = [];
    acc[title].push(app);
    return acc;
  }, {});

  if (loading) return <ActivityIndicator size="large" color="blue" style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  // Render each applicant under a job
  const renderApplicant = ({ item }) => (
    <TouchableOpacity
      style={styles.applicantCard}
      onPress={() => navigation.navigate('ApplicationDetail', { application: item })}
    >
      <Text style={styles.applicantName}>👤 {item.full_name}</Text>
      <Text style={styles.applicantEmail}>✉️ {item.email}</Text>
    </TouchableOpacity>
  );

  // Render one job section with applicants list
  const renderJobSection = (jobTitle) => (
    <View key={jobTitle} style={styles.jobSection}>
      <Text style={styles.jobTitle}>{jobTitle}</Text>
      <FlatList
        data={groupedByJob[jobTitle]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderApplicant}
        scrollEnabled={false} // Prevent nested scroll issues inside ScrollView
        ListEmptyComponent={<Text style={styles.emptyText}>No applications for this job.</Text>}
      />
    </View>
  );

  return (
  <View contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
    <ScrollView>

      {Object.keys(groupedByJob).length === 0 ? (
        <Text style={styles.emptyText}>No applications found.</Text>
      ) : (
        Object.keys(groupedByJob).map((jobTitle) => renderJobSection(jobTitle))
      )}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9fafb',
    paddingBottom: 40,
  },
    logoContainer: {
      alignItems: 'flex-start',
      marginBottom: RFPercentage(2),
      marginTop: RFPercentage(2),
    },
  loader: {
    marginTop: 50,
    justifyContent: 'center',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 50,
    textAlign: 'center',
    fontSize: RFPercentage(2),
  },
  jobSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  jobTitle: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  applicantCard: {
    backgroundColor: 'lightblue',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
  },
  applicantName: {
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
    color: 'blue',
  },
  applicantEmail: {
    fontSize: RFPercentage(1.8),
    color: 'black',

    marginTop: 2,
  },
  emptyText: {
    fontSize: RFPercentage(2),
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EmployerApplication;
