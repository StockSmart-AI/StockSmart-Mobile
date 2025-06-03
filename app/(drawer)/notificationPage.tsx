import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { ArrowLeft, AlertTriangle, LineChart, ClipboardList, User } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { router } from "expo-router";
import { AuthContext } from "@/context/AuthContext";
import { getNotifications, respondToAccessRequest } from "@/api/notifications";
import SnackBar from "@/components/ui/Snackbar";

interface Notification {
  id: string;
  type: string;
  message: string;
  status: string;
  created_at: string;
  sender?: {
    name: string;
  };
  shop?: {
    name: string;
  };
}

interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 18,
    color: Colors.text,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  title: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 16,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 13,
    color: Colors.tertiary,
    marginTop: 2,
  },
  date: {
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 13,
    color: Colors.tertiary,
    marginLeft: 8,
  },
  grantBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingHorizontal: 25,
    paddingVertical: 8,
  },
  grantText: {
    color: Colors.light,
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 15,
  },
  denyBtn: {
    backgroundColor: "#F35B5B",
    borderRadius: 16,
    paddingHorizontal: 25,
    paddingVertical: 8,
  },
  denyText: {
    color: Colors.light,
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default function NotificationPage() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(token);
      setNotifications(response.data);
    } catch (error: any) {
      setNotification({
        message: error.response?.data?.error || "Failed to fetch notifications",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRespond = async (notificationId: string, action: 'approve' | 'reject') => {
    try {
      await respondToAccessRequest(notificationId, action, token);
      setNotification({
        message: `Access request ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        type: "success"
      });
      // Refresh notifications after responding
      fetchNotifications();
    } catch (error: any) {
      setNotification({
        message: error.response?.data?.error || `Failed to ${action} request`,
        type: "error"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'access_request':
        return <User color={Colors.text} size={28} strokeWidth={1.5} />;
      case 'low_stock':
        return <AlertTriangle color={Colors.text} size={28} strokeWidth={1.5} />;
      case 'sales_trend':
        return <LineChart color={Colors.text} size={28} strokeWidth={1.5} />;
      default:
        return <ClipboardList color={Colors.text} size={28} strokeWidth={1.5} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={Colors.accent} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 28 }} /> {/* Spacer */}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {notifications.length === 0 ? (
            <Text style={styles.emptyText}>No notifications</Text>
          ) : (
            notifications.map((n) => (
              <View key={n.id} style={styles.card}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {getNotificationIcon(n.type)}
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.title}>{n.message}</Text>
                    <Text style={styles.subtitle}>
                      {n.type === 'access_request' 
                        ? `${n.sender?.name} is requesting access to ${n.shop?.name}`
                        : n.message}
                    </Text>
                  </View>
                  <Text style={styles.date}>{formatDate(n.created_at)}</Text>
                </View>
                {n.type === 'access_request' && n.status === 'pending' && (
                  <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                    <TouchableOpacity 
                      style={styles.grantBtn}
                      onPress={() => handleRespond(n.id, 'approve')}
                    >
                      <Text style={styles.grantText}>Grant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.denyBtn}
                      onPress={() => handleRespond(n.id, 'reject')}
                    >
                      <Text style={styles.denyText}>Deny</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      {notification && (
        <SnackBar
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </View>
  );
}
