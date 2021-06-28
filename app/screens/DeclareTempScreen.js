import { Container, Content, Button, Text, Form } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { firebase } from '../../firebase'


function DeclareTempScreen() {
  const [temperature, setTemperature] = useState(370); // multiplied by 10 because slider cannot work properly with decimal
  const [success, setSuccess] = useState(false);
  const userId = firebase.auth().currentUser.uid;
  const db = firebase.firestore();

  async function submitDeclaration() {
    const currentTime = firebase.firestore.Timestamp.now().toDate();
    const isNormal = temperature < 375;
    const actualTemp = temperature / 10;
    const tempInfo = {
      timestamp: currentTime,
      temperature: actualTemp,
      isNormal
    }
    await db.collection("users").doc(userId).update({
      temperatureHistory: firebase.firestore.FieldValue.arrayUnion(tempInfo)
    })
    setSuccess(true);
  }

    return (
        <Container >
          <Content>
            <Text style={{fontSize: 100, textAlign: 'center', marginTop: 50}}>{(temperature / 10).toFixed(1)}</Text>
            <Form style={{flexDirection: 'row', height: 80}}>
              <Form style={{alignItems: 'flex-start', flex: 1, flexDirection: 'row'}}>
            <Button style={styles.button} onPress={() => temperature <= 355 ? setTemperature(350) : setTemperature(temperature - 5)}>
              <Text style={styles.text}>-0.5</Text>
            </Button>
            <Button style={styles.button} onPress={() => temperature <= 351 ? setTemperature(350) : setTemperature(temperature - 1)}>
              <Text style={styles.text}>-0.1</Text>
            </Button>
            </Form>
            <Form style={{justifyContent: 'flex-end', flex: 1, flexDirection: 'row'}}>
            <Button style={styles.button} onPress={() => temperature >= 399 ? setTemperature(400) : setTemperature(temperature + 1)}>
              <Text style={styles.text}>+0.1</Text>
            </Button>
            <Button style={styles.button} onPress={() => temperature >= 395 ? setTemperature(400) : setTemperature(temperature + 5)}>
              <Text style={styles.text}>+0.5</Text>
            </Button>
            </Form>
            </Form>
          <Slider
            style={{width: '80%', height: 40, alignSelf: 'center'}}
            minimumValue={350}
            maximumValue={400}
            value={temperature}
            step={1}
            onValueChange={(temp) => setTemperature(temp)}
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