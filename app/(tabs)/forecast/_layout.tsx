import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '~/lib/theme-provider';
import { MOCK_3DAY_FORECAST } from '~/constants/mock-data';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function ForecastLayout() {
  const { colorScheme } = useTheme();

  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#666' : '#999',
        tabBarIndicatorStyle: {
          backgroundColor: colorScheme === 'dark' ? '#fff' : '#000',
        },
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarScrollEnabled: true,
      }}>
      <MaterialTopTabs.Screen
        name="day-1"
        options={{
          title: MOCK_3DAY_FORECAST[0].date,
        }}
      />
      <MaterialTopTabs.Screen
        name="day-2"
        options={{
          title: MOCK_3DAY_FORECAST[1].date,
        }}
      />
      <MaterialTopTabs.Screen
        name="day-3"
        options={{
          title: MOCK_3DAY_FORECAST[2].date,
        }}
      />
    </MaterialTopTabs>
  );
}
