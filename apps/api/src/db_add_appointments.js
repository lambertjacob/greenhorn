import { query } from "./db.js";

export async function getAvailableSlots() {
  return await query(
    `SELECT id, start_time, end_time 
     FROM availability 
     WHERE is_booked = FALSE 
     ORDER BY start_time ASC
     LIMIT 5`
  );
}

export async function bookSlot(slotId, phoneNumber) {
  // get or create user
  let users = await query(
    `SELECT id FROM users WHERE phone_number = $1`,
    [phoneNumber]
  );

  if (users.length === 0) {
    users = await query(
      `INSERT INTO users (phone_number) VALUES ($1) RETURNING id`,
      [phoneNumber]
    );
  }

  const userId = users[0].id;

  // mark slot as booked
  await query(
    `UPDATE availability SET is_booked = TRUE WHERE id = $1`,
    [slotId]
  );

  // create appointment
  const appointment = await query(
    `INSERT INTO appointments (user_id, availability_id) 
     VALUES ($1, $2) RETURNING id`,
    [userId, slotId]
  );

  return appointment[0];
}