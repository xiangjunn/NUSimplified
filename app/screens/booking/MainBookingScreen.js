import { Container, Footer, FooterTab, Button, Text, Icon, Header, Body, Left, Right, Label, Form } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient';

function BookingScreen() {
    const navigation = useNavigation();
    const homeStyle = styles.others;
    const bookingStyle = styles.selected;
    const borrowStyle = styles.others;
    const remindersStyle = styles.others;

    return (
        <Container >
         <Header androidStatusBarColor='#62B1F6' style={{backgroundColor: '#62B1F6'}}>
          <Left>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Icon name='menu' style={{color: 'white'}}/>
            </TouchableOpacity>
          </Left>
          <Body/>
          <Right/>
            </Header>
          <Form style={{flex: 1, justifyContent: 'center'}}>
          <LinearGradient
        colors={['#06beb6', '#48b1bf']}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.view}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SportBooking')}>
          <Label  style={[styles.text, {color: 'black'}]}>{"Sport\nFacilities"}</Label>
          </TouchableOpacity>
        </LinearGradient>
          <LinearGradient
        colors={['#2193b0', '#6dd5ed']}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.view}>
          <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('AcademicBooking')}}>
          <Label style={[styles.text, {color: 'black'}]}>{"Learning\nFacilities"}</Label>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
        colors={['#0cebeb', '#20e3b2', '#29ffc6']}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.view}>
          <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('ViewBookings')}}>
          <Label style={[styles.text, {color: 'black'}]}>View bookings</Label>
          </TouchableOpacity>
        </LinearGradient>
          </Form>
          <Footer style={{backgroundColor: '#62B1F6'}}>
            <FooterTab>
              <Button info  onPress={() => navigation.navigate("Home")}>
                <Icon name='home' style={homeStyle} />
                <Text style={homeStyle} >Home</Text>
              </Button>

              <Button info>
                  <Icon type='FontAwesome5' name='id-card' style={bookingStyle} />
                <Text style={bookingStyle} >Booking</Text>
              </Button>

              <Button info onPress={() => navigation.navigate("Borrow")}>
              <Icon name="book" style={borrowStyle} />
              <Text style={borrowStyle}>Borrow</Text>
              </Button>

              <Button info onPress={() => navigation.navigate("Reminder")}>
                  <Icon name='alarm' style={remindersStyle} />
                <Text style={remindersStyle}>Reminder</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
    );
}

const styles = StyleSheet.create({
    selected: {
        color: 'black'
    },
    others: {
        color: 'white'
    },
    view: {
      width: '80%',
      height: '25%',
      alignSelf: 'center',
      justifyContent: 'center',
      margin: '2%',
      borderRadius: 40
    },
    text: {
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold'
    },
    button: {
      flex: 1,
      width: '100%',
      flexDirection: 'column',
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 40
    }
});

export default BookingScreen;