import { Container, Content, Footer, FooterTab, Button, Icon, Header, Body, Left, Right, Card, CardItem, Form, Input, Textarea, Label } from 'native-base';
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
import { convertToDay,convertToMonth, getDay } from '../backend/functions'

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
    const [frequency, setFrequency] = useState('Once');
    const [open, setOpen] = useState(false);
    const [openDay, setOpenDay] = useState(false);
    const [isVisibleDate, setVisibleDate] = useState(false);
    const [isVisibleTime, setVisibleTime] = useState(false);
    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [day, setDay] = useState(1);
    const [edit, setEdit] = useState('');            

    function getTime(date) {
      let hr = date.getHours();
      let min = date.getMinutes();
      hr = hr < 10 ? '0' + hr : hr.toString(); 
      min = min < 10 ? '0' + min : min.toString(); 
      return hr + ':' + min;
    }

    const onChange = (event, selectedDate) => {
      console.log(selectedDate);
      const currentDate = selectedDate || date;
      setVisibleDate(Platform.OS === 'ios');
      setVisibleTime(Platform.OS === 'ios');
      setDate(currentDate);
    };

    function onClose() { // reset all fields to initial value
      setTitle('');
      setMessage('');
      setFrequency('Once');
      setDate(new Date());
      setDay(1);
      setOpen(false);
      setEdit('');
      setModalVisible(!modalVisible);
    }

    function editReminder(item) {
      setEdit(item.id);
      const itemDate = item.date.toDate();
      setTitle(item.title);
      setMessage(item.message);
      setFrequency(item.frequency);
      if (item.frequency === "Once") {
        setDate(itemDate);
      } else if (item.frequency === "Daily" || item.frequency === "Weekly") {
        const today = new Date();
        today.setHours(itemDate.getHours());
        today.setMinutes(itemDate.getMinutes());
        console.log(today)
        setDate(today);
      }
      if (item.frequency === "Weekly") {
        setDay(item.day);
      }
      setModalVisible(!modalVisible);
    }

    const datePicker =
    Platform.OS === 'ios'
    ?  <Form style={{ margin: '2%', flexDirection: 'row', width: '100%'}}>
    <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5, paddingVertical: 10}}>Date:</Text>
    <Form style={{ flex: 1, padding: 5}}>
    <DateTimePicker
    mode="date"
    minimumDate={new Date()}
    value={date}
    onChange={onChange}
  />
  </Form>
  </Form>
  :
  <Form style={{ margin: '2%', flexDirection: 'row', width: '100%', paddingVertical: 10,  marginBottom: 5,}}>
  <Text style={{fontWeight: 'bold', fontSize: 20,}}>Date:</Text>
  <Form style={{ marginHorizontal: '2%'}}>
  <TouchableOpacity
    onPress={() => setVisibleTime(true)}
    style={{paddingHorizontal: 5, borderWidth: 1,}}>
      <Text  style={{fontSize: 20}}>{displayDate(date)}</Text>
    </TouchableOpacity>
    {isVisibleDate && <DateTimePicker
      mode="date"
      minimumDate={new Date()}
      value={date}
      onChange={onChange}
    />}
    </Form>
    </Form>;

  const timePicker =
    Platform.OS === 'ios'
    ?  <Form style={{ margin: '2%', flexDirection: 'row', width: '100%'}}>
    <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5, paddingVertical: 10}}>Time:</Text>
    <Form style={{ flex: 1, padding: 5}}>
    <DateTimePicker
    mode="time"
    value={date}
    onChange={onChange}
    />
    </Form>
    </Form>
    :
    <Form style={{ margin: '2%', flexDirection: 'row', width: '100%', paddingVertical: 5,  marginBottom: 5,}}>
    <Text style={{fontWeight: 'bold', fontSize: 20,}}>Time:</Text>
    <Form style={{ marginHorizontal: '2%'}}>
    <TouchableOpacity
      onPress={() => setVisibleTime(true)}
      style={{paddingHorizontal: 5, borderWidth: 1}}>
      <Text style={{fontSize: 20}}>{getTime(date)}</Text>
    </TouchableOpacity>
    {isVisibleTime && <DateTimePicker
      mode="time"
      value={date}
      onChange={onChange}
    />}
    </Form></Form>;  
  
  const dayPicker = 
  <Form style={[{ margin: '2%', flexDirection: 'row'}, Platform.OS == 'ios' ? {zIndex: 100} : {}]}>
    <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5, paddingVertical: 10}}>Day of the week:</Text>
    <DropDownPicker
    dropDownDirection="TOP"
      open={openDay}
      value={day}
      showArrowIcon={false}
      containerProps={{
        width: '50%',
        marginLeft: 10,
      }}
      items={[
        {label: 'Sunday', value: 1},
        {label: 'Monday', value: 2},
        {label: 'Tuesday', value: 3},
        {label: 'Wednesday', value: 4},
        {label: 'Thursday', value: 5},
        {label: 'Friday', value: 6},
        {label: 'Saturday', value: 7},
        
      ]}
      setOpen={setOpenDay}
      setValue={setDay}
    />
  </Form>

    function displayDate(date) {
      return `${convertToDay[date.getDay()]} ${date.getDate()} ${convertToMonth[date.getMonth()]} ${date.getFullYear()}`; 
    }

    renderRightActions = (progress, item) => {
      return (
        <Form style={styles.swipeView}>
        <TouchableOpacity
          style={{backgroundColor: 'rgba(255, 255, 0, 0.3)',
          height: '100%', width: '50%',
          justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            editReminder(item);
        }}
          >
          <Icon type='FontAwesome5' name='edit' style={{color: 'rgb(100,100,0)'}}/>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor:'rgba(255, 0, 0, 0.4)',
            height: '100%', width: '50%',
            justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              removeReminder(item.id);
            }}
            >
        <Icon type='FontAwesome5' name='trash-alt' style={{color: 'red'}}/>
      </TouchableOpacity>
      </Form>
      );
    };

    async function removeReminder(id) {
      Alert.alert("Are you sure?", "You will no longer receive any push notification for this",
      [   { text: "No" },
          {
            text: "Yes",
            onPress: () => cancelSchedule(id),
            style: "cancel"
          }
          
        ])
    }
    
    function cancelSchedule(id) {
      Notifications.cancelScheduledNotificationAsync(id).then(() => {
        firebase.firestore().collection("users").doc(userId).update({
          [`notifications.${id}`] : firebase.firestore.FieldValue.delete()
        })
      })
    }

    async function updateReminder() {
      cancelSchedule(edit);
      scheduleNotification(frequency);
    }

    async function addReminder() {
      if (!(title && message)) {
        alert("Please fill up all fields");
        return;
      } else {
        await scheduleNotification(frequency);
      }
    }

    async function scheduleNotification(frequency) {
      const trigger = triggers()[frequency];
      Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message
        },
        trigger
      })
      .then((identifier) => 
        addToFirebase(identifier)
      )
      .then(() => { // success
        Toast.show({
          title: edit ? 'Reminder successfully updated!': 'Reminder successfully added!',
        text:
          '',
        color: '#2ecc71',
        timing: 3000,
        icon: (
          <Image
            source={require('../assets/tick.png')}
            style={{ width: 25, height: 25 }}
            resizeMode="contain"
          />)
        });
        onClose();
      })
      .catch((error) => alert(error));
    }

    function triggers() {
      return {
        "Once" : {
          date
        },
        "Daily": {
          repeats: true,
          hour: date.getHours(),
          minute: date.getMinutes()
        },
        "Weekly": {
          repeats: true,
          weekday: day,
          hour: date.getHours(),
          minute: date.getMinutes()
        }
      }
    }

    function addToFirebase(id) {
      console.log(date.getDay())
      console.log(getDay(date))
      const details = frequency === "Once" ? `On ${displayDate(date)} at ${getTime(date)}`
        : (frequency === "Daily" ? `Everyday at ${getTime(date)}`
          : `Every ${convertToDay[day - 1]} at ${getTime(date)}`)
      const info = {
        title,
        message,
        frequency,
        details,
        date
      }
      if (frequency === "Weekly") {
        info.day = day;
      }
      firebase.firestore().collection("users").doc(userId).update({
        [`notifications.${id}`]: info
      }
      ).then(() => console.log("Success! yay"))
    } 
    
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log(notification);
        const trigger = notification.request.trigger;
        const repeat = trigger.repeats;
        const identifier = notification.request.identifier;
        if (!repeat && trigger.type !== "daily" && trigger.type !== 'weekly') {
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
             <Icon name='menu' style={{color: 'white'}}/>
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
            <Button rounded onPress={() => onClose()}  style={{alignSelf: 'flex-end',
            justifyContent: 'center', aspectRatio: 1, width: '90%', backgroundColor: 'red'}}>
              <Icon name='times' type="FontAwesome5" style={{color: 'black', textAlign: 'center', width: '100%'}}/>
              </Button>
              <TouchableOpacity style={styles.textbox}>
                        <Input
                        placeholder='Title'
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => setTitle(text)}
                        value={title}
                        style={{margin: 5}}
                        >
                        </Input>
                    </TouchableOpacity>
                    <Textarea
                      rowSpan={5}
                      bordered
                      placeholder="Message"
                      blurOnSubmit={true}
                      onChangeText={(text) => setMessage(text)}
                        value={message}
                      style={{borderColor: 'grey', margin: '2%'}}
                      />
                    <Form style={[{ margin: '2%', flexDirection: 'row'}, Platform.OS == 'ios' ? {zIndex: 100} : {}]}>
                      <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5, paddingVertical: 10}}>Frequency:</Text>
                      <DropDownPicker
                      dropDownDirection="TOP"
                        open={open}
                        value={frequency}
                        showArrowIcon={false}
                        containerProps={{
                          width: '50%',
                          marginLeft: 10,
                        }}
                        items={[
                          {label: 'Once', value: 'Once'},
                          {label: 'Daily', value: 'Daily'},
                          {label: 'Weekly', value: 'Weekly'},
                        ]}
                        setOpen={setOpen}
                        setValue={setFrequency}
                      />
                    </Form>
                   {frequency === "Once" ? datePicker : null}
                   {frequency === "Weekly" ? dayPicker : null}
                   {frequency ? timePicker : null}
                   {frequency && !edit ? <Button
                                  block style={{marginTop: 5}} onPress={() => addReminder()}
                                >
                                <Label style={{fontWeight: 'bold', color: 'white'}}>Add</Label>
                                </Button>
                                : null}
                     {frequency && edit ? <Button
                                  block warning style={{marginTop: 5}} onPress={() => updateReminder()}
                                >
                                <Label style={{fontWeight: 'bold', color: 'white'}}>Update</Label>
                                </Button>
                                : null}
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
           <Swipeable renderRightActions={(progress) => renderRightActions(progress, item)}>
          <CardItem style={{flexDirection: 'column'}}>
          <Text style={{flex: 1, fontWeight: 'bold', color: '#0645AD', fontSize: 25, marginBottom: 5}}>{item.title}</Text>
          <Text style={{flex: 1, fontSize: 20, marginBottom: 5}}>{item.message}</Text>
        <Text style={styles.text}>{item.details}</Text>
          </CardItem>   
          </Swipeable>           
        </Card>
        
        )} 
    />
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