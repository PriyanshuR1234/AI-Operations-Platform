require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const Chat = require('./models/chat');
const Product = require('./models/product');
const { GoogleGenAI } = require('@google/genai');
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'public/uploads/' }); // Store uploads in public so they are accessible digitally
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB Atlas!");
    } catch (err) {
        console.log("Skipping MongoDB connection for local UI testing:", err.message);
    }
};

startServer();

app.listen(PORT, () => {
    console.log(`Express Server is actively listening on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/upload", (req, res) => {
    res.render("upload", { tagData: null, imageUrl: null });
});

app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        const taxonomyData = JSON.parse(fs.readFileSync(path.join(__dirname, "taxonomy.json"), "utf8"));

        const imagePart = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(req.file.path)).toString("base64"),
                mimeType: req.file.mimetype
            }
        };

        const prompt = `You are an AI tagging assistant. Analyze the image and assign properties based *only* on the taxonomy list provided below.
Taxonomy:
${JSON.stringify(taxonomyData, null, 2)}

Return ONLY a raw JSON mapping with the following format, with NO markdown formatting, NO backticks:
{
  "primaryCategory": "...",
  "subCategory": "...",
  "seoTags": ["...", "..."],
  "sustainabilityFilters": ["...", "..."]
}
Make sure your answer is strictly parsable JSON.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [prompt, imagePart]
        });

        let responseText = response.text.trim();
        // Clear out markdown block formatting if present
        if (responseText.startsWith("\`\`\`json")) {
            responseText = responseText.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
        } else if (responseText.startsWith("\`\`\`")) {
            responseText = responseText.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
        }


        const tagData = JSON.parse(responseText);

        console.log("\n====== AI GENERATED JSON RESPONSE ======");
        console.log(JSON.stringify(tagData, null, 2));
        console.log("========================================\n");


        // Disabling MongoDB for now, returning directly to UI
        res.render("upload", {
            tagData: tagData,
            imageUrl: "/uploads/" + req.file.filename
        });

    } catch (err) {
        console.error("Error processing image:", err);
        res.status(500).send("Error processing image: " + err.message);
    }
});

app.get("/proposal", (req, res) => {
    res.render("proposal", { proposalData: null });
});

app.post("/proposal", async (req, res) => {
    const userInput = req.body.userInput || "";
    const budget = req.body.budgetInput || "Not specified";
    if (!userInput.trim()) {
        return res.status(400).send("No input provided.");
    }

    try {
        const prompt = `You are an expert B2B Sustainable Operations consultant. Generate an AI B2B Proposal based on the following user request.
User Request: "${userInput}"
Budget Constraint: "${budget}"

Return ONLY a raw JSON strictly matching this format, with NO markdown formatting, NO backticks:
{
  "productMix": [{"item": "...", "reasoning": "..."}],
  "budgetAllocation": [{"category": "...", "amount": "...", "percentage": "..."}],
  "costBreakdown": [{"item": "...", "cost": "..."}],
  "impactPositioning": "..."
}
Make sure your answer is strictly parsable JSON.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        let responseText = response.text.trim();
        if (responseText.startsWith("\`\`\`json")) {
            responseText = responseText.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
        } else if (responseText.startsWith("\`\`\`")) {
            responseText = responseText.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
        }

        const proposalData = JSON.parse(responseText);

        console.log("\n====== AI GENERATED PROPOSAL JSON ======");
        console.log(JSON.stringify(proposalData, null, 2));
        console.log("========================================\n");

        res.render("proposal", { proposalData: proposalData });

    } catch (err) {
        console.error("Error generating proposal:", err);
        res.status(500).send("Error generating proposal: " + err.message);
    }
});
