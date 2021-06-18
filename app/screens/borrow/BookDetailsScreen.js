import { Container, Content, Footer, FooterTab, Button, Text, Icon, Radio, Body, Left, Right, Label, List, ListItem, Thumbnail, Form } from 'native-base';
import React, { useState, useEffect} from 'react';
import { Image, StyleSheet, Modal, View, Alert, TouchableOpacity } from 'react-native';
import { firebase } from '../../../firebase';

export default function BookDetailsScreen({ route, navigation }) {
    const {book} = route.params;
    const {id} = route.params;
    const userId = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    const [quota, setQuota] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [borrowed, setBorrowed] = useState(false);

    function borrow(library) {
        if (quota > 0) {
            Alert.alert("Borrow", "You have chosen to collect your book at " + library + "\n\nProceed to borrow?",
            [   { text: "No" },
                {
                  text: "Yes",
                  onPress: () => recordBook(library),
                  style: "cancel"
                }
                
              ])
            
        } else {
            Alert.alert("No copies left", "The book you are trying to borrow is not available.")
        }
    }

    async function recordBook(library) {
        const currQuota = await db.collection("library").doc(id).get().then(doc => doc.get("quota"));
        // array of books borrowed by user
        const arr = await db.collection("users").doc(userId).get().then(doc => doc.get("borrowedBooks"));
        const maxBooksBorrowed = 3;
        if (currQuota > 0 && (arr == undefined || arr.length < maxBooksBorrowed)) {
            await db.collection("library").doc(id).update({
                quota: firebase.firestore.FieldValue.increment(-1)
            });
            const borrowedDate = firebase.firestore.Timestamp.now().toDate();
            const dueDate = extendDate(borrowedDate, 14);
            recordUser(library, borrowedDate, dueDate);
            Alert.alert("Successful!",
                "The book will be available for collection at "
                + library
                + " on the next working day.\nPlease return it by "
                + dateToString(dueDate) + ".",
                [{
                  text: "OK",
                  onPress: () => {
                    setModalVisible(!modalVisible);},
                  style: "cancel"
                }]);
            
        } else if (currQuota === 0) {
            Alert.alert("Failed to borrow book", "The book may have already been borrowed by someone else. Please try again.");
        } else if (arr != undefined && arr.length === maxBooksBorrowed) {
            Alert.alert("Max limit reached!", "You cannot borrow anymore books as you have reached your borrow limit.")
        }
    }

    async function recordUser(library, borrowedDate, dueDate) {
      const isExtended = false;
        const book = {
            id,
            borrowedDate,
            dueDate,
            library,
            isExtended
        }
        await db.collection("users").doc(userId).update({
            borrowedBooks: firebase.firestore.FieldValue.arrayUnion(book)
        })
    } 

    function extendDate(date, day) {
        let dueDate = new Date();
        dueDate.setDate(date.getDate() + day);
        dueDate.setHours(date.getHours()); 
        return dueDate;
    }

    function dateToString(date) {
        const dd = date.getDate();
        const mm = date.getMonth() + 1;
        const y = date.getFullYear();

        return dd + '/'+ mm + '/'+ y;
    }

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            // check quota
            db.collection("library").doc(id).onSnapshot(doc => setQuota(doc.get("quota")));

            // check if borrowed
            db.collection("users").doc(userId).onSnapshot(doc => {
                const userBooks = doc.get("borrowedBooks");
                if (userBooks) {
                    const len = userBooks.length;
                    for (let i = 0; i < len; i++) {
                        if (userBooks[i].id === id) {
                            setBorrowed(true);
                            return;
                        }
                    }
                    
                }
                setBorrowed(false);
            })
        }
        return () => { isMounted = false }
    });
    return (
        <Form style={{flex: 1}}>
            <Image style={{resizeMode: 'contain', flex: 1}} source={{ uri: book.thumbnailUrl }} />
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
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.hideModal} 
            style={{height: '10%', flex: 1, backgroundColor: 'rgba(255,0,0,0.1)',
                    borderTopLeftRadius: 20, borderBottomWidth: 3, borderBottomColor: 'red', borderTopRightRadius: 20}}>
              <Text style={{fontWeight: 'bold', flex: 1, textAlign: 'center', textAlignVertical: 'center', color: 'red'}}>CLOSE</Text>
            </TouchableOpacity>

            <Text style={styles.modalText}>Select the location you wish to collect your book.</Text>
            
            <ListItem onPress={() => borrow("Central Library")}>
            <Left style={{flex: 1}}>
              <Text>Central Library</Text>
            </Left>
            <Right style={{flex: 1}}>
              {quota ? <Text style={{color: 'green'}}>{quota + " Available"}</Text>
                    : <Text style={{color: 'red'}}>Not Available</Text>}
            </Right>
          </ListItem>
            <Form style={{height: "10%"}}></Form>
          </Form>
        </Form>
      </Modal>
            <Footer style={{backgroundColor: '#62B1F6'}}>
                {borrowed
                    ? <Button disabled style={styles.button}>
                        <Text style={{textAlign: 'center', flex: 1, color: 'black'}}>BORROWED</Text>
                      </Button>
                    : 
                      <Button warning onPress={() => setModalVisible(!modalVisible)} style={styles.button}>
                        <Text style={{textAlign: 'center', flex: 1, color: 'black'}}>BORROW</Text>
                      </Button>}
            </Footer>
        </Form>
    )
}

const styles = StyleSheet.create({
    button: {
        color: 'red',
        flex: 1,
        alignSelf: 'center',
        marginHorizontal: '5%'
    },
    hideModal: {
        alignSelf: 'flex-end',
        marginRight: 10,
        marginTop: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
      },
      modalView: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginTop: 15,
        textAlign: "center",
        fontWeight: "bold"
      },
      confirm: {
          height: 50,
          margin: 15
      }
  })