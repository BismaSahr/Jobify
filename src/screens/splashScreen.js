import React, { useEffect } from 'react';
import Logo from '../../components/logo';
import { View, Text, StyleSheet } from 'react-native';

const Splash = ({navigation}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
          
            navigation.replace('FirstScreen');
        }, 2000); 

        return () => clearTimeout(timer); 
    }, [navigation]);

    return (
        <View style={styles.container}>
           <Logo/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default Splash;