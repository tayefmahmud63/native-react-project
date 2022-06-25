import React from 'react';
import { Button, Text, View } from 'react-native';
import { withOAuth } from "aws-amplify-react-native";


function App(props) {
    const {
      oAuthUser,
      googleSignIn,
      signOut,
    } = props;

  return (
    <View>
        <Text>User: {oAuthUser ? JSON.stringify(oAuthUser.attributes) : 'None'}</Text>
        {oAuthUser ? (
            <Button title="Sign Out" onPress={signOut} />
        ) : (
            <>
              
                <Button title="Google" onPress={googleSignIn}  />
            </>
        )}
    </View>
  );
}

export default withOAuth(App);