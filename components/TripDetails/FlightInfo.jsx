import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal, Alert } from 'react-native';
import moment from 'moment/moment';
import FlightPaymentPage from './FlightPaymentPage';

const windowWidth = Dimensions.get('window').width;

const FlightInfo = ({ flightData }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookedFlights, setBookedFlights] = useState({}); // Track booked flights

  const handlePressFlight = (flight) => {
    console.log('Pressed flight:', flight);
  };

  const handleBookFlight = (flight) => {
    setSelectedFlight(flight);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedFlight) {
      setBookedFlights(prev => ({
        ...prev,
        [selectedFlight.flight_number]: true
      }));
      Alert.alert('Success', 'Flight booked successfully!');
    }
  };

  const handleCancelBooking = (flight) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel your flight booking?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setBookedFlights(prev => ({
              ...prev,
              [flight.flight_number]: false
            }));
            Alert.alert('Success', 'Flight booking cancelled successfully!');
          },
        },
      ]
    );
  };

  if (!flightData || flightData.length === 0) {
    return (
      <View style={styles.noFlightsContainer}>
        <Text style={styles.noFlightsText}>No flight details available</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        horizontal
        style={styles.container}
        showsHorizontalScrollIndicator={false}
      >
        {flightData.map((flight, index) => (
          <TouchableOpacity
            key={index}
            style={styles.flightCard}
            onPress={() => handlePressFlight(flight)}
          >
            <Text style={styles.flightText}>Flight Number: {flight.flight_number}</Text>
            <Text style={styles.flightText}>Airline: {flight.airline}</Text>
            <Text style={styles.flightText}>Departure: {flight.departure_city} at {flight.departure_time} on {moment(flight.departure_date).format("MMM Do, YYYY")}</Text>
            <Text style={styles.flightText}>Arrival: {flight.arrival_city} at {flight.arrival_time} on {moment(flight.arrival_date).format("MMM Do, YYYY")}</Text>
            <Text style={styles.flightText}>Price: {flight.price}</Text>
            <TouchableOpacity
              style={[
                styles.bookButton,
                bookedFlights[flight.flight_number] && styles.cancelButton
              ]}
              onPress={() => 
                bookedFlights[flight.flight_number]
                  ? handleCancelBooking(flight)
                  : handleBookFlight(flight)
              }
            >
              <Text style={styles.bookButtonText}>
                {bookedFlights[flight.flight_number] ? 'Cancel Booking' : 'Book Now'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={showPayment}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPayment(false)}
      >
        <View style={styles.modalContainer}>
          <FlightPaymentPage
            flightDetails={selectedFlight}
            onPaymentSuccess={handlePaymentSuccess}
            onClose={() => setShowPayment(false)}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16, // Add horizontal padding to avoid content touching edges
  },
  flightCard: {
    backgroundColor: '#fff',
    marginRight: 16, // Add margin to separate flight cards
    width: windowWidth * 0.7, // Adjust width according to your design needs
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    padding: 16,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  flightText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  bookButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  noFlightsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  noFlightsText: {
    fontSize: 16,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
});

export default FlightInfo;
