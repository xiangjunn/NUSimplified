import { Container, Content, Button, Text, Icon, Header, Body, Left, Right, Label } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import Slider from '@react-native-community/slider';

function TemperatureHistory() {
    return (
        <Container >
     
          <Content>
          <Slider
    style={{width: 200, height: 40}}
    minimumValue={0}
    maximumValue={1}
    minimumTrackTintColor="#FFFFFF"
    maximumTrackTintColor="#000000"
  />
          </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
});

export default TemperatureHistory;