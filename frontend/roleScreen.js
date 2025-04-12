
import EmployeeLogin from './jobSeekerSignup.js';
import EmployeerLogin from './EmployeerSignup.js';
import Logo from '../src/logo.js';
import Icon from 'react-native-vector-icons/FontAwesome';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
    View,Text,
    StyleSheet,Pressable,
    Image, Button
  } from 'react-native';

  const RoleScreen = ({navigation}) => {
    return (

        <View style={styles.mainView}>

   <View style={styles.container}>
   <Logo/>
        <View>
          <Text style={styles.h1}>Create Account </Text>
          <Text style={{justifyContent:'center' ,textAlign:'center'   ,   fontSize:30,
 fontWeight:'bold'}}>as</Text>

        </View>
        <View style={styles.viewImg}>
        <Pressable  style={[styles.Pressableimg] }
            onPress={() =>
                           navigation.navigate("jobSeekerSignup")}>
            <Image style={styles.img}
              source={require('../src/images/image1.jpg')}/>
             <Text style={styles.text}>Job seeker</Text>


          </Pressable>


          <Pressable style={styles.Pressableimg}
             onPress={() =>
                           navigation.navigate("EmployeerSignup")}>
           <Image style={styles.img}
                         source={require('../src/images/image1.jpg')}/>    <Text style={styles.text}>Employer</Text>
          </Pressable>


        </View>
</View>


      <Pressable
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>

        </View>
);};


const styles= StyleSheet.create({

  mainView:{
    flex:1,

  },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#fff',

  },

  h1:{
     fontSize:30,
     fontWeight:'bold',
     justifyContent:'center',
     textAlign:'center',

  },
  img:{
    width:RFPercentage(20),
    height:RFPercentage(15)
  },
  viewImg:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
    paddingHorizontal:RFPercentage(5)
  },
  Pressableimg:{
marginTop:RFPercentage(5)
  },
  text:{
     fontSize:20,
     fontWeight:'bold',
     marginTop:RFPercentage(2),
     marginLeft:RFPercentage(3),
     margin:RFPercentage(5),
  }

  ,
    Paratext:{
    marginLeft:RFPercentage(5),
    marginRight:RFPercentage(5),

      marginTop:RFPercentage(4),
    fontSize: RFPercentage(3),


       color:'blue'
    },
    goBackButton: {
       position: 'absolute',
       bottom: 20,
       left: '5%',
       backgroundColor: 'transparent',
       padding: 10,
       borderRadius: 50,
       alignItems: 'center',
       justifyContent: 'center',
     },

     goBackText: {
       fontSize: RFValue(18),
       color: 'blue',

     }



});

export default RoleScreen;



