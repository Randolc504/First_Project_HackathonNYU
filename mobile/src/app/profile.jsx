import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Camera,
  Edit3,
  Award,
  Star,
  TrendingUp,
  CheckCircle,
  Calendar,
  BarChart3,
  TreePine,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    displayName: "Alex Green",
    bio: "Passionate about sustainable living and making a positive impact on our planet. Every small action counts! 🌱",
    profilePicture: null,
  });
  const [stats, setStats] = useState({
    totalPoints: 2847,
    level: 5,
    totalCO2Saved: 156.7,
    actionsCompleted: 47,
    streak: 12,
    joinDate: "March 2024",
    rank: 23,
  });

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    // Load user profile data
    // This would connect to an API in a real app
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
    },
  };

  const StatCard = ({ icon: IconComponent, title, value, subtitle, color }) => (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 16,
        padding: 16,
        flex: 1,
        marginHorizontal: 6,
        alignItems: "center",
      }}
    >
      <IconComponent
        size={24}
        color={colors.primary}
        style={{ marginBottom: 8 }}
      />
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 20,
          color: colors.primary,
          marginBottom: 2,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 11,
          color: colors.secondary,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 10,
            color: colors.green,
            textAlign: "center",
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );

  const ChartPlaceholder = () => (
    <View
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 16,
          color: colors.primary,
          marginBottom: 16,
        }}
      >
        CO₂ Savings Over Time
      </Text>

      {/* Simple bar chart representation */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "end",
          height: 120,
          marginBottom: 16,
        }}
      >
        {[20, 35, 45, 30, 55, 48, 62].map((height, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              backgroundColor: colors.green,
              height: height + 20,
              marginHorizontal: 2,
              borderRadius: 4,
              opacity: 0.7 + index / 10,
            }}
          />
        ))}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 11,
            color: colors.secondary,
          }}
        >
          Jan
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 11,
            color: colors.secondary,
          }}
        >
          Jul
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 11,
            color: colors.secondary,
          }}
        >
          Now
        </Text>
      </View>
    </View>
  );

  const Achievement = ({ title, description, earned, rarity }) => (
    <View
      style={{
        backgroundColor: earned ? colors.pastel.mint : colors.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        opacity: earned ? 1 : 0.6,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: earned ? colors.gold : colors.secondary,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Award size={20} color="white" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 14,
            color: colors.primary,
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            color: colors.secondary,
          }}
        >
          {description}
        </Text>
      </View>
      {earned && <CheckCircle size={20} color={colors.green} />}
    </View>
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
            Profile
          </Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Edit3 size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <TouchableOpacity
            style={{
              position: "relative",
              marginBottom: 16,
            }}
            disabled={!isEditing}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: colors.pastel.mint,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              {profile.profilePicture ? (
                <Image
                  source={{ uri: profile.profilePicture }}
                  style={{ width: 120, height: 120, borderRadius: 60 }}
                />
              ) : (
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 48,
                    color: colors.primary,
                  }}
                >
                  {profile.displayName.charAt(0)}
                </Text>
              )}
            </View>
            {isEditing && (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 36,
                  height: 36,
                  backgroundColor: colors.green,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Camera size={18} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {isEditing ? (
            <TextInput
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 24,
                color: colors.primary,
                textAlign: "center",
                borderBottomWidth: 1,
                borderBottomColor: colors.secondary,
                minWidth: 200,
                paddingVertical: 8,
              }}
              value={profile.displayName}
              onChangeText={(text) =>
                setProfile({ ...profile, displayName: text })
              }
              placeholder="Display Name"
              placeholderTextColor={colors.secondary}
            />
          ) : (
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 24,
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              {profile.displayName}
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Star size={16} color={colors.gold} />
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 16,
                color: colors.gold,
                marginLeft: 4,
                marginRight: 16,
              }}
            >
              Level {stats.level}
            </Text>
            <TrendingUp size={16} color={colors.green} />
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: colors.green,
                marginLeft: 4,
              }}
            >
              Rank #{stats.rank}
            </Text>
          </View>

          {isEditing ? (
            <TextInput
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
                borderWidth: 1,
                borderColor: colors.secondary,
                borderRadius: 8,
                padding: 12,
                width: "80%",
                minHeight: 80,
              }}
              value={profile.bio}
              onChangeText={(text) => setProfile({ ...profile, bio: text })}
              placeholder="Write something about yourself..."
              placeholderTextColor={colors.secondary}
              multiline
            />
          ) : (
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
                lineHeight: 20,
                paddingHorizontal: 32,
              }}
            >
              {profile.bio}
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Calendar size={14} color={colors.secondary} />
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
                color: colors.secondary,
                marginLeft: 4,
              }}
            >
              Joined {stats.joinDate}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Your Impact Stats
          </Text>

          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <StatCard
              icon={Star}
              title="Total Points"
              value={stats.totalPoints.toLocaleString()}
              color={colors.pastel.yellow}
            />
            <StatCard
              icon={TreePine}
              title="CO₂ Saved"
              value={`${stats.totalCO2Saved}kg`}
              subtitle="≈7.8 trees"
              color={colors.pastel.mint}
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            <StatCard
              icon={CheckCircle}
              title="Actions Done"
              value={stats.actionsCompleted}
              color={colors.pastel.sky}
            />
            <StatCard
              icon={TrendingUp}
              title="Streak"
              value={`${stats.streak} days`}
              color={colors.pastel.orange}
            />
          </View>
        </View>

        {/* CO2 Savings Chart */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <ChartPlaceholder />
        </View>

        {/* Recent Achievements */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Recent Achievements
          </Text>

          <Achievement
            title="Week Warrior"
            description="Maintained a 7-day streak"
            earned={true}
            rarity="rare"
          />
          <Achievement
            title="Transport Hero"
            description="Used sustainable transport 10 times"
            earned={true}
            rarity="common"
          />
          <Achievement
            title="Green Guardian"
            description="Saved 100kg of CO₂"
            earned={false}
            rarity="epic"
          />
        </View>

        {isEditing && (
          <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.green,
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                marginBottom: 12,
              }}
              onPress={() => setIsEditing(false)}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: "white",
                }}
              >
                Save Changes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
              onPress={() => setIsEditing(false)}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 16,
                  color: colors.secondary,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
