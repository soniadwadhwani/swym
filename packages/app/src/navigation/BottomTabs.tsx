import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout, Shadows, Spacing } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { TrainScreen } from '../screens/TrainScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const tabConfig: Record<string, { icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap }> = {
  Home: { icon: 'home-outline', iconActive: 'home' },
  Train: { icon: 'timer-outline', iconActive: 'timer' },
  Community: { icon: 'people-outline', iconActive: 'people' },
  Analytics: { icon: 'bar-chart-outline', iconActive: 'bar-chart' },
  Profile: { icon: 'person-outline', iconActive: 'person' },
};

export const BottomTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: Colors.accent,
      tabBarInactiveTintColor: Colors.textLight,
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 0.2,
      },
      tabBarStyle: {
        position: 'absolute',
        backgroundColor: Colors.tabBarBg,
        borderTopWidth: 0,
        height: Layout.tabBarHeight,
        paddingTop: Spacing.sm,
        ...Shadows.tabBar,
      },
      tabBarIcon: ({ focused, color, size }) => {
        const cfg = tabConfig[route.name];
        return (
          <Ionicons
            name={focused ? cfg.iconActive : cfg.icon}
            size={22}
            color={color}
          />
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Train" component={TrainScreen} />
    <Tab.Screen name="Community" component={CommunityScreen} />
    <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
