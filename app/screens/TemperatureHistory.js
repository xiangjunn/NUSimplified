import { Container, Content, Text, Form, List, ListItem } from 'native-base';
import React, { useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { firebase } from '../../firebase';

function TemperatureHistory() {
  const [temperatureInfo, setTemperatureInfo] = useState([])

  const userId = firebase.auth().currentUser.uid;

  async function createComponents(temperatureHistory) {
    let components = [];
    const sorted = Object.keys(temperatureHistory)
      .sort((a, b) => a < b)
      .map(date => {
          return {
            ...temperatureHistory[date],
            date
          }
      });
    for (let i = 0; i < sorted.length; i++) {
      const record = sorted[i];
      const date = record.date;
      let temperatureAM = "";
      let temperaturePM = "";
      let day = "";
      let isNormalAM = true;
      let isNormalPM = true;
      if (record.AM) {
        temperatureAM = record.AM.temperature;
        day = record.AM.day;
        isNormalAM = record.AM.isNormal;
      }
      if (record.PM) {
        temperaturePM = record.PM.temperature;
        day = record.PM.day;
        isNormalPM = record.PM.isNormal;
      }
        components.push(
        <ListItem
        style={{height: 70, marginVertical: 10, marginRight: 10, borderBottomColor: 'grey', borderBottomWidth: 2}}
        key={i}>
        <Form style={styles.list}>
              <Text style={styles.listText}>
                {date + '\n' + day}
              </Text>
              <Form style={{flexDirection: 'row', flex: 1}}>
              <Text style={[styles.listText, temperatureAM >= 37.5 ? {color: 'red'} : {}]}>
                {temperatureAM ? temperatureAM.toFixed(1) : ""}
              </Text>
              <Text style={[styles.listText, temperaturePM >= 37.5 ? {color: 'red'} : {}]}>
                {temperaturePM ? temperaturePM.toFixed(1) : ""}
              </Text>
              </Form>
              <Text style={styles.listText}>
                {isNormalAM && isNormalPM ? '-' : 'Above\nnormal'}
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
              <Form>
              <Text style={styles.headerText}>
                Temperature
              </Text>
              <Form style={{flexDirection: 'row'}}>
                <Form style={{flex: 1}}>
                <Text style={{textAlign: 'center', flex: 1}}>AM</Text>
                </Form>
                <Form style={{flex: 1}}>
                <Text style={{textAlign: 'center', flex: 1}}>PM</Text>
                </Form>
              
              
              </Form>
              </Form>
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