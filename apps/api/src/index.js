import express from "express";

//server initialization
const greenhorn = express();
const PORT = process.env.PORT || 3000;

greenhorn.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});

//handle json and urlencoded data
greenhorn.use(express.json());
greenhorn.use(express.urlencoded({ extended: true }));

//server healht check
greenhorn.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
