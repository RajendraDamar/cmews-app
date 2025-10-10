// Desktop Sidebar Component
import { View, ScrollView } from 'react-native';
import { Search } from 'lucide-react-native';
import { Input } from '~/components/ui/input';
import { Checkbox } from '~/components/ui/checkbox';
import { Text } from '~/components/ui/text';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { WeatherReport, WeatherReportFilters } from '~/lib/types/weather-report';
import { RecentReportsList } from './recent-reports-list';

interface DesktopSidebarProps {
  selectedReport: WeatherReport | null;
  recentReports: WeatherReport[];
  filters: WeatherReportFilters;
  onFilterChange: (filters: WeatherReportFilters) => void;
  onSelectReport: (report: WeatherReport) => void;
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
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function DesktopSidebar({
  selectedReport,
  recentReports,
  filters,
  onFilterChange,
  onSelectReport,
}: DesktopSidebarProps) {
  return (
    <View className="w-[30%] border-r border-border bg-card">
      {/* Search */}
      <View className="border-b border-border p-4">
        <View className="relative">
          <Input placeholder="Cari lokasi..." className="pl-10" />
          <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
        </View>
      </View>

      {/* Filters */}
      <View className="border-b border-border p-4">
        <Text className="mb-3 font-semibold">Filter Laporan</Text>
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <Checkbox
              checked={filters.all}
              onCheckedChange={(checked) =>
                onFilterChange({
                  ...filters,
                  all: checked,
                  low: checked,
                  medium: checked,
                  high: checked,
                })
              }
            />
            <Text>Semua Laporan</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Checkbox
              checked={filters.low}
              onCheckedChange={(checked) =>
                onFilterChange({ ...filters, low: checked, all: false })
              }
            />
            <Text>🟢 Rendah</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Checkbox
              checked={filters.medium}
              onCheckedChange={(checked) =>
                onFilterChange({ ...filters, medium: checked, all: false })
              }
            />
            <Text>🟡 Sedang</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Checkbox
              checked={filters.high}
              onCheckedChange={(checked) =>
                onFilterChange({ ...filters, high: checked, all: false })
              }
            />
            <Text>🔴 Tinggi</Text>
          </View>
        </View>
      </View>

      {/* Selected Report or Recent Reports */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {selectedReport ? (
          <View className="p-4">
            <Card>
              <CardContent className="p-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="flex-1 text-lg font-bold">{selectedReport.location}</Text>
                  <Badge variant={getSeverityBadge(selectedReport.severity).variant}>
                    <Text className="text-xs text-white">
                      {getSeverityBadge(selectedReport.severity).label}
                    </Text>
                  </Badge>
                </View>

                <Separator className="mb-3" />

                <View className="mb-3 flex-row items-center">
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarFallback>
                      <Text className="text-xs">{selectedReport.user.initials}</Text>
                    </AvatarFallback>
                  </Avatar>
                  <View>
                    <Text className="text-sm font-medium">{selectedReport.user.name}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {formatTimestamp(selectedReport.timestamp)}
                    </Text>
                  </View>
                </View>

                <Separator className="mb-3" />

                <View className="gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Cuaca:</Text>
                    <Text className="text-sm font-medium">{selectedReport.weather}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Suhu:</Text>
                    <Text className="text-sm font-medium">{selectedReport.temperature}°C</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Kelembaban:</Text>
                    <Text className="text-sm font-medium">{selectedReport.humidity}%</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Angin:</Text>
                    <Text className="text-sm font-medium">{selectedReport.windSpeed} km/h</Text>
                  </View>
                </View>

                {selectedReport.notes && (
                  <>
                    <Separator className="my-3" />
                    <Text className="text-sm text-muted-foreground">{selectedReport.notes}</Text>
                  </>
                )}
              </CardContent>
            </Card>
          </View>
        ) : (
          <View>
            <View className="p-4">
              <Text className="mb-2 font-semibold">Laporan Terbaru</Text>
            </View>
            <RecentReportsList reports={recentReports} onSelectReport={onSelectReport} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
