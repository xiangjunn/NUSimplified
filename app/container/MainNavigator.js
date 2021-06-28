import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import HomeNavigator from '../container/HomeNavigator';
import RemindersScreen from '../screens/RemindersScreen';
import { View, Icon } from 'native-base';
import { firebase } from '../../firebase'
import BorrowNavigator from '../container/BorrowNavigator';
import BookingNavigator from '../container/BookingNavigator';
import { Alert } from 'react-native';

function CustomDrawerContent(props) {
    const uid = firebase.auth().currentUser.uid;
    const db = firebase.firestore();  
    var docRef = db.collection("users").doc(uid);
    return (
        <View style={{flex: 1}}>
      <DrawerContentScrollView {...props} >
        <DrawerItemList {...props} />
        <DrawerItem labelStyle='' label="Profile"
          onPress={() => {
            docRef.get().then((doc) => {
            if (doc.exists) {
                const info = doc.data();
                Alert.alert("Profile", "Email: " + info.email + "\n"
                    + "First Name: " + info.firstName + "\n"
                    + "Last Name: " + info.lastName);
            } else {
                // doc.data() will be undefined in this case
                alert("No such document!");
            }
        }).catch((error) => {
            alert("Error getting document:", error);
        });}} />

      </DrawerContentScrollView>
      <View style={{flex: 0.5, justifyContent: 'flex-end'}}>
          <DrawerItem labelStyle='' inactiveTintColor='red' label="Sign out" style={{ justifyContent: 'center'}}
          icon={({color, size}) => (
            <Icon 
            type='FontAwesome5'
            name='sign-out-alt'
            style={{color: 'red'}}
            />
        )}
          onPress={() => firebase.auth().signOut()} />
      </View>
      </View>
    );
}

function MainNavigator() {
    const Drawer = createDrawerNavigator();
    return (
        <Drawer.Navigator 
          backBehavior="none"
          drawerType='slide'
          screenOptions={{swipeEnabled: false}}
          drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Home" component={HomeNavigator} />
          <Drawer.Screen name="Booking" component={BookingNavigator} />
          <Drawer.Screen name="Borrow" component={BorrowNavigator} />
          <Drawer.Screen name="Reminder" component={RemindersScreen} />
        </Drawer.Navigator>
      );
}

export default MainNavigator