import { Container, Content, Footer, FooterTab, Button, Text, Icon, Form, Header, Item, Input } from 'native-base';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../firebase';
import { DATAMALL_API } from '@env'
import axios from 'axios'
import BusTimings from './BusTimings'

function BusArrivalScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [busStops, setBusStops] = useState([]);
    const [expand, setExpand] = useState({"selected": null});
    const [arrayholder, setArrayholder] = useState([]);
    const [doneQuery, setDoneQuery] = useState(false);

    // function busInfoComponent(bus, busStop) {
    //   const busInfo = queryBus(bus, busStop);
    //   return (
    //     <Form key={bus} style={{height: 40, marginHorizontal: 30,
    //     marginVertical: 10, borderColor: 'grey', borderBottomWidth: 1, flexDirection: 'row'}}>
    //       <Text style={{fontWeight: 'bold', textAlignVertical: 'center', flex: 1}}>{bus}</Text>
    //       {doneQuery ? <Text style={{textAlignVertical: 'center', flex: 1}}>{busInfo.ServiceNo}</Text>
    //       : <Text style={{textAlignVertical: 'center', flex: 1}}>hi</Text>}
          
    //       <Text style={{textAlignVertical: 'center', flex: 1}}>{bus}</Text>
    //       <Text style={{textAlignVertical: 'center', flex: 1}}>{bus}</Text>
    //     </Form>
    //   )
    // }

    function searchFilterFunction(text) {   
      const newData = arrayholder.filter(item => {      
        const itemId = item.key.toUpperCase();
        const itemName = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return (itemId.indexOf(textData) > -1) || (itemName.indexOf(textData) > -1);    
        });   
      setBusStops(newData); 
    };

    // async function queryBus(bus, busStop) {
    //   const data = await firebase.firestore().collection("buses").doc(bus).get().then(doc => doc.data());
    //   const mockBusService = data.mockBusService;
    //   const busStopCode = data.stops[busStop].busStopCode;
    //   const instance = axios.create({
    //     baseURL: 'http://datamall2.mytransport.sg/ltaodataservice/',
    //     timeout: 1000,
    //   });
    //   instance.defaults.headers.common['AccountKey'] = DATAMALL_API;
    //   const query = await instance.get('/BusArrivalv2?BusStopCode=' + busStopCode + "&ServiceNo=" + mockBusService)
    //     .then(res => res.data.Services[0]);
    //   console.log(query.ServiceNo)
    //   setDoneQuery(true)
    //   return query;
    // }

  
    useEffect(() => {
      const subscriber = firebase.firestore()
        .collection('busStops')
        .onSnapshot(querySnapshot => {
          const arr = []
          querySnapshot.forEach(documentSnapshot => {
            arr.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setArrayholder(arr)
          setBusStops(arr);
          setLoading(false);
        });
    
      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }, []);

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
              onChangeText={text => searchFilterFunction(text)}  
            />
          </Item>
        </Header>
          <FlatList
      data={busStops}
      extraData={expand}
      renderItem={({ item }) => ( // item represents a busstop
        expand.selected !== item.key ?
        <TouchableOpacity style={styles.container} onPress={() => {
          setDoneQuery(false);
          setExpand({"selected": item.key});
        }}>
          <Form style={{flex: 1, marginVertical: 5, marginHorizontal: 10}}>
          <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
          <Text>{item.key}</Text>
          </Form>
        </TouchableOpacity>
        :
        <Form style={styles.expanded}>
        <Form style={styles.edittedContainer}>
          <Form style={{flex: 1, marginVertical: 5, marginHorizontal: 10}}>
          <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
          <Text>{item.key}</Text>
          </Form>
        </Form>
        <Form style={{flexDirection: 'row', height: 30, marginHorizontal: 30}}>
          <Form style={{flex: 1}}></Form>
          <Form style={{flex: 1}}>
            <Text style={{fontWeight: 'bold', backgroundColor: 'red'}}>First</Text>
          </Form>
          <Form style={{flex: 1}}>
          <Text style={{fontWeight: 'bold', backgroundColor: 'red'}}>Second</Text>
          </Form>
          <Form style={{flex: 1}}>
          <Text style={{fontWeight: 'bold', backgroundColor: 'red'}}>Third</Text>
          </Form>

        </Form>
        {item.buses.map(bus => <BusTimings key={bus} busStop={item.key} bus={bus}></BusTimings>)}
        </Form>
        
        
        
      )}
    />
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
  }
});

export default BusArrivalScreen;