import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../../firebase'
import { Container, Content, Form, Item, Input, Button, Text, Label } from 'native-base';

export default function RegistrationScreen() {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('')
    const [firstNameTitle, setFirstNameTitle] = useState(false)

    const [lastName, setLastName] = useState('')
    const [lastNameTitle, setLastNameTitle] = useState(false)

    const [email, setEmail] = useState('')
    const [emailTitle, setEmailTitle] = useState(false)

    const [password, setPassword] = useState('')
    const [passwordTitle, setPasswordTitle] = useState(false)

    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordTitle, setConfirmPasswordTitle] = useState(false)

    const display = (input, isDisplayed) => isDisplayed
        ? <Label style={{marginLeft: '5%'}}>{input}</Label>
        : <Label></Label>;    


    const onRegisterPress = () => {
        // remove whitespaces for first name, last name and email
        const firstNameModified = firstName.trim()
        const lastNameModified = lastName.trim()
        const emailModified = email.toLowerCase().trim()

        // check if all text fields are filled
        if (!(firstNameModified && lastNameModified && emailModified && password && confirmPassword)) {
            alert("Please fill up all text fields.")
            return
        } else if (!emailModified.endsWith("@u.nus.edu")) { // check if it is NUS registered email
            alert("This is not a NUS registered email!")
            return
        } else if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(emailModified, password)
            .then((response) => {
                const uid = response.user.uid
                const data = {
                    id: uid,
                    email: emailModified,
                    firstName: firstNameModified,
                    lastName: lastNameModified
                };
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .set(data)
                    .then(() => {
                        firebase.auth().currentUser.sendEmailVerification()
                        .then(function() {
                          // Verification email sent.
                          alert("Registration successful! An email verification has been sent to your email address.")
                          firebase.auth().signOut()
                          navigation.replace('Login')
                        })
                        .catch(function(error) {
                        // Error occurred. Inspect error.code.
                            console.log(error)
                        });
                    })
                    .catch((error) => {
                        alert(error)
                    });
            })
            .catch((error) => {
                alert(error)
        });
    }

    return (
        <Container>
            <Content style={styles.particularsArea}>
                <Form>
                    {/** first name textbox */}
                    {display('First Name', firstNameTitle)}
                    <Item rounded last style={styles.textbox}>
                        <Input
                        placeholder='First name'
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => {setFirstName(text); setFirstNameTitle(text !== '')}}
                        value={firstName}>
                        </Input>
                    </Item>

                    {/** last name textbox */}
                    {display('Last Name', lastNameTitle)}
                    <Item rounded last style={styles.textbox}>
                        <Input
                        placeholder='Last name'
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => {setLastName(text); setLastNameTitle(text !== '')}}
                        value={lastName}>
                        </Input>
                    </Item>

                    {/** Email textbox */}
                    {display('Email', emailTitle)}
                    <Item rounded last style={styles.textbox}>
                        <Input
                        keyboardType='email-address'
                        placeholder='Email'
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => {setEmail(text); setEmailTitle(text !== '')}}
                        value={email}>
                        </Input>
                    </Item>

                    
                    {/** Password textbox */}
                    {display('Password', passwordTitle)}
                    <Item rounded last style={styles.textbox}>
                        <Input
                        placeholder='Password'
                        secureTextEntry={true}
                        onChangeText={(text) =>{setPassword(text); setPasswordTitle(text !== '')}}
                        value={password} ></Input>
                    </Item>

                   
                    {/** Confirm Password textbox */}
                    {display('Confirm Password', confirmPasswordTitle)}
                    <Item rounded last style={styles.textbox}>
                        <Input
                        placeholder='Confirm Password'
                        secureTextEntry={true}
                        onChangeText={(text) => {setConfirmPassword(text); setConfirmPasswordTitle(text !== '')}}
                        value={confirmPassword} ></Input>
                    </Item>

                {/** Signup button */}
                <Button rounded style={styles.margin} onPress={onRegisterPress}>
                    <Text style={styles.textAlign} >Sign up</Text>
                </Button>
                
                {/** Login button */}
                <Form style={{flexDirection: 'row', marginTop: 20, justifyContent: 'center'}}>
                    <Label>Already have an account?  </Label>
                  <Label onPress={() => navigation.replace("Login")} style={{color: '#0645AD'}}>Login here</Label>
              
              </Form>
                
                </Form>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    particularsArea: { // for particulars
        marginLeft: '5%',
        marginRight: '5%',
        alignContent: 'center',
        marginTop: '5%'
    },
    textbox: {
        marginBottom: '5%'
    },
    margin: { // for login and signup button
      marginTop: 20,
      height: 60,
      flex: 1
    },
    textAlign: {
        flex: 1,
        textAlign: 'center'
    }
})