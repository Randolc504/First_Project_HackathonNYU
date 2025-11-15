import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Lock,
  RotateCcw,
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [settings, setSettings] = useState({
    notifications: true,
    privacy: "public",
    theme: "light_nature",
    language: "en",
  });

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const colors = {
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#CCCCCC" : "#666666",
    background: isDark ? "#121212" : "#FFFFFF",
    cardBackground: isDark ? "#1E1E1E" : "#F8FAF9",
    green: isDark ? "#22C55E" : "#16A34A",
    red: isDark ? "#EF4444" : "#DC2626",
    pastel: {
      mint: isDark ? "#1A4D2E" : "#DCFCE7",
      sky: isDark ? "#1E3A8A" : "#DBEAFE",
      orange: isDark ? "#9A3412" : "#FED7AA",
      purple: isDark ? "#6B21A8" : "#E9D5FF",
    },
  };

  const SettingsSection = ({ title, children }) => (
    <View style={{ marginBottom: 32 }}>
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 16,
          color: colors.primary,
          marginBottom: 16,
          paddingHorizontal: 24,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );

  const SettingsItem = ({
    icon: IconComponent,
    title,
    subtitle,
    onPress,
    rightElement,
  }) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.cardBackground,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 1,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: colors.pastel.mint,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 16,
        }}
      >
        <IconComponent size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
            color: colors.primary,
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || <ChevronRight size={20} color={colors.secondary} />}
    </TouchableOpacity>
  );

  const SettingsToggle = ({
    icon: IconComponent,
    title,
    subtitle,
    value,
    onValueChange,
  }) => (
    <View
      style={{
        backgroundColor: colors.cardBackground,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 1,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: colors.pastel.mint,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 16,
        }}
      >
        <IconComponent size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
            color: colors.primary,
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.secondary, true: colors.green }}
        thumbColor={value ? "#FFFFFF" : "#FFFFFF"}
      />
    </View>
  );

  const updateNotifications = async (enabled) => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications: enabled }),
      });

      if (response.ok) {
        setSettings((prev) => ({ ...prev, notifications: enabled }));
      }
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

  const handleRetakeAssessment = () => {
    router.push("/onboarding");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 24,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.primary,
            }}
          >
            Settings
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <SettingsSection title="Profile">
          <SettingsItem
            icon={User}
            title="Profile Settings"
            subtitle="Edit your profile and personal information"
            onPress={() => router.push("/settings/profile")}
          />
        </SettingsSection>

        {/* App Settings */}
        <SettingsSection title="App Settings">
          <SettingsToggle
            icon={Bell}
            title="Notifications"
            subtitle="Get reminders and updates"
            value={settings.notifications}
            onValueChange={updateNotifications}
          />

          <SettingsItem
            icon={Palette}
            title="Theme & Appearance"
            subtitle="Customize your app experience"
            onPress={() => router.push("/settings/themes")}
          />

          <SettingsItem
            icon={Globe}
            title="Language"
            subtitle="English"
            onPress={() => router.push("/settings/language")}
          />
        </SettingsSection>

        {/* Privacy & Security */}
        <SettingsSection title="Privacy & Security">
          <SettingsItem
            icon={Shield}
            title="Privacy Controls"
            subtitle="Manage your data and privacy settings"
            onPress={() => router.push("/settings/privacy")}
          />

          <SettingsItem
            icon={Lock}
            title="Security Settings"
            subtitle="Password and account security"
            onPress={() => router.push("/settings/security")}
          />
        </SettingsSection>

        {/* Carbon Assessment */}
        <SettingsSection title="Carbon Assessment">
          <SettingsItem
            icon={RotateCcw}
            title="Retake Assessment"
            subtitle="Update your carbon footprint calculation"
            onPress={handleRetakeAssessment}
          />
        </SettingsSection>

        {/* App Info */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            EcoTrack v1.0.0
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: colors.secondary,
              textAlign: "center",
            }}
          >
            Building a sustainable future together
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
