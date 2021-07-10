import { Container, Content, Button, Text, Form, Item, Input } from 'native-base';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { firebase } from '../../firebase';
import { getDay } from '../backend/functions'


function DeclareTempScreen() {
  const [temperature, setTemperature] = useState(370); // multiplied by 10 because slider cannot work properly with decimal
  const [period, setPeriod] = useState();
  const [date, setDate] = useState();
  const [day, setDay] = useState();
  const [success, setSuccess] = useState(false);
  const [input, setInput] = useState("37.0");
  const userId = firebase.auth().currentUser.uid;
  const db = firebase.firestore();

  function dateToString(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const y = date.getFullYear();
    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;
    return y + '-'+ mm + '-'+ dd;
  }
  function getTime(date) {
    let hr = date.getHours();
    let min = date.getMinutes();
    hr = hr < 10 ? '0' + hr : hr.toString(); 
    min = min < 10 ? '0' + min : min.toString(); 
    return hr + min;
  }


  async function submitDeclaration() {
    if (isNaN(input)) {
      alert("Please enter a valid temperature reading")
      return;
    } else if (input < 35 || input > 40) {
      alert("Please enter a temperature reading between 35 and 40 degree celsius");
      return;
    }
    const isNormal = input < 37.5;
    const tempInfo = {
      day,
      temperature: parseFloat(input),
      isNormal
    }
    await db.collection("users").doc(userId).update({
      [`temperatureHistory.${date}.${period}`]: tempInfo
    })
    setSuccess(true);
  }

  function update(text) {
    setInput(text);
    if (!isNaN(text) && text !=="" && text >= 35 && text <= 40) {
      setTemperature(parseInt(text * 10));
    }
  }

  useEffect(() => {
    const currentDate = firebase.firestore.Timestamp.now().toDate();
    const currentPeriod = getTime(currentDate) < 1200 ? "AM" : "PM";
    setDate(dateToString(currentDate));
    setDay(getDay(currentDate));
    setPeriod(currentPeriod);
  }, [])

    return (
        <Container >
          <Content>
            <Text style={{fontSize: 30, textAlign: 'center', marginTop: 50}}>{"Period: " + period}</Text>
            <Input
                  onChangeText={(text) => update(text)}
                  value={input}
                  keyboardType='number-pad'
                  maxLength={4}
                  style={{fontSize: 100, height: 150, alignSelf: 'center', marginBottom: 50}}
                  >
            </Input>
          <Slider
            style={{width: '80%', height: 40, alignSelf: 'center'}}
            minimumValue={350}
            maximumValue={400}
            value={temperature}
            step={1}
            onValueChange={(temp) => {
              setTemperature(temp);
              setInput(((temp / 10).toFixed(1)).toString());
            }}
            minimumTrackTintColor={temperature < 375 ? "blue" : "red"}
            maximumTrackTintColor={temperature < 375 ? "rgba(0, 0, 255, 0.3)" : "rgba(255, 0, 0, 0.3)"}
           />
            {success
            ? <Form style={{marginHorizontal: 20, marginTop: 100}}>
                <Text style={styles.submitText}>
                Success!
                </Text>
                <Button block disabled>
                  <Text style={styles.submitButton}>Submitted</Text>
                </Button>
              </Form>
            : <Form style={{marginHorizontal: 20, marginTop: 100}}>
                <Text style={styles.submitText}></Text>
                <Button block warning onPress={() => submitDeclaration()}>
                  <Text style={styles.submitButton}>Submit</Text>
                </Button>
              </Form>}
          </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
  button: {
    height: 70,
    margin: 5,
    width: '37%',
    borderRadius: 50
  },
  text: {
    textAlign: 'center',
    width: '100%',
    fontSize: 17
  },
  submitText: {
    textAlign: 'center',
    color: 'green',
    margin: 10,
    fontSize: 15,
    fontWeight: 'bold'
  },
  submitButton: {
    color: 'black',
    fontWeight: 'bold'
  }
});

export default DeclareTempScreen;