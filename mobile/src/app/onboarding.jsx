import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Home,
  Utensils,
  ShoppingBag,
  Trash2,
  Leaf,
  CheckCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const questions = [
  {
    id: "transportation",
    title: "Transportation",
    icon: Car,
    description: "Tell us about your travel habits",
    questions: [
      {
        key: "carMiles",
        label: "How many miles do you drive per week?",
        type: "number",
        placeholder: "150",
      },
      {
        key: "carType",
        label: "What type of car do you drive?",
        type: "select",
        options: ["Gas", "Hybrid", "Electric", "No car"],
      },
      {
        key: "publicTransport",
        label: "How often do you use public transport?",
        type: "select",
        options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      },
      {
        key: "flights",
        label: "How many flights do you take per year?",
        type: "number",
        placeholder: "2",
      },
    ],
  },
  {
    id: "energy",
    title: "Home Energy",
    icon: Home,
    description: "Your household energy consumption",
    questions: [
      {
        key: "homeSize",
        label: "What size is your home?",
        type: "select",
        options: ["Studio/1BR", "2BR", "3BR", "4BR+", "House"],
      },
      {
        key: "energySource",
        label: "What powers your home?",
        type: "select",
        options: [
          "Coal/Gas",
          "Mixed Grid",
          "Some Renewable",
          "Mostly Renewable",
        ],
      },
      {
        key: "heatingCooling",
        label: "How do you heat/cool your home?",
        type: "select",
        options: ["Gas", "Electric", "Heat Pump", "Solar"],
      },
      {
        key: "monthlyBill",
        label: "Average monthly energy bill ($)?",
        type: "number",
        placeholder: "120",
      },
    ],
  },
  {
    id: "diet",
    title: "Diet & Food",
    icon: Utensils,
    description: "Your eating habits and food choices",
    questions: [
      {
        key: "dietType",
        label: "What best describes your diet?",
        type: "select",
        options: [
          "Heavy Meat",
          "Moderate Meat",
          "Low Meat",
          "Vegetarian",
          "Vegan",
        ],
      },
      {
        key: "localFood",
        label: "How often do you buy local/organic food?",
        type: "select",
        options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      },
      {
        key: "foodWaste",
        label: "How much food do you typically waste?",
        type: "select",
        options: ["A lot", "Some", "Very little", "Almost none"],
      },
    ],
  },
  {
    id: "shopping",
    title: "Shopping",
    icon: ShoppingBag,
    description: "Your consumption and purchasing habits",
    questions: [
      {
        key: "clothesShopping",
        label: "How often do you buy new clothes?",
        type: "select",
        options: ["Weekly", "Monthly", "Few times a year", "Rarely"],
      },
      {
        key: "secondHand",
        label: "Do you buy second-hand items?",
        type: "select",
        options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      },
      {
        key: "onlineShopping",
        label: "How many packages do you receive per month?",
        type: "number",
        placeholder: "5",
      },
    ],
  },
  {
    id: "waste",
    title: "Waste & Recycling",
    icon: Trash2,
    description: "How you handle waste and recycling",
    questions: [
      {
        key: "recycling",
        label: "How often do you recycle?",
        type: "select",
        options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      },
      {
        key: "composting",
        label: "Do you compost organic waste?",
        type: "select",
        options: ["Never", "Sometimes", "Always"],
      },
      {
        key: "plastic",
        label: "How do you handle single-use plastics?",
        type: "select",
        options: [
          "Use regularly",
          "Use sometimes",
          "Avoid when possible",
          "Never use",
        ],
      },
    ],
  },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    pastel: {
      mint: isDark ? "#1A4D2E" : "#DCFCE7",
      sky: isDark ? "#1E3A8A" : "#DBEAFE",
      orange: isDark ? "#9A3412" : "#FED7AA",
      purple: isDark ? "#6B21A8" : "#E9D5FF",
    },
  };

  const handleAnswerChange = (questionKey, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/carbon-footprint/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        router.push("/onboarding-results");
      } else {
        console.error("Failed to calculate carbon footprint");
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  if (currentStep === -1) {
    // Welcome screen
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <View
          style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: 24 }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                backgroundColor: colors.pastel.mint,
                borderRadius: 60,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 32,
              }}
            >
              <Leaf size={60} color={colors.primary} />
            </View>

            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 32,
                color: colors.primary,
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Welcome to EcoTrack
            </Text>

            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 18,
                color: colors.secondary,
                textAlign: "center",
                lineHeight: 24,
                marginBottom: 48,
              }}
            >
              Let's calculate your carbon footprint and start your journey to a
              more sustainable lifestyle.
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: colors.green,
                borderRadius: 24,
                paddingVertical: 16,
                paddingHorizontal: 48,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => setCurrentStep(0)}
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
                Get Started
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const SelectOption = ({ option, isSelected, onPress }) => (
    <TouchableOpacity
      style={{
        backgroundColor: isSelected ? colors.green : colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 16,
          color: isSelected ? "white" : colors.primary,
        }}
      >
        {option}
      </Text>
      {isSelected && <CheckCircle size={20} color="white" />}
    </TouchableOpacity>
  );

  const NumberInput = ({ placeholder, value, onChangeText }) => (
    <TextInput
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        fontSize: 16,
        color: colors.primary,
        fontFamily: "Poppins_400Regular",
        marginBottom: 12,
      }}
      placeholder={placeholder}
      placeholderTextColor={colors.secondary}
      value={value}
      onChangeText={onChangeText}
      keyboardType="numeric"
    />
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
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft
              size={24}
              color={currentStep === 0 ? colors.secondary : colors.primary}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
            }}
          >
            {currentStep + 1} of {questions.length}
          </Text>

          <TouchableOpacity onPress={() => router.back()}>
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 16,
                color: colors.secondary,
              }}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View
          style={{
            height: 4,
            backgroundColor: isDark ? "#2C2C2C" : "#E5E7EB",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: colors.green,
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 32 }}>
          {/* Category Header */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: colors.pastel.mint,
                borderRadius: 40,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <currentQuestion.icon size={40} color={colors.primary} />
            </View>

            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 28,
                color: colors.primary,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {currentQuestion.title}
            </Text>

            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              {currentQuestion.description}
            </Text>
          </View>

          {/* Questions */}
          {currentQuestion.questions.map((q, index) => (
            <View key={q.key} style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              >
                {q.label}
              </Text>

              {q.type === "select" ? (
                q.options.map((option) => (
                  <SelectOption
                    key={option}
                    option={option}
                    isSelected={answers[q.key] === option}
                    onPress={() => handleAnswerChange(q.key, option)}
                  />
                ))
              ) : (
                <NumberInput
                  placeholder={q.placeholder}
                  value={answers[q.key] || ""}
                  onChangeText={(value) => handleAnswerChange(q.key, value)}
                />
              )}
            </View>
          ))}
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
            opacity: isSubmitting ? 0.6 : 1,
          }}
          onPress={handleNext}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: "white",
            }}
          >
            {currentStep === questions.length - 1
              ? isSubmitting
                ? "Calculating..."
                : "Calculate My Footprint"
              : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
