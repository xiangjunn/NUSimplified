import { Container, Content, Footer, FooterTab, Button, Text, Form, Card, CardItem } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';
import { firebase } from '../../../firebase';

function SlotsScreen() {
    const navigation = useNavigation();
    const currentDate = firebase.firestore.Timestamp.now().toDate();
    const advanceDate = extendDate(currentDate, 14);
    const [date, setDate] = useState({});

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
      setDate({[selectedDate]: {selected: true, selectedColor: '#62B1F6'}})}}
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
  markedDates={date}
/>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
});

export default SlotsScreen;