import { Container, Content, Footer, FooterTab, Button, Text, Icon, Header, Body, Left, Right, Label } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'

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
          <Content>
            <Label>Borrow - Not implemented yet</Label>
          </Content>
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
    }
});

export default BorrowScreen;