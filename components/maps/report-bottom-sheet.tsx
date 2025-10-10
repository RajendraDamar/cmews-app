// Report Bottom Sheet Component
import { View, ScrollView, Image } from 'react-native';
import { Thermometer, Droplets, Wind, CloudRain } from 'lucide-react-native';
import { Sheet, SheetContent } from '~/components/ui/sheet';
import { Text } from '~/components/ui/text';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Separator } from '~/components/ui/separator';
import { Card, CardContent } from '~/components/ui/card';
import { WeatherReport } from '~/lib/types/weather-report';

interface ReportBottomSheetProps {
  report: WeatherReport | null;
  onClose: () => void;
}

const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
  switch (severity) {
    case 'low':
      return { label: 'Rendah', variant: 'default' as const };
    case 'medium':
      return { label: 'Sedang', variant: 'secondary' as const };
    case 'high':
      return { label: 'Tinggi', variant: 'destructive' as const };
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function ReportBottomSheet({ report, onClose }: ReportBottomSheetProps) {
  if (!report) return null;

  const severityBadge = getSeverityBadge(report.severity);

  return (
    <Sheet open={!!report} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh]">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Header */}
          <View className="mb-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="flex-1 text-xl font-bold">{report.location}</Text>
              <Badge variant={severityBadge.variant}>
                <Text className="font-medium text-white">{severityBadge.label}</Text>
              </Badge>
            </View>
          </View>

          <Separator className="mb-4" />

          {/* User Info */}
          <View className="mb-4 flex-row items-center">
            <Avatar className="mr-3">
              <AvatarFallback>
                <Text className="text-sm font-medium">{report.user.initials}</Text>
              </AvatarFallback>
            </Avatar>
            <View>
              <Text className="font-medium">{report.user.name}</Text>
              <Text className="text-sm text-muted-foreground">
                {formatTimestamp(report.timestamp)}
              </Text>
            </View>
          </View>

          <Separator className="mb-4" />

          {/* Weather Data Grid */}
          <Text className="mb-3 font-semibold">Data Cuaca</Text>
          <View className="mb-4 flex-row flex-wrap">
            <View className="mb-3 w-1/2 pr-2">
              <Card>
                <CardContent className="p-3">
                  <View className="flex-row items-center">
                    <Thermometer size={20} color="#f97316" className="mr-2" />
                    <View>
                      <Text className="text-xs text-muted-foreground">Suhu</Text>
                      <Text className="font-semibold">{report.temperature}°C</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>

            <View className="mb-3 w-1/2 pl-2">
              <Card>
                <CardContent className="p-3">
                  <View className="flex-row items-center">
                    <Droplets size={20} color="#3b82f6" className="mr-2" />
                    <View>
                      <Text className="text-xs text-muted-foreground">Kelembaban</Text>
                      <Text className="font-semibold">{report.humidity}%</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>

            <View className="mb-3 w-1/2 pr-2">
              <Card>
                <CardContent className="p-3">
                  <View className="flex-row items-center">
                    <Wind size={20} color="#14b8a6" className="mr-2" />
                    <View>
                      <Text className="text-xs text-muted-foreground">Kecepatan Angin</Text>
                      <Text className="font-semibold">{report.windSpeed} km/h</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>

            <View className="mb-3 w-1/2 pl-2">
              <Card>
                <CardContent className="p-3">
                  <View className="flex-row items-center">
                    <CloudRain size={20} color="#6366f1" className="mr-2" />
                    <View>
                      <Text className="text-xs text-muted-foreground">Kondisi</Text>
                      <Text className="font-semibold">{report.weather}</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>
          </View>

          {/* Notes Section */}
          {report.notes && (
            <>
              <Separator className="mb-4" />
              <View className="mb-4">
                <Text className="mb-2 font-semibold">Catatan</Text>
                <Text className="text-muted-foreground">{report.notes}</Text>
              </View>
            </>
          )}

          {/* Photo Section */}
          {report.photo && (
            <>
              <Separator className="mb-4" />
              <View className="mb-4">
                <Text className="mb-2 font-semibold">Foto</Text>
                <Image
                  source={{ uri: report.photo }}
                  className="h-48 w-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
            </>
          )}
        </ScrollView>
      </SheetContent>
    </Sheet>
  );
}
