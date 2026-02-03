import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const PaymentPage = ({ hotelDetails, onPaymentSuccess, onClose }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  const handlePayment = () => {
    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
      Alert.alert('Error', 'Please fill in all payment details');
      return;
    }

    if (cardNumber.length !== 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return;
    }

    if (cvv.length !== 3) {
      Alert.alert('Error', 'Please enter a valid 3-digit CVV');
      return;
    }

    // In a real app, you would process the payment here
    // For demo purposes, we'll just show success
    Alert.alert(
      'Success',
      'Booking successful! Thank you for your reservation.',
      [
        {
          text: 'OK',
          onPress: () => {
            onPaymentSuccess();
            onClose();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{hotelDetails?.hotel_name}</Text>
        <Text style={styles.price}>Total Amount: {hotelDetails?.price}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Card Holder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter card holder name"
          value={cardHolderName}
          onChangeText={setCardHolderName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChangeText={(text) => setCardNumber(text.replace(/\D/g, '').slice(0, 16))}
          keyboardType="numeric"
          maxLength={16}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.label}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            value={expiryDate}
            onChangeText={setExpiryDate}
            maxLength={5}
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1 }]}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            value={cvv}
            onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  hotelInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default PaymentPage;
