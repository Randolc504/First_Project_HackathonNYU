import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // Get all active marketplace rewards
    const rewards = await sql`
      SELECT * FROM marketplace_rewards 
      WHERE is_active = TRUE 
      AND (expiry_date IS NULL OR expiry_date > CURRENT_DATE)
      ORDER BY level_requirement ASC, point_cost ASC
    `;

    return Response.json({
      rewards: rewards.map((reward) => ({
        id: reward.id,
        partnerName: reward.partner_name,
        partnerLogo: reward.partner_logo,
        title: reward.title,
        description: reward.description,
        category: reward.category,
        pointCost: reward.point_cost,
        levelRequirement: reward.level_requirement,
        originalValue: parseFloat(reward.original_value) || null,
        discountPercentage: reward.discount_percentage,
        termsConditions: reward.terms_conditions,
        expiryDate: reward.expiry_date,
        stockAvailable: reward.stock_available,
        createdAt: reward.created_at,
      })),
    });
  } catch (error) {
    console.error("Error fetching marketplace rewards:", error);
    return Response.json(
      { error: "Failed to fetch marketplace rewards" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { rewardId } = await request.json();

    if (!rewardId) {
      return Response.json({ error: "Reward ID is required" }, { status: 400 });
    }

    // Get the most recent user (since we don't have auth)
    const user = await sql`
      SELECT id FROM users ORDER BY created_at DESC LIMIT 1
    `;

    if (user.length === 0) {
      return Response.json({ error: "No user found" }, { status: 404 });
    }

    const userId = user[0].id;

    // Get reward details
    const reward = await sql`
      SELECT * FROM marketplace_rewards WHERE id = ${rewardId} AND is_active = TRUE
    `;

    if (reward.length === 0) {
      return Response.json({ error: "Reward not found" }, { status: 404 });
    }

    const rewardData = reward[0];

    // Get user rewards/points
    const userRewards = await sql`
      SELECT * FROM user_rewards WHERE user_id = ${userId}
    `;

    if (userRewards.length === 0) {
      return Response.json(
        { error: "User rewards not found" },
        { status: 404 },
      );
    }

    const userData = userRewards[0];

    // Check if user can afford the reward
    if (userData.total_points < rewardData.point_cost) {
      return Response.json({ error: "Insufficient points" }, { status: 400 });
    }

    // Check if user meets level requirement
    if (userData.current_level < rewardData.level_requirement) {
      return Response.json(
        { error: "Level requirement not met" },
        { status: 400 },
      );
    }

    // Check stock availability
    if (rewardData.stock_available <= 0) {
      return Response.json({ error: "Reward out of stock" }, { status: 400 });
    }

    // Generate redemption code
    const redemptionCode = generateRedemptionCode();

    // Create redemption record and update user points in transaction
    const result = await sql.transaction([
      sql`
        INSERT INTO user_reward_redemptions (
          user_id, reward_id, points_spent, redemption_code, expires_at
        ) VALUES (
          ${userId}, ${rewardId}, ${rewardData.point_cost}, ${redemptionCode},
          ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
        ) RETURNING *
      `,
      sql`
        UPDATE user_rewards 
        SET total_points = total_points - ${rewardData.point_cost}
        WHERE user_id = ${userId}
      `,
      sql`
        UPDATE marketplace_rewards 
        SET stock_available = stock_available - 1 
        WHERE id = ${rewardId}
      `,
    ]);

    const redemption = result[0][0];

    return Response.json({
      redemptionId: redemption.id,
      redemptionCode: redemption.redemption_code,
      pointsSpent: redemption.points_spent,
      expiresAt: redemption.expires_at,
      reward: {
        title: rewardData.title,
        partnerName: rewardData.partner_name,
        description: rewardData.description,
        termsConditions: rewardData.terms_conditions,
      },
    });
  } catch (error) {
    console.error("Error redeeming reward:", error);
    return Response.json({ error: "Failed to redeem reward" }, { status: 500 });
  }
}

function generateRedemptionCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
