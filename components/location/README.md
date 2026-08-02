# Location & Wilayah Management

This module provides Indonesian location services and wilayah code mapping for the CMEWS application.

## Files Created

### 1. `lib/data/wilayah-mapping.ts`
Contains mappings of major Indonesian cities to their official BMKG wilayah codes.

**Supported Cities:**
- Jakarta Pusat, Jakarta Selatan, Jakarta Utara
- Yogyakarta
- Surabaya
- Bandung
- Medan
- Denpasar

### 2. `lib/services/LocationService.ts`
Service class for handling location-related operations.

**Features:**
- Request and manage location permissions
- Get current device location
- Map city names to wilayah codes
- Find nearest city based on coordinates (Haversine formula)

**Methods:**
```typescript
// Get current device location
getCurrentLocation(): Promise<{ latitude: number; longitude: number }>

// Get wilayah code from city name
getWilayahCodeFromName(cityName: string): string

// Find nearest wilayah code based on coordinates
getNearestWilayahCode(lat: number, lon: number): Promise<string>
```

### 3. `components/location/WilayahSelector.tsx`
React component for wilayah selection UI.

**Props:**
```typescript
interface WilayahSelectorProps {
  selectedWilayah: string;           // Current wilayah code
  onWilayahChange: (wilayahCode: string) => void;  // Change handler
  className?: string;                // Optional styling
  showLocationButton?: boolean;      // Show auto-detect button (default: true)
}
```

## Usage Examples

### Basic Usage in a Screen

```typescript
import { WilayahSelector } from '~/components/location/WilayahSelector';

function WeatherScreen() {
  const [wilayahCode, setWilayahCode] = useState('3171031001'); // Default Jakarta

  return (
    <View>
      <WilayahSelector
        selectedWilayah={wilayahCode}
        onWilayahChange={setWilayahCode}
      />
    </View>
  );
}
```

### Using LocationService Directly

```typescript
import { locationService } from '~/lib/services/LocationService';

// Get wilayah code by city name
const jakartaCode = locationService.getWilayahCodeFromName('Jakarta Pusat');
// Returns: '3171031001'

// Get current location and find nearest city
try {
  const location = await locationService.getCurrentLocation();
  const nearestCode = await locationService.getNearestWilayahCode(
    location.latitude,
    location.longitude
  );
  console.log('Nearest wilayah code:', nearestCode);
} catch (error) {
  console.error('Location error:', error.message);
}
```

## Platform Support

- ✅ iOS
- ✅ Android
- ✅ Web

## Dependencies

- `expo-location` (v19.0.7) - For location access and permissions

## Error Handling

The service properly handles:
- Location permission denied
- Location unavailable
- Unknown city names (defaults to Jakarta Pusat)

## Implementation Notes

1. **No Store Dependencies**: The service is completely independent and doesn't modify any stores
2. **No Map Integration**: This is a pure location/wilayah service, map components are not modified
3. **Mock Data Intact**: Existing mock data in `lib/data/` remains unchanged
4. **Distance Calculation**: Uses Haversine formula for accurate distance measurement between coordinates
5. **Cross-platform**: Works on iOS, Android, and web with platform-specific permission handling

## Future Enhancements

- Add more Indonesian cities
- Support for district-level (kecamatan) selection
- Geocoding integration for address-to-wilayah conversion
- Offline location caching
