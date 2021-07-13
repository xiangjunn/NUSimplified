import { Text, Form } from 'native-base';
import React, { useState, useEffect} from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { firebase } from '../../../firebase';

export default function ViewBookingsScreen() {
    const [sportsData, setSportsData] = useState([]);
    const [acadData, setAcadData] = useState([]);
    const userId = firebase.auth().currentUser.uid;
    const sportName = {
        "badminton" : "Badminton",
        "squash" : "Squash",
        "tennis": "Tennis",
        "tableTennis": "Table Tennis"
    }

  useEffect(() => {
        firebase.firestore().collection('users').doc(userId).onSnapshot(query => {
            const bookings = query.get("bookings");
            if (bookings && bookings.length !== 0) {
                setSportsData(bookings)
            } 
            });

        firebase.firestore().collection('users').doc(userId).onSnapshot(query => {
            const acadBookings = query.get("academicBookings");
            if (acadBookings && acadBookings.length !== 0) {
                setAcadData(acadBookings)
            } 
            });
        
        }, []);

    return (
        <Form>
            <Text style={{fontSize: 40, marginLeft: '5%'}}>Sport Facilities</Text>
          <FlatList
      data={sportsData}
      contentContainerStyle={{ paddingBottom: 50 }}
      renderItem={({ item }) => ( // item represents a sport facility booking
        <Form key={item.date} style={{margin: 20, borderBottomWidth: 2, borderBottomColor: 'grey'}}>
        <Text style={{flex: 1, fontWeight: 'bold', color: '#0645AD', fontSize: 25, marginBottom: 5}}>{item.location}</Text>
        <Text style={{flex: 1, fontWeight: 'bold', fontSize: 20, marginBottom: 5}}>{sportName[item.activity]}</Text>
        <Text style={styles.text}>Date: {item.date}</Text>
        <Text style={styles.text}>Time: {item.time}</Text>
        <Text style={styles.text}>Court {item.courtNumber}</Text>
        </Form>
        )} 
    />
    <Text style={{fontSize: 40, marginLeft: '5%'}}>Learning Facilities</Text>
    <FlatList
    data={acadData}
    contentContainerStyle={{ paddingBottom: 300 }}
    renderItem={({ item }) => ( // item represents a learning facility booking
      <Form key={item.date} style={{margin: 20, borderBottomWidth: 2, borderBottomColor: 'grey'}}>
      <Text style={{flex: 1, fontWeight: 'bold', color: '#0645AD', fontSize: 25, marginBottom: 5}}>{item.name}</Text>
      <Text style={{flex: 1, fontWeight: 'bold', fontSize: 20, marginBottom: 5}}>{item.venue}</Text>
      <Text style={styles.text}>Date: {item.date}</Text>
      <Text style={styles.text}>Time: {item.time}</Text>
      </Form>
      )} 
  />
    </Form>
    )
}

const styles = StyleSheet.create({
    text: {
        flex: 1,
        fontSize: 17,
        marginBottom: 5
    }
})