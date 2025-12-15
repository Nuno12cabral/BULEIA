import * as Location from 'expo-location';
import { Coordinates } from '../types/driver';


export async function requestForegroundPermission() {
const { status } = await Location.requestForegroundPermissionsAsync();
return status === 'granted';
}


export async function getCurrentLocation(): Promise<Coordinates | null> {
try {
const granted = await requestForegroundPermission();
if (!granted) return null;
const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
} catch (err) {
console.warn('getCurrentLocation error', err);
return null;
}
}


export function watchLocation(onChange: (c: Coordinates) => void) {
let sub: Location.LocationSubscription | null = null;
(async () => {
const granted = await requestForegroundPermission();
if (!granted) return;
sub = await Location.watchPositionAsync(
{ accuracy: Location.Accuracy.Highest, distanceInterval: 5, timeInterval: 3000 },
(loc) => onChange({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
);
})();


return async () => {
if (sub) sub.remove();
};
}