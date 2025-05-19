import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import ipv4 from '../components/ipv4';

export const AuthContext = createContext({
  userToken: null,
  signIn: () => {},
  logout: () => {},
  signup: () => {},
});

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) setUserToken(token);
    };
    loadToken();
  }, []);

  const signIn = async (email, password, role) => {
    if (!email || !password || !role) {
      Alert.alert('Missing Info', 'Please fill all fields including role.');
      return { success: false };
    }

    try {
      const response = await fetch(`http://${ipv4.ip}:3000/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const userId = data.user.user_id;
        const userRole = role.toLowerCase();

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', String(userId));
        await AsyncStorage.setItem('role', userRole);
        setUserToken(token);
 console.log("Token",token);
        return { success: true, userId, userRole };
      } else {
        Alert.alert('Sign-in Failed', data.error || 'Unknown error');
        return { success: false };
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Network Error', 'Unable to connect to server.');
      return { success: false };
    }
  };

  //LOgOUt
 const logout = async () => {
    try {

const token = await AsyncStorage.getItem('token');
       if (!token) {
         Alert.alert('Not Logged In', 'You are not logged in.');
         return;
       }
  const response = await fetch(`http://${ipv4.ip}:3000/api/auth/logout`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`,
         },
       });
       if (response.ok || response.status === 400 || response.status === 401) {
               await AsyncStorage.removeItem('token');
               await AsyncStorage.removeItem('userId');
               await AsyncStorage.removeItem('role');
               setUserToken(null);
        console.log("Token",token);

         Alert.alert('Logged Out', 'You have been logged out.');

       } else {
       console.error('Logout error:', response.status);
       }
     } catch (error) {
         console.error('Logout error:', error);
     }
   };



const signup = async (userData, role) => {
  try {
    let endpoint = '';

    if (role === 'employer') {
      endpoint = `http://${ipv4.ip}:3000/api/employers/signup`;
    } else if (role === 'jobseeker') {
      endpoint = `http://${ipv4.ip}:3000/api/jobseekers/signup`;
    } else {
      Alert.alert('Invalid role', 'Please choose jobseeker or employer.');
      return { success: false };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      const token = data.token;
      const userId = data.user.userId; // or `user_id` based on your backend response
      const userRole = role.toLowerCase();

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', String(userId));
      await AsyncStorage.setItem('role', userRole);
      setUserToken(token);
      console.log("token.........",token);
      Alert.alert('Registration Successful', 'You are now logged in!');
      return { success: true, userId, userRole };
    } else {
      Alert.alert('Registration Failed', data.message || 'Unknown error');
      return { success: false };
    }

  } catch (error) {
    console.error('Registration error:', error);
    console.error(error.stack);
    Alert.alert('Network Error', 'Unable to connect to server.');
    return { success: false };
  }
};

  return (
    <AuthContext.Provider value={{ userToken, signIn, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
