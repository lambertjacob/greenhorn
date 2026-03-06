import { query } from "./db.js";

async function addSlots() {
  const slots = [
    { start: "2026-03-10 09:00", end: "2026-03-10 10:00" },
    { start: "2026-03-10 11:00", end: "2026-03-10 12:00" },
    { start: "2026-03-11 14:00", end: "2026-03-11 15:30" },
    { start: "2026-03-12 10:00", end: "2026-03-12 11:00" },
  ];

  for (const slot of slots) {
    await query(
      `INSERT INTO availability (start_time, end_time) VALUES ($1, $2)`,
      [slot.start, slot.end]
    );
    console.log(`added slot: ${slot.start} → ${slot.end}`);
  }

  console.log("added availability slots successfully");
  process.exit(0);
}

addSlots().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});