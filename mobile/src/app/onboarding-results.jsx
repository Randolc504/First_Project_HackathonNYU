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
  ArrowRight,
  Car,
  Home,
  Utensils,
  ShoppingBag,
  Trash2,
  Globe,
  Users,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const { width: screenWidth } = Dimensions.get("window");

export default function OnboardingResults() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const response = await fetch("/api/carbon-footprint/current");
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Error loading results:", error);
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
      yellow: isDark ? "#854D0E" : "#FEF3C7",
    },
  };

  const CarbonScoreCard = () => {
    const yearlyEmissions = results?.yearlyEmissions || 8.5;
    const monthlyEmissions = results?.monthlyEmissions || 0.7;

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
              width: 100,
              height: 100,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Leaf size={50} color={colors.primary} />
          </View>

          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 36,
              color: colors.primary,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {yearlyEmissions} tons CO₂
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              color: colors.secondary,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Your estimated annual carbon footprint
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
            <TrendingDown size={16} color={colors.green} />
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: colors.primary,
                marginLeft: 8,
              }}
            >
              Below average! Good work
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const BreakdownCard = ({
    title,
    value,
    icon: IconComponent,
    color,
    percentage,
  }) => (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 16,
        }}
      >
        <IconComponent size={24} color={colors.primary} />
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
          {value} tons CO₂/year
        </Text>
        <View
          style={{
            height: 6,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${percentage}%`,
              backgroundColor: colors.primary,
              borderRadius: 3,
            }}
          />
        </View>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 20,
            color: colors.primary,
          }}
        >
          {percentage}%
        </Text>
      </View>
    </View>
  );

  const ComparisonCard = () => (
    <View
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Globe size={24} color={colors.green} />
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 18,
            color: colors.primary,
            marginLeft: 12,
          }}
        >
          How You Compare
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 4,
            }}
          >
            {results?.yearlyEmissions || 8.5}t
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: colors.secondary,
              textAlign: "center",
            }}
          >
            Your Impact
          </Text>
        </View>

        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.secondary,
              marginBottom: 4,
            }}
          >
            12.3t
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: colors.secondary,
              textAlign: "center",
            }}
          >
            US Average
          </Text>
        </View>

        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.secondary,
              marginBottom: 4,
            }}
          >
            4.8t
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: colors.secondary,
              textAlign: "center",
            }}
          >
            Global Average
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.pastel.mint,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 14,
            color: colors.primary,
            textAlign: "center",
          }}
        >
          🎉 You're already doing better than most Americans!
        </Text>
      </View>
    </View>
  );

  // Calculate breakdown data
  const breakdownData = [
    {
      title: "Transportation",
      value: results?.transportationEmissions || 3.2,
      icon: Car,
      color: colors.pastel.sky,
      percentage: 38,
    },
    {
      title: "Home Energy",
      value: results?.energyEmissions || 2.8,
      icon: Home,
      color: colors.pastel.orange,
      percentage: 33,
    },
    {
      title: "Food",
      value: results?.dietEmissions || 1.5,
      icon: Utensils,
      color: colors.pastel.purple,
      percentage: 18,
    },
    {
      title: "Shopping",
      value: results?.shoppingEmissions || 0.7,
      icon: ShoppingBag,
      color: colors.pastel.yellow,
      percentage: 8,
    },
    {
      title: "Waste",
      value: results?.wasteEmissions || 0.3,
      icon: Trash2,
      color: colors.pastel.mint,
      percentage: 3,
    },
  ];

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

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          paddingBottom: 16,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 28,
            color: colors.primary,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Your Carbon Footprint
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 16,
            color: colors.secondary,
            textAlign: "center",
          }}
        >
          Here's your personal environmental impact
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Carbon Score Card */}
        <CarbonScoreCard />

        {/* Comparison Card */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <ComparisonCard />
        </View>

        {/* Breakdown Section */}
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
          {breakdownData.map((item, index) => (
            <BreakdownCard key={index} {...item} />
          ))}
        </View>

        {/* Recommendations Preview */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View
            style={{
              backgroundColor: colors.pastel.mint,
              borderRadius: 20,
              padding: 24,
              alignItems: "center",
            }}
          >
            <Users size={48} color={colors.primary} />
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 24,
                color: colors.primary,
                textAlign: "center",
                marginTop: 16,
                marginBottom: 12,
              }}
            >
              Ready to Make a Change?
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: colors.secondary,
                textAlign: "center",
                lineHeight: 22,
                marginBottom: 20,
              }}
            >
              We'll help you reduce your impact with personalized
              recommendations and track your progress.
            </Text>
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 14,
                  color: colors.primary,
                }}
              >
                Join 50,000+ eco-warriors making a difference
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom + 24,
          left: 24,
          right: 24,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: colors.green,
            borderRadius: 24,
            paddingVertical: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={() => router.push("/(tabs)/dashboard")}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: "white",
              marginRight: 8,
            }}
          >
            Start Your Eco Journey
          </Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
