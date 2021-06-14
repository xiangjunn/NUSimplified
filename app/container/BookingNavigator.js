import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import MainBookingScreen from '../screens/booking/MainBookingScreen';
import SportBookingScreen from '../screens/booking/SportBookingScreen';
import BadmintonScreen from '../screens/booking/BadmintonScreen';
import SlotsScreen from '../screens/booking/SlotsScreen';

export default function BookingNavigator() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={headerLooks}>
            <Stack.Screen
            name="MainBooking"
            component={MainBookingScreen}
            options={{
                headerShown: false
            }}
            />

        <Stack.Screen
            name="SportBooking"
            component={SportBookingScreen}
            options={{
                title: 'Select your sport',
            }}
            />

        <Stack.Screen
            name="Badminton"
            component={BadmintonScreen}
            options={{
                title: 'Choose your location',
            }}
            /> 
            <Stack.Screen
            name="Slots"
            component={SlotsScreen}
            options={{
                title: 'Choose your slots',
            }}
            /> 
        </Stack.Navigator>)
}

const headerLooks = {headerTitleAlign: 'center', headerStyle: { backgroundColor: '#62B1F6' }};