import { query } from "./db.js";

async function setup() {

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      phone_number TEXT UNIQUE NOT NULL,
      name TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("user table created successfully");

  await query(`
    CREATE TABLE IF NOT EXISTS availability (
      id SERIAL PRIMARY KEY,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      is_booked BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("availability table created successfully");

  await query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      availability_id INTEGER REFERENCES availability(id),
      status TEXT DEFAULT 'confirmed',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("appointments table created successfully");

  console.log("database setup complete");
  process.exit(0);
}

setup().catch((err) => {
  console.error("database setup failed:", err);
  process.exit(1);
});