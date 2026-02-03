import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';
import PaymentPage from './PaymentPage';

const windowWidth = Dimensions.get('window').width;

const HotelList = ({ hotelList }) => {
  const [hotelImages, setHotelImages] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookedHotels, setBookedHotels] = useState({}); // Track booked hotels

  useEffect(() => {
    // Fetch images for each hotel in hotelList
    const fetchHotelImages = async () => {
      const images = {};
      for (const hotel of hotelList) {
        const imageUrl = await fetchImageFromPixabay(hotel.hotel_name);
        images[hotel.hotel_name] = imageUrl;
      }
      setHotelImages(images);
    };

    fetchHotelImages();
  }, [hotelList]);

  const fetchImageFromPixabay = async (searchTerm) => {
    const apiKey = '44938756-d9d562ffdaf712150c470c59e'; // Pixabay API key
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(searchTerm)}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.hits && data.hits.length > 0) {
        return data.hits[0].webformatURL; // Adjust as per Pixabay API response structure
      } else {
        throw new Error('No images found');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  if (!hotelList || hotelList.length === 0) {
    return (
      <View style={styles.noHotelsContainer}>
        <Text style={styles.noHotelsText}>No hotel details available</Text>
      </View>
    );
  }

  const handlePressHotel = (hotel) => {
    // Handle press action for hotel card, e.g., navigate to hotel details screen
    console.log('Pressed hotel:', hotel);
  };

  const handleBookHotel = (hotel) => {
    setSelectedHotel(hotel);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedHotel) {
      setBookedHotels(prev => ({
        ...prev,
        [selectedHotel.hotel_name]: true
      }));
      Alert.alert('Success', 'Hotel booked successfully!');
    }
  };

  const handleCancelBooking = (hotel) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel your booking?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setBookedHotels(prev => ({
              ...prev,
              [hotel.hotel_name]: false
            }));
            Alert.alert('Success', 'Booking cancelled successfully!');
          },
        },
      ]
    );
  };

  return (
    <>
      <ScrollView
        horizontal
        style={styles.container}
        showsHorizontalScrollIndicator={false}
      >
        {hotelList.map((hotel, index) => (
          <TouchableOpacity
            key={index}
            style={styles.hotelCard}
            onPress={() => handlePressHotel(hotel)}
          >
            <Image
              source={{
                uri:
                  hotelImages[hotel.hotel_name] ||
                  'https://via.placeholder.com/400x300.png?text=Image+Not+Found',
              }}
              style={styles.hotelImage}
            />
            <View style={styles.hotelDetails}>
              <Text style={styles.hotelName} numberOfLines={3}>
                {hotel.hotel_name}
              </Text>
              <Text style={styles.hotelAddress} numberOfLines={2}>
                {hotel.hotel_address}
              </Text>
              <Text style={styles.hotelPrice}>💰 {hotel.price}</Text>
              <Text style={styles.hotelRating}>{hotel.rating} ⭐ </Text>
              <TouchableOpacity
                style={[
                  styles.bookButton,
                  bookedHotels[hotel.hotel_name] && styles.cancelButton
                ]}
                onPress={() => 
                  bookedHotels[hotel.hotel_name] 
                    ? handleCancelBooking(hotel)
                    : handleBookHotel(hotel)
                }
              >
                <Text style={styles.bookButtonText}>
                  {bookedHotels[hotel.hotel_name] ? 'Cancel Booking' : 'Book Now'}
                </Text>
              </TouchableOpacity>
            </View>
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
          <PaymentPage
            hotelDetails={selectedHotel}
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
  hotelCard: {
    backgroundColor: '#fff',
    marginRight: 16, // Add margin to separate hotel cards
    width: windowWidth * 0.7, // Adjust width according to your design needs
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  hotelImage: {
    width: 120, // Adjust the width according to your design needs
    height: '100%', // Maintain aspect ratio
    resizeMode: 'cover',
  },
  hotelDetails: {
    flex: 1,
    padding: 16,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hotelAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  hotelDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  hotelPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  hotelRating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d4af37',
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
  noHotelsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  noHotelsText: {
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

export default HotelList;
