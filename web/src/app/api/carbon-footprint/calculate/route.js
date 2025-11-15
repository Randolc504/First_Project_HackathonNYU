import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { answers } = await request.json();

    if (!answers) {
      return Response.json(
        { error: "Assessment answers are required" },
        { status: 400 },
      );
    }

    // Calculate emissions based on answers
    const emissions = calculateEmissions(answers);

    // Create or get user (for now we'll use a simple approach without auth)
    const userResult = await sql`INSERT INTO users DEFAULT VALUES RETURNING id`;
    const userId = userResult[0].id;

    // Store the assessment
    const assessmentResult = await sql`
      INSERT INTO carbon_assessments (
        user_id, 
        assessment_data, 
        monthly_emissions, 
        yearly_emissions,
        transportation_emissions,
        energy_emissions,
        diet_emissions,
        shopping_emissions,
        waste_emissions
      ) VALUES (
        ${userId},
        ${JSON.stringify(answers)},
        ${emissions.monthly},
        ${emissions.yearly},
        ${emissions.transportation},
        ${emissions.energy},
        ${emissions.diet},
        ${emissions.shopping},
        ${emissions.waste}
      ) RETURNING id
    `;

    // Create initial user rewards record
    await sql`
      INSERT INTO user_rewards (user_id, total_points, current_level, current_streak)
      VALUES (${userId}, 0, 1, 0)
    `;

    // Initialize user achievements for all badges
    const badges = await sql`SELECT id FROM badges`;
    for (const badge of badges) {
      await sql`
        INSERT INTO user_achievements (user_id, badge_id, progress)
        VALUES (${userId}, ${badge.id}, 0)
      `;
    }

    return Response.json({
      assessmentId: assessmentResult[0].id,
      userId,
      emissions,
    });
  } catch (error) {
    console.error("Error calculating carbon footprint:", error);
    return Response.json(
      { error: "Failed to calculate carbon footprint" },
      { status: 500 },
    );
  }
}

function calculateEmissions(answers) {
  let transportation = 0;
  let energy = 0;
  let diet = 0;
  let shopping = 0;
  let waste = 0;

  // Transportation calculations
  if (answers.carMiles) {
    const milesPerWeek = parseFloat(answers.carMiles) || 0;
    const milesPerYear = milesPerWeek * 52;

    // Emissions factor based on car type (kg CO2 per mile)
    let emissionsFactor = 0.404; // Default for gas car
    if (answers.carType === "Hybrid") emissionsFactor = 0.25;
    else if (answers.carType === "Electric") emissionsFactor = 0.1;
    else if (answers.carType === "No car") emissionsFactor = 0;

    transportation += milesPerYear * emissionsFactor;
  }

  // Flights
  if (answers.flights) {
    const flightsPerYear = parseFloat(answers.flights) || 0;
    transportation += flightsPerYear * 1000; // Average 1000kg CO2 per flight
  }

  // Public transport usage reduces transportation emissions
  if (answers.publicTransport === "Always") transportation *= 0.5;
  else if (answers.publicTransport === "Often") transportation *= 0.7;
  else if (answers.publicTransport === "Sometimes") transportation *= 0.85;

  // Home Energy calculations
  if (answers.monthlyBill) {
    const monthlyBill = parseFloat(answers.monthlyBill) || 0;
    const annualKwh = monthlyBill * 12 * 10; // Rough estimate: $1 = 10 kWh

    // Emissions factor based on energy source (kg CO2 per kWh)
    let emissionsFactor = 0.5; // Default mixed grid
    if (answers.energySource === "Coal/Gas") emissionsFactor = 0.8;
    else if (answers.energySource === "Some Renewable") emissionsFactor = 0.3;
    else if (answers.energySource === "Mostly Renewable") emissionsFactor = 0.1;

    energy = annualKwh * emissionsFactor;
  }

  // Home size adjustment
  const sizeMultiplier = {
    "Studio/1BR": 0.7,
    "2BR": 1.0,
    "3BR": 1.3,
    "4BR+": 1.6,
    House: 2.0,
  };
  energy *= sizeMultiplier[answers.homeSize] || 1.0;

  // Diet calculations (kg CO2 per year)
  const dietEmissions = {
    Vegan: 600,
    Vegetarian: 1200,
    "Low Meat": 1800,
    "Moderate Meat": 2500,
    "Heavy Meat": 3600,
  };
  diet = dietEmissions[answers.dietType] || 2500;

  // Local/organic food reduces emissions
  if (answers.localFood === "Always") diet *= 0.8;
  else if (answers.localFood === "Often") diet *= 0.9;

  // Food waste increases emissions
  if (answers.foodWaste === "A lot") diet *= 1.3;
  else if (answers.foodWaste === "Some") diet *= 1.1;

  // Shopping calculations
  // Clothes shopping
  const clothesEmissions = {
    Weekly: 800,
    Monthly: 400,
    "Few times a year": 200,
    Rarely: 100,
  };
  shopping += clothesEmissions[answers.clothesShopping] || 300;

  // Second-hand reduces emissions
  if (answers.secondHand === "Always") shopping *= 0.3;
  else if (answers.secondHand === "Often") shopping *= 0.5;
  else if (answers.secondHand === "Sometimes") shopping *= 0.7;

  // Online shopping
  if (answers.onlineShopping) {
    const packagesPerMonth = parseFloat(answers.onlineShopping) || 0;
    shopping += packagesPerMonth * 12 * 15; // 15kg CO2 per package average
  }

  // Waste calculations
  const recyclingReduction = {
    Never: 1.0,
    Rarely: 0.9,
    Sometimes: 0.7,
    Often: 0.5,
    Always: 0.3,
  };
  waste = 300; // Base waste emissions
  waste *= recyclingReduction[answers.recycling] || 1.0;

  // Composting reduces waste emissions
  if (answers.composting === "Always") waste *= 0.7;
  else if (answers.composting === "Sometimes") waste *= 0.85;

  // Plastic usage
  if (answers.plastic === "Use regularly") waste *= 1.3;
  else if (answers.plastic === "Never use") waste *= 0.6;

  const yearlyTotal = transportation + energy + diet + shopping + waste;
  const monthlyTotal = yearlyTotal / 12;

  return {
    yearly: Math.round((yearlyTotal / 1000) * 100) / 100, // Convert to tons and round
    monthly: Math.round((monthlyTotal / 1000) * 100) / 100,
    transportation: Math.round((transportation / 1000) * 100) / 100,
    energy: Math.round((energy / 1000) * 100) / 100,
    diet: Math.round((diet / 1000) * 100) / 100,
    shopping: Math.round((shopping / 1000) * 100) / 100,
    waste: Math.round((waste / 1000) * 100) / 100,
  };
}
