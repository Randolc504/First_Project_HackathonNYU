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
  Gift,
  Star,
  Lock,
  ShoppingCart,
  Utensils,
  Home,
  Car,
  TreePine,
  Settings,
  Crown,
  Award,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function Marketplace() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    loadMarketplace();
    loadUserStats();
  }, []);

  const loadMarketplace = async () => {
    try {
      const response = await fetch("/api/marketplace");
      if (response.ok) {
        const data = await response.json();
        setRewards(data.rewards || []);
      }
    } catch (error) {
      console.error("Error loading marketplace:", error);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await fetch("/api/rewards");
      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error("Error loading user stats:", error);
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
    gold: isDark ? "#F59E0B" : "#D97706",
    red: isDark ? "#EF4444" : "#DC2626",
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

  const CategoryButton = ({
    title,
    icon: IconComponent,
    isActive,
    onPress,
  }) => (
    <TouchableOpacity
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: isActive ? colors.green : colors.cardBackground,
        marginRight: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <IconComponent size={16} color={isActive ? "white" : colors.primary} />
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 14,
          color: isActive ? "white" : colors.primary,
          marginLeft: 6,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const RewardCard = ({ reward }) => {
    const canAfford = userStats && userStats.currentPoints >= reward.pointCost;
    const canUnlock =
      userStats && userStats.currentLevel >= reward.levelRequirement;
    const isAvailable = canAfford && canUnlock;

    return (
      <TouchableOpacity
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          opacity: isAvailable ? 1 : 0.7,
        }}
        onPress={() => isAvailable && handleRewardPress(reward)}
        activeOpacity={0.9}
        disabled={!isAvailable}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          <Image
            source={{ uri: reward.partnerLogo }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: colors.pastel.mint,
              marginRight: 16,
            }}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  flex: 1,
                }}
              >
                {reward.title}
              </Text>
              {!canUnlock && <Lock size={16} color={colors.secondary} />}
            </View>
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 12,
                color: colors.green,
                marginBottom: 2,
              }}
            >
              {reward.partnerName}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 14,
            color: colors.secondary,
            lineHeight: 20,
            marginBottom: 16,
          }}
        >
          {reward.description}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Star size={16} color={colors.gold} />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginLeft: 4,
                }}
              >
                {reward.pointCost} points
              </Text>
            </View>
            {reward.levelRequirement > 1 && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Crown size={12} color={colors.gold} />
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 12,
                    color: colors.secondary,
                    marginLeft: 4,
                  }}
                >
                  Level {reward.levelRequirement}+ required
                </Text>
              </View>
            )}
          </View>

          <View style={{ alignItems: "flex-end" }}>
            {reward.originalValue && (
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                  color: colors.secondary,
                  textDecorationLine: "line-through",
                }}
              >
                ${reward.originalValue}
              </Text>
            )}
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: colors.green,
              }}
            >
              {reward.discountPercentage === 100
                ? "FREE"
                : `${reward.discountPercentage}% OFF`}
            </Text>
          </View>
        </View>

        {!isAvailable && (
          <View
            style={{
              marginTop: 12,
              padding: 12,
              backgroundColor: colors.pastel.orange,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 12,
                color: colors.primary,
                textAlign: "center",
              }}
            >
              {!canUnlock
                ? `Unlock at Level ${reward.levelRequirement}`
                : `Need ${reward.pointCost - (userStats?.currentPoints || 0)} more points`}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleRewardPress = (reward) => {
    router.push(`/marketplace/${reward.id}`);
  };

  const categories = [
    { id: "all", title: "All", icon: Gift },
    { id: "food", title: "Food", icon: Utensils },
    { id: "shopping", title: "Shopping", icon: ShoppingCart },
    { id: "transport", title: "Transport", icon: Car },
    { id: "home", title: "Home", icon: Home },
    { id: "environment", title: "Environment", icon: TreePine },
  ];

  const filteredRewards = rewards.filter(
    (reward) => activeCategory === "all" || reward.category === activeCategory,
  );

  const PointsCard = () => (
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
          <Gift size={40} color={colors.primary} />
        </View>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 32,
            color: colors.primary,
            textAlign: "center",
          }}
        >
          {userStats?.currentPoints || 0}
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
          Available Points
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
          <Award size={16} color={colors.gold} />
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: colors.primary,
              marginLeft: 8,
            }}
          >
            Level {userStats?.currentLevel || 1}
          </Text>
        </View>
      </View>
    </View>
  );

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
          backgroundColor: colors.pastel.purple,
          opacity: isDark ? 0.4 : 0.3,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -120,
          left: -120,
          width: 240,
          height: 240,
          borderRadius: 120,
          backgroundColor: colors.pastel.pink,
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
            marginBottom: 16,
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
              Rewards
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Redeem points for eco-friendly deals
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Settings size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 24 }}
        >
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              title={category.title}
              icon={category.icon}
              isActive={activeCategory === category.id}
              onPress={() => setActiveCategory(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Points Card */}
        <PointsCard />

        {/* Rewards List */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            {activeCategory === "all"
              ? "All Rewards"
              : categories.find((c) => c.id === activeCategory)?.title +
                " Rewards"}
          </Text>
          {filteredRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
