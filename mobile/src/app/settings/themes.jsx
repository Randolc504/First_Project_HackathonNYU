import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Check,
  Sun,
  Moon,
  Palette,
  Mountain,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function ThemeSettings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [currentTheme, setCurrentTheme] = useState("light_nature");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    loadCurrentTheme();
  }, []);

  const loadCurrentTheme = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setCurrentTheme(data.theme || "light_nature");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
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
  };

  const themes = [
    {
      id: "light_nature",
      name: "Light Nature",
      description: "Fresh and natural with green accents",
      icon: Sun,
      preview: {
        primary: "#DCFCE7",
        secondary: "#16A34A",
        accent: "#F0FDF4",
        background: "#FFFFFF",
      },
    },
    {
      id: "dark_eco",
      name: "Dark Eco Mode",
      description: "Easy on the eyes with eco-friendly tones",
      icon: Moon,
      preview: {
        primary: "#1A4D2E",
        secondary: "#22C55E",
        accent: "#121212",
        background: "#1E1E1E",
      },
    },
    {
      id: "minimalist_white",
      name: "Minimalist White",
      description: "Clean and simple design",
      icon: Palette,
      preview: {
        primary: "#F8FAF9",
        secondary: "#666666",
        accent: "#E5E7EB",
        background: "#FFFFFF",
      },
    },
    {
      id: "earth_tones",
      name: "Earth Tones",
      description: "Warm and natural earth-inspired colors",
      icon: Mountain,
      preview: {
        primary: "#FED7AA",
        secondary: "#9A3412",
        accent: "#F3E8FF",
        background: "#FEF3C7",
      },
    },
  ];

  const applyTheme = async (themeId) => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: themeId }),
      });

      if (response.ok) {
        setCurrentTheme(themeId);
      }
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  };

  const ThemeCard = ({ theme }) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: currentTheme === theme.id ? 2 : 0,
        borderColor: colors.green,
      }}
      onPress={() => applyTheme(theme.id)}
      activeOpacity={0.8}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor: theme.preview.primary,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <theme.icon size={24} color={theme.preview.secondary} />
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: colors.primary,
              }}
            >
              {theme.name}
            </Text>
            {currentTheme === theme.id && (
              <View
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: colors.green,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={16} color="white" />
              </View>
            )}
          </View>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
              marginBottom: 16,
            }}
          >
            {theme.description}
          </Text>
        </View>
      </View>

      {/* Theme Preview */}
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: theme.preview.background,
            borderRadius: 8,
            marginRight: 8,
            borderWidth: 1,
            borderColor: colors.secondary + "40",
          }}
        />
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: theme.preview.primary,
            borderRadius: 8,
            marginRight: 8,
          }}
        />
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: theme.preview.secondary,
            borderRadius: 8,
            marginRight: 8,
          }}
        />
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: theme.preview.accent,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.secondary + "40",
          }}
        />
      </View>

      {currentTheme === theme.id && (
        <View
          style={{
            backgroundColor: colors.green + "20",
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 12,
              color: colors.green,
              textAlign: "center",
            }}
          >
            Currently Applied
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

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
            Themes
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              color: colors.secondary,
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 32,
            }}
          >
            Choose a theme that reflects your style and enhances your
            eco-tracking experience.
          </Text>

          {themes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
