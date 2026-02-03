import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "../../../constants/Colors";

export default function AdminLogin() {
  const navigation = useNavigation();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  const onAdminLogin = () => {
    if (!username || !password) {
      ToastAndroid.show("Please enter Username and Password", ToastAndroid.LONG);
      return;
    }

    // Check admin credentials
    if (username === 'admin' && password === '123456') {
      router.replace('/admin/dashboard');
    } else {
      ToastAndroid.show("Invalid Admin Credentials", ToastAndroid.LONG);
    }
  }

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 60,
        backgroundColor: "#FFFFFF",
        height: "100%",
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle-outline" size={24} color="black" />
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: "roboto-bold",
          fontSize: 30,
          marginTop: 50,
        }}
      >
        Admin Login
      </Text>

      <Text
        style={{
          fontFamily: "roboto",
          color: Colors.GRAY,
          marginTop: 10,
          marginBottom: 50,
        }}
      >
        Welcome back, Administrator!
      </Text>

      {/* Username Field */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: "roboto" }}>Username</Text>
        <TextInput
          style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 15,
            borderColor: "#a0a0a0",
            fontFamily: "roboto",
          }}
          placeholder="Enter Username"
          placeholderTextColor="#a0a0a0"
          onChangeText={(val) => setUsername(val)}
        />
      </View>

      {/* Password Field */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: "roboto" }}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 15,
            borderColor: "#a0a0a0",
            fontFamily: "roboto",
          }}
          placeholder="Enter Password"
          placeholderTextColor="#a0a0a0"
          onChangeText={(val) => setPassword(val)}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={onAdminLogin}
        style={{
          padding: 20,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 50,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          Login as Admin
        </Text>
      </TouchableOpacity>
    </View>
  );
} 