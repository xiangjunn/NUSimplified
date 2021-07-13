import { Container, Content, Footer, FooterTab, Button, Icon, Header, Body, Left, Right, Form } from 'native-base';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Platform, Alert, Linking, NativeModules, FlatList, View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { firebase } from '../../firebase';
import { Root, Popup, Toast } from 'popup-ui';

const { RNAndroidOpenSettings } = NativeModules;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL("app-settings:");
  } else {
    RNAndroidOpenSettings.appDetailsSettings();
  }
}

function RemindersScreen() {
    const navigation = useNavigation();
    const userId = firebase.auth().currentUser.uid;
    const homeStyle = styles.others;
    const bookingStyle = styles.others;
    const borrowStyle = styles.others;
    const remindersStyle = styles.selected;
    const [expoPushToken, setExpoPushToken] = useState('');
    const [reminders, setReminders] = useState([]);
    const notificationListener = useRef();
    const responseListener = useRef();

    async function scheduleNotification() {
      console.log(firebase.firestore.Timestamp.now().toDate())
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time's up!",
          body: 'Change sides!',
        },
        trigger: {
          // repeats: true,
          // weekday: 3, //Sunday
          // hour: 20,
          // minute: 0
          seconds: 2,
        }
      });
      const info = {
        title: "Time's up",
        body: "BAKANA!",
        frequency: "Once"
      }
      firebase.firestore().collection("users").doc(userId).update({
        [`notifications.${identifier}`]: info
      }
      ).then(() =>  Toast.show({
        title: 'Profile edited',
      text:
        'Your profile has been edited, you can now see your new information.',
      color: '#f39c12',
      timing: 2000,
      icon: (
        <Image
          source={require('../assets/warning.png')}
          style={{ width: 25, height: 25 }}
          resizeMode="contain"
        />)
      }))
    }

   
    
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log(notification);
      });
  
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

      firebase.firestore().collection('users').doc(userId).onSnapshot(query => {
        const notifications = query.get("notifications");
        if (notifications) {
            const arr = Object.keys(notifications).map(id => {
              return {
                ...notifications[id],
                id
              }
            })
            setReminders(arr);
        } 
        });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

    return (
      <Root>
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
            <Text style={{marginLeft: "3%", fontSize: 50}}>Reminders</Text>
            {/* <FlatList
      data={reminders}
      contentContainerStyle={{ paddingBottom: 200 }}
      renderItem={({ item }) => ( // item represents a reminder
        <Form key={item.key} style={{margin: 20, borderBottomWidth: 2, borderBottomColor: 'grey'}}>
        <Text style={{flex: 1, fontWeight: 'bold', color: '#0645AD', fontSize: 25, marginBottom: 5}}>{item.key}</Text>
        </Form>
        )} 
    /> */}
    <Content>
      <Text>yoyo</Text>
   
        <Button
            onPress={async () => {
              await scheduleNotification();
               
            }}
        >
            <Text>Open Popup</Text>
        </Button>
        
          <Button
          onPress={async () => {
            await Notifications.cancelAllScheduledNotificationsAsync();
          }}
        ><Text>cancel all notif :D</Text></Button>
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
        </Root>
    );
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