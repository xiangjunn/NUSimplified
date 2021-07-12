import { Container, Item, Input, Text, Icon, Header, ListItem, Form } from 'native-base';
import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../../firebase';
import { searchFilter } from '../../backend/functions';

function AcademicFacilitiesScreen({ route }) {
    const navigation = useNavigation();
    const { location } = route.params;
    const [loading, setLoading] = useState(true);
    const [arrayholder, setArrayholder] = useState([]);
    const [venues, setVenues] = useState([]);
    
    useEffect(() => {
      const subscriber = firebase.firestore()
        .collection(location)
        .onSnapshot(querySnapshot => {
          const arr = []
          querySnapshot.forEach(documentSnapshot => {
            arr.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setArrayholder(arr)
          setVenues(arr);
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
            onChangeText={text => {
              const newData = searchFilter(text, arrayholder, "key")
              setVenues(newData);
            }}  
          />
        </Item>
      </Header>
      <Form>
        <FlatList
    data={venues}
    contentContainerStyle={{ paddingBottom: 300 }}
    renderItem={({ item }) => ( // item represents a venue
    <ListItem
      onPress={() => navigation.navigate('AcademicSlots', {location, venue: item.key})}
      style={{height: 80, marginVertical: 20, marginRight: 10}}
      key={item.key}>
        <Text style={{fontWeight: 'bold', color: '#0645AD', textAlign: 'center', flex: 1}}>{item.key}</Text>
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

export default AcademicFacilitiesScreen;