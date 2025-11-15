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
  Plus,
  Car,
  Lightbulb,
  Recycle,
  Utensils,
  Droplets,
  TreePine,
  Bike,
  Settings,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function Actions() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [actions, setActions] = useState([]);
  const [todayActions, setTodayActions] = useState([]);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      const response = await fetch("/api/actions");
      if (response.ok) {
        const data = await response.json();
        setActions(data.actions || []);
        setTodayActions(data.todayActions || []);
      }
    } catch (error) {
      console.error("Error loading actions:", error);
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
    pastel: {
      mint: isDark ? "#1A4D2E" : "#DCFCE7",
      sky: isDark ? "#1E3A8A" : "#DBEAFE",
      orange: isDark ? "#9A3412" : "#FED7AA",
      purple: isDark ? "#6B21A8" : "#E9D5FF",
      yellow: isDark ? "#854D0E" : "#FEF3C7",
      pink: isDark ? "#9F1239" : "#FCE7F3",
    },
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const handleQuickAction = async (actionType) => {
    try {
      const response = await fetch("/api/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actionType,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        loadActions();
      }
    } catch (error) {
      console.error("Error logging action:", error);
    }
  };

  const QuickActionCard = ({
    title,
    description,
    icon: IconComponent,
    color,
    impact,
    actionType,
  }) => (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => handleQuickAction(actionType)}
      activeOpacity={0.9}
    >
      <View
        style={{
          width: 60,
          height: 60,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 16,
        }}
      >
        <IconComponent size={28} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 18,
            color: colors.primary,
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 14,
            color: colors.secondary,
            marginBottom: 8,
          }}
        >
          {description}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 12,
            color: colors.green,
            marginBottom: 4,
          }}
        >
          Save {impact} kg CO₂
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 10,
            color: colors.secondary,
          }}
        >
          📸 Proof required for points
        </Text>
      </View>
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: colors.green,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Plus size={20} color="white" />
      </View>
    </TouchableOpacity>
  );

  const TodayActionItem = ({
    title,
    time,
    impact,
    verificationStatus,
    hasProof,
  }) => {
    const getStatusColor = () => {
      switch (verificationStatus) {
        case "verified":
          return colors.green;
        case "rejected":
          return colors.red;
        default:
          return colors.secondary;
      }
    };

    const getStatusText = () => {
      switch (verificationStatus) {
        case "verified":
          return "✅ Verified";
        case "rejected":
          return "❌ Rejected";
        case "pending":
          return "⏳ Pending";
        default:
          return "📤 Awaiting proof";
      }
    };

    return (
      <View
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: getStatusColor(),
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          {verificationStatus === "verified" ? (
            <CheckCircle size={20} color="white" />
          ) : (
            <Clock size={20} color="white" />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
                color: colors.secondary,
                marginRight: 12,
              }}
            >
              {time}
            </Text>
            {verificationStatus === "verified" && (
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: colors.green,
                }}
              >
                +{impact} kg CO₂ saved
              </Text>
            )}
          </View>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 11,
              color: getStatusColor(),
            }}
          >
            {getStatusText()}
          </Text>
        </View>
      </View>
    );
  };

  const quickActions = [
    {
      title: "Public Transport",
      description: "Used bus/train instead of driving",
      icon: Car,
      color: colors.pastel.sky,
      impact: 2.3,
      actionType: "public_transport",
    },
    {
      title: "Energy Saving",
      description: "Turned off lights/electronics",
      icon: Lightbulb,
      color: colors.pastel.yellow,
      impact: 0.8,
      actionType: "energy_saving",
    },
    {
      title: "Recycling",
      description: "Recycled waste properly",
      icon: Recycle,
      color: colors.pastel.mint,
      impact: 0.5,
      actionType: "recycling",
    },
    {
      title: "Plant-Based Meal",
      description: "Had a vegetarian/vegan meal",
      icon: Utensils,
      color: colors.pastel.orange,
      impact: 1.2,
      actionType: "plant_based_meal",
    },
    {
      title: "Water Conservation",
      description: "Shorter shower or saved water",
      icon: Droplets,
      color: colors.pastel.sky,
      impact: 0.3,
      actionType: "water_conservation",
    },
    {
      title: "Biking/Walking",
      description: "Walked or biked instead of driving",
      icon: Bike,
      color: colors.pastel.mint,
      impact: 2.8,
      actionType: "active_transport",
    },
  ];

  // Sample today's actions - will be replaced with real data
  const sampleTodayActions = [
    {
      title: "Used public transport",
      time: "2 hours ago",
      impact: 2.3,
      completed: true,
    },
    {
      title: "Recycled packaging",
      time: "4 hours ago",
      impact: 0.5,
      completed: true,
    },
    {
      title: "Had vegetarian lunch",
      time: "6 hours ago",
      impact: 1.2,
      completed: true,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background circles */}
      <View
        style={{
          position: "absolute",
          top: -100,
          right: -50,
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: colors.pastel.mint,
          opacity: isDark ? 0.4 : 0.3,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -120,
          left: -60,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: colors.pastel.sky,
          opacity: isDark ? 0.4 : 0.3,
        }}
      />

      {/* Fixed Header */}
      <View
        style={{
          backgroundColor: colors.background,
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 24,
          borderBottomWidth: showHeaderBorder ? 1 : 0,
          borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
          zIndex: 1000,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 24,
                color: colors.primary,
              }}
            >
              Eco Actions
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Track your sustainable habits
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Settings size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Today's Impact */}
        <View
          style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: 32 }}
        >
          <View
            style={{
              backgroundColor: colors.pastel.mint,
              borderRadius: 20,
              padding: 24,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 32,
                color: colors.primary,
                textAlign: "center",
              }}
            >
              4.0 kg CO₂
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Saved today
            </Text>
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TreePine size={16} color={colors.green} />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 14,
                  color: colors.primary,
                  marginLeft: 8,
                }}
              >
                Equal to planting 0.2 trees
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Quick Log Actions
          </Text>
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </View>

        {/* Today's Activities */}
        {sampleTodayActions.length > 0 && (
          <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                }}
              >
                Today's Activities
              </Text>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => router.push("/action-history")}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 14,
                    color: colors.green,
                    marginRight: 4,
                  }}
                >
                  View All
                </Text>
                <ArrowRight size={16} color={colors.green} />
              </TouchableOpacity>
            </View>
            {sampleTodayActions.map((activity, index) => (
              <TodayActionItem key={index} {...activity} />
            ))}
          </View>
        )}

        {/* Custom Action Button */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: colors.green,
              borderStyle: "dashed",
            }}
            onPress={() => router.push("/log-custom-action")}
            activeOpacity={0.9}
          >
            <Plus size={24} color={colors.green} />
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: colors.green,
                marginLeft: 8,
              }}
            >
              Log Custom Action
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
