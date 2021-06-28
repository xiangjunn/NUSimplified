import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BorrowScreen from '../screens/borrow/BorrowScreen';
import BrowseBooksScreen from '../screens/borrow/BrowseBooksScreen';
import BookDetailsScreen from '../screens/borrow/BookDetailsScreen';
import LoanScreen from '../screens/borrow/LoanScreen';


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
            name="Browse"
            component={BrowseBooksScreen}
            options={{
                title: 'Browse',
            }}
            />

        <Stack.Screen
            name="Loan"
            component={LoanScreen}
            options={{
                title: 'Loans',
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