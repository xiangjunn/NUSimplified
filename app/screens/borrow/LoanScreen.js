import { Container, Content, Footer, FooterTab, Button, Text, Input, Item, List, ListItem, Thumbnail, Form } from 'native-base';
import React, { useState, useEffect} from 'react';
import { Image, StyleSheet, Modal, View, Alert } from 'react-native';
import { firebase } from '../../../firebase';

export default function LoanScreen() {
    const [data, setData] = useState([]);
    const userId = firebase.auth().currentUser.uid;
    const [selected, setSelected] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [code, setCode] = useState('');

    function dateToString(date) {
        const dd = date.getDate();
        const mm = date.getMonth() + 1;
        const y = date.getFullYear();

        return dd + '/'+ mm + '/'+ y;
    }

    async function createComponents(borrowedBooks) {
        for (let i = 0; i < borrowedBooks.length; i++) {
            const id = borrowedBooks[i].id;
            const library = borrowedBooks[i].library;
            const dueDate = borrowedBooks[i].dueDate.toDate();
            const doc = await firebase.firestore().collection('library').doc(id).get();
            const temp = borrowedBooks[i];
            borrowedBooks[i] =
            <ListItem
            style={{height: 120, marginVertical: 20, marginRight: 10, borderBottomColor: 'grey', borderBottomWidth: 2}}
            thumbnail
            key={doc.id}>
            <Form style={{flex: 3}}>
              <Image style={{resizeMode: 'stretch', flex: 1}} source={{ uri: doc.get('thumbnailUrl') }} />
            </Form>
            <Form style={{flex: 10, height: 120, marginLeft: 5}}>
              <Text style={{fontWeight: 'bold', color: '#0645AD'}}>{doc.get('title') }</Text>
              <Text style={{fontWeight: 'bold'}}>{library}</Text>
              <Text note numberOfLines={1} style={{color: '#F05832'}}>{"Due on " + dateToString(dueDate)}</Text>
              <Form style={{flex: 1, flexDirection: 'row'}}>
                  <Button style={styles.button} onPress={() => returnDialog(temp)}>
                      <Text style={styles.text}>Return</Text>
                  </Button>
                  <Button warning style={styles.button} onPress={() => extendPrompt(temp)}>
                      <Text style={[styles.text, {color: 'black'}]}>Extend</Text>
                  </Button>
                  </Form>
            </Form>
          </ListItem>
        }
        return borrowedBooks; 
    }

    function returnDialog(book) {
        setSelected(book);
        setModalVisible(!modalVisible);
    }

    async function returnBook() {
        const codeForTesting = '123456'; // actual deployment will be unique codes for each book
        if (code === codeForTesting) {
            await firebase.firestore().collection("users").doc(userId).update({
                borrowedBooks: firebase.firestore.FieldValue.arrayRemove(selected)
            });
            setCode('');
            setSelected();
            setModalVisible(!modalVisible);
        } else {
            Alert.alert("Incorrect code! Please try again.")
        }
    }

    function extendPrompt(book) {
        if (!book.isExtended) {
            Alert.alert("Are you sure?", "Book will be extended by 14 days.",
                [   { text: "No" },
                    {
                    text: "Yes",
                    onPress: () => extendDate(book),
                    style: "cancel"
                    }
                    
            ])
        } else {
            Alert.alert("Unable to extend", "The book has already been extended once.");
        }
    }

    async function extendDate(book) {
        const daysExtended = 14;
        const oldDueDate = book.dueDate.toDate();
        let newDueDate = new Date();
        newDueDate.setDate(oldDueDate.getDate() + daysExtended);
        newDueDate.setHours(oldDueDate.getHours()); 
        await firebase.firestore().collection("users").doc(userId).update({
            borrowedBooks: firebase.firestore.FieldValue.arrayRemove(book)
        });
        book.dueDate = newDueDate;
        book.isExtended = true;
        await firebase.firestore().collection("users").doc(userId).update({
            borrowedBooks: firebase.firestore.FieldValue.arrayUnion(book)
        });
    }

  useEffect(() => {
      firebase.firestore().collection('users').doc(userId).onSnapshot(query => {
            const borrowedBooks = query.get("borrowedBooks");
            if (borrowedBooks) {
                createComponents(borrowedBooks).then((components) => setData(components))
            } else {
                setData(<Text>You have no book on loan.</Text>)
            } 
            })}, []);

    return (
        <Container>
            <Content>
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
            <Text style={styles.modalText}>Please key in the code received upon returning book.</Text>
            <Item regular last>
                <Input
                  placeholder='Key in code here'
                  onChangeText={(text) => setCode(text)}
                  value={code}
                  keyboardType='number-pad' ></Input>
                  
            </Item>
            <Form style={{flexDirection: 'row', marginTop: 25}}>
                  <Button danger style={styles.button} onPress={() => {setModalVisible(!modalVisible)}}>
                      <Text style={styles.text}>Cancel</Text>
                  </Button>
                  <Button success style={styles.button} onPress={() => returnBook()}>
                      <Text style={[styles.text, {color: 'black'}]}>Confirm</Text>
                  </Button>
                  </Form>
          </Form>
        </Form>
      </Modal>

            <List>
                {data}
            </List>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        alignSelf: 'center',
        marginHorizontal: '5%',
        borderRadius: 50
    },
    text: {
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
})