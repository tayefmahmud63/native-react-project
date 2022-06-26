import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import {  Auth, Hub } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../../actions/userState';

function Login({ next }) {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  useEffect(() => {
    if(user){
      dispatch(setUserInfo(user));
      next()
    }
  }, [user])
  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  return (
    <View>
      {user ? (
        <Button title="Sign Out" onPress={() => Auth.signOut()} />
      ) : (
        <Button title="Google Sign In" onPress={() => Auth.federatedSignIn()} />
      )}
    </View>
  );
}

export default Login;