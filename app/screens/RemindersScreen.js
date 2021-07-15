import { Container, Content, Footer, FooterTab, Button, Icon, Header, Body, Left, Right, Card, CardItem, Form, Input, Textarea } from 'native-base';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Platform, Alert, Linking, NativeModules, FlatList, View, Text, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { firebase } from '../../firebase';
import { Root, Popup, Toast } from 'popup-ui';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { convertToDay,convertToMonth } from '../backend/functions'

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
    const [modalVisible, setModalVisible] = useState(false);
    const [frequency, setFrequency] = useState(null);
    const [open, setOpen] = useState(false);
    const [isVisible, setVisible] = useState(false);
    const [date, setDate] = useState(new Date());   

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setVisible(Platform.OS === 'ios');
      setDate(currentDate);
    };

    const dateTimePicker =
    <Form style={{height: '10%'}}>
    <TouchableOpacity
      onPress={() => setVisible(true)}
      style={{}}>
      <Text>{displayDate(date)}</Text>
    </TouchableOpacity>
    {isVisible && <DateTimePicker
      mode="datetime"
      value={date}
      onChange={onChange}
    />}
    </Form>

    function displayDate(date) {
      return `${convertToDay[date.getDay()]} ${date.getDate()} ${convertToMonth[date.getMonth()]} ${date.getFullYear()}`; 
    }

    renderRightActions = (progress) => {
      return (
        <Form style={styles.swipeView}>
        <TouchableOpacity style={{backgroundColor: 'rgba(255, 255, 0, 0.3)', height: '100%', width: '50%', justifyContent: 'center', alignItems: 'center'}}>
          <Icon type='FontAwesome5' name='edit' style={{color: 'rgb(100,100,0)'}}/>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor:'rgba(255, 0, 0, 0.4)', height: '100%', width: '50%', justifyContent: 'center', alignItems: 'center'}}>
        <Icon type='FontAwesome5' name='trash' style={{color: 'red'}}/>
      </TouchableOpacity>
      </Form>
      );
    };

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
        const repeat = notification.request.trigger.repeats;
        const identifier = notification.request.identifier;
        if (!repeat) {
          firebase.firestore().collection("users").doc(userId).update({
            [`notifications.${identifier}`] : firebase.firestore.FieldValue.delete()
          })
        }
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
              
            </TouchableOpacity>
          </Left>
          <Body/>
          <Right/>
            </Header>
            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Form style={styles.centeredView}>
          <Form style={styles.modalView}>
          <Form style={{flex: 1, margin: '2%'}}>
            <Button rounded onPress={() => setModalVisible(!modalVisible)}  style={{alignSelf: 'flex-end',
            justifyContent: 'center', aspectRatio: 1, width: '90%', backgroundColor: 'red'}}>
              <Icon name='times' type="FontAwesome5" style={{color: 'black', textAlign: 'center', width: '100%'}}/>
              </Button>
              <TouchableOpacity style={styles.textbox}>
                        <Input
                        placeholder='Title'
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => {}}
                        >
                        </Input>
                    </TouchableOpacity>
                    <Textarea rowSpan={5} bordered placeholder="Message" style={{borderColor: 'grey', margin: '2%'}}/>
                    <Form style={[{height: '20%', margin: '2%'}, Platform.OS == 'ios' ? {zIndex: 100} : {}]}>
                      <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5}}>Frequency</Text>

                      <DropDownPicker
                      dropDownDirection="BOTTOM"
                        open={open}
                        value={frequency}
                        items={[
                          {label: 'Once', value: 'Once'},
                          {label: 'Daily', value: 'Daily'},
                          {label: 'Weekly', value: 'Weekly'},
                        ]}
                        setOpen={setOpen}
                        setValue={setFrequency}
                      />
                    </Form>
                   {frequency === "Once" ? dateTimePicker : null}
            </Form>

            
            <Form>
  </Form>
          </Form>
        </Form>
      </Modal>

            <Form style={{flexDirection: 'row', width: '100%'}}>
              <Form style={{flex: 4}}>
              <Text style={{marginLeft: "3%", fontSize: 50}}>Reminders</Text>
              </Form>
            <Form style={{flex: 1, justifyContent: 'center'}}>
            <Button rounded onPress={() => setModalVisible(!modalVisible)}  style={{alignSelf: 'center',
            justifyContent: 'center', aspectRatio: 1, width: '90%', backgroundColor: 'rgb(0, 255, 0)'}}>
              <Icon name='add' style={{color: 'black', textAlign: 'center', width: '100%'}}/>
              </Button>
            </Form>
            
            </Form>
            <Text style={{marginLeft: "3%"}}>Swipe left on the reminder to edit or remove</Text>
            <FlatList
      data={reminders}
      renderItem={({ item }) => ( // item represents a reminder
       
    
        <Card>
           <Swipeable renderRightActions={renderRightActions}>
          <CardItem style={{flexDirection: 'column'}}>
          <Text style={{flex: 1, fontWeight: 'bold', color: '#0645AD', fontSize: 25, marginBottom: 5}}>{item.title}</Text>
          <Text style={{flex: 1, fontWeight: 'bold', fontSize: 20, marginBottom: 5}}>{item.body}</Text>
        <Text style={styles.text}>Fequency: {item.frequency}</Text>
          </CardItem>   
          </Swipeable>           
        </Card>
        
        )} 
    />
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
    },
    swipeView: {
      width: '40%',
      height: '100%',
      flexDirection: 'row',
    },
    hideModal: {
      alignSelf: 'flex-end',
      marginRight: 10,
      marginTop: 5,
  },
  centeredView: {
      flex: 1,
      justifyContent: "flex-end",
    },
    modalView: {
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      height: '80%'
    },
    textbox: {
      borderWidth: 1,
      borderColor: "grey",
      height: '10%',
      margin: '2%'
  },
});

export default RemindersScreen;