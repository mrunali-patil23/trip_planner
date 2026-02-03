import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import moment from 'moment/moment';

const FlightPaymentPage = ({ flightDetails, onPaymentSuccess, onClose }) => {
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
      'Flight booking successful! Your tickets will be sent to your email.',
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
      <Text style={styles.title}>Flight Payment Details</Text>
      
      <View style={styles.flightInfo}>
        <Text style={styles.flightNumber}>Flight {flightDetails?.flight_number}</Text>
        <Text style={styles.airline}>{flightDetails?.airline}</Text>
        <View style={styles.routeInfo}>
          <View style={styles.routeDetail}>
            <Text style={styles.city}>{flightDetails?.departure_city}</Text>
            <Text style={styles.time}>{flightDetails?.departure_time}</Text>
            <Text style={styles.date}>
              {moment(flightDetails?.departure_date).format("MMM Do, YYYY")}
            </Text>
          </View>
          <Text style={styles.arrow}>✈️</Text>
          <View style={styles.routeDetail}>
            <Text style={styles.city}>{flightDetails?.arrival_city}</Text>
            <Text style={styles.time}>{flightDetails?.arrival_time}</Text>
            <Text style={styles.date}>
              {moment(flightDetails?.arrival_date).format("MMM Do, YYYY")}
            </Text>
          </View>
        </View>
        <Text style={styles.price}>Total Amount: {flightDetails?.price}</Text>
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
  flightInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  flightNumber: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  airline: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeDetail: {
    flex: 1,
    alignItems: 'center',
  },
  city: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'right',
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

export default FlightPaymentPage;
