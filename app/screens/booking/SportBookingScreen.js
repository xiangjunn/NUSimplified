import { Container, Content, Footer, FooterTab, Button, Text, Icon, Form, Label } from 'native-base';
import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

function SportBookingScreen() {
    const navigation = useNavigation();

    return (
        <Container >
            <Form style={{flex: 1}}>
              <Form style={{flex: 1, flexDirection: 'row'}}>
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
        <LinearGradient
        colors={['#ff7e5f', '#feb47b']}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.view}>
          <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate("Squash")}}>
          <Label  style={[styles.text, {color: 'black'}]}>Squash</Label>
          <Image style={styles.logo} source={require("../../assets/squash.png")} />
          </TouchableOpacity>
        </LinearGradient>
        </Form>

        <Form style={{flex: 1, alignItems: 'flex-end', flexDirection: 'row'}}>
        <LinearGradient
        colors={['#ff7e5f', '#feb47b']}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.view}>
          <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate("Badminton")}}>
          <Label  style={[styles.text, {color: 'black'}]}>Table Tennnis</Label>
          <Image style={styles.logo} source={require("../../assets/table-tennis.png")} />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
        colors={['#ff7e5f', '#feb47b']}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.view}>
          <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate("Badminton")}}>
          <Label  style={[styles.text, {color: 'black'}]}>Tennis</Label>
          <Image style={styles.logo} source={require("../../assets/tennis.png")} />
          </TouchableOpacity>
        </LinearGradient>
        </Form>
          </Form>
        </Container>
    );
}

const styles = StyleSheet.create({
    view: {
        width: '50%',
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        // borderRadius: 40
      },
      text: {
        textAlign: 'center',
        fontSize: 20,
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
        // borderRadius: 40
      },
      logo: {
        resizeMode: 'stretch',
        width: '50%',
        height: '50%',
        alignSelf: 'center'
    }
});

export default SportBookingScreen;