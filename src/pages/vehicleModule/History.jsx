import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const History = () => {
  const mapStyles = {
    height: "100vh",
    width: "100%",
    borderRadius: "10px"
  };

  const defaultCenter = {
    lat: 40.7128,
    lng: -74.0060
  };

  return (
    // <LoadScript
    //   googleMapsApiKey="AIzaSyD5EKIlo4bRStD4EzFKd5X405aCoN6dRtw"
    // >
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={10}
        center={defaultCenter}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    // </LoadScript>
  );
};

export default History;
