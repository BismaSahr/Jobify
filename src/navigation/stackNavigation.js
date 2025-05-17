import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Splash from '../../src/screens/splashScreen.js';
import FirstScreen from '../../src/screens/FirstScreen.js';
import RoleScreen from '../../src/screens/roleScreen.js';
import SignIn from '../../src/screens/Signin.js';
import jobSeekerSignup from '../../src/screens/JobSeeker/jobSeekerSignup.js';
import EmployeerSignup from '../../src/screens/Employer/EmployeerSignup.js';
import EditProfile from '../../src/screens/EditProfile.js';
import JobDetailScreen from '../../src/screens/JobDetails.js';
import CreateJobScreen from '../../src/screens/Employer/CreateJobs.js';
import EmployerJob from '../../src/screens/Employer/EmployerJobs.js';
import EditJobScreen from '../../src/screens/Employer/EditJob.js';
import JobApplication from '../../src/screens/JobSeeker/JobApplication.js';
import SearchScreen from '../../src/screens/searchScreen.js';
import JobSeekerApplication from  '../../src/screens/JobSeeker/JobSeekerApplication.js';
import EditApplicationScreen from '../../src/screens/JobSeeker/EditApplication.js';
import EmployerApplication from '../../src/screens/Employer/EmployerApplication.js';
import ApplicationDetail from '../../src/screens/Employer/ApplicationDetail.js';

import EmployerTab from '../../src/navigation/employerTab.js';
import JobSeekerTab from '../../src/navigation/jobSeekerTab.js';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="FirstScreen" component={FirstScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RoleScreen" component={RoleScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="jobSeekerSignup" component={jobSeekerSignup} options={{ headerShown: false }} />
        <Stack.Screen name="EmployeerSignup" component={EmployeerSignup} options={{ headerShown: false }} />
        <Stack.Screen name="JobSeekerTab" component={JobSeekerTab} options={{ headerShown: false }} />
        <Stack.Screen name="EmployerTab" component={EmployerTab} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="CreateJob" component={CreateJobScreen} />
        <Stack.Screen name="EditJob" component={EditJobScreen} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="JobApplication" component={JobApplication} />

        <Stack.Screen name="EditApplication" component={EditApplicationScreen} />

        <Stack.Screen name="EmployerApplication" component={EmployerApplication} />
        <Stack.Screen name="ApplicationDetail" component={ApplicationDetail} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
