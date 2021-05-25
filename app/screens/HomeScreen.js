import { Container, Content, Footer, FooterTab, Button, Text, Icon, Label, Header, Body, Left, Right } from 'native-base';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

function HomeScreen({route, navigation}) {
    //const navigation = useNavigation();
    const homeStyle = styles.selected;
    const bookingStyle = styles.others;
    const borrowStyle = styles.others;
    const remindersStyle = styles.others;
    const [name, setName] = useState('hi')
    useEffect(() => {
      if (route.params != undefined) {
        setName(route.params.user.fullName);
      }
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
            <Label>Home - Not implemented yet</Label>
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