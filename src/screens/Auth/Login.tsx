import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { Auth, Hub } from 'aws-amplify';
import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Divider, Text, useTheme } from 'react-native-paper';
import { Screen } from '../../components/Screen';
import { width } from '../../utils/constants';

function Login({ navigation }) {
  const [user, setUser] = React.useState(null);
  const { colors } = useTheme();

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
      <View style={{ flex: 1, justifyContent: "space-around", alignItems: "center", marginVertical: 24, marginHorizontal: 24 }}>
        <Image source={require('../../assets/Images/brand.png')} style={{ width: '100%', height: 120 }} />
        <View>
          <View style={styles.buttonContainer}>
            <Button mode="contained" uppercase={false} style={styles.button} onPress={() => navigation.navigate("SignUp")}>Continue with Email</Button>
          </View>
          <View style={styles.buttonContainer}>
            <Button mode="outlined" uppercase={false} style={[styles.button, styles.outlined]} labelStyle={{ color: colors.text }} onPress={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })}>Continue with Google</Button>
          </View>
          <View style={styles.buttonContainer}>
            <Button mode="outlined" uppercase={false} style={[styles.button, styles.outlined]} labelStyle={{ color: colors.text }}>Continue Wallet</Button>
          </View>
        </View>
        <Divider style={{ width: '90%', padding: 1 }} />
        <View style={styles.buttonContainer}>
          <Text style={{ textAlign: 'center', marginVertical: 8 }}>Already have an account ?</Text>
          <Button mode="outlined" uppercase={false} style={[styles.button, styles.outlined]} labelStyle={{ color: colors.text }} onPress={() => navigation.navigate("SignIn")}>Login</Button>
        </View>
      </View>
    </Screen>
  )
}

export default Login;

const styles = StyleSheet.create({
  button: { paddingVertical: 6, borderRadius: 40, minWidth: '100%' },
  outlined: { borderWidth: 2 },
  buttonContainer: { marginVertical: 8 }
})