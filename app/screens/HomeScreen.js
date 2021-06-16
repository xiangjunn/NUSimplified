import { Container, Content, Footer, FooterTab, Button, Text, Icon, Label, Header, Body, Left, Right, Form } from 'native-base';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../../firebase'
import BusArrivalScreen from './BusArrivalScreen';


function HomeScreen() {
    const navigation = useNavigation();
    const homeStyle = styles.selected;
    const bookingStyle = styles.others;
    const borrowStyle = styles.others;
    const remindersStyle = styles.others;
    const [name, setName] = useState('')
    const uid = firebase.auth().currentUser.uid;
    const db = firebase.firestore();  
    const docRef = db.collection("users").doc(uid);

    useEffect(() => {
      docRef.get().then(doc => {
        const data = doc.data();
        const fullName = data.firstName + ' ' + data.lastName;
        setName(fullName);
      })
      return () => console.log('unmounting...');
    }, []) 

  

    return (
        <Container>
          <Header androidStatusBarColor='#62B1F6' style={{backgroundColor: '#62B1F6'}}>
          <Left>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Icon name='menu' style={{color: 'white'}}/>
            </TouchableOpacity>
          </Left>
          <Body/>
          <Right/>
            </Header>
          <Content>
            <Label style={{fontSize: 30, color: '#000033', margin: 10}}>{'Hello ' + name}</Label>
            <Form style={{height: 130, width: '100%', marginTop: 25, flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <TouchableOpacity onPress={() => navigation.navigate("HealthDeclaration")}
              style={{height: '100%', width: '30%',
              borderColor: 'blue', borderWidth: 5, borderRadius: 20, backgroundColor: 'white'}}>
                <Image style={{resizeMode: 'cover', width: '100%', height: '66%'}} source={require("../assets/temperature.png")}></Image>
                <Label style={{flex: 1, fontSize: 15, textAlign: 'center', fontWeight: 'bold'}}>{'Health\nDeclaration'}</Label>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("BusArrival")}
              style={{height: '100%', width: '30%', borderColor: 'blue', borderWidth: 5, borderRadius: 20, backgroundColor: 'white'}}>
                <Image style={{resizeMode: 'cover', width: '60%', height: '61%', marginTop: '5%', borderRadius: 18, alignSelf: 'center'}} source={require("../assets/bus.png")}></Image>
                <Label style={{flex: 1, fontSize: 15, textAlign: 'center', fontWeight: 'bold'}}>{'Bus\nArrival'}</Label>
            </TouchableOpacity>
            </Form>
            
            <Button onPress={() => {}}><Text>byee</Text></Button>
          </Content>
          <Footer style={{backgroundColor: '#62B1F6'}}>
            <FooterTab>
              <Button info >
                <Icon name='home' style={homeStyle} />
                <Text style={homeStyle} >Home</Text>
              </Button>

              <Button info onPress={() => navigation.navigate("Booking")}>
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
    }
});

export default HomeScreen;