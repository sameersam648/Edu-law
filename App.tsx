import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LessonScreen from './src/screens/LessonScreen';
import AskmeScreen from './src/screens/AskmeScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName: string, color: string, size: number) => {
  const iconMap: { [key: string]: string } = {
    Home: 'home-outline',
    Lessons: 'book-outline',
    Askme: 'help-circle-outline',
    Progress: 'bar-chart-outline',
    Profile: 'person-outline',
  };

  return <Icon name={iconMap[routeName]} size={size} color={color} />;
};
const App: React.FC = () => {
  const iconSize = Platform.OS === 'ios' ? 30 : 25;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, iconSize),
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Lessons" component={LessonScreen} />
        <Tab.Screen name="Askme" component={AskmeScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
