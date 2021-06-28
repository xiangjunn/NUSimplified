import { Text, Form } from 'native-base';
import React, { useState, useEffect} from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { firebase } from '../../../firebase';

export default function ViewBookingsScreen() {
    const [data, setData] = useState([]);
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
                setData(bookings)
            } 
            })}, []);

    return (
          <FlatList
      data={data}
      contentContainerStyle={{ paddingBottom: 300 }}
      renderItem={({ item }) => ( // item represents a booking
        <Form key={item.date} style={{margin: 20, borderBottomWidth: 2, borderBottomColor: 'grey'}}>
        <Text style={{flex: 1, fontWeight: 'bold', color: '#0645AD', fontSize: 25, marginBottom: 5}}>{item.location}</Text>
        <Text style={{flex: 1, fontWeight: 'bold', fontSize: 20, marginBottom: 5}}>{sportName[item.activity]}</Text>
        <Text style={styles.text}>Date: {item.date}</Text>
        <Text style={styles.text}>Time: {item.time}</Text>
        <Text style={styles.text}>Court {item.courtNumber}</Text>
        </Form>
        )}
        
    
    />
    )
}

const styles = StyleSheet.create({
    text: {
        flex: 1,
        fontSize: 17,
        marginBottom: 5
    }
})