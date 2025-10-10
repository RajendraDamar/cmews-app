// Report Form Dialog Component
import { View, ScrollView } from 'react-native';
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
import { Select, SelectContent, SelectItem } from '~/components/ui/select';
import { useState } from 'react';

interface ReportFormDialogProps {
  location: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ReportFormDialog({ location, onSubmit, onCancel }: ReportFormDialogProps) {
  const [weather, setWeather] = useState('');
  const [severity, setSeverity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSubmit({
      location,
      weather,
      severity,
      temperature: parseFloat(temperature),
      windSpeed: parseFloat(windSpeed),
      notes,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Text className="text-xl font-bold">Laporkan Cuaca</Text>
          </DialogTitle>
        </DialogHeader>

        <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
          <View className="gap-4">
            {/* Location */}
            <View>
              <Text className="mb-2 font-medium">Lokasi</Text>
              <Input value={location} editable={false} className="bg-muted" />
            </View>

            {/* Weather Condition */}
            <View>
              <Text className="mb-2 font-medium">Kondisi Cuaca</Text>
              <Select value={weather} onValueChange={setWeather} placeholder="Pilih kondisi cuaca">
                <SelectContent>
                  <SelectItem value="cerah">Cerah</SelectItem>
                  <SelectItem value="berawan">Berawan</SelectItem>
                  <SelectItem value="berawan_tebal">Berawan Tebal</SelectItem>
                  <SelectItem value="hujan_ringan">Hujan Ringan</SelectItem>
                  <SelectItem value="hujan_sedang">Hujan Sedang</SelectItem>
                  <SelectItem value="hujan_lebat">Hujan Lebat</SelectItem>
                  <SelectItem value="kabut">Kabut</SelectItem>
                </SelectContent>
              </Select>
            </View>

            {/* Severity */}
            <View>
              <Text className="mb-2 font-medium">Tingkat Keparahan</Text>
              <Select value={severity} onValueChange={setSeverity} placeholder="Pilih tingkat">
                <SelectContent>
                  <SelectItem value="low">🟢 Rendah</SelectItem>
                  <SelectItem value="medium">🟡 Sedang</SelectItem>
                  <SelectItem value="high">🔴 Tinggi</SelectItem>
                </SelectContent>
              </Select>
            </View>

            {/* Temperature */}
            <View>
              <Text className="mb-2 font-medium">Suhu (°C)</Text>
              <Input
                value={temperature}
                onChangeText={setTemperature}
                keyboardType="numeric"
                placeholder="Contoh: 28"
              />
            </View>

            {/* Wind Speed */}
            <View>
              <Text className="mb-2 font-medium">Kecepatan Angin (km/h)</Text>
              <Input
                value={windSpeed}
                onChangeText={setWindSpeed}
                keyboardType="numeric"
                placeholder="Contoh: 15"
              />
            </View>

            {/* Notes */}
            <View>
              <Text className="mb-2 font-medium">Catatan</Text>
              <Textarea
                value={notes}
                onChangeText={setNotes}
                placeholder="Tambahkan catatan (opsional)"
                numberOfLines={4}
              />
            </View>

            {/* Photo Upload */}
            <View>
              <Text className="mb-2 font-medium">Foto (opsional)</Text>
              <Button
                variant="outline"
                label="📷 Unggah Foto"
                className="flex-row items-center justify-center gap-2"
              />
            </View>
          </View>
        </ScrollView>

        <DialogFooter className="mt-4 flex-row gap-2">
          <Button variant="outline" onPress={onCancel} label="Batal" className="flex-1" />
          <Button onPress={handleSubmit} label="Kirim Laporan" className="flex-1" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
