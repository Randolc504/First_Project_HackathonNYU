import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // Get the most recent user (since we don't have auth)
    const user = await sql`
      SELECT id FROM users ORDER BY created_at DESC LIMIT 1
    `;

    if (user.length === 0) {
      return Response.json({ actions: [], todayActions: [] });
    }

    const userId = user[0].id;

    // Get all actions for the user
    const actions = await sql`
      SELECT * FROM eco_actions 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    // Get today's actions
    const todayActions = await sql`
      SELECT 
        action_type,
        description,
        co2_impact,
        created_at
      FROM eco_actions 
      WHERE user_id = ${userId} 
      AND DATE(created_at) = CURRENT_DATE
      ORDER BY created_at DESC
    `;

    return Response.json({
      actions: actions.map((action) => ({
        id: action.id,
        actionType: action.action_type,
        description: action.description,
        co2Impact: parseFloat(action.co2_impact),
        pointsEarned: action.points_earned,
        createdAt: action.created_at,
      })),
      todayActions: todayActions.map((action) => ({
        actionType: action.action_type,
        description: action.description,
        co2Impact: parseFloat(action.co2_impact),
        createdAt: action.created_at,
      })),
    });
  } catch (error) {
    console.error("Error fetching actions:", error);
    return Response.json({ error: "Failed to fetch actions" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { actionType, description, timestamp, proofUrl, proofType } =
      await request.json();

    if (!actionType) {
      return Response.json(
        { error: "Action type is required" },
        { status: 400 },
      );
    }

    // Get the most recent user (since we don't have auth)
    const user = await sql`
      SELECT id FROM users ORDER BY created_at DESC LIMIT 1
    `;

    if (user.length === 0) {
      return Response.json({ error: "No user found" }, { status: 404 });
    }

    const userId = user[0].id;

    // Calculate CO2 impact and points based on action type
    const actionData = getActionData(actionType);

    // Insert the action with pending verification status
    const result = await sql`
      INSERT INTO eco_actions (
        user_id, 
        action_type, 
        description, 
        co2_impact, 
        points_earned,
        proof_url,
        proof_type,
        verification_status
      ) VALUES (
        ${userId},
        ${actionType},
        ${description || actionData.description},
        ${actionData.co2Impact},
        ${actionData.points},
        ${proofUrl || null},
        ${proofType || null},
        ${proofUrl ? "pending" : "awaiting_proof"}
      ) RETURNING *
    `;

    // Note: We don't update user rewards or achievements until verification
    // This will be done when the action is verified

    return Response.json({
      id: result[0].id,
      actionType: result[0].action_type,
      description: result[0].description,
      co2Impact: parseFloat(result[0].co2_impact),
      pointsEarned: result[0].points_earned,
      verificationStatus: result[0].verification_status,
      proofUrl: result[0].proof_url,
      proofType: result[0].proof_type,
      createdAt: result[0].created_at,
    });
  } catch (error) {
    console.error("Error creating action:", error);
    return Response.json({ error: "Failed to create action" }, { status: 500 });
  }
}

function getActionData(actionType) {
  const actionTypes = {
    public_transport: {
      description: "Used public transport instead of driving",
      co2Impact: 2.3,
      points: 25,
    },
    energy_saving: {
      description: "Turned off lights/electronics",
      co2Impact: 0.8,
      points: 10,
    },
    recycling: {
      description: "Recycled waste properly",
      co2Impact: 0.5,
      points: 8,
    },
    plant_based_meal: {
      description: "Had a vegetarian/vegan meal",
      co2Impact: 1.2,
      points: 15,
    },
    water_conservation: {
      description: "Shorter shower or saved water",
      co2Impact: 0.3,
      points: 5,
    },
    active_transport: {
      description: "Walked or biked instead of driving",
      co2Impact: 2.8,
      points: 30,
    },
  };

  return (
    actionTypes[actionType] || {
      description: "Eco-friendly action",
      co2Impact: 1.0,
      points: 10,
    }
  );
}

async function updateUserRewards(userId, points, co2Impact) {
  // Get current rewards
  const currentRewards = await sql`
    SELECT * FROM user_rewards WHERE user_id = ${userId}
  `;

  if (currentRewards.length === 0) {
    // Create if doesn't exist
    await sql`
      INSERT INTO user_rewards (user_id, total_points, current_level, current_streak, last_activity_date)
      VALUES (${userId}, ${points}, 1, 1, CURRENT_DATE)
    `;
    return;
  }

  const rewards = currentRewards[0];
  const newTotalPoints = rewards.total_points + points;

  // Calculate new level (every 500 points = 1 level)
  const newLevel = Math.floor(newTotalPoints / 500) + 1;

  // Calculate streak
  const lastActivityDate = rewards.last_activity_date;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let newStreak = rewards.current_streak;
  if (!lastActivityDate || lastActivityDate < yesterday) {
    newStreak = 1; // Reset streak
  } else if (lastActivityDate === yesterday) {
    newStreak += 1; // Continue streak
  }
  // If today, maintain current streak

  await sql`
    UPDATE user_rewards 
    SET 
      total_points = ${newTotalPoints},
      current_level = ${newLevel},
      current_streak = ${newStreak},
      last_activity_date = CURRENT_DATE,
      updated_at = NOW()
    WHERE user_id = ${userId}
  `;
}

async function updateAchievements(userId, actionType) {
  // Map action types to achievement requirements
  const actionMapping = {
    public_transport: "transport_actions",
    energy_saving: "energy_actions",
    recycling: "recycle_actions",
    plant_based_meal: "plant_meals",
    water_conservation: "water_actions",
    active_transport: "transport_actions",
  };

  const requirementType = actionMapping[actionType];
  if (!requirementType) return;

  // Update progress for relevant achievements
  const relevantBadges = await sql`
    SELECT id, requirement_value FROM badges 
    WHERE requirement_type = ${requirementType}
  `;

  for (const badge of relevantBadges) {
    await sql`
      UPDATE user_achievements 
      SET 
        progress = progress + 1,
        completed = CASE 
          WHEN progress + 1 >= ${badge.requirement_value} THEN TRUE
          ELSE FALSE
        END,
        completed_at = CASE
          WHEN progress + 1 >= ${badge.requirement_value} AND completed_at IS NULL THEN NOW()
          ELSE completed_at
        END
      WHERE user_id = ${userId} AND badge_id = ${badge.id}
    `;
  }

  // Update general action count achievements
  await sql`
    UPDATE user_achievements 
    SET 
      progress = progress + 1,
      completed = CASE 
        WHEN progress + 1 >= (SELECT requirement_value FROM badges WHERE id = badge_id) THEN TRUE
        ELSE FALSE
      END,
      completed_at = CASE
        WHEN progress + 1 >= (SELECT requirement_value FROM badges WHERE id = badge_id) AND completed_at IS NULL THEN NOW()
        ELSE completed_at
      END
    WHERE user_id = ${userId} 
    AND badge_id IN (SELECT id FROM badges WHERE requirement_type = 'action_count')
  `;
}
