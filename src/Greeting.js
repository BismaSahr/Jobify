import React from 'react';
import { Text, View } from 'react-native';

// Functional component with props
const Greeting = ({ name }) => {
  return (
    <View>
      <Text style={{ fontSize: 20 }}>Hello, {name}!</Text>
    </View>
  );
};

export default Greeting;