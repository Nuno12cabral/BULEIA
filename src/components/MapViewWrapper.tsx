import React, { useEffect, useRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';

declare global {
  interface Window {
    google: any;
  }
}

// MOBILE: react-native-maps
let MapViewMobile: any = null;
let MarkerMobile: any = null;
let PolylineMobile: any = null;

if (Platform.OS !== 'web') {
  MapViewMobile = require('react-native-maps').default;
  MarkerMobile = require('react-native-maps').Marker;
  PolylineMobile = require('react-native-maps').Polyline;
}

// TYPES
interface Props {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markers?: {
    coordinate: { latitude: number; longitude: number };
    title?: string;
    pinColor?: string;
  }[];
  polylines?: { points: { latitude: number; longitude: number }[] }[];
  style?: any;
}

export default function MapViewWrapper({ initialRegion, markers = [], polylines = [], style }: Props) {
  // WEB VIEW
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const loader = document.createElement('script');
    loader.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    loader.async = true;
    loader.onload = () => {
      const map = new window.google.maps.Map(mapRef.current!, {
        center: { lat: initialRegion.latitude, lng: initialRegion.longitude },
        zoom: 14,
      });

      markers.forEach((m) =>
        new window.google.maps.Marker({
          position: { lat: m.coordinate.latitude, lng: m.coordinate.longitude },
          map,
          title: m.title,
        })
      );

      polylines.forEach((p) => {
        new window.google.maps.Polyline({
          path: p.points.map((pt) => ({
            lat: pt.latitude,
            lng: pt.longitude
          })),
          strokeColor: '#1DB954',
          strokeWeight: 4,
          map,
        });
      });
    };

    document.body.appendChild(loader);
    return () => loader.remove();
  }, [initialRegion, markers, polylines]);

  // MOBILE VIEW
  if (Platform.OS !== 'web') {
    return (
      <MapViewMobile style={style} initialRegion={initialRegion}>
        {markers.map((m, i) => (
          <MarkerMobile
            key={i}
            coordinate={m.coordinate}
            title={m.title}
            pinColor={m.pinColor}
          />
        ))}

        {polylines.map((l, i) => (
          <PolylineMobile
            key={i}
            strokeColor="#1DB954"
            strokeWidth={4}
            coordinates={l.points}
          />
        ))}
      </MapViewMobile>
    );
  }

  return <div ref={mapRef} style={{ ...styles.webMap, ...style }} />;
}

const styles = StyleSheet.create({
  webMap: {
    width: '100%',
    height: '100%',
  },
});
