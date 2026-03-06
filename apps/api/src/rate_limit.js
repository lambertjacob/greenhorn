//have it set for 10 messages per day per phone number
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const smsRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000 * 24, 
  max: 10,             
  keyGenerator: (req) => req.body.From || ipKeyGenerator(req),
  validate: {trustProxy: false},
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for ${req.body.From}`);
    res.status(429).type("text/xml").send("<Response><Message>You have sent exceeded the daily limit.</Message></Response>");
  },
});