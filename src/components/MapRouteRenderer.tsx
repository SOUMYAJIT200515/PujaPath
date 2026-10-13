import React, { useEffect, useState } from 'react';
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

declare const google: any;

interface MapRouteRendererProps {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  waypoints?: { lat: number; lng: number }[];
  travelMode?: 'WALKING' | 'TRANSIT' | 'DRIVING';
  strokeColor?: string;
}

export const MapRouteRenderer: React.FC<MapRouteRendererProps> = ({
  origin,
  destination,
  waypoints = [],
  travelMode = 'WALKING',
  strokeColor = '#DC2626',
}) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const [polyline, setPolyline] = useState<any | null>(null);

  useEffect(() => {
    if (!map || !origin || !destination) {
      if (polyline) {
        polyline.setMap(null);
        setPolyline(null);
      }
      return;
    }

    // Cleanup previous polyline
    if (polyline) {
      polyline.setMap(null);
    }

    if (!routesLib) {
      // Fallback: draw straight geodesic polyline while SDK routes is loading
      const simplePath = [origin, ...waypoints, destination];
      const fallbackLine = new google.maps.Polyline({
        path: simplePath,
        geodesic: true,
        strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map,
      });
      setPolyline(fallbackLine);
      return;
    }

    try {
      const routeService = new routesLib.Route();

      // Map travel mode enum
      let sdkTravelMode = routesLib.TravelMode.WALKING;
      if (travelMode === 'TRANSIT') {
        sdkTravelMode = routesLib.TravelMode.TRANSIT;
      } else if (travelMode === 'DRIVING') {
        sdkTravelMode = routesLib.TravelMode.DRIVING;
      }

      const intermediates = waypoints.map((pt) => ({
        location: { latLng: { lat: pt.lat, lng: pt.lng } },
      }));

      const request: any = {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: sdkTravelMode,
        intermediates: intermediates.length > 0 ? intermediates : undefined,
        fields: ['polyline', 'viewport', 'distanceMeters', 'duration'],
      };

      routeService
        .computeRoutes(request)
        .then((response: any) => {
          if (response?.routes && response.routes.length > 0) {
            const primaryRoute = response.routes[0];
            if (primaryRoute.polyline?.encodedPolyline) {
              const decodedPath = routesLib.Route.decode(
                primaryRoute.polyline.encodedPolyline
              );

              const newLine = new google.maps.Polyline({
                path: decodedPath,
                geodesic: true,
                strokeColor,
                strokeOpacity: 0.9,
                strokeWeight: 5,
                map,
              });
              setPolyline(newLine);

              if (primaryRoute.viewport) {
                const bounds = new google.maps.LatLngBounds(
                  primaryRoute.viewport.southwest,
                  primaryRoute.viewport.northeast
                );
                map.fitBounds(bounds, 50);
              }
              return;
            }
          }

          // Fallback to coordinates path if route response didn't contain encodedPolyline
          const fallbackPath = [origin, ...waypoints, destination];
          const newLine = new google.maps.Polyline({
            path: fallbackPath,
            geodesic: true,
            strokeColor,
            strokeOpacity: 0.85,
            strokeWeight: 4,
            map,
          });
          setPolyline(newLine);
        })
        .catch((err: any) => {
          // If Routes API fails or restricted, render reliable direct polyline
          const fallbackPath = [origin, ...waypoints, destination];
          const newLine = new google.maps.Polyline({
            path: fallbackPath,
            geodesic: true,
            strokeColor,
            strokeOpacity: 0.85,
            strokeWeight: 4,
            map,
          });
          setPolyline(newLine);
        });
    } catch (e) {
      const fallbackPath = [origin, ...waypoints, destination];
      const newLine = new google.maps.Polyline({
        path: fallbackPath,
        geodesic: true,
        strokeColor,
        strokeOpacity: 0.85,
        strokeWeight: 4,
        map,
      });
      setPolyline(newLine);
    }

    return () => {
      if (polyline) {
        polyline.setMap(null);
      }
    };
  }, [map, routesLib, origin?.lat, origin?.lng, destination?.lat, destination?.lng, waypoints.length, travelMode]);

  return null;
};
