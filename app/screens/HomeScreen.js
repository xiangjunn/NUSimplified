import { Container, Content, Footer, FooterTab, Button, Text, Icon, Label, Header, Body, Left, Right, Form } from 'native-base';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../../firebase'

function HomeScreen() {
    const navigation = useNavigation();
    const homeStyle = styles.selected;
    const bookingStyle = styles.others;
    const borrowStyle = styles.others;
    const remindersStyle = styles.others;
    const [name, setName] = useState('hi')
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
            <Button transparent onPress={() => navigation.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body/>
          <Right/>
            </Header>
          <Content>
            <Label style={{fontSize: 30, color: '#000033', margin: 10}}>{'Hello ' + name}</Label>
            <Form style={{height: 130, width: '30%', margin: 25}}>
            <Button onPress={() => navigation.navigate("HealthDeclaration")} style={{flex: 2, borderRadius: 20}}>
              <Icon style={{fontSize: 70, flex: 1, textAlign: 'center'}} type='FontAwesome5' name="thermometer-half"></Icon>
            </Button>
            <Label style={{flex: 1, fontSize: 15, textAlign: 'center', fontWeight: 'bold'}}>{'Health\nDeclaration'}</Label>
            </Form>
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