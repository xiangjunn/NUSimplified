import { Container, Item, Input, Text, Icon, Header, Body, Left, Right, Label, List, ListItem, Thumbnail, Form } from 'native-base';
import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../../firebase';

function BrowseBooksScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [arrayholder, setArrayholder] = useState([]);
    const [books, setBooks] = useState([]);

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

    function searchFilterFunction(text) {   
      const newData = arrayholder.filter(item => {      
        const title = item.title.toUpperCase();
        const textData = text.toUpperCase();
        return title.indexOf(textData) > -1;
        });   
      setBooks(newData); 
    };
    
    useEffect(() => {
      const subscriber = firebase.firestore()
        .collection('library')
        .onSnapshot(querySnapshot => {
          const arr = []
          querySnapshot.forEach(documentSnapshot => {
            arr.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setArrayholder(arr)
          setBooks(arr);
          setLoading(false);
        });
    
      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }, []);

    if (loading) {
      return <ActivityIndicator animating={true} size="large" style={{opacity:1}} color="#999999" />
    }


    return (
      <Container>
      <Header noShadow androidStatusBarColor='#62B1F6' style={{backgroundColor: 'transparent'}}>
      <Item style={{flex: 1}}>
          <Icon name="ios-search" />
          <Input
            placeholder="Search"
            onChangeText={text => searchFilterFunction(text)}  
          />
        </Item>
      </Header>
      <Form>
        <FlatList
    data={books}
    renderItem={({ item }) => ( // item represents a book
    <ListItem
      onPress={() => navigation.navigate('BookDetails', {book: item, id: item.key})}
      style={{height: 120, marginVertical: 20, marginRight: 10, borderBottomColor: 'grey', borderBottomWidth: 2}}
      thumbnail
      key={item.key}>
      <Form style={{flex: 3}}>
        <Image style={{resizeMode: 'stretch', flex: 1, borderWidth: 2, borderColor: 'rgba(0,0,0,0.2)'}} source={{ uri: item.thumbnailUrl }} />
      </Form>
      <Form style={{flex: 10, height: 120, marginLeft: 5}}>
        <Text style={{fontWeight: 'bold', color: '#0645AD'}}>{item.title}</Text>
        {displayAuthors(item.authors)}
        <Text note>{"Number of pages: " + item.pageCount}</Text>
        <Text note numberOfLines={1}>{"Published " + item.publishedDate.$date.split('-')[0]}</Text>
      </Form>
    </ListItem>)}
  />
  </Form>
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