import React, { useEffect } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import {
    Button,
    Card,
    Headline,
    Paragraph,
    useTheme,
} from "react-native-paper";
import { Screen } from "../../components/Screen";
import { View } from "react-native";
import { Title } from "../../components/Title";
import Config from "react-native-config";
var Color = require("color");

const publishableKey =
    Config.STRIPE_KEY ||
    'pk_test_51J2sxSA7x9UAPSqCbnfBfSQMl9lk7eWEaR6WOcdR4az9PUzT3VuFNg8akrqpkw0tS6m5JjBGtmjE9CzN6H2uZPN1005IQ4kdp1';

export default function PaymentScreen() {
    return (
        <View style={{ flex: 1, margin: 12 }}>
            <Card>
                <Card.Cover source={require("../../../assets/logo.jpg")} />
                <Card.Content
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <Headline>Start your 1 month free trial</Headline>
                    <Paragraph>then 1.99 USD per month.</Paragraph>
                </Card.Content>

                <Card.Actions
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <Button mode="contained">Subscribe Now</Button>
                </Card.Actions>
            </Card>

            <StripeProvider
                publishableKey={publishableKey}
                merchantIdentifier="merchant.identifier"
            >
                <Payment />
            </StripeProvider>
            <View>
                <Title>Explanation:</Title>
                <Paragraph>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed nesciunt
                    repellat dolorum deserunt, laborum ea nihil. Error commodi corrupti
                    officia porro sapiente tempore odio, animi obcaecati, quam veniam
                    alias ipsum.
                </Paragraph>
            </View>
        </View>
    );
}

// PaymentScreen.ts

function Payment() {
    const { confirmPayment } = useStripe();
    const { colors } = useTheme();

    return (
        <Screen>
            <View style={{ flex: 1 }}>
                <View>
                    <Card>
                        <View style={{ margin: 12 }}>
                            <CardField
                                postalCodeEnabled={true}
                                placeholder={{
                                    number: "4242 4242 4242 4242",
                                }}
                                cardStyle={{
                                    backgroundColor: colors.surface,
                                    textColor: Color(colors.text).hex(),
                                    placeholderColor: Color(colors.placeholder).hex(),
                                    borderColor: Color(colors.backdrop).hex(),
                                }}
                                style={{
                                    width: "100%",
                                    height: 50,
                                }}
                                onCardChange={(cardDetails) => {
                                    console.log("cardDetails", cardDetails);
                                }}
                                onFocus={(focusedField) => {
                                    console.log("focusField", focusedField);
                                }}
                            />
                        </View>
                    </Card>
                </View>
            </View>
        </Screen>
    );
}
