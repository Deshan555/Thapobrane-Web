import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const center = {
  lat: 7.2905715, // default latitude
  lng: 80.6337262, // default longitude
};

const MapGoogle = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBNDzWTsrfkC0bKKx7Nh7LKvYJ6WGK3Qu4',
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
<div style={{ width: '100%', height: '100%', borderRadius: '50px' }}>
  <GoogleMap
    mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '50px' }}
    zoom={10}
    center={center}
  >
    <Marker position={center} />
  </GoogleMap>
</div>

  );
};

export default MapGoogle;