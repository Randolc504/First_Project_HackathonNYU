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
  Users,
  Trophy,
  TrendingUp,
  MapPin,
  Calendar,
  MessageCircle,
  Heart,
  Share,
  Settings,
  Crown,
  Medal,
  Award,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function Community() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

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

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={{
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: isActive ? colors.green : colors.cardBackground,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 14,
          color: isActive ? "white" : colors.primary,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const LeaderboardCard = ({
    rank,
    name,
    points,
    co2Saved,
    isCurrentUser = false,
  }) => {
    const getRankIcon = () => {
      switch (rank) {
        case 1:
          return <Crown size={24} color={colors.gold} />;
        case 2:
          return <Medal size={24} color="#C0C0C0" />;
        case 3:
          return <Award size={24} color="#CD7F32" />;
        default:
          return (
            <View
              style={{
                width: 24,
                height: 24,
                backgroundColor: colors.pastel.sky,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 12,
                  color: colors.primary,
                }}
              >
                {rank}
              </Text>
            </View>
          );
      }
    };

    return (
      <View
        style={{
          backgroundColor: isCurrentUser
            ? colors.pastel.mint
            : colors.cardBackground,
          borderRadius: 16,
          padding: 20,
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          borderWidth: isCurrentUser ? 2 : 0,
          borderColor: isCurrentUser ? colors.green : "transparent",
        }}
      >
        {getRankIcon()}
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 4,
            }}
          >
            {name} {isCurrentUser && "(You)"}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: colors.green,
              }}
            >
              {points} points
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              {co2Saved}kg CO₂ saved
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const PostCard = ({ author, time, content, co2Impact, likes, comments }) => (
    <View
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: colors.pastel.mint,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              color: colors.primary,
            }}
          >
            {author.charAt(0)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              color: colors.primary,
            }}
          >
            {author}
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: colors.secondary,
            }}
          >
            {time}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 16,
          color: colors.primary,
          lineHeight: 22,
          marginBottom: 12,
        }}
      >
        {content}
      </Text>

      {co2Impact && (
        <View
          style={{
            backgroundColor: colors.pastel.mint,
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 14,
              color: colors.primary,
              textAlign: "center",
            }}
          >
            🌱 Saved {co2Impact}kg CO₂ today!
          </Text>
        </View>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          activeOpacity={0.8}
        >
          <Heart size={20} color={colors.secondary} />
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: colors.secondary,
              marginLeft: 4,
            }}
          >
            {likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          activeOpacity={0.8}
        >
          <MessageCircle size={20} color={colors.secondary} />
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: colors.secondary,
              marginLeft: 4,
            }}
          >
            {comments}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}>
          <Share size={20} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EventCard = ({ title, description, date, location, participants }) => (
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
          fontSize: 18,
          color: colors.primary,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 14,
          color: colors.secondary,
          lineHeight: 20,
          marginBottom: 12,
        }}
      >
        {description}
      </Text>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Calendar size={16} color={colors.green} />
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 14,
            color: colors.primary,
            marginLeft: 8,
          }}
        >
          {date}
        </Text>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <MapPin size={16} color={colors.green} />
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 14,
            color: colors.primary,
            marginLeft: 8,
          }}
        >
          {location}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            color: colors.secondary,
          }}
        >
          {participants} people interested
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: colors.green,
            borderRadius: 12,
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 14,
              color: "white",
            }}
          >
            Join
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const BountyCard = ({
    title,
    description,
    target,
    reward,
    progress,
    daysLeft,
    completed,
  }) => (
    <View
      style={{
        backgroundColor: completed ? colors.pastel.mint : colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: completed ? 2 : 0,
        borderColor: completed ? colors.green : "transparent",
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
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            {description}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.pastel.yellow,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 12,
              color: colors.primary,
            }}
          >
            +{reward} pts
          </Text>
        </View>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 14,
            color: colors.primary,
            marginBottom: 8,
          }}
        >
          Target: {target}kg CO₂ saved
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: colors.secondary,
            }}
          >
            Progress: {progress}kg / {target}kg
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 12,
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
              width: `${Math.min((progress / target) * 100, 100)}%`,
              backgroundColor: completed ? colors.green : colors.gold,
              borderRadius: 3,
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            color: colors.secondary,
          }}
        >
          {completed ? "Completed! 🎉" : `${daysLeft} days left`}
        </Text>

        {completed && (
          <View
            style={{
              backgroundColor: colors.green,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 12,
                color: "white",
              }}
            >
              Claimed
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const PostComposer = () => (
    <View
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: colors.pastel.mint,
          borderRadius: 12,
          padding: 16,
          alignItems: "center",
        }}
        onPress={() => router.push("/create-post")}
      >
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
            color: colors.primary,
          }}
        >
          Share your eco action! 🌱
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Sample bounties data
  const bounties = [
    {
      title: "Green Week Challenge",
      description:
        "Save 50kg of CO₂ through your eco-actions this week and earn bonus points!",
      target: 50,
      reward: 200,
      progress: 32.5,
      daysLeft: 3,
      completed: false,
    },
    {
      title: "Transport Hero",
      description: "Use only sustainable transportation for one full week",
      target: 75,
      reward: 350,
      progress: 75,
      daysLeft: 0,
      completed: true,
    },
    {
      title: "Zero Waste Week",
      description: "Minimize waste and maximize recycling to save 30kg CO₂",
      target: 30,
      reward: 150,
      progress: 18.2,
      daysLeft: 5,
      completed: false,
    },
  ];

  // Sample data
  const leaderboard = [
    { rank: 1, name: "EcoHero23", points: 2450, co2Saved: 89.2 },
    { rank: 2, name: "GreenWarrior", points: 2180, co2Saved: 76.5 },
    { rank: 3, name: "ClimateChamp", points: 1980, co2Saved: 68.9 },
    { rank: 4, name: "You", points: 1250, co2Saved: 45.3, isCurrentUser: true },
    { rank: 5, name: "TreeHugger", points: 1150, co2Saved: 42.1 },
  ];

  const posts = [
    {
      author: "EcoHero23",
      time: "2 hours ago",
      content:
        "Just completed my first week of using public transport exclusively! 🚌 Amazing how much of a difference small changes can make.",
      co2Impact: 15.6,
      likes: 24,
      comments: 8,
    },
    {
      author: "GreenWarrior",
      time: "5 hours ago",
      content:
        "Started a community garden in my neighborhood! Anyone else interested in joining local sustainability initiatives?",
      co2Impact: null,
      likes: 31,
      comments: 12,
    },
    {
      author: "ClimateChamp",
      time: "1 day ago",
      content:
        "Switched to renewable energy at home today. It feels great knowing my daily actions are making a real impact! ⚡",
      co2Impact: 8.2,
      likes: 18,
      comments: 5,
    },
  ];

  const events = [
    {
      title: "Community Cleanup Day",
      description:
        "Join us for a neighborhood cleanup and tree planting event. Bring gloves and enthusiasm!",
      date: "Saturday, Nov 18",
      location: "Central Park",
      participants: 24,
    },
    {
      title: "Sustainable Living Workshop",
      description:
        "Learn practical tips for reducing waste and energy consumption in your daily life.",
      date: "Sunday, Nov 19",
      location: "Community Center",
      participants: 18,
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
          left: -100,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: colors.pastel.mint,
          opacity: isDark ? 0.4 : 0.3,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -150,
          right: -150,
          width: 300,
          height: 300,
          borderRadius: 150,
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
              Community
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Connect with eco-minded people
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Settings size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TabButton
            title="Feed"
            isActive={activeTab === "feed"}
            onPress={() => setActiveTab("feed")}
          />
          <TabButton
            title="Leaderboard"
            isActive={activeTab === "leaderboard"}
            onPress={() => setActiveTab("leaderboard")}
          />
          <TabButton
            title="Bounties"
            isActive={activeTab === "bounties"}
            onPress={() => setActiveTab("bounties")}
          />
          <TabButton
            title="Events"
            isActive={activeTab === "events"}
            onPress={() => setActiveTab("events")}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          {activeTab === "bounties" && (
            <>
              <View
                style={{
                  backgroundColor: colors.pastel.yellow,
                  borderRadius: 20,
                  padding: 24,
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Trophy size={48} color={colors.gold} />
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 24,
                    color: colors.primary,
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  Eco Bounties
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  Complete challenges and earn bonus points!
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              >
                Active Challenges
              </Text>
              {bounties.map((bounty, index) => (
                <BountyCard key={index} {...bounty} />
              ))}
            </>
          )}

          {activeTab === "feed" && (
            <>
              <PostComposer />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              >
                Recent Activity
              </Text>
              {posts.map((post, index) => (
                <PostCard key={index} {...post} />
              ))}
            </>
          )}

          {activeTab === "leaderboard" && (
            <>
              <View
                style={{
                  backgroundColor: colors.pastel.sky,
                  borderRadius: 20,
                  padding: 24,
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Trophy size={48} color={colors.gold} />
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 24,
                    color: colors.primary,
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  Weekly Leaderboard
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  See how you compare with others
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              >
                Top Eco Champions
              </Text>
              {leaderboard.map((user, index) => (
                <LeaderboardCard key={index} {...user} />
              ))}
            </>
          )}

          {activeTab === "events" && (
            <>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              >
                Upcoming Events
              </Text>
              {events.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}