import React from 'react'
import { Container, Form} from 'native-base';
import { StyleSheet, Image} from 'react-native';

import LoginDetails from '../container/LoginAuth';


function LoginScreen() {
    return (
        <Container>
          {/** Upper half of the screen, to display logo */}
            <Form style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <Image style={styles.logo} source={require("../assets/logo.png")}></Image>
            </Form>

          {/** Bottom half of the screen, to display login info */}
            <Form style={{flex: 2}}>
              <LoginDetails></LoginDetails>
            </Form>
          </Container>
        
        
        );
  }

  const styles = StyleSheet.create({
    logo: { // for our app logo
        resizeMode: 'cover',
        width: '100%',
        height: '100%'
    }
  })


  export default LoginScreen;