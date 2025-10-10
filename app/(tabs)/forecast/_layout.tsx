import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '~/lib/theme-provider';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function ForecastLayout() {
  const { colorScheme } = useTheme();

  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor:
          colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)',
        tabBarInactiveTintColor:
          colorScheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)',
        tabBarIndicatorStyle: {
          backgroundColor: colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)',
        },
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
          borderBottomColor:
            colorScheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
          borderBottomWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarScrollEnabled: true,
      }}>
      <MaterialTopTabs.Screen
        name="weather"
        options={{
          title: 'Cuaca',
        }}
      />
      <MaterialTopTabs.Screen
        name="wind"
        options={{
          title: 'Angin',
        }}
      />
      <MaterialTopTabs.Screen
        name="wave"
        options={{
          title: 'Gelombang',
        }}
      />
      <MaterialTopTabs.Screen
        name="current"
        options={{
          title: 'Arus Laut',
        }}
      />
    </MaterialTopTabs>
  );
}
