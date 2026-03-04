import express from "express";
import { handleIncomingSMS } from "./webhook.js";

//server initialization
const greenhorn = express();
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
greenhorn.post("/webhook/sms", handleIncomingSMS);
