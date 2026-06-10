const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
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

// Fallback: fetch from postal API and normalize to same shape
const fetchFromPostalAPI = async (pin) => {
  const { data } = await axios.get(
    `https://api.postalpincode.in/pincode/${pin}`,
    { timeout: 10000 }
  );
  if (!data || data[0]?.Status !== "Success") {
    return null;
  }
  const postOffices = data[0].PostOffice || [];
  if (postOffices.length === 0) return null;
  const first = postOffices[0];
  return {
    pincode: pin,
    district: first.District,
    state: first.State,
    division: first.Division,
    region: first.Region,
    circle: first.Circle,
    postOffices: postOffices.map((po) => ({
      name: po.Name,
      branchType: po.BranchType,
      deliveryStatus: po.DeliveryStatus,
      district: po.District,
      division: po.Division,
      region: po.Region,
      state: po.State,
      latitude: null,
      longitude: null,
    })),
  };
};

// GET /api/pincode/:pin
router.get("/:pin", async (req, res) => {
  const { pin } = req.params;

  if (!/^\d{6}$/.test(pin)) {
    return res.status(400).json({ error: "Invalid pincode. Must be a 6-digit number." });
  }

  // Try MongoDB first
  try {
    await connectDB();
    const data = await Pincode.find({ pincode: Number(pin) }).lean();
    if (data && data.length > 0) {
      const first = data[0];
      return res.json({
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
      });
    }
  } catch (err) {
    console.warn("MongoDB unavailable, falling back to postal API:", err.message);
  }

  // Fallback to postal API
  try {
    const result = await fetchFromPostalAPI(pin);
    if (!result) {
      return res.status(404).json({ error: "Pincode not found." });
    }
    return res.json(result);
  } catch (err) {
    console.error("Postal API fallback failed:", err.message);
    return res.status(500).json({ error: "Failed to fetch pincode data." });
  }
});

module.exports = router;