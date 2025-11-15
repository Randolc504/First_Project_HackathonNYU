import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // Get the most recent user (since we don't have auth)
    const user = await sql`
      SELECT id FROM users ORDER BY created_at DESC LIMIT 1
    `;

    if (user.length === 0) {
      return Response.json({
        currentPoints: 0,
        currentLevel: 1,
        currentStreak: 0,
        pointsToNext: 500,
        badges: [],
        achievements: [],
      });
    }

    const userId = user[0].id;

    // Get user rewards data
    const rewards = await sql`
      SELECT * FROM user_rewards WHERE user_id = ${userId}
    `;

    const rewardsData = rewards[0] || {
      total_points: 0,
      current_level: 1,
      current_streak: 0,
    };

    // Calculate points needed for next level
    const currentLevelPoints = (rewardsData.current_level - 1) * 500;
    const nextLevelPoints = rewardsData.current_level * 500;
    const pointsToNext = nextLevelPoints - rewardsData.total_points;

    // Get user achievements with badge data
    const achievements = await sql`
      SELECT 
        ua.*,
        b.name as badge_name,
        b.description as badge_description,
        b.icon as badge_icon,
        b.rarity as badge_rarity,
        b.requirement_value
      FROM user_achievements ua
      JOIN badges b ON ua.badge_id = b.id
      WHERE ua.user_id = ${userId}
      ORDER BY ua.completed DESC, b.rarity DESC, ua.progress DESC
    `;

    // Get completed badges
    const completedBadges = achievements.filter((a) => a.completed);
    const inProgressAchievements = achievements.filter((a) => !a.completed);

    return Response.json({
      currentPoints: rewardsData.total_points,
      currentLevel: rewardsData.current_level,
      currentStreak: rewardsData.current_streak,
      pointsToNext: Math.max(0, pointsToNext),
      badges: completedBadges.map((badge) => ({
        id: badge.id,
        name: badge.badge_name,
        description: badge.badge_description,
        icon: badge.badge_icon,
        rarity: badge.badge_rarity,
        earnedAt: badge.completed_at,
      })),
      achievements: inProgressAchievements.map((achievement) => ({
        id: achievement.id,
        name: achievement.badge_name,
        description: achievement.badge_description,
        icon: achievement.badge_icon,
        rarity: achievement.badge_rarity,
        progress: achievement.progress,
        target: achievement.requirement_value,
        percentage: Math.round(
          (achievement.progress / achievement.requirement_value) * 100,
        ),
      })),
    });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return Response.json({ error: "Failed to fetch rewards" }, { status: 500 });
  }
}
