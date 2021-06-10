import { Container, Footer, FooterTab, Button, Text, Icon, Header, Body, Left, Right, Label, List, ListItem, Thumbnail, Form } from 'native-base';
import React, { useState, useEffect} from 'react';
import { Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient';

function BorrowScreen() {
    const navigation = useNavigation();
    const homeStyle = styles.others;
    const bookingStyle = styles.others;
    const borrowStyle = styles.selected;
    const remindersStyle = styles.others;

    return (
        <Container >
          <Header androidStatusBarColor='#62B1F6' style={{backgroundColor: '#62B1F6'}}>
          <Left>
            <Button transparent onPress={() => navigation.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body/>
          <Right/>
            </Header>
          <Form style={{flex: 1, justifyContent: 'center'}}>
          <LinearGradient
        colors={['#ff7e5f', '#feb47b']}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.view}>
          <Button transparent style={styles.button} onPress={() => navigation.navigate('Browse')}>
          <Label  style={[styles.text, {color: 'black'}]}>Browse</Label>
          <Icon type='FontAwesome5' name='search' style={[styles.icon, {color: 'black'}]}/>
          </Button>
        </LinearGradient>
          <LinearGradient
        colors={['#42275a', '#734b6d']}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.view}>
          <Button transparent style={styles.button} onPress={() => navigation.navigate('Loan')}>
          <Label style={[styles.text, {color: 'white'}]}>Book Loans</Label>
          <Icon type='FontAwesome5' name='book' style={[styles.icon, {color: 'white'}]}/>
          </Button>
        </LinearGradient>
          </Form>
          <Footer style={{backgroundColor: '#62B1F6'}}>
            <FooterTab>
              <Button info onPress={() => navigation.navigate("Home")}>
                <Icon name='home' style={homeStyle} />
                <Text style={homeStyle} >Home</Text>
              </Button>

              <Button info onPress={() => navigation.navigate("Booking")}>
                  <Icon type='FontAwesome5' name='id-card' style={bookingStyle} />
                <Text style={bookingStyle} >Booking</Text>
              </Button>

              <Button info>
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
    }
});

export default BorrowScreen;