const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Connect to MongoDB (lazy singleton)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
};

const Pincode = mongoose.models.Pincode || mongoose.model(
  "Pincode",
  new mongoose.Schema({}, { strict: false }),
  "pincodes"
);

// GET /api/pincode/:pin
router.get("/:pin", async (req, res) => {
  const { pin } = req.params;

  if (!/^\d{6}$/.test(pin)) {
    return res.status(400).json({ error: "Invalid pincode. Must be a 6-digit number." });
  }

  try {
    await connectDB();

    const data = await Pincode.find({ pincode: Number(pin) }).lean();

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Pincode not found." });
    }

    const first = data[0];

    const result = {
      pincode: pin,
      district: first.district,
      state: first.statename,
      division: first.divisionname,
      region: first.regionname,
      circle: first.circlename,
      postOffices: data.map((po) => ({
        name: po.officename,
        branchType: po.officetype,
        deliveryStatus: po.delivery,
        district: po.district,
        division: po.divisionname,
        region: po.regionname,
        state: po.statename,
        latitude: po.latitude,
        longitude: po.longitude,
      })),
    };

    res.json(result);
  } catch (err) {
    console.error("Pincode fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch pincode data." });
  }
});

module.exports = router;