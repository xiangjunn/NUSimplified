import { Container, Content, Footer, FooterTab, Button, Text, Form, Card, CardItem } from 'native-base';
import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function SquashScreen() {
    const navigation = useNavigation();
    const sport = "squash";

    return (
        <Container >
            <Content>
                <TouchableOpacity onPress={() => navigation.navigate("Slots", {sport, location: "uTown", name: "UTown - Sports Hall 1"})}>
                <Card>
                <CardItem cardBody>
                <Image source={require("../../assets/utown.jpg")} style={{height: 250, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                    <Text style={{fontWeight: 'bold', fontSize: 15, textAlign: 'center', flex: 1}}>UTown - Sports Hall 1</Text>
                </CardItem>              
                </Card>
                </TouchableOpacity>  
                <Form style={{height: 10}}></Form>
                <Card>
                <TouchableOpacity onPress={() => navigation.navigate("Slots", {sport, location: "kentRidge", name: "Kent Ridge - MPSH 5"})}>
                <CardItem cardBody>
                <Image source={require("../../assets/kentridge.jpg")} style={{height: 250, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                    <Text style={{fontWeight: 'bold', fontSize: 15, textAlign: 'center', flex: 1}}>Kent Ridge - MPSH 5</Text>
                </CardItem>
                </TouchableOpacity>             
            </Card>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
});

export default SquashScreen;