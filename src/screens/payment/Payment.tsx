import React, { useEffect, useState } from 'react';
import { StripeProvider, useConfirmPayment } from '@stripe/stripe-react-native';
import { CardField } from '@stripe/stripe-react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Headline,
  Paragraph,
  useTheme,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import { Screen } from '../../components/Screen';
import { Alert, View } from 'react-native';
import { Title } from '../../components/Title';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getUser, startFreeTrial } from '../../actions/userState';
var Color = require('color');

const publishableKey =
  Config.STRIPE_KEY ||
  'pk_test_51J2sxSA7x9UAPSqCbnfBfSQMl9lk7eWEaR6WOcdR4az9PUzT3VuFNg8akrqpkw0tS6m5JjBGtmjE9CzN6H2uZPN1005IQ4kdp1';

const secretKey =
  'sk_test_51J2sxSA7x9UAPSqCjBcCjmG4V2IFOgnm1Jm6ZFKt8kDv260IOnrjW6vGTWL0G0RFp1AnzAr3W46IXSrXPIMno1Ji001h1AzTCG';

export default function PaymentScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector(state => state.user);
  const [userInfo, setUserInfo] = useState();

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setVisible(false);
    navigation.navigate('App');
  };

  function getStarted() {
    startFreeTrial(userInfo.id);
    showDialog();
  }

  useEffect(() => {
    getUser(user).then(info => {
      setUserInfo(info);
      setIsLoading(false);
      const validTrial = moment(info.startDate).isAfter(
        moment(info.startDate).add(30, 'days'),
      );
    });
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        margin: 16,
        marginTop: 34,
      }}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Success</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Your subscription has been activated!</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Go to home</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {!userInfo.isFreeTrialCompleted && !userInfo.isFreeTrialStarted ? (
        <View>
          <Card>
            <Card.Cover source={require('../../../assets/logo.jpg')} />
            <Card.Content
              style={{ justifyContent: 'center', alignItems: 'center' }}>
              {userInfo.isFreeTrialStarted ? (
                <Title>{`Free trial will expire ${moment(userInfo?.startDate)
                  .add(30, 'days')
                  .fromNow()}`}</Title>
              ) : (
                <Headline>Start your 1 month free trial</Headline>
              )}
              <Paragraph>then 1.99 USD per month.</Paragraph>
            </Card.Content>

            <Card.Actions
              style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Button mode="contained" onPress={getStarted}>
                Subscribe Now
              </Button>
            </Card.Actions>
          </Card>
          <View style={{ marginTop: 12 }}>
            <Title>Explanation:</Title>
            <Paragraph>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
              nesciunt repellat dolorum deserunt, laborum ea nihil. Error
              commodi corrupti officia porro sapiente tempore odio, animi
              obcaecati, quam veniam alias ipsum.
            </Paragraph>
          </View>
        </View>
      ) : (
        <StripeProvider
          publishableKey={publishableKey}
          merchantIdentifier="merchant.identifier">
          <Payment />
        </StripeProvider>
      )}
    </View>
  );
}

// PaymentScreen.ts

function Payment() {
  const [name, setName] = useState();
  const { confirmPayment, loading } = useConfirmPayment();
  const { colors } = useTheme();

  const openPaymentSheet = async () => {
    if (!secretKey) {
      return;
    }

    const { error, paymentIntent } = await confirmPayment(secretKey, {
      type: 'Card',
      billingDetails: { name },
    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else if (paymentIntent) {
      Alert.alert(
        'Success',
        `The payment was confirmed successfully ${paymentIntent.id}`,
      );
    }
  };

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <View>
          <Card>
            <Card.Content style={{ margin: 12 }}>
              <Headline>Subscribe</Headline>
              <Paragraph>
                Your subscription has expired. Please resume using application
                by paying $2 to continue
              </Paragraph>
              <TextInput
                value={name}
                placeholder="Name"
                onChange={e => setName(e.nativeEvent.text)}
                style={{ marginBottom: 8 }}
              />
              <CardField
                postalCodeEnabled={true}
                placeholder={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: colors.surface,
                  textColor: Color(colors.text).hex(),
                  placeholderColor: Color(colors.placeholder).hex(),
                  borderColor: Color(colors.backdrop).hex(),
                }}
                style={{
                  width: '100%',
                  height: 50,
                }}
              />
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                disabled={loading}
                style={{ flex: 1 }}
                onPress={() => openPaymentSheet()}>
                Checkout
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
