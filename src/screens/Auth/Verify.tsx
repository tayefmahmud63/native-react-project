import { Auth } from 'aws-amplify';
import * as React from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Screen } from '../../components/Screen';

function Verify({ route, navigation }) {
    const {username} = route.params;
    const [code, setCode] = React.useState();

    async function confirmSignUp() {
        try {
            await Auth.confirmSignUp(username, code);
            navigation.navigate("SignIn");
        } catch (error) {
            console.log('error confirming sign up', error);
        }
    }
    return (
        <Screen>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {/* <View style={{margin: 12}}> */}
                <TextInput mode='outlined' placeholder='Code' value={code} onChangeText={text => setCode(text)} style={{width: '100%'}} />
                <View style={{ marginVertical: 8, width: '100%' }}>
                    <Button onPress={confirmSignUp} mode="contained" style={{ paddingVertical: 6, borderRadius: 40, width: '100%' }}>Sign Up</Button>
                </View>
            {/* </View> */}
            </View>
        </Screen>
    )
}


export default Verify;