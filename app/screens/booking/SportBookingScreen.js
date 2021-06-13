import { Container, Content, Footer, FooterTab, Button, Text, Icon, Form, Label } from 'native-base';
import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

function SportBookingScreen() {
    const navigation = useNavigation();

    return (
        <Container >
            <Form style={{flex: 1, justifyContent: 'center'}}>
          <LinearGradient
        colors={['#ff7e5f', '#feb47b']}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.view}>
          <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate("Badminton")}}>
          <Label  style={[styles.text, {color: 'black'}]}>Badminton</Label>
          <Image style={styles.logo} source={require("../../assets/shuttlecock.png")} />
          </TouchableOpacity>
        </LinearGradient>
          </Form>
        </Container>
    );
}

const styles = StyleSheet.create({
    view: {
        width: '80%',
        height: '40%',
        alignSelf: 'center',
        justifyContent: 'center',
        margin: '7%',
        borderRadius: 40
      },
      text: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold'
      },
      icon: {
        alignSelf: 'center',
        fontSize: 100,
        marginTop: 20
      },
      button: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 40
      },
      logo: {
        resizeMode: 'stretch',
        width: '50%',
        height: '50%',
        alignSelf: 'center'
    }
});

export default SportBookingScreen;