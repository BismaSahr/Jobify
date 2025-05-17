import * as React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';


import StackNavigation from './src/navigation/stackNavigation.js';
import { AuthProvider } from './src/AuthContext';
import { SearchProvider } from './src/SearchContext';

const App = () => {
    return (
    <AuthProvider>
      <SearchProvider>
         <StackNavigation />
      </SearchProvider>
    </AuthProvider>


    );
};




export default App;