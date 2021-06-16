import { Container, Content, Footer, FooterTab, Button, Text, Icon, Form, Label } from 'native-base';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import busService from '../backend/busService.json';
import { DATAMALL_API } from '@env'
import axios from 'axios'

function BusArrivalScreen() {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    function bus() {
      
      
    }
    useEffect(() => {
      var arr = []
      console.log("yep pass")
      const instance = axios.create({
        baseURL: 'http://datamall2.mytransport.sg/ltaodataservice/',
        timeout: 1000,
      });
      instance.defaults.headers.common['AccountKey'] = DATAMALL_API;
      async function getQuery() {
        for (let i = 0; i < busService.length; i++) {
          console.log("hi")
          const query = busService[i].busStopCode;
          
          await instance.get('/BusArrivalv2?BusStopCode=' + query + "&ServiceNo=154").then(x => {
            console.log(x.data.BusStopCode)
            arr.push(<Text key={i}>Hi</Text>);
            console.log("bye")
          });
          
        }
        setData(arr);
      }
      getQuery();
      
      }, []);


    return (
        <Container >
          {data}
        </Container>
    );
}

const styles = StyleSheet.create({
    view: {
        width: '50%',
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        // borderRadius: 40
      },
      text: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
      },
      icon: {
        alignSelf: 'center',
        fontSize: 100,
        marginTop: 20
      },
      button: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignSelf: 'center',
        justifyContent: 'center',
        // borderRadius: 40
      },
      logo: {
        resizeMode: 'stretch',
        width: '50%',
        height: '50%',
        alignSelf: 'center'
    }
});

export default BusArrivalScreen;