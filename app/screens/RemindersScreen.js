import { Container, Content, Footer, FooterTab, Button, Text, Icon, Header, Body, Left, Right, Form } from 'native-base';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Platform, Alert, Linking, NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { firebase } from '../../firebase';

const { RNAndroidOpenSettings } = NativeModules;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function RemindersScreen() {
    const navigation = useNavigation();
    const homeStyle = styles.others;
    const bookingStyle = styles.others;
    const borrowStyle = styles.others;
    const remindersStyle = styles.selected;
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    openAppSettings = () => {
      if (Platform.OS === 'ios') {
        Linking.openURL("app-settings:");
      } else {
        RNAndroidOpenSettings.appDetailsSettings();
      }
    }

    
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

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
          <Content>
            <Form
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Text>Your expo push token: {expoPushToken}</Text>
        <Form style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </Form>
        <Button
          title="Press to Send Notification"
          onPress={async () => {
            await scheduleNotification();
          }}
        ><Text>LOL</Text></Button>
      </Form>
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

              <Button info onPress={() => navigation.navigate("Borrow")}>
              <Icon name="book" style={borrowStyle} />
              <Text style={borrowStyle}>Borrow</Text>
              </Button>

              <Button info>
                  <Icon name='alarm' style={remindersStyle} />
                <Text style={remindersStyle}>Reminder</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
    );
}

async function scheduleNotification() {
  const trigger = new Date(Date.UTC(2021, 6, 5) - 60 * 60 * 8 * 1000);
  console.log(trigger)
  console.log(firebase.firestore.Timestamp.now().toDate())
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Time's up!",
      body: 'Change sides!',
    },
    trigger,
  });
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Turn on notifications in your settings',
        'You will not receive push notifications for the reminders unless you have notifications turned on.',
        [   { text: "Turn On Notifications", onPress: openAppSettings, style: "cancel" },
                    {
                    text: "Keep Notifications Off",
                    }
                    
            ]);
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}


const styles = StyleSheet.create({
    selected: {
        color: 'black'
    },
    others: {
        color: 'white'
    }
});

export default RemindersScreen;