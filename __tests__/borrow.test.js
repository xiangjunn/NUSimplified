import React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import BorrowScreen from '../app/screens/borrow/BorrowScreen';

afterEach(() => {    
  jest.clearAllMocks();
  cleanup();
});

const mockReplace = jest.fn();
jest.mock("@react-navigation/native", () => {
    const actualNav = jest.requireActual("@react-navigation/native");
    return {
      ...actualNav,
      useNavigation: () => ({
        navigate: jest.fn(),
        replace: mockReplace,
        dispatch: jest.fn(),
      }),
    };
});

window.addEventListener = jest.fn();
window.attachEvent= jest.fn();

describe('Borrow Test', () => {
    test('renders correctly', () => {
        const tree = render(<BorrowScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });  
});