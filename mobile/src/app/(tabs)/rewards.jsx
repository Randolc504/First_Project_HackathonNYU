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
  Award,
  Star,
  Trophy,
  Target,
  Zap,
  Flame,
  TreePine,
  Recycle,
  Lock,
  Settings,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function Rewards() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [rewards, setRewards] = useState(null);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const response = await fetch("/api/rewards");
      if (response.ok) {
        const data = await response.json();
        setRewards(data);
      }
    } catch (error) {
      console.error("Error loading rewards:", error);
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

  const ProgressCard = () => {
    const currentPoints = rewards?.currentPoints || 1250;
    const currentLevel = rewards?.currentLevel || 3;
    const pointsToNext = rewards?.pointsToNext || 750;
    const streak = rewards?.currentStreak || 7;

    return (
      <View style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: 32 }}>
        <View
          style={{
            backgroundColor: colors.pastel.mint,
            borderRadius: 20,
            padding: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Trophy size={28} color={colors.gold} />
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                }}
              >
                Level {currentLevel}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                }}
              >
                Eco Warrior
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Star size={28} color={colors.gold} />
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                }}
              >
                {currentPoints}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                }}
              >
                Total Points
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Flame size={28} color={colors.gold} />
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                }}
              >
                {streak}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                }}
              >
                Day Streak
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Next Level: {pointsToNext} points to go
            </Text>
            <View
              style={{
                height: 8,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "60%",
                  backgroundColor: colors.gold,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const BadgeCard = ({
    title,
    description,
    icon: IconComponent,
    color,
    earned,
    rarity,
  }) => (
    <View
      style={{
        backgroundColor: earned ? color : colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        opacity: earned ? 1 : 0.6,
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: earned
            ? "rgba(255, 255, 255, 0.2)"
            : colors.pastel.sky,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 16,
        }}
      >
        {earned ? (
          <IconComponent size={24} color={colors.primary} />
        ) : (
          <Lock size={20} color={colors.secondary} />
        )}
      </View>
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
              color: earned ? colors.primary : colors.secondary,
              marginRight: 8,
            }}
          >
            {title}
          </Text>
          <View
            style={{
              backgroundColor: rarity === "rare" ? colors.gold : colors.green,
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 10,
                color: "white",
                textTransform: "uppercase",
              }}
            >
              {rarity}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 14,
            color: earned ? colors.secondary : colors.secondary,
          }}
        >
          {description}
        </Text>
      </View>
    </View>
  );

  const AchievementCard = ({
    title,
    description,
    progress,
    target,
    icon: IconComponent,
    color,
  }) => (
    <View
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
      }}
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
            width: 40,
            height: 40,
            backgroundColor: color,
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
            }}
          >
            {description}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 14,
            color: colors.primary,
          }}
        >
          Progress: {progress}/{target}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 14,
            color: colors.green,
          }}
        >
          {Math.round((progress / target) * 100)}%
        </Text>
      </View>

      <View
        style={{
          height: 6,
          backgroundColor: isDark ? "#2C2C2C" : "#E5E7EB",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${(progress / target) * 100}%`,
            backgroundColor: colors.green,
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );

  // Sample data - will be replaced with real data
  const badges = [
    {
      title: "First Steps",
      description: "Complete your first eco action",
      icon: Target,
      color: colors.pastel.mint,
      earned: true,
      rarity: "common",
    },
    {
      title: "Transport Hero",
      description: "Use public transport 10 times",
      icon: Zap,
      color: colors.pastel.sky,
      earned: true,
      rarity: "common",
    },
    {
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: Flame,
      color: colors.pastel.orange,
      earned: true,
      rarity: "rare",
    },
    {
      title: "Green Guardian",
      description: "Save 100kg CO₂ total",
      icon: TreePine,
      color: colors.pastel.mint,
      earned: false,
      rarity: "rare",
    },
    {
      title: "Recycle Master",
      description: "Log 50 recycling actions",
      icon: Recycle,
      color: colors.pastel.purple,
      earned: false,
      rarity: "common",
    },
  ];

  const achievements = [
    {
      title: "Transport Champion",
      description: "Use sustainable transport 25 times",
      progress: 18,
      target: 25,
      icon: Zap,
      color: colors.pastel.sky,
    },
    {
      title: "Energy Saver",
      description: "Log 20 energy-saving actions",
      progress: 12,
      target: 20,
      icon: Award,
      color: colors.pastel.yellow,
    },
    {
      title: "Streak Legend",
      description: "Maintain a 30-day streak",
      progress: 7,
      target: 30,
      icon: Flame,
      color: colors.pastel.orange,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background circles */}
      <View
        style={{
          position: "absolute",
          top: -90,
          left: -90,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: colors.pastel.purple,
          opacity: isDark ? 0.4 : 0.3,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -110,
          right: -110,
          width: 220,
          height: 220,
          borderRadius: 110,
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
              Your achievements and progress
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
        {/* Progress Card */}
        <ProgressCard />

        {/* Badges Section */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Badges Earned
          </Text>
          {badges.map((badge, index) => (
            <BadgeCard key={index} {...badge} />
          ))}
        </View>

        {/* Achievements Section */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Current Goals
          </Text>
          {achievements.map((achievement, index) => (
            <AchievementCard key={index} {...achievement} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
