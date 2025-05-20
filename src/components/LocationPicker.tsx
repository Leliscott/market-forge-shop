
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface LocationPickerProps {
  onLocationSelect: (location: string) => void;
  defaultLocation?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, defaultLocation = '' }) => {
  const [location, setLocation] = useState(defaultLocation);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const getCurrentLocation = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use Google's Geocoding API to get the address from coordinates
          // Note: In a production environment, you should restrict your API key
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          );
          
          const data = await response.json();
          
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            // Find components for South Africa
            const address = data.results[0];
            const components = address.address_components;
            
            // Extract city, province, and country
            const city = components.find(c => c.types.includes('locality'))?.long_name || '';
            const province = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '';
            const country = components.find(c => c.types.includes('country'))?.long_name || '';
            
            if (country === 'South Africa') {
              const formattedLocation = `${city}, ${province}, South Africa`;
              setLocation(formattedLocation);
              onLocationSelect(formattedLocation);
            } else {
              toast({
                title: "Warning",
                description: "Location detected is not in South Africa. Please enter your South African location manually.",
              });
            }
          } else {
            throw new Error('Unable to get address from coordinates');
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to get your location. Please enter it manually.",
            variant: "destructive"
          });
          console.error('Geocoding error:', error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        toast({
          title: "Error",
          description: `Failed to get your location: ${error.message}`,
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true }
    );
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    onLocationSelect(e.target.value);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="location" className="flex items-center">
        <MapPin className="w-4 h-4 mr-1" />
        Location
      </Label>
      <div className="flex gap-2">
        <Input 
          id="location" 
          value={location} 
          onChange={handleChange} 
          placeholder="City, Province, South Africa"
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={getCurrentLocation}
          disabled={loading}
        >
          {loading ? 'Detecting...' : 'Detect'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Enter your South African location or click 'Detect' to use your current location
      </p>
    </div>
  );
};

export default LocationPicker;
