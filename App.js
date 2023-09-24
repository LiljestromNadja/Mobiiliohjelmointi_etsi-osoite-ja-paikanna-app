import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, Keyboard } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
//import { API_TOKEN } from "@env";

   
export default function App() {

  const[location, setLocation] = useState(null);
  const [input, setInput] = useState('');
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });

  const initialRegion = {
    latitude: 60.15524,
    longitude: 24.9117114,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221
};

const apitoken =  API_TOKEN;

const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${apitoken}&location=${input}`;

const printTheTime = () => {

  let time = new Date();

  let hours = time.getHours()+3;
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();


  if (hours < 10) {
    hours = '0' + hours.toString();
  }
  if (minutes < 10) {
    minutes = '0' + minutes.toString();
  }
  if (seconds < 10) {
    seconds = '0' + seconds.toString();
  }

  let printTime = hours + ':' + minutes + ':' + seconds;

  return printTime;

}

const getTheLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  console.log('permission to get the location', status, printTheTime());
  if (status !== 'granted') {
  Alert.alert('No permission to get location')
  return;
  }
  // Get location  
  let location2 = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
  console.log(printTheTime(), location2);

  setLocation(location2.coords);
  console.log(printTheTime(), 'location2 coords: ', location2.coords);
  console.log(printTheTime(),'LOCATION', location);

  setRegion({...region, latitude: location2.coords.latitude, longitude: location2.coords.longitude});

  }



  useEffect(() => {
    getTheLocation();
  },[])



const showLocationOnMap = async (input) => {

  try {
    const response = await fetch(url);
    const data = await response.json(); 

    const lat = data.results[0].locations[0].latLng.lat;
    const lng = data.results[0].locations[0].latLng.lng;
    
    
    console.log('DATA RESULTS',data.results);
    console.log('DATA RESULTS LOCATIONS',data.results[0].locations);
    console.log(printTheTime());
    console.log('haettu: ', data.results[0].providedLocation.location);
    console.log('length',data.results[0].locations.length);
    console.log('latitude',lat,'longitude', lng);  
    console.log(data.results[0].locations[0].adminArea1, data.results[0].locations[0].adminArea5, data.results[0].locations[0].postalCode);
    
    setRegion({ ...region, latitude: lat, longitude: lng})

  } catch (error) {
    Alert.alert('Error', error);
    console.log('ERROR', error);
    
    }

    setInput('');
    Keyboard.dismiss();

};


  return (
    <View style={styles.container}> 
      <MapView
        style={styles.mapViewStyle}        
        region={region}
        >
        <Marker
        coordinate={region}>
        </Marker>
      </MapView>
      <StatusBar style="auto" />

      <TextInput 
        placeholder="Give address (and city) here" 
        style={styles.inputStyle}      
        value={input}
        onChangeText={(input) => setInput(input)}        
      />
      <Button onPress={showLocationOnMap} title="Show" ></Button>
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapViewStyle: { 
    flex: 1,
    height: "100", 
    width: "100%"
   }, 
   inputStyle: {
    borderRadius: 1
   }
});