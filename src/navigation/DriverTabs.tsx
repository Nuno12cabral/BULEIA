// src/navigation/DriverTabs.tsx
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DriverRideManagementScreen from '/screens/Driver/DriverRideManagementScreen';
import DriverEarningsScreen from '/screens/Driver/DriverEarningsScreen';
import DriverProfileScreen from '/screens/Driver/DriverProfileScreen';

const Tab = createBottomTabNavigator();

export default function DriverTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Corridas"
        component={DriverRideManagementScreen}
      />
      <Tab.Screen
        name="Ganhos"
        component={DriverEarningsScreen}
      />
      <Tab.Screen
        name="Perfil"
        component={DriverProfileScreen}
      />
    </Tab.Navigator>
  );
}
