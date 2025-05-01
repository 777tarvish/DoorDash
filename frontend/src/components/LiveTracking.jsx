import React, { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(center);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition({
                    lat: latitude,
                    lng: longitude
                });
            },
            (error) => {
                console.error('Initial geolocation error:', error.message);
            }
        );

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition({
                    lat: latitude,
                    lng: longitude
                });
            },
            (error) => {
                console.error('Watch position error:', error.message);
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        const updatePosition = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Position updated:', latitude, longitude);
                    setCurrentPosition({
                        lat: latitude,
                        lng: longitude
                    });
                },
                (error) => {
                    console.error('Interval geolocation error:', error.message);
                }
            );
        };

        updatePosition(); // Initial position update

        const intervalId = setInterval(updatePosition, 1000); // 1 second interval

        return () => clearInterval(intervalId); // ✅ Cleanup
    }, []);

    return (
        <LoadScript googleMapsApiKey={import.meta.env.GOOGLE_MAPS_API}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
            >
                <Marker position={currentPosition} />
            </GoogleMap>
        </LoadScript>
    );
};

export default LiveTracking; 