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
import { UI_CONSTANTS } from '~/lib/constants';

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
            <Text className="mb-2 text-2xl font-bold">{report.location}</Text>
            <View className="flex-row items-center gap-2">
              <Badge
                variant={severityBadge.variant}
                label={severityBadge.label}
                labelClasses="text-primary-foreground font-semibold"
              />
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
          <Text className="mb-3 text-base font-semibold">Data Cuaca</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            <View className="min-w-[45%] flex-1">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <View className="flex-row items-center gap-3">
                    <View className="rounded-lg bg-orange-500/10 p-2">
                      <Thermometer size={22} color="#f97316" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-muted-foreground">Suhu</Text>
                      <Text className="text-lg font-bold">{report.temperature}°C</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>

            <View className="min-w-[45%] flex-1">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <View className="flex-row items-center gap-3">
                    <View className="rounded-lg bg-blue-500/10 p-2">
                      <Droplets size={22} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-muted-foreground">Kelembaban</Text>
                      <Text className="text-lg font-bold">{report.humidity}%</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>

            <View className="min-w-[45%] flex-1">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <View className="flex-row items-center gap-3">
                    <View className="rounded-lg bg-teal-500/10 p-2">
                      <Wind size={22} color="#14b8a6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-muted-foreground">Kec. Angin</Text>
                      <Text className="text-lg font-bold">{report.windSpeed} km/h</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>

            <View className="min-w-[45%] flex-1">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <View className="flex-row items-center gap-3">
                    <View className="rounded-lg bg-indigo-500/10 p-2">
                      <CloudRain size={22} color="#6366f1" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-muted-foreground">Kondisi</Text>
                      <Text className="text-sm font-semibold">{report.weather}</Text>
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
                <View className="w-full overflow-hidden rounded-lg" style={{ aspectRatio: UI_CONSTANTS.imageAspectRatio }}>
                  <Image
                    source={{ uri: report.photo }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </SheetContent>
    </Sheet>
  );
}
