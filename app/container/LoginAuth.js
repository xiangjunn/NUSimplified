import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../firebase'
import { Content, Form, Item, Input, Icon, Button, Text, Label} from 'native-base';
import { StyleSheet, Image} from 'react-native';

function LoginAuth() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onLoginPress = () => {
      firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((response) => {
              const uid = response.user.uid
              const usersRef = firebase.firestore().collection('users')
              usersRef
                  .doc(uid)
                  .get()
                  .then(firestoreDocument => {
                      if (!firestoreDocument.exists) {
                          alert("User does not exist anymore.")
                          return;
                      } else if (!firebase.auth().currentUser.emailVerified) {
                          alert("Email not verified!")
                          firebase.auth().signOut()
                      }
                      //const user = firestoreDocument.data()
                      //console.log(user)
                      //navigation.replace('Main')
                  })
                  .catch(error => {
                      alert(error)
                  });
          })
          .catch(error => {
              alert(error)
          })
  }

    return (
        <Content style={styles.login}>
            <Form>
              {/** Email textbox */}
              <Item rounded last>
                <Icon type='FontAwesome5' name='envelope' />
                <Input
                  placeholder='Email'
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => setEmail(text)}
                  value={email}>
                </Input>
              </Item>

              {/** Password textbox */}
              <Item rounded last>
                <Icon type='FontAwesome5' name='key' />
                <Input
                  placeholder='Password'
                  secureTextEntry={true}
                  onChangeText={(text) => setPassword(text)}
                  value={password} ></Input>
              </Item>

              {/** "Forget password" button */}
              <Button hasText transparent style={{height: 35, marginTop: 5}} onPress={() => alert('Not implemented yet')}>
                  <Label style={{color: '#0645AD', marginLeft: 10}}>Forgot password?</Label>
              </Button>
            
              {/** Login button */}
              <Button rounded success style={styles.margin} onPress={() => onLoginPress()}>
                  <Text style={styles.textAlign} >Login</Text>
              </Button>
                
              {/** Signup button */}
              <Button rounded style={styles.margin} onPress={() => navigation.replace("Signup")}>
                  <Text style={styles.textAlign} >Sign up</Text>
              </Button>
            </Form>
        </Content>
      );
  }

  const styles = StyleSheet.create({
      login: { // for email and password
          marginLeft: '5%',
          marginRight: '5%',
          alignContent: 'center',
      },
      margin: { // for login and signup button
        marginTop: 40,
        height: 60,
        flex: 1
      },
      textAlign: {
          flex: 1,
          textAlign: 'center'
      }
  })

  export default LoginAuth;