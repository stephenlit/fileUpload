const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB once when the server starts
mongoose
    .connect(
        "mongodb+srv://stevish45:oACvnlrH0MYjsHtZ@atvapi.krqs0.mongodb.net/ATVAPI?retryWrites=true&w=majority"
    )
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define a Mongoose Schema for the GPX route
const gpxSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    route: { type: Array, required: true },
    uploadedAt: { type: Date, default: Date.now },
});

// ✅ Create a Mongoose model
const GPXRoute = mongoose.model("GPXRoute", gpxSchema);

app.post("/api/upload-gpx", async (req, res) => {
    console.log("request body:", req.body);
    try {
        const { fileName, route } = req.body;

        if (!route || !fileName) {
            return res
                .status(400)
                .json({ error: "Filename and route are required." });
        }

        console.log("✅ Received GPX Route:", fileName);
        console.log("Route coordinates:", route);

        // ✅ Save to MongoDB using Mongoose Model
        const newRoute = new GPXRoute({ fileName, route });
        console.log(newRoute);
        await newRoute
            .save()
            .then(() => console.log("✅ Route saved!"))
            .catch((err) => console.error("❌ Mongoose Save Error:", err));

        res.json({ message: "✅ GPX data saved successfully", data: newRoute });
    } catch (error) {
        console.error("❌ Error saving GPX data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Start the server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
