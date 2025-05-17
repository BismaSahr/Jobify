// LogoutScreen.js
import React, { useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../../src/AuthContext';

const LogoutScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    };

    performLogout();
  }, [logout, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});

export default LogoutScreen;
