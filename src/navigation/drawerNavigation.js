import React, { useContext } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { AuthContext } from '../../src/AuthContext';

import JobSeekerTab from '../jobSeekerTab';
import EmployerTab from '../employerTab';

import SearchScreen from '../screens/searchScreen';
import LogoutScreen from '../screens/logoutScreen';
import DeleteAccountScreen from '../screens/DeleteAccountScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <TouchableOpacity onPress={() => props.navigation.navigate('Logout')} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('DeleteAccount')} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function drawerNavigation() {
  const { role } = useContext(AuthContext); // 'jobseeker' or 'employer'

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      {role === 'jobseeker' ? (
        <Drawer.Screen name="Job Seeker Home" component={JobSeekerTab} />
      ) : (
        <Drawer.Screen name="Employer Home" component={EmployerTab} />
      )}
      <Drawer.Screen name="Search" component={SearchScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} options={{ drawerLabel: () => null, title: null, drawerItemStyle: { height: 0 } }} />
      <Drawer.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ drawerLabel: () => null, title: null, drawerItemStyle: { height: 0 } }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutButton: { marginTop: 20, marginLeft: 15 },
  logoutText: { color: 'red', fontWeight: 'bold' },
  deleteButton: { marginTop: 10, marginLeft: 15 },
  deleteText: { color: 'darkred', fontWeight: 'bold' },
});
