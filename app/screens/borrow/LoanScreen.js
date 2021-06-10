import { Container, Content, Footer, FooterTab, Button, Text, Icon, Radio, Body, Left, Right, Label, List, ListItem, Thumbnail, Form } from 'native-base';
import React, { useState, useEffect} from 'react';
import { Image, StyleSheet, Modal, View, Alert } from 'react-native';
import { firebase } from '../../../firebase';

export default function LoanScreen() {
    const [data, setData] = useState([]);
    const userId = firebase.auth().currentUser.uid;

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
                  <Button style={styles.button} onPress={() => userReturnBook(temp)}>
                      <Text style={styles.text}>Return</Text>
                  </Button>
                  <Button warning style={styles.button} onPress={() => alert("why always not implemented yet???")}>
                      <Text style={[styles.text, {color: 'black'}]}>Extend</Text>
                  </Button>
                  </Form>
            </Form>
          </ListItem>
        }
        return borrowedBooks; 
    }

    async function userReturnBook(book) {
        await firebase.firestore().collection("users").doc(userId).update({
            borrowedBooks: firebase.firestore.FieldValue.arrayRemove(book)
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
    }
})