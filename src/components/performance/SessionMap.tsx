import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet - use local assets instead of CDN
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface SessionMapProps {
  sessionData: {
    rawData: Array<{
      longitude: string;
      latitude: string;
      distance: number;
      heartrate: number;
      strokerate: number;
    }>;
  } | null;
  className?: string;
}

export function SessionMap({ sessionData, className }: SessionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    console.log('SessionMap useEffect triggered:', { sessionData, mapRef: !!mapRef.current });
    
    if (!sessionData) {
      console.log('SessionMap: Missing sessionData');
      return;
    }
    
    // Use requestAnimationFrame to ensure DOM is ready
    const frameId = requestAnimationFrame(() => {
      if (!mapRef.current) {
        console.log('SessionMap: mapRef not available, retrying...');
        // Retry after a short delay
        setTimeout(() => {
          if (!mapRef.current) {
            console.log('SessionMap: mapRef still not available after retry');
            return;
          }
          console.log('SessionMap: mapRef is ready after retry, proceeding with map creation');
          createMap();
        }, 100);
        return;
      }
      
      console.log('SessionMap: mapRef is ready, proceeding with map creation');
      createMap();
    });
    
    const createMap = () => {
      // Check if Leaflet is available
      if (typeof L === 'undefined') {
        console.error('SessionMap: Leaflet is not available');
        return;
      }
      
      // Clean up previous map instance
      if (mapInstanceRef.current) {
        console.log('SessionMap: Removing previous map instance');
        mapInstanceRef.current.remove();
      }

      // Filter out invalid coordinates
      const validCoordinates = sessionData?.rawData
        ?.filter(point => {
          const lat = parseFloat(point.latitude);
          const lng = parseFloat(point.longitude);
          return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
        })
        .map(point => ({
          lat: parseFloat(point.latitude),
          lng: parseFloat(point.longitude),
          distance: point.distance,
          heartRate: point.heartrate,
          strokeRate: point.strokerate
        })) || [];

      console.log('SessionMap: Valid coordinates found:', validCoordinates.length);

      if (validCoordinates.length === 0) {
        console.log('SessionMap: No valid coordinates found');
        // Show placeholder if no valid coordinates
        return;
      }

      // Calculate bounds
      const bounds = L.latLngBounds(validCoordinates.map(coord => [coord.lat, coord.lng]));

      console.log('SessionMap: Creating map instance');
      
      // Create map instance
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        dragging: true,
        touchZoom: true
      });
      
      console.log('SessionMap: Map instance created successfully');

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    // Fit map to bounds with padding
    map.fitBounds(bounds, { padding: [20, 20] });

    // Create route polyline
    if (validCoordinates.length > 1) {
      const routeCoordinates = validCoordinates.map(coord => [coord.lat, coord.lng]);
      
      // Create gradient polyline based on heart rate
      const heartRates = validCoordinates.map(coord => coord.heartRate);
      const minHR = Math.min(...heartRates);
      const maxHR = Math.max(...heartRates);
      
      const routePolyline = L.polyline(routeCoordinates as [number, number][], {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
      }).addTo(map);

      // Add start marker
      const startCoord = validCoordinates[0];
      const startMarker = L.marker([startCoord.lat, startCoord.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })
      }).addTo(map);

      // Add end marker
      const endCoord = validCoordinates[validCoordinates.length - 1];
      const endMarker = L.marker([endCoord.lat, endCoord.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })
      }).addTo(map);

      // Add popups for start and end markers
      startMarker.bindPopup(`
        <div class="text-sm">
          <strong>Start</strong><br>
          Distance: ${startCoord.distance.toFixed(0)}m<br>
          Heart Rate: ${startCoord.heartRate} bpm<br>
          Stroke Rate: ${startCoord.strokeRate} spm
        </div>
      `);

      endMarker.bindPopup(`
        <div class="text-sm">
          <strong>Finish</strong><br>
          Distance: ${endCoord.distance.toFixed(0)}m<br>
          Heart Rate: ${endCoord.heartRate} bpm<br>
          Stroke Rate: ${endCoord.strokeRate} spm
        </div>
      `);

      // Add route info popup
      routePolyline.bindPopup(`
        <div class="text-sm">
          <strong>Session Route</strong><br>
          Total Points: ${validCoordinates.length}<br>
          Distance: ${endCoord.distance.toFixed(0)}m<br>
          Avg Heart Rate: ${Math.round(heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length)} bpm
        </div>
      `);
    }

      mapInstanceRef.current = map;
    };

    // Cleanup function
    return () => {
      cancelAnimationFrame(frameId);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [sessionData]);

  if (!sessionData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Session Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Select a session to view the route</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if we have valid coordinates
  const hasValidCoordinates = sessionData?.rawData?.some(point => {
    const lat = parseFloat(point.latitude);
    const lng = parseFloat(point.longitude);
    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  }) || false;

  if (!hasValidCoordinates) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Session Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No GPS data available for this session</p>
              <p className="text-sm text-muted-foreground">This session doesn't contain location coordinates</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Session Route
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="h-64 w-full rounded-lg border"
          style={{ 
            zIndex: 1,
            minHeight: '256px',
            position: 'relative',
            display: 'block'
          }}
        />
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Start</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Finish</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-blue-500 rounded"></div>
            <span>Route</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 