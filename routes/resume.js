const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenAI } = require('@google/generative-ai');
const verifyToken = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', verifyToken, upload.single('resume'), async (req, res) => {
  const db = req.app.locals.db;
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a PDF resume.' });
  }

  try {
    const userRes = await db.query('SELECT target_role FROM users WHERE id = $1', [userId]);
    const targetRole = userRes.rows[0]?.target_role || 'Software Engineer';

    const parsedPdf = await pdfParse(req.file.buffer);
    const resumeText = parsedPdf.text;

    const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systematicPrompt = `
      You are an expert Applicant Tracking System (ATS).
      Analyze this resume for a "${targetRole}" role. Return strictly JSON:
      {
        "ats_score": 85,
        "strengths": ["A", "B"],
        "weaknesses": ["C"],
        "missing_keywords": ["X", "Y"],
        "improvements": "Text",
        "interview_readiness_score": 80
      }
      Resume: ${resumeText}
    `;

    const aiResponse = await model.generateContent(systemPrompt);
    const cleanJsonString = aiResponse.response.text().replace(/```json|```/g, '').trim();
    const metricsData = JSON.parse(cleanJsonString);

    const fileSaved = await db.query(
      'INSERT INTO resumes (user_id, file_name, file_path) VALUES ($1, $2, $3) RETURNING id',
      [userId, req.file.originalname, 'Parsed via memory']
    );
    
    await db.query(
      `INSERT INTO resume_analysis (resume_id, ats_score, strengths, weaknesses, missing_keywords, improvements, interview_readiness_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [fileSaved.rows[0].id, metricsData.ats_score, metricsData.strengths, metricsData.weaknesses, metricsData.missing_keywords, metricsData.improvements, metricsData.interview_readiness_score]
    );

    res.status(200).json(metricsData);
  } catch (error) {
    res.status(500).json({ error: 'AI analysis failed.', details: error.message });
  }
});

module.exports = router;