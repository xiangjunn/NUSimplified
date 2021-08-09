import React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import BusArrivalScreen from '../app/screens/BusArrivalScreen';

afterEach(() => {    
  jest.clearAllMocks();
  cleanup();
});

describe('Bus arrival Test', () => {
    test('renders correctly', () => {
        const tree = render(<BusArrivalScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });  
});