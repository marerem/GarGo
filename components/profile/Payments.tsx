import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import client from "@/lib/backend/client"; // Import the Appwrite client

const Payments = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await client.call(
        'post',
        '/functions/stripe-payment/executions', // Call the Appwrite function
        {
          data: {
            amount: 5000, // Amount in cents ($50.00)
            email: 'user@example.com', // Replace with the authenticated user's email
          },
        }
      );

      if (response.error) {
        throw new Error(response.error);
      }

      return response;
    } catch (error) {
      console.error('Error fetching PaymentSheet params:', error);
      throw new Error('Unable to process payment');
    }
  };

  const initializePaymentSheet = async () => {
    setLoading(true);

    try {
      const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'CarGo Relay',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true, // Enable methods like SEPA or Sofort
      });

      if (!error) {
        setPaymentReady(true);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    if (!paymentReady) return;

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your payment is confirmed!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Stripe PaymentSheet</Text>
      {loading && <ActivityIndicator size="large" />}
      <Button
        title={paymentReady ? 'Pay Now' : 'Initializing Payment...'}
        onPress={openPaymentSheet}
        disabled={!paymentReady}
      />
    </View>
  );
};

export default Payments;
