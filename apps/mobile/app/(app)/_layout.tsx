import { Tabs } from 'expo-router';
import { Home, Bell, User, BookOpen, ShieldCheck } from 'lucide-react-native';
import { useAuthStore } from '../../hooks/useAuthStore';

export default function AppLayout() {
  const { user } = useAuthStore();

  const isFaculty = ['TEACHER', 'CLASS_TEACHER', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER'].includes(user?.role);
  const isStudent = user?.role === 'STUDENT';
  const isAdmin = ['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user?.role);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home stroke={color} size={size} />,
        }}
      />
      
      {/* Role-specific Tabs */}
      {(isFaculty || isStudent) && (
        <Tabs.Screen
          name="coursework"
          options={{
            title: 'LMS',
            tabBarIcon: ({ color, size }) => <BookOpen stroke={color} size={size} />,
          }}
        />
      )}

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell stroke={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User stroke={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
