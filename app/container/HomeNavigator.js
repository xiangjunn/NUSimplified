import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import HealthDeclaration from '../container/HealthDeclaration'

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

        </Stack.Navigator>)
}

const headerLooks = {headerTitleAlign: 'center', headerStyle: { backgroundColor: '#62B1F6' }};