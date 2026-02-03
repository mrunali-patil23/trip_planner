import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../../configs/firebaseConfig';
import { Colors } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ToastAndroid } from 'react-native';

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, 'UserTrips'));
      const uniqueUsers = new Set();
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.userEmail) {
          uniqueUsers.add(userData.userEmail);
        }
      });
      setUsers(Array.from(uniqueUsers));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (email) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete user ${email}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setLoading(true);
            try {
              // Get all trips for this user
              const q = query(collection(db, 'UserTrips'), where('userEmail', '==', email));
              const querySnapshot = await getDocs(q);
              
              // Delete all trips for this user
              const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
              await Promise.all(deletePromises);
              
              // Update the users list
              setUsers(users.filter(user => user !== email));
              ToastAndroid.show('User deleted successfully', ToastAndroid.SHORT);
            } catch (error) {
              console.error('Error deleting user:', error);
              ToastAndroid.show('Error deleting user', ToastAndroid.SHORT);
            }
            setLoading(false);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = () => {
    router.replace('/auth/admin-login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>User List</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        <ScrollView style={styles.userList}>
          {users.map((email, index) => (
            <View key={index} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Ionicons name="person-circle-outline" size={24} color={Colors.PRIMARY} />
                <Text style={styles.userEmail}>{email}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleDeleteUser(email)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
  },
  logoutButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontFamily: 'outfit',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    fontFamily: 'outfit',
    color: Colors.GRAY,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    marginBottom: 15,
  },
  userList: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'outfit',
    marginLeft: 10,
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
}); 