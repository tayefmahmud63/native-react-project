import * as React from 'react';
import { Button, useTheme } from 'react-native-paper';

function ThemedButton(){
    const {colors} = useTheme();
    return (
        <Button mode='outlined' style={{ borderWidth: 1.2, borderColor: colors.primary, marginTop: 24 }} labelStyle={{marginVertical: 4}}>Sell</Button>
    )
}

export default ThemedButton;