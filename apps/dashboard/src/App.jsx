import { useState, useEffect } from "react";

const API = "http://localhost:3000";

function Bookings({ onCancel }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/bookings`)
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []));
  }, []);

  const cancel = async (id) => {
    await fetch(`${API}/api/appointments/${id}`, { method: "DELETE" });
    setBookings(bookings.filter((b) => b.id !== id));
  };

  return (
    <div>
      <h2>Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      <table>
        <thead>
          <tr>
            <th>Phone</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.phone_number}</td>
              <td>{new Date(b.start_time).toLocaleString()}</td>
              <td>{new Date(b.end_time).toLocaleString()}</td>
              <td>{b.status}</td>
              <td>
                {b.status !== "cancelled" && (
                  <button onClick={() => cancel(b.id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Availability() {
  const [slots, setSlots] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    fetch(`${API}/api/availability`)
      .then((r) => r.json())
      .then(setSlots);
  }, []);

  const addSlot = async () => {
    if (!start || !end) return;
    const res = await fetch(`${API}/api/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start_time: start, end_time: end }),
    });
    const newSlot = await res.json();
    setSlots([...slots, newSlot]);
    setStart("");
    setEnd("");
  };

  return (
    <div>
      <h2>Availability</h2>
      <div>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button onClick={addSlot}>Add Slot</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
            <th>Booked</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((s) => (
            <tr key={s.id}>
              <td>{new Date(s.start_time).toLocaleString()}</td>
              <td>{new Date(s.end_time).toLocaleString()}</td>
              <td>{s.is_booked ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("bookings");

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Greenhorn Dashboard</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setTab("bookings")}>Bookings</button>
        <button onClick={() => setTab("availability")} style={{ marginLeft: "1rem" }}>
          Availability
        </button>
      </div>
      {tab === "bookings" && <Bookings />}
      {tab === "availability" && <Availability />}
    </div>
  );
}