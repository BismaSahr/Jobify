
import { View,Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
const Home = ({ navigation }) => {
    return (
        
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome to Home Screen!</Text>
      </View>
      
    );
  };
export default Home;