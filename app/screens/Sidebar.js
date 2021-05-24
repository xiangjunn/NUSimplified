import { Content, Form, Item, Input, Icon, Button, Label, Text} from 'native-base';
import React from 'react';
import { useNavigation } from '@react-navigation/native'

function Sidebar() {
    const navigation = useNavigation();
    return(
        <Form style={{borderColor: 'red', borderRadius: 1}}>
            <Label style={{color: 'red'}}>HELO</Label>
            <Button onPress={() => navigation.replace('Login')}>
                <Text>BAKANA</Text>
            </Button>
        </Form>
    )
}

export default Sidebar