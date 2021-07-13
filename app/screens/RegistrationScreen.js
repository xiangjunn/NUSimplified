import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../../firebase'
import { Container, Content, Form, Input, Button, Text, Label } from 'native-base';

export default function RegistrationScreen() {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('')
    const [firstNameSelected, setFirstNameSelected] = useState(false)

    const [lastName, setLastName] = useState('')
    const [lastNameSelected, setLastNameSelected] = useState(false)

    const [email, setEmail] = useState('')
    const [emailSelected, setEmailSelected] = useState(false)
    const [emailValidity, setEmailValidity] = useState(true)

    const [password, setPassword] = useState('')
    const [passwordSelected, setPasswordSelected] = useState(false)
    const [passwordValidity, setPasswordValidity] = useState(true)

    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordSelected, setConfirmPasswordSelected] = useState(false)
    const [confirmPasswordValidity, setConfirmPasswordValidity] = useState(true)

    const display = (input, isDisplayed, select, valid) => isDisplayed
        ? <Label style={[{marginLeft: '1%', color: 'grey'}, select ? {color: "#00BBBB"} : {},
        valid ? {} : {color: "#d9534f"}]}>{input}</Label>
        : <Label></Label>;
        
    const showError = (message) => {
        return <Label style={{marginLeft: '1%', color: '#d9534f', marginBottom: '1%', fontSize: 14}}>{message}</Label>;
    }


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
        } else if (password.length < 8) {
            alert("Password must be at least 8 characters long")
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
                    {display('First Name', firstName, firstNameSelected, true)}
                    <TouchableOpacity style={[styles.textbox, firstNameSelected ? {borderWidth: 2, borderColor: "#00BBBB"} : {}]}> 
                        <Input
                        placeholder='First name'
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => setFirstName(text)}
                        value={firstName}
                        onFocus={() => setFirstNameSelected(true)}
                        onBlur={() => setFirstNameSelected(false)}>
                        </Input>
                    </TouchableOpacity>
                    <Label style={{marginBottom: "1%"}}></Label>

                    {/** last name textbox */}
                    {display('Last Name', lastName, lastNameSelected, true)}
                    <TouchableOpacity style={[styles.textbox, lastNameSelected ? {borderWidth: 2, borderColor: "#00BBBB"} : {}]}>
                        <Input
                        placeholder='Last name'
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => setLastName(text)}
                        value={lastName}
                        onFocus={() => setLastNameSelected(true)}
                        onBlur={() => setLastNameSelected(false)}>
                        </Input>
                    </TouchableOpacity>
                    <Label style={{marginBottom: "1%"}}></Label>

                    {/** Email textbox */}
                    {display('Email', email, emailSelected, emailValidity)}
                    <TouchableOpacity style={
                        [styles.textbox,
                         emailSelected ? {borderWidth: 2, borderColor: "#00BBBB"} : {},
                         emailValidity ? {} : styles.error]}>
                        <Input
                        keyboardType='email-address'
                        placeholder='Email'
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        onFocus={() => {
                            setEmailSelected(true);
                            setEmailValidity(true);
                        }
                        }
                        onBlur={() => {
                            setEmailSelected(false);
                            setEmailValidity(email === "" || email.toLowerCase().trim().endsWith("@u.nus.edu"));
                        }
                        }>
                        </Input>
                    </TouchableOpacity>
                    {emailValidity ? <Label></Label> : showError("Invalid NUS Email")}

                    
                    {/** Password textbox */}
                    {display('Password', password, passwordSelected, passwordValidity)}
                    <TouchableOpacity style={
                        [styles.textbox,
                        passwordSelected ? {borderWidth: 2, borderColor: "#00BBBB"} : {},
                        passwordValidity ? {} : styles.error]}>
                        <Input
                        placeholder='Password'
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        onFocus={() => {
                            setPasswordSelected(true);
                            setPasswordValidity(true);
                        }
                        }
                        onBlur={() => {
                            setPasswordSelected(false);
                            setPasswordValidity(password === "" || password.length >= 8)
                        }}></Input>
                    </TouchableOpacity>
                    {passwordValidity ? <Label></Label> : showError("Must be at least 8 characters long")}
                   
                    {/** Confirm Password textbox */}
                    {display('Confirm Password', confirmPassword, confirmPasswordSelected, confirmPasswordValidity)}
                    <TouchableOpacity style={[
                        styles.textbox,
                        confirmPasswordSelected ? {borderWidth: 2, borderColor: "#00BBBB"} : {},
                        confirmPasswordValidity ? {} : styles.error]}>
                        <Input
                        placeholder='Confirm Password'
                        secureTextEntry={true}
                        onChangeText={(text) => setConfirmPassword(text)}
                        value={confirmPassword}
                        onFocus={() => {
                            setConfirmPasswordSelected(true);
                            setConfirmPasswordValidity(true);
                        }}
                        onBlur={() => {
                            setConfirmPasswordSelected(false)
                            setConfirmPasswordValidity(password === confirmPassword)
                        }}></Input>
                    </TouchableOpacity>
                    {confirmPasswordValidity ? <Label></Label> : showError("Passwords don't match")}

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
        borderWidth: 1,
        borderColor: "grey"
    },
    margin: { // for login and signup button
      marginTop: 20,
      height: 60,
      flex: 1
    },
    textAlign: {
        flex: 1,
        textAlign: 'center'
    },
    error: {
        borderWidth: 2,
        borderColor: "#d9534f"
    }
})