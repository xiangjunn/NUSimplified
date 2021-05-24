import React, { useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, Toast } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import BorrowScreen from '../screens/BorrowScreen';
import RemindersScreen from '../screens/RemindersScreen';
import { Button, Form, Label, View, Icon } from 'native-base';
import { firebase } from '../../firebase'

function CustomDrawerContent(props) {
    const uid = firebase.auth().currentUser.uid;
    const db = firebase.firestore();  
    var docRef = db.collection("users").doc(uid);
    

    return (
        <View style={{flex: 1}}>
      <DrawerContentScrollView {...props} >
        <DrawerItemList {...props} />
        <DrawerItem label="Bus Timings" onPress={() => alert("Not implemented yet")}>
        </DrawerItem>
        <DrawerItem label="NUS Wallet" onPress={() => alert("Not implemented yet")}>
        </DrawerItem>
        <DrawerItem labelStyle='' label="Profile"
          onPress={() => {
            docRef.get().then((doc) => {
            if (doc.exists) {
                const info = doc.data();
                alert("Email: " + info.email + "\n"
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
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <DrawerItem labelStyle='' inactiveTintColor='red' label="Log out" style={{ justifyContent: 'center'}}
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
    const headerLooks = {headerTitleAlign: 'center', headerStyle: { backgroundColor: '#62B1F6' }};
    

    return (
        <Drawer.Navigator backBehavior="none" drawerType='slide' drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Booking" component={BookingScreen} />
          <Drawer.Screen name="Borrow" component={BorrowScreen} />
          <Drawer.Screen name="Reminder" component={RemindersScreen} />
        </Drawer.Navigator>
      );
}

export default MainNavigator