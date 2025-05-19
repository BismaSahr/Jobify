import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import HomeScreen from '../../src/screens/Home.js';

import JobSeekerSaved from '../../src/screens/JobSeeker/JobSeekerSaved.js';
import JobSeekerApplication from  '../../src/screens/JobSeeker/JobSeekerApplication.js';
import Profile from '../../src/screens/Profile.js';
import Images from '../../assets/images/index.js';

const Tab = createBottomTabNavigator();

const JobSeekerTab = ({ route }) => {
  const userIdFromTab = route?.params?.userId;
  const roleFromTab = route?.params?.role;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: { backgroundColor: 'grey' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Home}
              style={{ height: 30, width: 30, tintColor: focused ? 'blue' : 'black' }}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Applications"
        component={JobSeekerApplication}
        options={{
          title: 'Applications',
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Application}
              style={{ height: 30, width: 30, tintColor: focused ? 'blue' : 'black' }}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="SavedJobs"
        component={JobSeekerSaved}
        options={{
          title: 'SavedJobs',
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Save}
              style={{ height: 30, width: 30, tintColor: focused ? 'blue' : 'black' }}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={(props) => (
          <Profile {...props} userId={userIdFromTab} role={roleFromTab} />
        )}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.Profile}
              style={{ height: 30, width: 30, tintColor: focused ? 'blue' : 'black' }}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default JobSeekerTab;
