import { useState, useEffect, useCallback, useRef } from 'react';
import { UserLocationState } from '../types';

const DEFAULT_KOLKATA_COORDS = { lat: 22.5971, lng: 88.3675 }; // Sovabazar Sutanuti Metro

export function useGeolocation() {
  const [state, setState] = useState<UserLocationState>({
    coords: null,
    accuracy: null,
    lastUpdated: null,
    isTracking: false,
    permissionStatus: 'prompt',
    errorMessage: undefined,
  });

  const watchIdRef = useRef<number | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        permissionStatus: 'unavailable',
        errorMessage: 'Geolocation is not supported by your browser.',
        isTracking: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isTracking: true, errorMessage: undefined }));

    const handleSuccess = (pos: GeolocationPosition) => {
      setState({
        coords: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        },
        accuracy: pos.coords.accuracy,
        lastUpdated: pos.timestamp,
        isTracking: true,
        permissionStatus: 'granted',
        errorMessage: undefined,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let status: UserLocationState['permissionStatus'] = 'unavailable';
      let message = 'Unable to determine GPS location.';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          status = 'denied';
          message =
            'Location access was denied. You can still explore using transit hubs or manual pin.';
          break;
        case error.POSITION_UNAVAILABLE:
          status = 'unavailable';
          message = 'Location information is temporarily unavailable.';
          break;
        case error.TIMEOUT:
          status = 'timeout';
          message = 'Location request timed out. Please check GPS signal.';
          break;
      }

      setState((prev) => ({
        ...prev,
        isTracking: false,
        permissionStatus: status,
        errorMessage: message,
      }));
    };

    // First try single fast lookup, then watch
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000,
    });

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 5000,
      }
    );
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState((prev) => ({ ...prev, isTracking: false }));
  }, []);

  const setManualLocation = useCallback((lat: number, lng: number, label?: string) => {
    setState((prev) => ({
      ...prev,
      coords: { lat, lng },
      accuracy: 25,
      lastUpdated: Date.now(),
      isTracking: false,
      permissionStatus: 'granted',
      errorMessage: undefined,
    }));
  }, []);

  // Check initial permission status if Permissions API is available
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permission) => {
          if (permission.state === 'granted') {
            startTracking();
          } else if (permission.state === 'denied') {
            setState((prev) => ({
              ...prev,
              permissionStatus: 'denied',
              coords: DEFAULT_KOLKATA_COORDS,
              errorMessage:
                'Location permission is denied. Using North Kolkata Sovabazar as center.',
            }));
          }
          permission.onchange = () => {
            if (permission.state === 'granted') {
              startTracking();
            } else if (permission.state === 'denied') {
              stopTracking();
              setState((prev) => ({ ...prev, permissionStatus: 'denied' }));
            }
          };
        })
        .catch(() => {
          // Fallback
        });
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [startTracking, stopTracking]);

  return {
    ...state,
    startTracking,
    stopTracking,
    setManualLocation,
    defaultCoords: DEFAULT_KOLKATA_COORDS,
  };
}
