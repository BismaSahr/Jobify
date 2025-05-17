import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { View ,Text, StyleSheet } from 'react-native';


const logo =()=>{
return (
    <View>
 <Text style={styles.logo}>Jobify</Text></View>

);
};


const styles= StyleSheet.create({
    logo:{

        fontWeight:'bold',
        color:'blue',
       fontSize: RFPercentage(7),
 },
})
export default logo;



