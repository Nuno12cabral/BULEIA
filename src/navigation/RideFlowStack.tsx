// src/navigation/RideFlowStack.tsx
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WaitingDriverScreen from '/screens/Rider/WaitingDriverScreen';
import DriverOnWayScreen from '/screens/Rider/DriverOnWayScreen';
import InRideScreen from '/screens/Rider/InRideScreen';
import RideCompletedScreen from '/screens/Rider/RideCompletedScreen';
import RideRatingScreen from '/screens/Rider/RideRatingScreen';

const Stack = createNativeStackNavigator();

export default function RideFlowStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WaitingDriver" component={WaitingDriverScreen} />
      <Stack.Screen name="DriverOnWay" component={DriverOnWayScreen} />
      <Stack.Screen name="InRide" component={InRideScreen} />
      <Stack.Screen name="RideCompleted" component={RideCompletedScreen} />
      <Stack.Screen name="RideRating" component={RideRatingScreen} />
    </Stack.Navigator>
  );
}
