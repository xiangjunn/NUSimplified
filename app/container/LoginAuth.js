import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../firebase'
import { Content, Form, Item, Input, Icon, Button, Text, Label} from 'native-base';
import { StyleSheet, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

function LoginAuth() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [emailSelected, setEmailSelected] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordSelected, setPasswordSelected] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const onLoginPress = () => {
      setLoading(true);
      firebase
          .auth()
          .signInWithEmailAndPassword(email.toLowerCase().trim(), password)
          .then((response) => {
              const uid = response.user.uid
              const usersRef = firebase.firestore().collection('users')
              usersRef
                  .doc(uid)
                  .get()
                  .then(firestoreDocument => {
                      if (!firestoreDocument.exists) {
                          alert("User does not exist anymore.")
                          setLoading(false);
                          return;
                      } else if (!firebase.auth().currentUser.emailVerified) {
                          alert("Email not verified!")
                          setLoading(false);
                          firebase.auth().signOut()
                      }
                  })
                  .catch(error => {
                      alert(error)
                      setLoading(false);
                  });
          })
          .catch(error => {
              alert(error)
              setLoading(false);
          })
    }

    function resetPassword() {
        firebase.auth().sendPasswordResetEmail(forgotPasswordEmail.toLowerCase().trim())
        .then(() => {
          // Password reset email sent!
          Alert.alert("A password reset email has been sent. Please check your mailbox.");
          setModalVisible(!modalVisible);
        })
        .catch((error) => {
          alert(error);
        });
    }

    return (
        <Content style={styles.login}>
            <Form>
              {/** Email textbox */}
              <Item rounded last style={emailSelected ? {borderColor: "#00BBBB"} : {}}>
                <Icon type='FontAwesome5' name='envelope' style={emailSelected ? {color: "#00BBBB"} : {}}/>
                <Input
                  keyboardType='email-address'
                  placeholder='Email'
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  onFocus={() => setEmailSelected(true)}
                  onBlur={() => setEmailSelected(false)}
                >
                </Input>
              </Item>

              {/** Password textbox */}
              <Item rounded last style={passwordSelected ? {borderColor: "#00BBBB"} : {}}>
                <Icon type='FontAwesome5' name='key' style={passwordSelected ? {color: "#00BBBB"} : {}}/>
                <Input
                  placeholder='Password'
                  secureTextEntry={true}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  onFocus={() => setPasswordSelected(true)}
                  onBlur={() => setPasswordSelected(false)}
                   ></Input>
              </Item>

              {/** "Forget password" button */}
              <TouchableOpacity style={{height: 35, marginTop: 5}} onPress={() => setModalVisible(!modalVisible)}>
                  <Label style={{color: '#0645AD', marginLeft: 10}}>Forgot password?</Label>
              </TouchableOpacity>
            
              {/** Login button */}
              <Button rounded success style={styles.margin} onPress={() => onLoginPress()}>
              {loading ? <ActivityIndicator animating={true} size="large" style={{flex: 1, alignSelf: 'center'}} color="#999999" />
                :  <Text style={styles.textAlign} >Login</Text>
              }
              </Button>
                
              {/** Signup button */}
              <Button rounded style={styles.margin} onPress={() => navigation.replace("Signup")}>
                  <Text style={styles.textAlign} >Sign up</Text>
              </Button>
            </Form>

            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Form style={styles.centeredView}>
          <Form style={styles.modalView}>
            <Text style={styles.modalText}>Please input your email address for password reset</Text>
            <Item regular last>
                <Input
                  placeholder='eg e0123456@u.nus.edu'
                  onChangeText={(text) => setForgotPasswordEmail(text)}
                  value={forgotPasswordEmail}
                  keyboardType='number-pad'
                >
                </Input>
                  
            </Item>
            <Form style={{flexDirection: 'row', marginTop: 25}}>
                  <Button danger style={styles.button} onPress={() => {
                      setModalVisible(!modalVisible)
                      setForgotPasswordEmail('')
                      }}>
                      <Text style={styles.text}>Cancel</Text>
                  </Button>
                  <Button success style={styles.button} onPress={() => resetPassword()}>
                      <Text style={[styles.text, {color: 'black'}]}>Confirm</Text>
                  </Button>
                  </Form>
          </Form>
        </Form>
      </Modal>
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
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "bold"
      },
      text: {
        flex: 1,
        textAlign: 'center'
    },
    button: {
        flex: 1,
        alignSelf: 'center',
        marginHorizontal: '5%',
        borderRadius: 50
    },
    selected: {

    },
    notSelected: {

    }
  })

  export default LoginAuth;