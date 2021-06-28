import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import HealthDeclaration from '../container/HealthDeclaration'
import BusArrival from '../screens/BusArrivalScreen'

export default function HomeNavigator() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={headerLooks}>
            <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
                headerShown: false
            }}
            />

        <Stack.Screen
            name="HealthDeclaration"
            component={HealthDeclaration}
            options={{
                title: 'Declare your temperature!',
            }}
            />
        
        <Stack.Screen
            name="BusArrival"
            component={BusArrival}
            options={{
                title: 'Bus Arrival',
            }}
            />

        </Stack.Navigator>)
}

const headerLooks = {headerTitleAlign: 'center', headerStyle: { backgroundColor: '#62B1F6' }};