import { Container, Content, Footer, FooterTab, Button, Text, Icon, Form, Header, Item, Input } from 'native-base';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../firebase';
import { DATAMALL_API } from '@env'
import axios from 'axios'

function BusArrivalScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [busStops, setBusStops] = useState([]);
    const [expand, setExpand] = useState({"selected": null});
    const [arrayholder, setArrayholder] = useState([]);

    function busInfoComponent(bus) {
      return (
        <Form key={bus} style={{height: 40, marginHorizontal: 30, marginVertical: 10, borderColor: 'grey', borderBottomWidth: 1}}>
          <Text style={{fontWeight: 'bold', textAlignVertical: 'center', flex: 1}}>{bus}</Text>
        </Form>
      )
    }

    function searchFilterFunction(text) {   
      const newData = arrayholder.filter(item => {      
        const itemId = item.key.toUpperCase();
        const itemName = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return (itemId.indexOf(textData) > -1) || (itemName.indexOf(textData) > -1);    
        });   
      setBusStops(newData); 
    };

    // function bus() {
    //   var arr = []
    //   console.log("yep pass")
    //   const instance = axios.create({
    //     baseURL: 'http://datamall2.mytransport.sg/ltaodataservice/',
    //     timeout: 1000,
    //   });
    //   instance.defaults.headers.common['AccountKey'] = DATAMALL_API;
    //   async function getQuery() {
    //     for (let i = 0; i < busService.length; i++) {
    //       console.log("hi")
    //       const query = busService[i].busStopCode;
          
    //       await instance.get('/BusArrivalv2?BusStopCode=' + query + "&ServiceNo=154").then(x => {
    //         console.log(x.data.BusStopCode)
    //         arr.push(<Text key={i}>Hi</Text>);
    //         console.log("bye")
    //       });
    //     }
    //     setData(arr);
    //   }
    //   getQuery();
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
        <TouchableOpacity style={styles.container} onPress={() => setExpand({"selected": item.key})}>
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
        <Form style={{flexDirection: 'row', height: 30}}>
          <Form style={{flex: 1}}></Form>
          <Form style={{flex: 1}}>
            <Text>First</Text>
          </Form>
          <Form style={{flex: 1}}>
          <Text>Second</Text>
          </Form>
          <Form style={{flex: 1}}>
          <Text>Third</Text>
          </Form>

        </Form>
        {item.buses.map(bus => busInfoComponent(bus))}
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