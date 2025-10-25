// Location Selection Dialog
// Allows users to select a city from the list or auto-detect their location

import * as React from 'react';
import { View } from 'react-native';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { WilayahSelector } from './WilayahSelector';
import { useWeatherStore } from '~/store/weatherStore';

interface LocationSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LocationSelectionDialog({
  open,
  onOpenChange,
}: LocationSelectionDialogProps) {
  const { selectedWilayah, setSelectedWilayah } = useWeatherStore();
  const [tempWilayah, setTempWilayah] = React.useState(selectedWilayah);

  // Update temp selection when dialog opens
  React.useEffect(() => {
    if (open) {
      setTempWilayah(selectedWilayah);
    }
  }, [open, selectedWilayah]);

  const handleConfirm = () => {
    setSelectedWilayah(tempWilayah);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempWilayah(selectedWilayah);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pilih Lokasi</DialogTitle>
          <DialogDescription>
            Pilih wilayah untuk melihat prakiraan cuaca atau gunakan lokasi otomatis
          </DialogDescription>
        </DialogHeader>

        <View className="py-4">
          <WilayahSelector
            selectedWilayah={tempWilayah}
            onWilayahChange={setTempWilayah}
            showLocationButton={true}
          />
        </View>

        <DialogFooter>
          <Button
            label="Batal"
            variant="outline"
            onPress={handleCancel}
            className="mr-2"
          />
          <Button label="Terapkan" onPress={handleConfirm} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
