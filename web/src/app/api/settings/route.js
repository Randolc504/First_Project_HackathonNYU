import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // Get the most recent user (since we don't have auth)
    const user = await sql`
      SELECT id FROM users ORDER BY created_at DESC LIMIT 1
    `;

    if (user.length === 0) {
      return Response.json({
        theme: "light_nature",
        language: "en",
        notifications: true,
        privacy: "public",
      });
    }

    const userId = user[0].id;

    // Get user settings
    const settings = await sql`
      SELECT * FROM user_settings WHERE user_id = ${userId}
    `;

    if (settings.length === 0) {
      // Create default settings if they don't exist
      const defaultSettings = await sql`
        INSERT INTO user_settings (user_id, theme, language, notifications_enabled, privacy_profile)
        VALUES (${userId}, 'light_nature', 'en', true, 'public')
        RETURNING *
      `;

      const setting = defaultSettings[0];
      return Response.json({
        theme: setting.theme,
        language: setting.language,
        notifications: setting.notifications_enabled,
        privacy: setting.privacy_profile,
      });
    }

    const setting = settings[0];
    return Response.json({
      theme: setting.theme,
      language: setting.language,
      notifications: setting.notifications_enabled,
      privacy: setting.privacy_profile,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return Response.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const updates = await request.json();

    // Get the most recent user (since we don't have auth)
    const user = await sql`
      SELECT id FROM users ORDER BY created_at DESC LIMIT 1
    `;

    if (user.length === 0) {
      return Response.json({ error: "No user found" }, { status: 404 });
    }

    const userId = user[0].id;

    // Check if settings exist
    const existingSettings = await sql`
      SELECT * FROM user_settings WHERE user_id = ${userId}
    `;

    if (existingSettings.length === 0) {
      // Create new settings
      const newSettings = await sql`
        INSERT INTO user_settings (
          user_id, 
          theme, 
          language, 
          notifications_enabled, 
          privacy_profile
        ) VALUES (
          ${userId},
          ${updates.theme || "light_nature"},
          ${updates.language || "en"},
          ${updates.notifications !== undefined ? updates.notifications : true},
          ${updates.privacy || "public"}
        ) RETURNING *
      `;

      const setting = newSettings[0];
      return Response.json({
        theme: setting.theme,
        language: setting.language,
        notifications: setting.notifications_enabled,
        privacy: setting.privacy_profile,
      });
    }

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    if (updates.theme !== undefined) {
      updateFields.push(`theme = $${paramIndex++}`);
      values.push(updates.theme);
    }
    if (updates.language !== undefined) {
      updateFields.push(`language = $${paramIndex++}`);
      values.push(updates.language);
    }
    if (updates.notifications !== undefined) {
      updateFields.push(`notifications_enabled = $${paramIndex++}`);
      values.push(updates.notifications);
    }
    if (updates.privacy !== undefined) {
      updateFields.push(`privacy_profile = $${paramIndex++}`);
      values.push(updates.privacy);
    }

    if (updateFields.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    updateFields.push(`updated_at = NOW()`);
    values.push(userId);

    const updateQuery = `
      UPDATE user_settings 
      SET ${updateFields.join(", ")} 
      WHERE user_id = $${paramIndex}
      RETURNING *
    `;

    const updatedSettings = await sql(updateQuery, values);

    if (updatedSettings.length === 0) {
      return Response.json(
        { error: "Failed to update settings" },
        { status: 500 },
      );
    }

    const setting = updatedSettings[0];
    return Response.json({
      theme: setting.theme,
      language: setting.language,
      notifications: setting.notifications_enabled,
      privacy: setting.privacy_profile,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
