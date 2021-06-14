import { Container, Content, Label, Button, Text, Form, Card, CardItem } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import {Calendar} from 'react-native-calendars';
import { firebase } from '../../../firebase';
import peakDay from '../../backend/sportBookingPeak.json'
import { getDay, titleCase } from '../../backend/functions'

function SlotsScreen({ route, navigation }) {
    const { sport, location, name } = route.params;
    const currentDate = firebase.firestore.Timestamp.now().toDate();
    const advanceDate = extendDate(currentDate, 14);
    const [date, setDate] = useState();
    const [dateObject, setDateObject] = useState({});
    const [slotsInfo, setSlotsInfo] = useState([]);

    function dateToString(date) {
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let y = date.getFullYear();
        dd = dd < 10 ? '0' + dd : dd;
        mm = mm < 10 ? '0' + mm : mm; 

        return y + '-'+ mm + '-'+ dd;
    }

    function extendDate(date, day) {
        let dueDate = new Date();
        dueDate.setDate(date.getDate() + day);
        dueDate.setHours(date.getHours()); 
        return dueDate;
    }

    async function displaySlots() {
        console.log(sport, location);
        if (date === undefined) {
            Alert.alert("Unable to show booking slots", "Please select a date!");
        } else {
            await firebase.firestore().collection(sport).doc(location).onSnapshot(async doc => {
                let selectedSlot = doc.get(date);
                const jsDate = new Date(date);
                const day = getDay(jsDate);
                if (!selectedSlot) { // slots for the selected date is not available in database, need to add
                    selectedSlot = {
                        ...peakDay,
                        day
                        }
                    await firebase.firestore().collection(sport).doc(location).set({
                        ...doc.data(),
                        [date] : selectedSlot
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
                const courts = selectedSlot.courts;
                const componenentArray = courts.map(court => createCourtComponent(court, courts));
                setSlotsInfo(componenentArray);
            })
        }
    }

    function createCourtComponent(court, courts) {
        const id = court.courtNumber;
        return (
        <Card key={id}>
        <Form style={{margin: 20}}>
        <Text style={{fontSize: 25}}>{titleCase(sport) + ' Court ' + id}</Text>
        <Text>Each slot is 1 hour and represents the start time of the slot.</Text>
        {createButtonsComponent(court, courts)}
        </Form>
        </Card>
        )
    }

    function createButtonsComponent(court, courts) {
        const timeslots = court.timeslots;
        let rowNumber = 1;
        let components = [];
        for (let i = 0; i < timeslots.length; i += 4) {
            let eachComponent = [];
            for (let j = 0; j < 4; j++) {
                const pos = i + j;
                if (pos < timeslots.length) {
                    const currSlot = timeslots[pos];
                    eachComponent.push(
                        <Button
                            key={currSlot.time}
                            style={[{width: '23%', marginHorizontal: '1%'}, currSlot.isAvailable ? styles.available : styles.unavailable]}
                            onPress={() => {
                                if (currSlot.isAvailable) {
                                    const period = currSlot.isPeak ? "Peak period" : "Non-peak period";
                                    const body = "Court selected: " + court.courtNumber
                                                    + "\nTimeslot selected: " + currSlot.time + "\n" + period
                                                    + "\n\nProceed to book?";
                                    Alert.alert(name, body, [
                                    { text: "No" },
                                    {
                                    text: "Yes",
                                    onPress: () => bookCourt(currSlot, courts),
                                    style: "cancel"
                                    }
                                    
                                     ]);
                                }
                            }}>
                            <Text style={{textAlign: 'center', flex: 1}}>{currSlot.time}</Text>
                        </Button>);
                }
            }
            components.push(<Form key={rowNumber} style={{flexDirection: 'row', marginVertical: 10}}>{eachComponent}</Form>);
            rowNumber++;
        }
        return components;
    }

    async function bookCourt(currSlot, courts) {
        currSlot.isAvailable = false;
        const reference = date + '.' + "courts"
        firebase.firestore().collection(sport).doc(location).update({
            [reference]: courts
        })
    }

    return (
        <Container >
            <Content>            
            <Calendar
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={dateToString(currentDate)}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={dateToString(advanceDate)}
  // Handler which gets executed on day press. Default = undefined
  onDayPress={(day) => {
      const selectedDate = day.dateString;
      setDate(selectedDate);
      setSlotsInfo([]);
      setDateObject({[selectedDate]: {selected: true, selectedColor: '#62B1F6'}})}}
  // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
  monthFormat={'MMMM yyyy'}
  // Do not show days of other months in month page. Default = false
  hideExtraDays={true}
  // Handler which gets executed when press arrow icon left. It receive a callback can go back month
  onPressArrowLeft={subtractMonth => subtractMonth()}
  // Handler which gets executed when press arrow icon right. It receive a callback can go next month
  onPressArrowRight={addMonth => addMonth()}
  // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
  disableAllTouchEventsForDisabledDays={true}
//   // Enable the option to swipe between months. Default = false
  enableSwipeMonths={true}
  markedDates={dateObject}
/>
                <Button block style={{marginVertical: 10}} onPress={() => displaySlots()}><Text>View Slots</Text></Button>
                <Text style={{textAlign: 'center', fontSize: 30}}>{date}</Text>
                <Form style={{flexDirection: 'row', margin: 20}}>
                <Form style={{height: 20, width: 20, backgroundColor: '#5cb85c'}}></Form>
                <Text style={{marginLeft: 5, marginRight: 20}}>Available</Text>
                <Form style={{height: 20, width: 20, backgroundColor: 'red'}}></Form>
                <Text style={{marginLeft: 5}}>Unavailable</Text>
                </Form>
                {slotsInfo}
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    available: {
        backgroundColor: '#5cb85c'
    },
    unavailable: {
        backgroundColor: 'red'
    }
});

export default SlotsScreen;