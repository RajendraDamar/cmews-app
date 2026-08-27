import { View, ScrollView, Pressable, Platform, KeyboardAvoidingView } from 'react-native';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { useState } from 'react';
import { 
  CloudRain, 
  CloudDrizzle, 
  Sun, 
  Wind, 
  Cloud, 
  MapPin, 
  Thermometer, 
  AlertCircle, 
  StickyNote, 
  CloudLightning,
  Camera
} from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

interface ReportFormDialogProps {
  location: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const WEATHER_OPTIONS = [
  { id: 'cerah', label: 'Cerah', icon: Sun },
  { id: 'berawan', label: 'Berawan', icon: Cloud },
  { id: 'berawan_tebal', label: 'Berawan Tebal', icon: Cloud },
  { id: 'hujan_ringan', label: 'Hujan Ringan', icon: CloudDrizzle },
  { id: 'hujan_sedang', label: 'Hujan Sedang', icon: CloudRain },
  { id: 'hujan_lebat', label: 'Hujan Lebat', icon: CloudLightning },
  { id: 'kabut', label: 'Kabut/Angin', icon: Wind },
];

const SEVERITY_OPTIONS = [
  { id: 'low', label: 'Rendah', color: '#10B981' },
  { id: 'medium', label: 'Sedang', color: '#F59E0B' },
  { id: 'high', label: 'Tinggi', color: '#EF4444' },
];

export function ReportFormDialog({ location, onSubmit, onCancel }: ReportFormDialogProps) {
  const [weather, setWeather] = useState('');
  const [severity, setSeverity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [notes, setNotes] = useState('');
  
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#9CA3AF' : '#6B7280'; // text-muted-foreground
  const selectedIconColor = isDark ? '#020617' : '#FFFFFF'; // matches primary-foreground

  // Validation
  const isValid = weather !== '' && severity !== '' && temperature.trim() !== '';

  const handleSubmit = () => {
    if (!isValid) return;
    
    onSubmit({
      location,
      weather,
      severity,
      temperature: parseFloat(temperature),
      windSpeed: windSpeed ? parseFloat(windSpeed) : 0,
      notes,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <Text className="text-xl font-bold">Laporkan Cuaca</Text>
          </DialogTitle>
        </DialogHeader>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flexShrink: 1 }}>
          <ScrollView 
            className="max-h-[65vh]" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <View className="gap-6 mt-2">
              
              {/* Location (Read-only) */}
              <View>
                <View className="flex-row items-center gap-2 mb-2">
                  <MapPin size={16} color={iconColor} />
                  <Text className="font-medium text-sm text-muted-foreground">Lokasi</Text>
                </View>
                <View className="bg-muted px-4 py-3 rounded-lg border border-border">
                  <Text className="font-semibold">{location}</Text>
                </View>
              </View>

              {/* Weather Condition - Grid Selector */}
              <View>
                <View className="flex-row items-center gap-2 mb-3">
                  <Cloud size={16} color={iconColor} />
                  <Text className="font-medium text-sm text-muted-foreground">Kondisi Cuaca (Wajib)</Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {WEATHER_OPTIONS.map((opt) => {
                    const isSelected = weather === opt.id;
                    const Icon = opt.icon;
                    return (
                      <Pressable
                        key={opt.id}
                        onPress={() => setWeather(opt.id)}
                        className={`flex-row items-center gap-2 px-3 py-2 rounded-xl border active:scale-95 transition-all ${
                          isSelected 
                            ? 'bg-primary border-primary' 
                            : 'bg-card border-border'
                        }`}
                      >
                        <Icon size={16} color={isSelected ? selectedIconColor : iconColor} />
                        <Text className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                          {opt.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Severity - Segmented Pill */}
              <View>
                <View className="flex-row items-center gap-2 mb-3">
                  <AlertCircle size={16} color={iconColor} />
                  <Text className="font-medium text-sm text-muted-foreground">Tingkat Keparahan (Wajib)</Text>
                </View>
                <View className="flex-row bg-muted rounded-xl p-1">
                  {SEVERITY_OPTIONS.map((opt) => {
                    const isSelected = severity === opt.id;
                    return (
                      <Pressable
                        key={opt.id}
                        onPress={() => setSeverity(opt.id)}
                        className="flex-1 py-2.5 items-center justify-center rounded-lg"
                        style={isSelected ? {
                          backgroundColor: opt.color,
                          shadowColor: opt.color,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 4
                        } : undefined}
                      >
                        <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-muted-foreground'}`}>
                          {opt.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Measurements Row */}
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Thermometer size={16} color={iconColor} />
                    <Text className="font-medium text-sm text-muted-foreground">Suhu (°C) (Wajib)</Text>
                  </View>
                  <Input
                    value={temperature}
                    onChangeText={setTemperature}
                    keyboardType="numeric"
                    placeholder="28"
                    className="text-lg font-semibold"
                  />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Wind size={16} color={iconColor} />
                    <Text className="font-medium text-sm text-muted-foreground">Angin (km/h)</Text>
                  </View>
                  <Input
                    value={windSpeed}
                    onChangeText={setWindSpeed}
                    keyboardType="numeric"
                    placeholder="15"
                    className="text-lg font-semibold"
                  />
                </View>
              </View>

              {/* Notes */}
              <View>
                <View className="flex-row items-center gap-2 mb-2">
                  <StickyNote size={16} color={iconColor} />
                  <Text className="font-medium text-sm text-muted-foreground">Catatan Tambahan</Text>
                </View>
                <Textarea
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Deskripsikan kondisi secara singkat..."
                  numberOfLines={3}
                  className="min-h-[80px]"
                />
              </View>

              {/* Photo Upload */}
              <View>
                <Pressable
                  className="w-full border-dashed border-2 py-6 bg-muted/30 border-border rounded-lg active:opacity-70 transition-opacity"
                  onPress={() => {}}
                >
                  <View className="items-center gap-2">
                    <Camera size={24} color={iconColor} />
                    <Text className="text-sm font-medium text-muted-foreground">Unggah Foto Lokasi (Opsional)</Text>
                  </View>
                </Pressable>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <DialogFooter className="mt-4 flex-row gap-3 border-t border-border pt-4">
          <Button 
            variant="outline" 
            onPress={onCancel} 
            className="flex-1"
            label="Batal"
          />
          <Button 
            onPress={handleSubmit} 
            className="flex-1"
            disabled={!isValid}
            style={!isValid ? { opacity: 0.5 } : undefined}
            label="Kirim Laporan"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
