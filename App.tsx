


App


import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RoleScreen from './frontend/roleScreen';
import EmployeeLogin from './frontend/employeeLogin';
import EmployeerLogin from './frontend/EmployeerLogin';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
    return (
       <NavigationContainer>
         <Stack.Navigator>
           <Stack.Screen name="RoleScreen" component={RoleScreen} options={{ headerShown: false }} />

           <Stack.Screen
                     name="EmployeeLogin"
                     component={EmployeeLogin}
                         />

          <Stack.Screen
                              name="EmployeerLogin"
                              component={EmployeerLogin}
                                  />
         </Stack.Navigator>
       </NavigationContainer>
    );
};

export default App;





