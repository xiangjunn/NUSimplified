import { Container, Content, Text, Form, Card, CardItem } from 'native-base';
import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function AcademicBookingScreen() {
    const navigation = useNavigation();

    return (
        <Container >
            <Content>
                <TouchableOpacity onPress={
                    () => navigation.navigate("AcademicFacilities", {location: "educationResourceCentre", name: "Education Resource Centre"})}>
                <Card>
                <CardItem cardBody>
                <Image source={require("../../assets/educationResourceCentre.jpg")} style={{height: 250, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                    <Text style={{fontWeight: 'bold', fontSize: 15, textAlign: 'center', flex: 1}}>Education Resource Centre</Text>
                </CardItem>              
                </Card>
                </TouchableOpacity>  
                <Form style={{height: 10}}></Form>
                <TouchableOpacity onPress={
                    () => navigation.navigate("AcademicFacilities", {location: "stephenRiadyCentre", name: "Stephen Riady Centre"})}>
                <Card>
                <CardItem cardBody>
                <Image source={require("../../assets/stephenRiadyCentre.jpg")} style={{height: 250, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                    <Text style={{fontWeight: 'bold', fontSize: 15, textAlign: 'center', flex: 1}}>Stephen Riady Centre</Text>
                </CardItem>
                </Card>
                </TouchableOpacity>
                <Form style={{height: 10}}></Form>
                <TouchableOpacity onPress={
                    () => navigation.navigate("AcademicFacilities", {location: "townPlaza", name: "Town Plaza"})}>
                <Card>
                <CardItem cardBody>
                <Image source={require("../../assets/townPlaza.jpg")} style={{height: 250, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                    <Text style={{fontWeight: 'bold', fontSize: 15, textAlign: 'center', flex: 1}}>Town Plaza</Text>
                </CardItem>              
                </Card>
                </TouchableOpacity>               
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
});

export default AcademicBookingScreen;