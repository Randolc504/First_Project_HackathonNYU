import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  X,
  Camera,
  Video,
  Image as ImageIcon,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function ActionHistory() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [actions, setActions] = useState([]);
  const [filter, setFilter] = useState("all");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    loadActionHistory();
  }, []);

  const loadActionHistory = async () => {
    try {
      const response = await fetch("/api/actions/history");
      if (response.ok) {
        const data = await response.json();
        setActions(data.actions || []);
      }
    } catch (error) {
      console.error("Error loading action history:", error);
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
    orange: isDark ? "#FB923C" : "#EA580C",
    pastel: {
      mint: isDark ? "#1A4D2E" : "#DCFCE7",
      sky: isDark ? "#1E3A8A" : "#DBEAFE",
      orange: isDark ? "#9A3412" : "#FED7AA",
    },
  };

  const FilterTab = ({ title, value, isActive, onPress }) => (
    <TouchableOpacity
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: isActive ? colors.green : colors.cardBackground,
        marginRight: 8,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
          color: isActive ? "white" : colors.primary,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const getStatusInfo = (verificationStatus) => {
    switch (verificationStatus) {
      case "verified":
        return {
          color: colors.green,
          icon: CheckCircle,
          text: "Verified",
          bgColor: colors.green + "20",
        };
      case "rejected":
        return {
          color: colors.red,
          icon: X,
          text: "Rejected",
          bgColor: colors.red + "20",
        };
      case "pending":
        return {
          color: colors.orange,
          icon: Clock,
          text: "Pending Review",
          bgColor: colors.orange + "20",
        };
      default:
        return {
          color: colors.secondary,
          icon: Clock,
          text: "Awaiting Proof",
          bgColor: colors.secondary + "20",
        };
    }
  };

  const getProofIcon = (proofType) => {
    switch (proofType) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      default:
        return Camera;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const ActionCard = ({ action }) => {
    const statusInfo = getStatusInfo(action.verificationStatus);
    const ProofIcon = getProofIcon(action.proofType);

    return (
      <View
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: statusInfo.color,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {action.description}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
                marginBottom: 8,
              }}
            >
              {formatDate(action.createdAt)}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: statusInfo.bgColor,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <statusInfo.icon size={12} color={statusInfo.color} />
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 12,
                color: statusInfo.color,
                marginLeft: 4,
              }}
            >
              {statusInfo.text}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            {action.verificationStatus === "verified" ? (
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 14,
                  color: colors.green,
                }}
              >
                +{action.pointsEarned} points • {action.co2Impact}kg CO₂ saved
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                Potential: {action.pointsEarned} points • {action.co2Impact}kg
                CO₂
              </Text>
            )}
          </View>

          {action.proofUrl && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.pastel.sky,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}
              onPress={() => {
                /* View proof */
              }}
            >
              <ProofIcon size={12} color={colors.primary} />
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 11,
                  color: colors.primary,
                  marginLeft: 4,
                }}
              >
                View Proof
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {action.verificationStatus === "rejected" && action.rejectionReason && (
          <View
            style={{
              marginTop: 12,
              padding: 12,
              backgroundColor: colors.red + "10",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.red + "30",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 12,
                color: colors.red,
                marginBottom: 2,
              }}
            >
              Rejection Reason:
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
                color: colors.red,
              }}
            >
              {action.rejectionReason}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const filters = [
    { label: "All", value: "all" },
    { label: "Verified", value: "verified" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ];

  // Sample data - will be replaced with real data from API
  const sampleActions = [
    {
      id: 1,
      description: "Used public transport to work",
      actionType: "public_transport",
      verificationStatus: "verified",
      pointsEarned: 25,
      co2Impact: 2.3,
      proofType: "image",
      proofUrl: "https://example.com/proof1.jpg",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      description: "Recycled plastic bottles",
      actionType: "recycling",
      verificationStatus: "pending",
      pointsEarned: 8,
      co2Impact: 0.5,
      proofType: "image",
      proofUrl: "https://example.com/proof2.jpg",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      description: "Had vegetarian lunch",
      actionType: "plant_based_meal",
      verificationStatus: "rejected",
      pointsEarned: 15,
      co2Impact: 1.2,
      proofType: "image",
      proofUrl: "https://example.com/proof3.jpg",
      rejectionReason: "Image quality too poor to verify the meal content",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      description: "Turned off lights when leaving room",
      actionType: "energy_saving",
      verificationStatus: "verified",
      pointsEarned: 10,
      co2Impact: 0.8,
      proofType: "video",
      proofUrl: "https://example.com/proof4.mp4",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      description: "Biked to grocery store",
      actionType: "active_transport",
      verificationStatus: "verified",
      pointsEarned: 30,
      co2Impact: 2.8,
      proofType: "image",
      proofUrl: "https://example.com/proof5.jpg",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const filteredActions =
    filter === "all"
      ? sampleActions
      : sampleActions.filter((action) => action.verificationStatus === filter);

  const getStats = () => {
    const verified = sampleActions.filter(
      (a) => a.verificationStatus === "verified",
    );
    const totalPoints = verified.reduce((sum, a) => sum + a.pointsEarned, 0);
    const totalCO2 = verified.reduce((sum, a) => sum + a.co2Impact, 0);

    return { totalPoints, totalCO2, totalActions: verified.length };
  };

  const stats = getStats();

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
            Action History
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Card */}
        <View
          style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: 24 }}
        >
          <View
            style={{
              backgroundColor: colors.pastel.mint,
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Your Impact Summary
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 24,
                    color: colors.primary,
                  }}
                >
                  {stats.totalActions}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: colors.secondary,
                  }}
                >
                  Verified Actions
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 24,
                    color: colors.primary,
                  }}
                >
                  {stats.totalPoints}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: colors.secondary,
                  }}
                >
                  Points Earned
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 24,
                    color: colors.primary,
                  }}
                >
                  {stats.totalCO2.toFixed(1)}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: colors.secondary,
                  }}
                >
                  kg CO₂ Saved
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filterItem) => (
              <FilterTab
                key={filterItem.value}
                title={filterItem.label}
                value={filterItem.value}
                isActive={filter === filterItem.value}
                onPress={() => setFilter(filterItem.value)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Actions List */}
        <View style={{ paddingHorizontal: 24 }}>
          {filteredActions.length > 0 ? (
            filteredActions.map((action) => (
              <ActionCard key={action.id} action={action} />
            ))
          ) : (
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                padding: 32,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 16,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                No actions found for this filter
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
