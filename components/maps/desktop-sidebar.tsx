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
    <View className="w-[30%] border-r border-border bg-card/50">
      {/* Search */}
      <View className="border-b border-border bg-card p-4">
        <View className="relative">
          <Input placeholder="Cari lokasi..." className="h-11 pl-10" />
          <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
        </View>
      </View>

      {/* Filters */}
      <View className="border-b border-border bg-card p-4">
        <Text className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Filter Laporan
        </Text>
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
            <Text className="font-medium">Semua Laporan</Text>
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
            <Card className="shadow-lg">
              <CardContent className="p-5">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="flex-1 text-xl font-bold">{selectedReport.location}</Text>
                  <Badge
                    variant={getSeverityBadge(selectedReport.severity).variant}
                    label={getSeverityBadge(selectedReport.severity).label}
                    labelClasses="text-primary-foreground font-semibold"
                  />
                </View>

                <Separator className="mb-4" />

                <View className="mb-4 flex-row items-center">
                  <Avatar className="mr-3 h-10 w-10">
                    <AvatarFallback>
                      <Text className="text-sm font-medium">{selectedReport.user.initials}</Text>
                    </AvatarFallback>
                  </Avatar>
                  <View>
                    <Text className="text-base font-semibold">{selectedReport.user.name}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {formatTimestamp(selectedReport.timestamp)}
                    </Text>
                  </View>
                </View>

                <Separator className="mb-4" />

                <View className="gap-3">
                  <View className="flex-row justify-between rounded-lg bg-muted/50 p-3">
                    <Text className="text-sm font-medium text-muted-foreground">Cuaca:</Text>
                    <Text className="text-sm font-semibold">{selectedReport.weather}</Text>
                  </View>
                  <View className="flex-row justify-between rounded-lg bg-muted/50 p-3">
                    <Text className="text-sm font-medium text-muted-foreground">Suhu:</Text>
                    <Text className="text-sm font-semibold">{selectedReport.temperature}°C</Text>
                  </View>
                  <View className="flex-row justify-between rounded-lg bg-muted/50 p-3">
                    <Text className="text-sm font-medium text-muted-foreground">Kelembaban:</Text>
                    <Text className="text-sm font-semibold">{selectedReport.humidity}%</Text>
                  </View>
                  <View className="flex-row justify-between rounded-lg bg-muted/50 p-3">
                    <Text className="text-sm font-medium text-muted-foreground">Angin:</Text>
                    <Text className="text-sm font-semibold">{selectedReport.windSpeed} km/h</Text>
                  </View>
                </View>

                {selectedReport.notes && (
                  <>
                    <Separator className="my-4" />
                    <View className="rounded-lg bg-muted/30 p-3">
                      <Text className="text-sm text-muted-foreground">{selectedReport.notes}</Text>
                    </View>
                  </>
                )}
              </CardContent>
            </Card>
          </View>
        ) : (
          <View>
            <View className="bg-card p-4">
              <Text className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Laporan Terbaru
              </Text>
            </View>
            <RecentReportsList reports={recentReports} onSelectReport={onSelectReport} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
