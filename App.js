import React, { useState, useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native'
import { firebase } from './firebase';
import LoginScreen from './app/screens/LoginScreen';
import RegistrationScreen from './app/screens/RegistrationScreen';
import MainNavigator from './app/container/MainNavigator'



export default function App() {
  const Stack = createStackNavigator();
  const [isReady, setReady] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);
  useEffect(() => firebase.auth().onAuthStateChanged((user) => {
    if (user != null && user.emailVerified) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }), [])


  if (!isReady) {
    return (
      <AppLoading
        startAsync={componentDidMount}
        onFinish={() => setReady(true)}
        onError={err => console.log(err)}
      />
    )
  } else {
    return (
      <NavigationContainer>
        {!isSignedIn ?
        <Stack.Navigator screenOptions={headerLooks}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Welcome to ActiveNUS'
            }}
          />

          <Stack.Screen
            name="Signup"
            component={RegistrationScreen}
            options={{
              title: 'Registration',
            }}
          />
          </Stack.Navigator>
          :
          <MainNavigator
          />}

        
      </NavigationContainer>
    );
    }
  }

function componentDidMount() {
  return Font.loadAsync({
    Roboto: require("native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    ...Ionicons.font,
  });
}


const headerLooks = {headerTitleAlign: 'center', headerStyle: { backgroundColor: '#62B1F6' }};

const styles = StyleSheet.create({
  header: {
    
  }
})


