import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import { useRouter } from 'expo-router';

// Function to fetch image URL from Pixabay
const fetchImageUrl = async (query) => {
  const apiKey = '44938756-d9d562ffdaf712150c470c59e'; // Pixabay API key
  try {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
      },
    });
    return response.data.hits[0]?.largeImageURL || null;
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error);
    return null;
  }
};

const UserTripCard = ({ trip, onDelete }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const router = useRouter();

  if (!trip) {
    console.error('Trip data is missing');
    return null;
  }

  let tripData;

  // Safely parse tripData
  try {
    tripData = typeof trip.tripData === 'string' ? JSON.parse(trip.tripData) : trip.tripData;
  } catch (error) {
    console.error('Failed to parse trip data:', error);
    return null;
  }

  useEffect(() => {
    const fetchPhoto = async () => {
      if (tripData?.locationInfo?.name) {
        const url = await fetchImageUrl(tripData.locationInfo.name.trim());
        setPhotoUrl(url);
      }
    };
    fetchPhoto();
  }, [tripData?.locationInfo?.name]);

  const handlePress = () => {
    console.log("Trip data before navigation:", JSON.stringify(trip, null, 2));
    router.push({
      pathname: '/trip-detail',
      params: { trip: JSON.stringify(trip) }
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => onDelete(trip),
          style: 'destructive',
        },
      ]
    );
  };

  if (!tripData || !tripData.locationInfo) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
      <Image
        source={photoUrl ? { uri: photoUrl } : require('./../../assets/images/pl.jpg')}
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardLocation}>
          🌍 {tripData.locationInfo.name.trim()}
        </Text>
        <Text style={styles.cardDate}>
          📅 {moment(trip.startDate).format('MMM Do YYYY')} - {moment(trip.endDate).format('MMM Do YYYY')}
        </Text>
        <Text style={styles.cardBudget}>
          💸 Budget: {tripData.budget}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>See Your Plans</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 16,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardInfo: {
    padding: 16,
  },
  cardLocation: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDate: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  cardBudget: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserTripCard;