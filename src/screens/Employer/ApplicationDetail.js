import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Toast from '../../Toast'; // Import the Toast component
import { useState } from 'react';

const ApplicationDetail = ({ route }) => {
  const { application } = route.params;
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

  const openResume = () => {
    if (application.resume_link) {
      Linking.openURL(application.resume_link)
        .then(() => {
          showToast('Opening resume...', 'success');
        })
        .catch(() => {
          showToast('Failed to open resume.', 'error');
        });
    } else {
      showToast('No resume link available.', 'error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Job Details</Text>
        <Text style={styles.label}>Title: <Text style={styles.value}>{application.title}</Text></Text>
        <Text style={styles.label}>Description: <Text style={styles.value}>{application.description}</Text></Text>
        <Text style={styles.label}>Requirements: <Text style={styles.value}>{application.requirements}</Text></Text>
        <Text style={styles.label}>Salary: <Text style={styles.value}>£{application.salary_range}</Text></Text>
        <Text style={styles.label}>Job Type: <Text style={styles.value}>{application.job_type}</Text></Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Applicant Details</Text>
        <Text style={styles.label}>Name: <Text style={styles.value}>{application.full_name}</Text></Text>
        <Text style={styles.label}>Email: <Text style={styles.value}>{application.email}</Text></Text>
        <Text style={styles.label}>Phone: <Text style={styles.value}>{application.phone}</Text></Text>
        <Text style={styles.label}>Location: <Text style={styles.value}>{application.jobseeker_location}</Text></Text>
        <Text style={styles.label}>Skills: <Text style={styles.value}>{application.skills}</Text></Text>
        <Text style={styles.label}>Experience Level: <Text style={styles.value}>{application.experience_level}</Text></Text>
        <Text style={styles.label}>Desired Job Titles: <Text style={styles.value}>{application.desired_job_titles}</Text></Text>
        <Text style={styles.label}>Education: <Text style={styles.value}>{application.education}</Text></Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Application Info</Text>
        <Text style={styles.label}>Cover Letter:</Text>
        <Text style={[styles.value, { marginTop: 6 }]}>{application.cover_letter}</Text>
        <Text style={[styles.label, { marginTop: 12 }]}>Applied On: <Text style={styles.value}>{new Date(application.application_date).toLocaleDateString()}</Text></Text>

        {application.resume_link ? (
          <TouchableOpacity style={styles.button} onPress={openResume}>
            <Text style={styles.buttonText}>Download CV</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.value, { marginTop: 10 }]}>No resume link available.</Text>
        )}
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
  container: {
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  sectionCard: {
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
  sectionTitle: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  label: {
    fontWeight: '600',
    fontSize: RFPercentage(2),
    color: 'blue', // Blue tone consistent with your buttons & links
    marginTop: 10,
  },
  value: {
    fontWeight: 'normal',
    fontSize: RFPercentage(1.9),
    color: '#4b5563',
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: 'blue', // Same blue as your jobs screen buttons
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: RFPercentage(2.1),
  },
});

export default ApplicationDetail;