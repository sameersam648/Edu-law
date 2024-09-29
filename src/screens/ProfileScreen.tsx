import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  useColorScheme,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface InfoItemProps {
  label: string;
  value: string;
  iconName: string;
  theme: ThemeType;
}

interface SettingsItemProps extends InfoItemProps {
  actionComponent?: React.ReactNode;
}

interface ThemeType {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  cardColor: string;
  gradientColors: string[];
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, iconName, theme }) => (
  <Animated.View style={[styles.infoItem, { backgroundColor: theme.cardColor }]}>
    <Icon name={iconName} size={24} color={theme.accentColor} />
    <View style={styles.infoTextContainer}>
      <Text style={[styles.infoLabel, { color: theme.textColor }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.textColor }]}>{value}</Text>
    </View>
    <Icon name="chevron-right" size={24} color={theme.accentColor} />
  </Animated.View>
);

const SettingsItem: React.FC<SettingsItemProps> = ({ label, value, iconName, actionComponent, theme }) => (
  <Animated.View style={[styles.settingsItem, { backgroundColor: theme.cardColor }]}>
    <Icon name={iconName} size={24} color={theme.accentColor} />
    <View style={styles.settingsTextContainer}>
      <Text style={[styles.settingsLabel, { color: theme.textColor }]}>{label}</Text>
      <Text style={[styles.settingsValue, { color: theme.textColor }]}>{value}</Text>
    </View>
    {actionComponent || <Icon name="chevron-right" size={24} color={theme.accentColor} />}
  </Animated.View>
);

const ProfileScreen: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const systemColorScheme = useColorScheme();
  const [animatedValue] = useState(new Animated.Value(0));

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
    Animated.timing(animatedValue, {
      toValue: isDarkMode ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode, animatedValue]);

  const theme = useMemo(() => {
    return isDarkMode || systemColorScheme === 'dark'
      ? darkTheme
      : lightTheme;
  }, [isDarkMode, systemColorScheme]);

  const renderInfoItems = useMemo(() => [
    { label: 'Username', value: '1st_User', iconName: 'person' },
    { label: 'E-mail Address', value: 'firstuser@gmail.com', iconName: 'email' },
    { label: 'Phone Number', value: '+1234567890', iconName: 'phone' },
    { label: 'Address', value: '123 Anywhere St., Any City, ST 12345', iconName: 'location-on' },
  ], []);

  const renderSettingsItems = useMemo(() => [
    { label: 'Language', value: 'English', iconName: 'language' },
    { label: 'Notifications', value: 'Silent Mode', iconName: 'notifications', actionComponent: <Switch thumbColor={theme.accentColor} trackColor={{ false: theme.cardColor, true: theme.accentColor }} /> },
    { label: 'Theme', value: 'Dark Mode', iconName: 'nightlight-round', actionComponent: <Switch value={isDarkMode} onValueChange={toggleDarkMode} thumbColor={theme.accentColor} trackColor={{ false: theme.cardColor, true: theme.accentColor }} /> },
    { label: 'Device Permissions', value: 'Camera, Location, & Microphone', iconName: 'security' },
    { label: 'Mobile Data', value: 'Highest Quality', iconName: 'signal-cellular-alt' },
  ], [isDarkMode, toggleDarkMode, theme]);

  const animatedBackgroundStyle = {
    backgroundColor: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [lightTheme.backgroundColor, darkTheme.backgroundColor],
    }),
  };

  return (
    <Animated.ScrollView style={[styles.container, animatedBackgroundStyle]}>
      <LinearGradient colors={theme.gradientColors} style={styles.header}>
        <TouchableOpacity onPress={() => setShowQRCode(true)}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.profileDetails}>
          <Text style={[styles.profileName, { color: theme.textColor }]}>Claudia Alves</Text>
          <Text style={[styles.profileStatus, { color: theme.accentColor }]}>Online</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="edit" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>About Me</Text>
        {renderInfoItems.map((item, index) => (
          <InfoItem key={index} {...item} theme={theme} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Settings</Text>
        {renderSettingsItems.map((item, index) => (
          <SettingsItem key={index} {...item} theme={theme} />
        ))}
      </View>

      <TouchableOpacity style={[styles.signOutButton, { backgroundColor: theme.accentColor }]}>
        <Icon name="logout" size={26} color={theme.textColor} />
        <Text style={[styles.signOutText, { color: theme.textColor }]}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textColor }]}>Privacy & Policy</Text>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showQRCode}
        onRequestClose={() => setShowQRCode(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Share Profile</Text>
            <Image
              source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://profile/claudia-alves' }}
              style={styles.qrCode}
            />
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.accentColor }]}
              onPress={() => setShowQRCode(false)}
            >
              <Text style={[styles.closeButtonText, { color: theme.textColor }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.ScrollView>
  );
};

const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileDetails: {
    marginLeft: 20,
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileStatus: {
    fontSize: 16,
  },
  editButton: {
    padding: 10,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingsTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  settingsLabel: {
    fontSize: 14,
  },
  settingsValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: width * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const lightTheme: ThemeType = {
  backgroundColor: '#f0f2f5',
  textColor: '#333',
  accentColor: '#4facfe',
  cardColor: '#ffffff',
  gradientColors: ['#4facfe', '#00f2fe'],
};

const darkTheme: ThemeType = {
  backgroundColor: '#1f2937',
  textColor: '#e5e7eb',
  accentColor: '#60a5fa',
  cardColor: '#374151',
  gradientColors: ['#3730a3', '#4f46e5'],
};

const styles = StyleSheet.create(baseStyles);

export default ProfileScreen;