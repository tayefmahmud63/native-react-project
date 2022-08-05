import * as React from 'react';
import { Button, TextInput } from 'react-native-paper';
import { Screen } from '../../components/Screen';
import { Auth } from 'aws-amplify';
import { Alert, View } from 'react-native';


function SignUp({ navigation }) {

    const [email, setEmail] = React.useState()
    const [firstName, setFirstName] = React.useState()
    const [lastName, setLastName] = React.useState()
    const [password, setPassword] = React.useState()

    async function signUp() {
        try {
            const { user } = await Auth.signUp({
                username: email,
                password,
                name: firstName,
                attributes: {
                    email,          // optional
                    name: firstName
                    // 'custom:firstname': firstName,
                    // 'custom:lastname':lastName
                    // other custom attributes 
                }
            });
            console.log(user);
            navigation.navigate("Verify", {username: email});
        } catch (error) {
            console.log(JSON.stringify(error));
            console.log('error signing up:', error);
            if(error.code === 'UsernameExistsException'){
                Alert.alert("Error Signing Up", "User Already Exists");
            } else {
                Alert.alert("Error Signing Up", JSON.stringify(error.code));
            }
        }
    }

    return (
        <Screen>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 12 }}>
                <TextInput
                    mode='outlined'
                    label="First Name"
                    value={firstName}
                    onChangeText={text => setFirstName(text)}
                    style={{width: '100%', marginVertical: 8}}
                />
                <TextInput
                    mode='outlined'
                    label="Last Name"
                    value={lastName}
                    onChangeText={text => setLastName(text)}
                    style={{width: '100%', marginVertical: 8}}
                />
                <TextInput
                    mode='outlined'
                    label="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={{width: '100%', marginVertical: 8}}
                />
                <TextInput
                    mode='outlined'
                    label="Password"
                    value={password}
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)}
                    style={{width: '100%', marginVertical: 8}}
                />
                <View style={{ marginVertical: 12, width: '100%' }}>
                    <Button mode='contained' uppercase={false} style={{paddingVertical: 6, borderRadius: 40, width: '100%' }} onPress={signUp}>Sign Up</Button>
                </View>
            </View>
        </Screen>
    )
}

export default SignUp;