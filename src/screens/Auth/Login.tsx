import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { Auth, Hub } from 'aws-amplify';
import * as React from 'react';
import { Image, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { Screen } from '../../components/Screen';

function Login({ navigation }) {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        Hub.listen('auth', ({ payload: { event, data } }) => {
          switch (event) {
            case 'signIn':
            case 'cognitoHostedUI':
              getUser().then(userData => setUser(userData));
              navigation.navigate("App");
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

      function getUser() {
        return Auth.currentAuthenticatedUser()
          .then(userData => userData)
          .catch(() => console.log('Not signed in'));
      }
    
    return (
        <Screen>
            <View style={{ flex: 1, justifyContent: "space-around", alignItems: "center", marginVertical: 24 }}>
                <View>
                    <Image source={require('../../assets/Images/brand.png')} style={{ width: 360, height: 120 }} />
                </View>
                <View>
                    <View style={{ margin: 8 }}>
                        <Button mode="contained" uppercase={false} style={{ paddingVertical: 6, borderRadius: 40, width: 400 }} onPress={() => navigation.navigate("SignUp")}>Continue with Email</Button>
                    </View>
                    <View style={{ margin: 8 }}>
                        <Button mode="contained" uppercase={false} style={{ paddingVertical: 6, borderRadius: 40, width: 400 }} onPress={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })}>Continue with Google</Button>
                    </View>
                    <View style={{ margin: 8 }}>
                        <Button mode="contained" uppercase={false} style={{ paddingVertical: 6, borderRadius: 40, width: 400 }}>Continue Wallet</Button>
                    </View>
                </View>
                <Divider/>
                <View style={{ margin: 8 }}>
                    <Text style={{textAlign: 'center', marginVertical: 8}}>Already have an account ?</Text>
                    <Button mode="contained" uppercase={false} style={{ paddingVertical: 6, borderRadius: 40, width: 400 }} onPress={() => navigation.navigate("SignIn")}>Login</Button>
                </View>
            </View>
        </Screen>
    )
}

export default Login;