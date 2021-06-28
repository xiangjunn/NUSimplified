import { Container, Content, Text, Form, Card, CardItem } from 'native-base';
import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function TableTennisScreen() {
    const navigation = useNavigation();
    const sport = "tableTennis";
    const name = "Kent Ridge - Multi-purpose Sports Hall 2";

    return (
        <Container >
            <Content>
                <TouchableOpacity onPress={() => navigation.navigate("Slots", {sport, location: "kentRidge", name})}>
                <Card>
                <CardItem cardBody>
                <Image source={require("../../assets/kentridge.jpg")} style={{height: 250, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                    <Text style={{fontWeight: 'bold', fontSize: 15, textAlign: 'center', flex: 1}}>{name}</Text>
                </CardItem>              
                </Card>
                </TouchableOpacity>  
                <Form style={{height: 10}}></Form>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
});

export default TableTennisScreen;