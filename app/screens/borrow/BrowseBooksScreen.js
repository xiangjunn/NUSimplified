import { Container, Content, Footer, FooterTab, Button, Text, Icon, Header, Body, Left, Right, Label, List, ListItem, Thumbnail, Form } from 'native-base';
import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../../firebase';

function BrowseBooksScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    function displayAuthors(authors) {
      const length = authors.length;
      if (length == 0) {
        return; // no author
      }
      if (length == 1) {
        return (<Text>{"Author: " + authors[0]}</Text>)
      } else {
        return (<Text>{"Authors: " + authors[0] + " & " + (length - 1) + " more"}</Text>)
      }
    }
    
    useEffect(() => {
      firebase.firestore().collection('library').get()
        .then(query => {
          setData(query.docs.map(doc => {
            const book = doc.data();
            const id = doc.id;
            return (<ListItem
              onPress={() => navigation.navigate('BookDetails', {book, id})}
              style={{height: 120, marginVertical: 20, marginRight: 10, borderBottomColor: 'grey', borderBottomWidth: 2}}
              thumbnail
              key={doc.id}>
              <Form style={{flex: 3}}>
                <Image style={{resizeMode: 'stretch', flex: 1}} source={{ uri: book.thumbnailUrl }} />
              </Form>
              <Form style={{flex: 10, height: 120, marginLeft: 5}}>
                <Text style={{fontWeight: 'bold', color: '#0645AD'}}>{book.title}</Text>
                {displayAuthors(book.authors)}
                <Text note>{"Number of pages: " + book.pageCount}</Text>
                <Text note numberOfLines={1}>{"Published " + book.publishedDate.$date.split('-')[0]}</Text>
              </Form>
            </ListItem>)}))
            setLoading(false);
        })
      }, []);

    if (loading) {
      return <ActivityIndicator animating={true} size="large" style={{opacity:1}} color="#999999" />
    }


    return (
        <Container >
          <Content>
          <List>
            {data}
          </List>
          </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    selected: {
        color: 'black'
    },
    others: {
        color: 'white'
    }
});

export default BrowseBooksScreen;