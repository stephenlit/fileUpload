const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.post("/api/upload-gpx", (req, res) => {
    const { route } = req.body;
    
    if (!route || !Array.isArray(route)) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    console.log("Received GPX Route:", route);
    
    // Save to database or further process
    res.json({ message: "GPX data received successfully", data: route });
});

app.listen(5000, () => console.log("Server running on port 5000"));
