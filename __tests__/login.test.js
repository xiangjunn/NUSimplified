import React from 'react';
import { fireEvent, render, waitFor, cleanup } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../app/screens/LoginScreen';
import LoginAuth from '../app/container/LoginAuth';
import { SAMPLE_EMAIL, SAMPLE_PASSWORD, SAMPLE_EMAIL_UNVERIFIED, SAMPLE_PASSWORD_UNVERIFIED } from '@env'
import { firebase } from '../firebase'

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

describe('Login Test', () => {
    test('renders correctly', () => {
        const tree = render(<LoginScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });  

    test('dialog pops up after clicking forgot password', () => {
        const { getByTestId } = render(<LoginAuth />);
        const button = getByTestId('forgotPassword');
        expect(getByTestId('modal').props.visible).toBe(false);
        fireEvent.press(button);
        expect(getByTestId('modal').props.visible).toBe(true);
    })

    test('navigate to registration screen upon pressing sign up button', () => {
      const { getByTestId } = render(<LoginAuth />);
      const button = getByTestId('signUp');
      fireEvent.press(button);
      expect(mockReplace).toBeCalled();
      expect(mockReplace).toBeCalledWith('Signup');
    })

    test('login with empty email field', async () => {
      const email = '';
      const password = '12345678';
      const { getByTestId, getByPlaceholderText } = render(<LoginAuth />);
      fireEvent.changeText(getByPlaceholderText('Email'), email);
      fireEvent.changeText(getByPlaceholderText('Password'), password);
      const button = getByTestId('login');
      const spy = jest.spyOn(Alert, 'alert');
      fireEvent.press(button)
      await waitFor(() => expect(spy).toBeCalledWith('Email or password is not filled in'))
    })

    test('login with empty password field', async () => {
      const email = SAMPLE_EMAIL;
      const password = '';
      const { getByTestId, getByPlaceholderText } = render(<LoginAuth />);
      fireEvent.changeText(getByPlaceholderText('Email'), email);
      fireEvent.changeText(getByPlaceholderText('Password'), password);
      const button = getByTestId('login');
      const spy = jest.spyOn(Alert, 'alert');
      fireEvent.press(button)
      await waitFor(() => expect(spy).toBeCalledWith('Email or password is not filled in'))
    })

    test('login with non-NUS email', async () => {
      const email = 'notnusemail@gmail.com';
      const password = '12345678';
      const { getByTestId, getByPlaceholderText } = render(<LoginAuth />);
      fireEvent.changeText(getByPlaceholderText('Email'), email);
      fireEvent.changeText(getByPlaceholderText('Password'), password);
      const button = getByTestId('login');
      const spy = jest.spyOn(Alert, 'alert');
      fireEvent.press(button)
      await waitFor(() => expect(spy).toBeCalledWith('This is not a NUS email'))
    })

    test('login with an email that is not registered yet', async () => {
      const email = 'e9999999@u.nus.edu';
      const password = '12345678';
      const { getByTestId, getByPlaceholderText } = render(<LoginAuth />);
      fireEvent.changeText(getByPlaceholderText('Email'), email);
      fireEvent.changeText(getByPlaceholderText('Password'), password);
      const button = getByTestId('login');
      const spy = jest.spyOn(Alert, 'alert');
      fireEvent.press(button)
      await waitFor(() => expect(spy).toBeCalledWith('Email is not registered. Please register an account.'))
    })

    test('login with correct email but wrong password', async () => {
      const email = SAMPLE_EMAIL;
      const password = 'qwertyu';
      const { getByTestId, getByPlaceholderText } = render(<LoginAuth />);
      fireEvent.changeText(getByPlaceholderText('Email'), email);
      fireEvent.changeText(getByPlaceholderText('Password'), password);
      const button = getByTestId('login');
      const spy = jest.spyOn(Alert, 'alert');
      fireEvent.press(button)
      await waitFor(() => expect(spy).toBeCalledWith('The password is invalid'))
    })

    test('login with correct login credentials but email not verified', async () => {
      const email = SAMPLE_EMAIL_UNVERIFIED;
      const password = SAMPLE_PASSWORD_UNVERIFIED.toString();
      const { getByTestId, getByPlaceholderText } = render(<LoginAuth />);
      fireEvent.changeText(getByPlaceholderText('Email'), email);
      fireEvent.changeText(getByPlaceholderText('Password'), password);
      const button = getByTestId('login');
      const spy = jest.spyOn(Alert, 'alert');
      fireEvent.press(button)
      await waitFor(() => expect(spy).toBeCalledWith('Email not verified!'))
    })

    test('login with correct login credentials and email verified', async () => {
      const email = SAMPLE_EMAIL;
      const password = SAMPLE_PASSWORD.toString();
      let loggedIn = false;
      const { getByTestId, getByPlaceholderText } = render(<LoginAuth />);
      fireEvent.changeText(getByPlaceholderText('Email'), email);
      fireEvent.changeText(getByPlaceholderText('Password'), password);
      const button = getByTestId('login');
      const spy = jest.spyOn(Alert, 'alert');
      fireEvent.press(button)
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is logged in.
          loggedIn = true;
        } else {
          loggedIn = false;
        }
      });
      await waitFor(() => {
        expect(spy).not.toBeCalled();
        expect(loggedIn).toBe(false);
      })
    })
});
