import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '~/lib/theme-provider';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function BooksLayout() {
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
        name="for-you"
        options={{
          title: 'For You',
        }}
      />
      <MaterialTopTabs.Screen
        name="top-charts"
        options={{
          title: 'Top Charts',
        }}
      />
      <MaterialTopTabs.Screen
        name="categories"
        options={{
          title: 'Categories',
        }}
      />
      <MaterialTopTabs.Screen
        name="popular"
        options={{
          title: 'Popular',
        }}
      />
    </MaterialTopTabs>
  );
}
