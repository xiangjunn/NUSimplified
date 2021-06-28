import { Container, Content, Text, Form, List, ListItem } from 'native-base';
import React, { useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { firebase } from '../../firebase';
import { getDay } from '../backend/functions'

function TemperatureHistory() {
  const [temperatureInfo, setTemperatureInfo] = useState([])

  const userId = firebase.auth().currentUser.uid;

  function dateToString(date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const y = date.getFullYear();

    return dd + '/'+ mm + '/'+ y;
  }

  function getTime(date) {
    let hr = date.getHours();
    let min = date.getMinutes();
    hr = hr < 10 ? '0' + hr : hr.toString(); 
    min = min < 10 ? '0' + min : min.toString(); 
    return hr + ':'+ min;
  }

  async function createComponents(temperatureHistory) {
    let components = [];
    for (let i = temperatureHistory.length - 1; i >= 0; i--) {
      const record = temperatureHistory[i];
        const temperature = record.temperature;
        const date = record.timestamp.toDate();
        const isNormal = record.isNormal;
        components.push(
        <ListItem
        style={{height: 70, marginVertical: 10, marginRight: 10, borderBottomColor: 'grey', borderBottomWidth: 2}}
        key={i}>
        <Form style={styles.list}>
              <Text style={styles.listText}>
                {dateToString(date) + '\n' + getDay(date) + '\n' + getTime(date)}
              </Text>
              <Text style={[styles.listText, temperature >= 37.5 ? {color: 'red'} : {}]}>
                {temperature.toFixed(1)}
              </Text>
              <Text style={styles.listText}>
                {isNormal ? '-' : 'Above\nnormal'}
              </Text>
            </Form>
      </ListItem>
        )}
    return components; 
}
  
  useEffect(() => {
    const subscriber = firebase.firestore().collection('users').doc(userId).onSnapshot(query => {
          const temperatureHistory = query.get("temperatureHistory");
          if (temperatureHistory) {
              createComponents(temperatureHistory).then((components) => setTemperatureInfo(components))
          }
          })
  return () => subscriber();
  }, []);

    return (
        <Container >
          <Content>
            <Form style={styles.header}>
              <Text style={styles.headerText}>
                Date
              </Text>
              <Text style={styles.headerText}>
                Temperature
              </Text>
              <Text style={styles.headerText}>
                Remarks
              </Text>
            </Form>
            <List>
            {temperatureInfo}
            </List>
          </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    marginTop: 10
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
  list: {
    flexDirection: 'row',
  },
  listText: {
    height: '100%',
    flex: 1,
    textAlign: 'center',
    fontSize: 18
  }
});

export default TemperatureHistory;