import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../config/firebase';
import { useTranslation } from 'react-i18next';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
            } catch (error: any) {
              Alert.alert(t('auth.errors.logoutError'), error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("homeScreen.title")}</Text>
        <Text style={styles.subtitle}>{t("homeScreen.subtitle")}</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userInfoTitle}>{t("homeScreen.userInfoTitle")}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t("homeScreen.email")}</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t("homeScreen.userId")}</Text>
          <Text style={styles.infoValue}>{user?.uid}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t("homeScreen.emailVerified")}</Text>
          <Text style={styles.infoValue}>
            {user?.emailVerified ? t("homeScreen.yes") : t("homeScreen.no")}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.contentTitle}>{t("homeScreen.revenueDataTitle")}</Text>
        <Text style={styles.contentText}>
          {t("homeScreen.revenueDataDescription")}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, loading && styles.buttonDisabled]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.logoutButtonText}>{t("homeScreen.logoutButtonText")}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    flex: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  contentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen; 