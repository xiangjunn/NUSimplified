import { Container, Content, Button, Text, Form, Card } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import {Calendar} from 'react-native-calendars';
import { firebase } from '../../../firebase';
import badmintonBooking from '../../backend/badmintonBooking.json'
import squashBooking from '../../backend/squashBooking.json'
import tennisBooking from '../../backend/tennisBooking.json'
import tableTennisBooking from '../../backend/tableTennisBooking.json'
import { getDay, titleCase } from '../../backend/functions'

function SlotsScreen({ route, navigation }) {
    const { sport, location, name } = route.params;
    const currentDate = firebase.firestore.Timestamp.now().toDate();
    const advanceDate = extendDate(currentDate, 14);
    const [date, setDate] = useState();
    const [dateObject, setDateObject] = useState({});
    const [slotsInfo, setSlotsInfo] = useState([]);
    const userId = firebase.auth().currentUser.uid;

    function dateToString(date) {
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let y = date.getFullYear();
        dd = dd < 10 ? '0' + dd : dd;
        mm = mm < 10 ? '0' + mm : mm; 

        return y + '-'+ mm + '-'+ dd;
    }

    function extendDate(date, day) {
        let dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + day);
        dueDate.setHours(dueDate.getHours()); 
        return dueDate;
    }

    async function displaySlots() {
        setSlotsInfo([]);
        if (date === undefined) {
            Alert.alert("Unable to show booking slots", "Please select a date!");
        } else {
            await firebase.firestore().collection(sport).doc(location).get().then(async doc => {
                let selectedSlot = doc.get(date);
                const jsDate = new Date(date);
                const day = getDay(jsDate);
                if (!selectedSlot) { // slots for the selected date is not available in database, need to add
                    let json = {};
                    const sports = {
                        "badminton" : badmintonBooking,
                        "squash" : squashBooking,
                        "tennis" : tennisBooking,
                        "tableTennis" : tableTennisBooking
                    }
                    if (day == 'Saturday' || day == 'Sunday') {
                        json = sports[sport][location].peak;
                    } else {
                        json = sports[sport][location].nonPeak;
                    }
                    selectedSlot = {
                        ...json,
                        day
                    }
                    await firebase.firestore().collection(sport).doc(location).set({
                        ...doc.data(),
                        [date] : selectedSlot
                    })
                    .then(() => {
                        console.log("Document successfully added!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
                const courts = selectedSlot.courts;
                const cloneCourts = JSON.parse(JSON.stringify(courts));
                let index = -1; // because increment before calling function, so first index will be 0
                const componenentArray = cloneCourts.map(
                    court => {
                        index++
                        return createCourtComponent(court, cloneCourts, index)
                    });
                setSlotsInfo(componenentArray);
            })
        }
    }

    function createCourtComponent(court, courts, index) {
        const id = court.courtNumber;
        return (
        <Card key={id}>
        <Form style={{margin: 20}}>
        <Text style={{fontSize: 25}}>{titleCase(sport) + ' Court ' + id}</Text>
        <Text>Each slot is 1 hour and represents the start time of the slot.</Text>
        {createButtonsComponent(court, courts, index)}
        </Form>
        </Card>
        )
    }

    function createButtonsComponent(court, courts, index) {
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
                                    const period = currSlot.isPeak ? "Period: Peak" : "Period: Non-peak";
                                    const body = "Court selected: " + court.courtNumber
                                                    + "\nDate: " + date
                                                    + "\nTimeslot selected: " + currSlot.time + "\n" + period
                                                    + "\n\nProceed to book?";
                                    Alert.alert(name, body, [
                                    { text: "No" },
                                    {
                                    text: "Yes",
                                    onPress: () => bookCourt(currSlot, courts, index),
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

    async function bookCourt(currSlot, courts, index) {
        const sfDocRef = firebase.firestore().collection(sport).doc(location);
        const userInfo = firebase.firestore().collection("users").doc(userId);
        const courtNumber = courts[index].courtNumber;
        const time = currSlot.time;
        firebase.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then(async (sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            const court = sfDoc.get(date).courts[index];
            const timeslots = court.timeslots;
            let isAvailable = false;
            for (let i = 0; i < timeslots.length; i++) {
                if (timeslots[i].time === currSlot.time) {
                    isAvailable = timeslots[i].isAvailable;
                    break;
                }
            }
            const userBookings = await firebase.firestore().collection("users").doc(userId).get().then(doc => doc.get("bookings"));
            let canBook = true;
            if (userBookings) {
                for (let i = 0; i < userBookings.length; i++) {
                    if (userBookings[i].date == date) {
                        canBook = false;
                        break;
                    }
                }
            }
            
            if (isAvailable && canBook) {
                const reference = date + '.' + 'courts';
                currSlot.isAvailable = false;
                const slotInfo = {
                    date,
                    courtNumber,
                    time,
                    activity: sport,
                    location: name
                }
                transaction.update(userInfo, { bookings : firebase.firestore.FieldValue.arrayUnion(slotInfo) }); 
                transaction.update(sfDocRef, { [reference] : courts });
                return true;
               
            } else if (!isAvailable) {
                Alert.alert('Unable to book slot", "Sorry! This slot is already taken. Please press "VIEW SLOTS" again to refresh the slots');
                return false;
            } else if (!canBook) {
                Alert.alert("You cannot have two bookings on the same day.");
                return false;
            }
        });
            }).then(success => {
                if (success) {
                    Alert.alert("Success", "You have booked court " + courtNumber + " at " + time + " located at " + name);
                    displaySlots();
                }
            })
            .catch((err) => {
                console.error(err);
            });
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