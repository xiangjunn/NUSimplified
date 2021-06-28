import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainBookingScreen from '../screens/booking/MainBookingScreen';
import SportBookingScreen from '../screens/booking/SportBookingScreen';
import BadmintonScreen from '../screens/booking/BadmintonScreen';
import SquashScreen from '../screens/booking/SquashScreen';
import TennisScreen from '../screens/booking/TennisScreen';
import TableTennisScreen from '../screens/booking/TableTennisScreen';
import SlotsScreen from '../screens/booking/SlotsScreen';
import ViewBookingsScreen from '../screens/booking/ViewBookingsScreen';

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

            <Stack.Screen
            name="Squash"
            component={SquashScreen}
            options={{
                title: 'Choose your location',
            }}
            /> 
            <Stack.Screen
            name="Tennis"
            component={TennisScreen}
            options={{
                title: 'Choose your location',
            }}
            /> 
            <Stack.Screen
            name="TableTennis"
            component={TableTennisScreen}
            options={{
                title: 'Choose your location',
            }}
            /> 
            <Stack.Screen
            name="ViewBookings"
            component={ViewBookingsScreen}
            options={{
                title: 'Bookings',
            }}
            /> 

        </Stack.Navigator>)
}

const headerLooks = {headerTitleAlign: 'center', headerStyle: { backgroundColor: '#62B1F6' }};