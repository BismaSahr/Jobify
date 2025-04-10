import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);
  const [divide, setdivide] = useState(1000);
  const [multiply, setmultiply] = useState(10);


  const [muldiv, setmuldiv] = useState(10);



  return (
    <View style={{ alignItems: 'center', marginTop: 50 }}>
      <Text style={{ fontSize: 24 }}>Count: {count}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Button title="Increase" onPress={() => setCount(count + 1)} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Button title="Decrease" onPress={() => setCount(count - 1)} />
        </View>


        
      </View>
    

      

      <Text style={{ fontSize: 24 ,marginTop:20}}>Divide: {divide}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 , marginTop:10}}>
        <View style={{ flex: 1, marginRight: 10, marginLeft:10 }}>
          <Button title="Divide" onPress={() => setdivide(divide / 2)} />
        </View>
      </View>



      <Text style={{ fontSize: 24 ,marginTop:20}}>Multiply: {multiply}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 , marginTop:10}}>
        <View style={{ flex: 1, marginRight: 10, marginLeft:10 }}>
          <Button title="Multiply" onPress={() => setmultiply(multiply * 2)} />
        </View>
      </View>





      <Text style={{ fontSize: 24 ,marginTop:40}}>Count: {muldiv}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Button title="Multiply" onPress={() => setmuldiv(muldiv * 2)} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Button title="Divide" onPress={() => setmuldiv(muldiv / 2)} />
        </View>

        </View>

    </View>








  );
};

export default Counter;