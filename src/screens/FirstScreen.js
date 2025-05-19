import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import Logo from '../../components/logo.js';
import { useNavigation } from '@react-navigation/native';

const FirstScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.tagline}>The job search site</Text>

      <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('RoleScreen')}>
        <Text style={styles.createAccountText}>Create an account</Text>
      </TouchableOpacity>



      <Text style={styles.footerText}>
        By using Indeed, you agree to Indeed’s{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.indeed.com/legal')}>
          Terms of Service
        </Text>{' '}
        and acknowledge the{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.indeed.com/legal#cookies')}>
          Cookie Policy
        </Text>{' '}
        and{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.indeed.com/legal#privacy')}>
          Privacy Policy
        </Text>.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  tagline: {
    fontSize: RFPercentage(2.8),
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 15,
  },
  signInButton: {
    width: '100%',
    backgroundColor: 'blue',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  signInText: {
    color: '#fff',
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
  },
  createAccountButton: {
    width: '100%',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  createAccountText: {
    color: 'blue',
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
  },



  footerText: {
    fontSize: RFPercentage(1.6),
    color: '#333',
    textAlign: 'center',
    marginTop: 40,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default FirstScreen;
