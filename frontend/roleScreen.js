
import EmployeeLogin from './employeeLogin.js';
import EmployeerLogin from './EmployeerLogin.js';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
    View,Text,
    StyleSheet,Pressable,
    Image
  } from 'react-native';

  const roleScreen = ({navigation}) => {
    return (

        <View style={styles.mainView}>
        <Text style={styles.logo}>Jobify</Text>

        <View>
          <Text style={styles.h1}>Login as</Text>
        </View>
        <View style={styles.viewImg}>
        <Pressable  style={[styles.Pressableimg] }
            onPress={() =>
                           navigation.navigate("EmployeeLogin")}>
            <Image style={styles.img}
             source={{uri:"data:image/png;base64,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"}}/>
             <Text style={styles.text}>Employee</Text>


          </Pressable>


          <Pressable style={styles.Pressableimg}
             onPress={() =>
                           navigation.navigate("EmployeerLogin")}>
            <Image style={styles.img}
             source={{uri:"data:image/png;base64,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"}}/>
            <Text style={styles.text}>Employeer</Text>
          </Pressable>

        </View>



    <View>
      <Text style={styles.Paratext}>Find your dream job with ease! Explore opportunities, apply online, and connect with top employers.</Text>
    </View>


        </View>
);};


const styles= StyleSheet.create({

  mainView:{
    flex:1,
  },
  logo:{

      fontWeight:'bold',
      color:'blue',
      marginLeft:RFPercentage(2),
      marginTop:RFPercentage(0),
     fontSize: RFPercentage(7),
  },
  h1:{
     fontSize:30,
     fontWeight:'bold',
     justifyContent:'center',
     textAlign:'center',
     marginTop:RFPercentage(20),
     marginBottom:RFPercentage(2)

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
    }

});

export default roleScreen;



