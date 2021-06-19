import { Container, Content, Footer, FooterTab, Button, Text, Form, Card, CardItem } from 'native-base';
import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function TennisScreen() {
    const navigation = useNavigation();
    const sport = "tennis";
    const name = "Kent Ridge - Outdoor Tennis Courts";

    return (
        <Container >
            <Content>
                <TouchableOpacity onPress={() => navigation.navigate("Slots", {sport, location: "kentRidge", name})}>
                <Card>
                <CardItem cardBody>
                <Image source={require("../../assets/kentridgeTennis.jpg")} style={{height: 250, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                    <Text style={{fontWeight: 'bold', fontSize: 15, textAlign: 'center', flex: 1}}>{name}</Text>
                </CardItem>              
                </Card>
                </TouchableOpacity>  
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
});

export default TennisScreen;