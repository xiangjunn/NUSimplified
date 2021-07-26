import React from 'react';
import { fireEvent, render, waitFor, cleanup, act, unmount } from '@testing-library/react-native';
import DeclareTempScreen from '../app/screens/DeclareTempScreen';
import { SAMPLE_EMAIL, SAMPLE_PASSWORD, SAMPLE_EMAIL_UNVERIFIED, SAMPLE_PASSWORD_UNVERIFIED } from '@env'
import { firebase } from '../firebase'

afterEach(() => {    
  jest.clearAllMocks();
  cleanup();
});


window.addEventListener = jest.fn();
window.attachEvent= jest.fn();

beforeAll((done) => {
    firebase.auth().signInWithEmailAndPassword(SAMPLE_EMAIL, SAMPLE_PASSWORD).then(() => done())
})

describe('Declare Temperature Test', () => {
    test('renders correctly', () => {
        const tree = render(<DeclareTempScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });  

    test('After submitting temperature, there should be a success message', async () => {
        const { getByText } = render(<DeclareTempScreen />);
        const button = getByText('Submit').parent;
        fireEvent.press(button);
        await waitFor(() => expect(getByText('Success!')).toBeDefined());
    })
})

