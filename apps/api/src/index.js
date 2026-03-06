import express from "express";
import { handleIncomingSMS } from "./webhook.js";
import { smsRateLimit } from "./rate_limit.js";
import { query } from "./db.js";
import cors from "cors";

//server initialization
const greenhorn = express();
greenhorn.use(cors({ 
  origin: [
    process.env.DASHBOARD_URL,
  ] 
}));
const PORT = process.env.PORT || 3000;

greenhorn.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});

//handle json and urlencoded data
greenhorn.use(express.json());
greenhorn.use(express.urlencoded({ extended: true }));

//server health check
greenhorn.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

//webhook endpoint for incoming SMS
greenhorn.post("/webhook/sms", smsRateLimit, handleIncomingSMS);


// get all booked appointments
greenhorn.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await query(`
      SELECT 
        appointments.id,
        users.phone_number,
        availability.start_time,
        availability.end_time,
        appointments.status,
        appointments.created_at
      FROM appointments
      JOIN users ON appointments.user_id = users.id
      JOIN availability ON appointments.availability_id = availability.id
      ORDER BY availability.start_time ASC
    `);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// get all availability slots
greenhorn.get("/api/availability", async (req, res) => {
  try {
    const slots = await query(`
      SELECT * FROM availability 
      ORDER BY start_time ASC
    `);
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

// add a new availability slot
greenhorn.post("/api/availability", async (req, res) => {
  const { start_time, end_time } = req.body;
  try {
    const slot = await query(
      `INSERT INTO availability (start_time, end_time) 
       VALUES ($1, $2) RETURNING *`,
      [start_time, end_time]
    );
    res.status(201).json(slot[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add slot" });
  }
});

// cancel an appointment
greenhorn.delete("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await query(
      `UPDATE appointments SET status = 'cancelled' WHERE id = $1`,
      [id]
    );
    await query(`
      UPDATE availability SET is_booked = FALSE 
      WHERE id = (SELECT availability_id FROM appointments WHERE id = $1)`,
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});
