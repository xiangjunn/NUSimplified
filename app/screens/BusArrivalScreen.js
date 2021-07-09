import { Container, Text, Icon, Form, Header, Item, Input, Button } from 'native-base';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { firebase } from '../../firebase';
import BusTimings from './BusTimings';
import { searchFilter } from '../backend/functions';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

function BusArrivalScreen() {
    const isInitialMount = useRef(true);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [busStops, setBusStops] = useState([]);
    const [expand, setExpand] = useState({"selected": null});
    const [arrayholder, setArrayholder] = useState([]);
    const [refresh, setRefresh] = useState(false);
  
    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          await Location.watchPositionAsync({timeInterval: 5000, distanceInterval: 10}, setCurrentLocation);   
        })();
    }, []);

    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
     } else {
      firebase.firestore()
      .collection('busStops')
      .onSnapshot(querySnapshot => {
        const arr = []
        querySnapshot.forEach(documentSnapshot => {
          arr.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            distance: findDistance(location, documentSnapshot.get("location"))
          });
        });
        arr.sort((busStop1, busStop2) => busStop1.distance - busStop2.distance)
        setArrayholder(arr);
        setBusStops(arr);
        setLoading(false);
      });
     }
    }, [location])

    function setCurrentLocation(currentLocation) {
      const locationObject = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      }
      setLocation(locationObject);
    }

    // location consist of 2 keys namely latitude and longitude
    function findDistance(firstLocation, secondLocation) {
      const distance = getDistance(firstLocation, secondLocation);
      return distance;
    }

    if (loading) {
      return <ActivityIndicator animating={true} size="large" style={{opacity:1}} color="#999999" />
    }

    return (
      <Container>
        <Header noShadow androidStatusBarColor='#62B1F6' style={{backgroundColor: 'transparent'}}>
        <Item style={{flex: 1}}>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              onChangeText={text => {
                const newData = searchFilter(text, arrayholder, "key", "name");
                setBusStops(newData);
              }}
            />
          </Item>
        </Header>
        <Form>
          <FlatList
      contentContainerStyle={{ paddingBottom: 300 }}
      data={busStops}
      extraData={expand}
      renderItem={({ item }) => ( // item represents a busstop
        expand.selected !== item.key ?
        <TouchableOpacity style={styles.container} onPress={() => {
          setExpand({"selected": item.key});
        }}>
          <Form style={{flex: 1, marginVertical: 5, marginHorizontal: 10}}>
            <Form flexDirection='row'>
          <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
          <Text style={styles.distance}>
            {item.distance + "m"}
          </Text>
          </Form>
          <Text>{item.key}</Text>
          </Form>
        </TouchableOpacity>
        :
        <Form style={styles.expanded}>
        <Form style={styles.edittedContainer}>
          <Form style={{flex: 2, marginVertical: 5, marginHorizontal: 10}}>
          <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
          <Text>{item.key}</Text>
          </Form>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 20}}
            onPress={() => setRefresh(!refresh)}>
            <Icon type="FontAwesome5" name="redo"></Icon>
          </TouchableOpacity>
        </Form>
        <Form style={{flexDirection: 'row', height: 30, marginHorizontal: 30}}>
          <Form style={{flex: 1}}></Form>
          <Form style={{flex: 1}}>
            <Text style={{fontWeight: 'bold'}}>First</Text>
          </Form>
          <Form style={{flex: 1}}>
          <Text style={{fontWeight: 'bold'}}>Second</Text>
          </Form>
          <Form style={{flex: 1}}>
          <Text style={{fontWeight: 'bold'}}>Third</Text>
          </Form>

        </Form>
        {item.buses.map(bus => <BusTimings key={refresh + bus} busStop={item.key} bus={bus}></BusTimings>)}
        </Form>
        
        
        
      )}
    />
    </Form>
    </Container>
    );
}

const styles = StyleSheet.create({
  container: {
    height: 65,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,0,0,0.4)',
    flexDirection: "row",
    margin: 5,
    backgroundColor: 'rgba(255,0,0,0.1)'
  },
  expanded: {  
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,255,0.4)',
    margin: 5,
    backgroundColor: 'rgba(173,216,230,0.1)'
  },
  edittedContainer: {
    height: 65,
    flex: 1,
    flexDirection: "row",
  },
  distance: {
    paddingHorizontal: 5,
    marginLeft: 5,
    borderRadius: 5,
    borderWidth: 1,
    color: 'blue',
    fontWeight: 'bold'
  }
});

export default BusArrivalScreen;