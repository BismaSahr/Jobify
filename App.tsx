import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RoleScreen from './frontend/roleScreen';
import jobSeekerSignup from './frontend/jobSeekerSignup.js';
import EmployeerSignup from './frontend/EmployeerSignup.js';
import FirstScreen from './frontend/FirstScreen.js';
import SignIn from './frontend/Signin.js';
import Home from './frontend/home.js';
import Splash from './frontend/splashScreen.js'; 

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash"> 
                <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                <Stack.Screen name="FirstScreen" component={FirstScreen} options={{ headerShown: false }} />
                <Stack.Screen name="RoleScreen" component={RoleScreen} options={{ headerShown: false }} />
                 <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                <Stack.Screen name="jobSeekerSignup" component={jobSeekerSignup} options={{ headerShown: false }} />
                <Stack.Screen name="EmployeerSignup" component={EmployeerSignup} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;