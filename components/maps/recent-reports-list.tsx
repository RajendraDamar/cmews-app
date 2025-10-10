// Recent Reports List Component
import { ScrollView, Pressable, View } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { WeatherReport } from '~/lib/types/weather-report';

interface RecentReportsListProps {
  reports: WeatherReport[];
  onSelectReport: (report: WeatherReport) => void;
}

const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
  switch (severity) {
    case 'low':
      return '#10B981';
    case 'medium':
      return '#F59E0B';
    case 'high':
      return '#EF4444';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

export function RecentReportsList({ reports, onSelectReport }: RecentReportsListProps) {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-2 p-4">
        {reports.map((report) => (
          <Pressable key={report.id} onPress={() => onSelectReport(report)}>
            <Card>
              <CardContent className="p-3">
                <View className="flex-row items-center gap-3">
                  {/* Severity Dot */}
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: getSeverityColor(report.severity),
                    }}
                  />

                  {/* Report Info */}
                  <View className="flex-1">
                    <Text className="font-medium">{report.location}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {formatTimestamp(report.timestamp)}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {report.weather} • {report.temperature}°C
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
