// src/navigation/RiderTabs.tsx
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/Rider/HomeScreen';
import RideHistoryScreen from '/screens/Rider/RideHistoryScreen';
import RiderProfileScreen from '/screens/Rider/RiderProfileScreen';


const Tab = createBottomTabNavigator();

export default function RiderTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Histórico" component={RideHistoryScreen} />
      <Tab.Screen name="Perfil" component={RiderProfileScreen} />
    </Tab.Navigator>
  );
}
