import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthStack from './AuthStack';
import RiderTabs from './RiderTabs';
import DriverTabs from './DriverTabs';
import RideFlowStack from './RideFlowStack';

import { useRiderStore } from '../stores/useRiderStore';
import { useDriverStore } from '../stores/useDriverStore';

export default function RootNavigator() {
  const isLoggedIn = true;
  const role: 'rider' | 'driver' = 'rider';

  const riderRide = useRiderStore((s: any) => s.currentRide);
  const driverRide = useDriverStore((s: any) => s.currentRide);

  const hasActiveRide = !!riderRide || !!driverRide;

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <AuthStack />
      ) : hasActiveRide ? (
        <RideFlowStack />
      ) : role === 'rider' ? (
        <RiderTabs />
      ) : (
        <DriverTabs />
      )}
    </NavigationContainer>
  );
}
