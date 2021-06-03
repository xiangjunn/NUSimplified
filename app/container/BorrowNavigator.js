import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import BorrowScreen from '../screens/BorrowScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';


export default function BorrowNavigator() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={headerLooks}>
            <Stack.Screen
            name="Borrow"
            component={BorrowScreen}
            options={{
                headerShown: false
            }}
            />

            <Stack.Screen
            name="BookDetails"
            component={BookDetailsScreen}
            options={{
                title: 'Book details',
            }}
            />
        </Stack.Navigator>)
}

const headerLooks = {headerTitleAlign: 'center', headerStyle: { backgroundColor: '#62B1F6' }};