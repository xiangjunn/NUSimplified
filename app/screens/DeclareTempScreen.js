import { Container, Content, Button, Text, Item, Form } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import Slider from '@react-native-community/slider';
import { text } from 'body-parser';

function DeclareTempScreen() {
  const [temperature, setTemperature] = useState(370);

    return (
        <Container >
          <Content>
            <Text style={{fontSize: 100, textAlign: 'center', textDecorationLine: 'underline'}}>{(temperature / 10).toFixed(1)}</Text>
            <Form style={{flexDirection: 'row', height: 80, backgroundColor: 'red'}}>
              <Form style={{alignItems: 'flex-start', flex: 1, flexDirection: 'row', backgroundColor: 'blue'}}>
            <Button style={styles.button} onPress={() => temperature <= 355 ? setTemperature(350) : setTemperature(temperature - 5)}>
              <Text style={styles.text}>- 0.5</Text>
            </Button>
            <Button style={styles.button} onPress={() => temperature <= 351 ? setTemperature(350) : setTemperature(temperature - 1)}>
              <Text style={styles.text}>- 0.1</Text>
            </Button>
            </Form>
            <Form style={{justifyContent: 'flex-end', flex: 1, flexDirection: 'row', backgroundColor: 'black'}}>
            <Button style={styles.button} onPress={() => temperature >= 399 ? setTemperature(400) : setTemperature(temperature + 1)}>
              <Text style={styles.text}>+ 0.1</Text>
            </Button>
            <Button style={styles.button} onPress={() => temperature >= 395 ? setTemperature(400) : setTemperature(temperature + 5)}>
              <Text style={styles.text}>+ 0.5</Text>
            </Button>
            </Form>
            </Form>
          <Slider
            style={{width: '80%', height: 40, alignSelf: 'center', marginVertical: 10}}
            minimumValue={350}
            maximumValue={400}
            value={temperature}
            step={1}
            onValueChange={(temp) => setTemperature(temp)}
            minimumTrackTintColor="blue"
            maximumTrackTintColor="blue"
  />
          </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
  button: {
    height: 70,
    margin: 5,
    width: '35%',
    borderRadius: 50
  },
  text: {
    textAlign: 'center',
    width: '100%',
    fontSize: 17
  }
});

export default DeclareTempScreen;