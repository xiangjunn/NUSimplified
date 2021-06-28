import React from 'react';
import { Container, Tab, Tabs, TabHeading, Icon, Text, DefaultTabBar } from 'native-base';
import DeclareTempScreen from '../screens/DeclareTempScreen';
import TemperatureHistory from '../screens/TemperatureHistory';

const renderTabBar = (props) => {
    props.tabStyle = Object.create(props.tabStyle);
    return <DefaultTabBar {...props} />;
  };

export default function HealthDeclaration() {
    return (
      <Container>
        <Tabs renderTabBar={renderTabBar} locked tabBarUnderlineStyle={{backgroundColor: 'orange'}}>
          <Tab
          heading={
            <TabHeading style={{backgroundColor: '#62B1F6'}}>
                <Icon type='FontAwesome5' name="thermometer-half" style={{color: 'black'}}/>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Declare</Text>
            </TabHeading>}>
            <DeclareTempScreen />
          </Tab>
          <Tab heading={
            <TabHeading style={{backgroundColor: '#62B1F6'}}>
                <Icon type='FontAwesome' name="history" style={{color: 'black'}}/>
                <Text style={{color: 'black', fontWeight: 'bold'}}>History</Text>
            </TabHeading>}>
            <TemperatureHistory />
          </Tab>
        </Tabs>
      </Container>
    );
}