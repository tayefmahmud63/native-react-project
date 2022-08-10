import { Auth } from 'aws-amplify';
import * as React from 'react';
import { Alert, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Screen } from '../../components/Screen';


function SignIn({ navigation }) {
    const [email, setEmail] = React.useState()
    const [password, setPassword] = React.useState()
    const [loading, setLoading] = React.useState(false);
    async function signIn() {
        try {
            setLoading(true)
            const user = await Auth.signIn(email, password);
            console.log(user);
            setLoading(false);
            navigation.navigate("App");
        } catch (error) {
            setLoading(false)
            console.log('error signing in', error);
            if(error.message == "Incorrect username or password."){
                Alert.alert("Error Signing In", "Incorrect username or password.");
            } else {
                Alert.alert("Error Signing In", JSON.stringify(error));
            }
        }
    }
    return (
        <Screen>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 12}}>
                    <TextInput
                        label="Email"
                        mode='outlined'
                        value={email}
                        style={{ marginVertical: 4, width: '100%' }}
                        onChangeText={text => setEmail(text)}
                    />
                    <TextInput
                        label="Password"
                        mode='outlined'
                        value={password}
                        secureTextEntry={true}
                        style={{ marginVertical: 4, width: '100%' }}
                        onChangeText={text => setPassword(text)}
                    />
                    <View style={{ marginVertical: 8, width: '100%' }}>
                        <Button onPress={signIn} mode="contained" loading={loading} style={{ paddingVertical: 6, borderRadius: 40, width: '100%' }}>Login</Button>
                    </View>
                    <View style={{ marginVertical: 8, width: '100%' }}>
                        <Button onPress={() => navigation.navigate("SignUp")} mode="contained" style={{ paddingVertical: 6, borderRadius: 40, width: '100%' }}>Sign Up</Button>
                    </View>
            </View>
        </Screen>
    )
}

export default SignIn;