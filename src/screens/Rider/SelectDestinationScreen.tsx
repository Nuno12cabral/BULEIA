import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

export default function SelectDestinationScreen({ navigation }: any) {
  const GOOGLE_KEY = (Constants.expoConfig?.extra as any)?.GOOGLE_API_KEY || '';

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Para onde vamos?"
        fetchDetails={true}
        onPress={(data, details: any = null) => {
          navigation.navigate('SelectService', {
            destination: {
              lat: details?.geometry.location.lat,
              lng: details?.geometry.location.lng,
              description: data.description
            }
          });
        }}
        query={{
          key: GOOGLE_KEY,
          language: 'pt'
        }}
        styles={{
          container: { flex: 1 },
          listView: { backgroundColor: '#fff' }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 }
});
