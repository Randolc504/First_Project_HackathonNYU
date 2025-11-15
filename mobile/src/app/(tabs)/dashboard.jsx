import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Leaf,
  TrendingDown,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Plus,
  Settings,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const { width: screenWidth } = Dimensions.get("window");

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await fetch("/api/carbon-footprint/current");
      if (response.ok) {
        const data = await response.json();
        setCarbonFootprint(data);
      } else {
        // If no data exists, show onboarding
        router.push("/onboarding");
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      // If there's an error, also redirect to onboarding
      router.push("/onboarding");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded || loading) {
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

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const CarbonScoreCard = () => {
    const monthlyScore = carbonFootprint?.monthlyEmissions || 2.4;
    const yearlyScore = carbonFootprint?.yearlyEmissions || 28.8;
    const trend = carbonFootprint?.trend || "down";
    const trendPercentage = carbonFootprint?.trendPercentage || 12;

    return (
      <View style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: 32 }}>
        <View
          style={{
            backgroundColor: colors.pastel.mint,
            borderRadius: 20,
            padding: 24,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 40,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Leaf size={40} color={colors.primary} />
          </View>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 32,
              color: colors.primary,
              textAlign: "center",
            }}
          >
            {monthlyScore} tons
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
            Carbon emissions this month
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {trend === "down" ? (
              <TrendingDown size={16} color={colors.green} />
            ) : (
              <TrendingUp size={16} color={colors.red} />
            )}
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: trend === "down" ? colors.green : colors.red,
                marginLeft: 4,
              }}
            >
              {trendPercentage}% vs last month
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const EmissionCard = ({
    title,
    value,
    percentage,
    trend,
    color,
    icon: IconComponent,
  }) => (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 16,
        padding: 20,
        flex: 1,
        marginHorizontal: 4,
        alignItems: "center",
      }}
    >
      <IconComponent
        size={24}
        color={colors.primary}
        style={{ marginBottom: 12 }}
      />
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 20,
          color: colors.primary,
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 12,
          color: colors.secondary,
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {trend === "up" ? (
          <ArrowUp size={12} color={colors.red} />
        ) : (
          <ArrowDown size={12} color={colors.green} />
        )}
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 11,
            color: trend === "up" ? colors.red : colors.green,
            marginLeft: 2,
          }}
        >
          {percentage}%
        </Text>
      </View>
    </View>
  );

  const RecommendationCard = ({ title, description, impact, onPress }) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={onPress}
      activeOpacity={0.9}
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
          }}
        >
          Save {impact} kg CO₂/month
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

  // Use real data instead of sample data
  const emissionsData = carbonFootprint
    ? [
        {
          title: "Transportation",
          value: `${carbonFootprint.transportationEmissions}t`,
          percentage: 5,
          trend: "down",
          color: colors.pastel.sky,
          icon: ArrowUp,
        },
        {
          title: "Home Energy",
          value: `${carbonFootprint.energyEmissions}t`,
          percentage: 8,
          trend: "up",
          color: colors.pastel.orange,
          icon: ArrowUp,
        },
        {
          title: "Food",
          value: `${carbonFootprint.dietEmissions}t`,
          percentage: 15,
          trend: "down",
          color: colors.pastel.purple,
          icon: ArrowUp,
        },
      ]
    : [];

  // Use real recommendations based on highest emission categories
  const getRecommendations = () => {
    if (!carbonFootprint) return [];

    const recommendations = [];

    if (carbonFootprint.transportationEmissions > 2.0) {
      recommendations.push({
        title: "Use public transport",
        description: "Take the bus or train twice this week instead of driving",
        impact: 25,
      });
    }

    if (carbonFootprint.energyEmissions > 2.0) {
      recommendations.push({
        title: "Switch to LED bulbs",
        description: "Replace remaining incandescent bulbs in your home",
        impact: 12,
      });
    }

    if (carbonFootprint.dietEmissions > 1.5) {
      recommendations.push({
        title: "Meatless Monday",
        description: "Try one vegetarian day per week to reduce food emissions",
        impact: 18,
      });
    }

    // Add default recommendations if none above qualify
    if (recommendations.length === 0) {
      recommendations.push({
        title: "Start small",
        description: "Turn off lights when leaving a room",
        impact: 8,
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background circles */}
      <View
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: colors.pastel.mint,
          opacity: isDark ? 0.4 : 0.3,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 200,
          height: 200,
          borderRadius: 100,
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
              EcoTrack
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Your carbon footprint
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
        {/* Carbon Score Card */}
        <CarbonScoreCard />

        {/* Emissions Breakdown */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Emissions Breakdown
          </Text>
          <View style={{ flexDirection: "row", marginHorizontal: -4 }}>
            {emissionsData.map((item, index) => (
              <EmissionCard key={index} {...item} />
            ))}
          </View>
        </View>

        {/* Environmental Impact Section */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Your Environmental Impact
          </Text>

          <View
            style={{
              backgroundColor: colors.pastel.mint,
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Leaf size={40} color={colors.green} />
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 32,
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                47.2 kg
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
                Total CO₂ Saved This Month
              </Text>
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 12,
                    color: colors.primary,
                  }}
                >
                  ≈ 2.3 trees planted
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 16,
                padding: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                🌍 You're making a difference!
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.primary,
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                Your eco-actions have saved 3x more carbon than the average
                person this month. Keep up the amazing work!
              </Text>
            </View>
          </View>

          {/* Comparison Stats */}
          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: colors.primary,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              How You Compare
            </Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: colors.pastel.sky,
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <ArrowUp size={24} color={colors.primary} />
                </View>
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 18,
                    color: colors.primary,
                  }}
                >
                  47.2 kg
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 11,
                    color: colors.secondary,
                    textAlign: "center",
                  }}
                >
                  You
                </Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: colors.pastel.orange,
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <ArrowDown size={24} color={colors.primary} />
                </View>
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 18,
                    color: colors.primary,
                  }}
                >
                  15.8 kg
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 11,
                    color: colors.secondary,
                    textAlign: "center",
                  }}
                >
                  Average User
                </Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: colors.pastel.purple,
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <TrendingUp size={24} color={colors.primary} />
                </View>
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 18,
                    color: colors.green,
                  }}
                >
                  +199%
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 11,
                    color: colors.secondary,
                    textAlign: "center",
                  }}
                >
                  Above Average
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Recommendations */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Recommended Actions
          </Text>
          {recommendations.map((rec, index) => (
            <RecommendationCard
              key={index}
              {...rec}
              onPress={() => router.push("/actions")}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: insets.bottom + 100,
          right: 24,
          width: 56,
          height: 56,
          backgroundColor: colors.green,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
          elevation: 8,
          shadowColor: colors.green,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          zIndex: 1000,
        }}
        onPress={() => router.push("/log-action")}
        activeOpacity={0.8}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
