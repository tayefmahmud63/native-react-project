import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { Button, Card, Paragraph, useTheme } from 'react-native-paper';
import { Screen } from '../../components/Screen';
import { View } from 'react-native';
import { Title } from '../../components/Title';
import Config from 'react-native-config';
var Color = require('color');

const publishableKey = Config.STRIPE_KEY;

export default function PaymentScreen() {
    return (
        <StripeProvider
            publishableKey={publishableKey}
            merchantIdentifier="merchant.identifier"
        >
            <Payment />
        </StripeProvider>
    );
}

// PaymentScreen.ts

function Payment() {
    const { confirmPayment } = useStripe();
    const { colors } = useTheme();

    return (
        <Screen>
            <View style={{ justifyContent: "center", alignItems: 'center', flex: 1 }}>
                <View style={{ height: 200 }}>
                    <Card>
                        <Card.Content>
                            <Title>Subscription</Title>
                            <Paragraph>Subscriptions will enable new features</Paragraph>
                        </Card.Content>
                        <View style={{ margin: 12 }}>
                            <CardField
                                postalCodeEnabled={true}
                                placeholder={{
                                    number: '4242 4242 4242 4242',
                                }}
                                cardStyle={{
                                    backgroundColor: colors.surface,
                                    textColor: Color(colors.text).hex(),
                                    placeholderColor: Color(colors.placeholder).hex(),
                                    borderColor: Color(colors.backdrop).hex()
                                }}
                                style={{
                                    width: '100%',
                                    height: 50,
                                }}
                                onCardChange={(cardDetails) => {
                                    console.log('cardDetails', cardDetails);
                                }}
                                onFocus={(focusedField) => {
                                    console.log('focusField', focusedField);
                                }}
                            />
                        </View>
                    </Card>
                </View>
            </View>

        </Screen>
    );
}