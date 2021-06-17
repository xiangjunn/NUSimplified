import { Container, Content, Footer, FooterTab, Button, Text, Icon, Form, Header, Item, Input } from 'native-base';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../firebase';
import { DATAMALL_API } from '@env'
import axios from 'axios'

function BusTimingsScreen(props) {
    const [loading, setLoading] = useState(true);
    const [bus1, setBus1] = useState('');
    const [bus2, setBus2] = useState('');
    const [bus3, setBus3] = useState('');

    async function queryBus(bus, busStop) {
      const data = await firebase.firestore().collection("buses").doc(bus).get().then(doc => doc.data());
      const mockBusService = data.mockBusService;
      const busStopCode = data.stops[busStop].busStopCode;
      const instance = axios.create({
        baseURL: 'http://datamall2.mytransport.sg/ltaodataservice/',
        timeout: 1000,
      });
      instance.defaults.headers.common['AccountKey'] = DATAMALL_API;
      const query = await instance.get('/BusArrivalv2?BusStopCode=' + busStopCode + "&ServiceNo=" + mockBusService)
        .then(res => res.data.Services[0]);
        const currentTime = firebase.firestore.Timestamp.now().toDate();
        console.log(query);
        let bus1Timing = "-";
        let bus2Timing = "-";
        let bus3Timing = "-";

        if (query !== undefined) {
            const bus1Estimated = query.NextBus.EstimatedArrival;
            bus1Timing = bus1Estimated
                ? differenceInMins(new Date(bus1Estimated.split('+')[0]), convertToSGTime(currentTime)) + " min"
                : "-";
            const bus2Estimated = query.NextBus2.EstimatedArrival;
            bus1Timing = bus2Estimated
                ? differenceInMins(new Date(bus2Estimated.split('+')[0]), convertToSGTime(currentTime)) + " min"
                : "-";
            const bus3Estimated = query.NextBus3.EstimatedArrival;
            bus1Timing = bus3Estimated
                ? differenceInMins(new Date(bus3Estimated.split('+')[0]), convertToSGTime(currentTime)) + " min"
                : "-";
        }
      setBus1(bus1Timing < 0 ? "Arriving" : bus1Timing);
      setBus2(bus2Timing < 0 ? "Arriving" : bus2Timing);
      setBus3(bus3Timing < 0 ? "Arriving" : bus3Timing);
      setLoading(false);
      return query;
    }

    function convertToSGTime(date) {
        let sgDate = new Date();
        const utcToSgTime = 8;
        sgDate.setHours(date.getHours() + utcToSgTime); 
        return sgDate;
    }

    function differenceInMins(date1, date2) {
        return Math.floor((date1 - date2) / (1000 * 60)) 
    }
  
    useEffect(() => {
      queryBus(props.bus, props.busStop)
    }, []);

    if (loading) {
      return <ActivityIndicator animating={true} size="large" style={{opacity:1}} color="#999999" />
    }


    return (
        <Form style={{height: 40, marginHorizontal: 30,
            marginVertical: 10, borderColor: 'grey', borderBottomWidth: 1, flexDirection: 'row'}}>
              <Text style={{fontWeight: 'bold', textAlignVertical: 'center', flex: 1}}>{props.bus}</Text>
              <Text style={{textAlignVertical: 'center', flex: 1}}>{bus1}</Text>
              <Text style={{textAlignVertical: 'center', flex: 1}}>{bus2}</Text>
              <Text style={{textAlignVertical: 'center', flex: 1}}>{bus3}</Text>
            </Form>
        )
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

export default BusTimingsScreen;