import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // For now, get the most recent assessment since we don't have user auth
    // In a real app, this would filter by authenticated user
    const assessment = await sql`
      SELECT 
        ca.*,
        ur.current_streak,
        ur.total_points,
        ur.current_level
      FROM carbon_assessments ca
      LEFT JOIN user_rewards ur ON ca.user_id = ur.user_id
      ORDER BY ca.created_at DESC 
      LIMIT 1
    `;

    if (assessment.length === 0) {
      return Response.json({ error: "No assessment found" }, { status: 404 });
    }

    const data = assessment[0];

    // Calculate trend (mock for now - in real app would compare with previous periods)
    const trend = Math.random() > 0.5 ? "down" : "up";
    const trendPercentage = Math.floor(Math.random() * 20) + 5;

    // Get recent actions for today's savings calculation
    const todayActions = await sql`
      SELECT SUM(co2_impact) as today_savings
      FROM eco_actions 
      WHERE user_id = ${data.user_id} 
      AND DATE(created_at) = CURRENT_DATE
    `;

    const todaySavings = todayActions[0]?.today_savings || 0;

    return Response.json({
      userId: data.user_id,
      monthlyEmissions: parseFloat(data.monthly_emissions),
      yearlyEmissions: parseFloat(data.yearly_emissions),
      transportationEmissions: parseFloat(data.transportation_emissions),
      energyEmissions: parseFloat(data.energy_emissions),
      dietEmissions: parseFloat(data.diet_emissions),
      shoppingEmissions: parseFloat(data.shopping_emissions),
      wasteEmissions: parseFloat(data.waste_emissions),
      trend,
      trendPercentage,
      currentStreak: data.current_streak || 0,
      totalPoints: data.total_points || 0,
      currentLevel: data.current_level || 1,
      todaySavings: parseFloat(todaySavings) || 0,
      createdAt: data.created_at,
    });
  } catch (error) {
    console.error("Error fetching current carbon footprint:", error);
    return Response.json(
      { error: "Failed to fetch carbon footprint data" },
      { status: 500 },
    );
  }
}
