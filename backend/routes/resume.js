const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse-fixed');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const verifyToken = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', verifyToken, upload.single('resume'), async (req, res) => {
  const db = req.app.locals.db;
  const userId = req.user.id;

  try {
    if (!req.file) throw new Error('Please upload a PDF.');

    // 1. Get Target Role
    const userRes = await db.query('SELECT target_role FROM users WHERE id = $1', [userId]);
    const targetRole = userRes.rows[0]?.target_role || 'Software Engineer';

    // 2. Extract PDF Text
    const data = await pdf(req.file.buffer);
    const resumeText = data.text;
    if (!resumeText || resumeText.trim().length < 10) throw new Error("PDF extraction failed.");

    // 3. Initialize Gemini SDK
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing.");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    /**
     * MODEL CHOICE:
     * Based on your diagnostic list, your key recognizes 'gemini-flash-latest'
     * but NOT 'gemini-1.5-flash'. 
     */
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest", 
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert ATS. Analyze this resume for a "${targetRole}" position.
      Return ONLY a JSON object: 
      {
        "ats_score": number, 
        "strengths": [], 
        "weaknesses": [], 
        "missing_keywords": [], 
        "improvements": "", 
        "interview_readiness_score": number
      }
      Resume Content: ${resumeText}
    `;

    console.log("✨ Step 3: Sending to gemini-flash-latest...");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawAiText = response.text();

    // 4. Parse JSON
    const jsonMatch = rawAiText.match(/\{[\s\S]*\}/);
    const metricsData = JSON.parse(jsonMatch ? jsonMatch[0] : rawAiText);

    // 5. Database Persistence
    const fileSaved = await db.query(
      'INSERT INTO resumes (user_id, file_name, file_path) VALUES ($1, $2, $3) RETURNING id',
      [userId, req.file.originalname, 'In-Memory']
    );
    
    const resumeId = fileSaved.rows[0].id;
    await db.query(
      `INSERT INTO resume_analysis (resume_id, ats_score, strengths, weaknesses, missing_keywords, improvements, interview_readiness_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        resumeId,
        parseInt(metricsData.ats_score) || 0,
        metricsData.strengths || [],
        metricsData.weaknesses || [],
        metricsData.missing_keywords || [],
        metricsData.improvements || '',
        parseInt(metricsData.interview_readiness_score) || 0
      ]
    );

    console.log("🎉 Analysis Complete!");
    return res.status(200).json(metricsData);

  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;