# InstantPrep 🚀

InstantPrep is a unified, full-stack preparation platform designed to help students master core technical, analytical, and professional placement workflows. The application bridges behavioral and technical prep by combining a **DSA Tracker**, an emerging **Aptitude Coach** architecture, and an automated **Resume Analyzer** microservice.

---

## 📂 Project Architecture

The workspace is structured as a monorepo containing decoupled frontend, backend, and AI processing layers:


instantprep/
├── frontend/             # React.js Client Application
│   ├── src/
│   │   ├── components/   # Dashboard, Tracker & Analyzer UI
│   │   └── App.jsx
│   └── package.json
│
├── backend/              # Node.js / Express API Server (Core Gateway)
│   ├── routes/           # REST Endpoint handlers
│   └── server.js         # Entry point
│
├── routes         
│   ├── auth.js           
│   ├── resume.js        
│   ├── analyzer.py      
│   └── requirements.txt  
│
└── README.md             # Project documentation


Core Features
📄 **Resume Analyzer (AI Engine)**
PDF Parsing: High-accuracy extraction of raw text from multi-column technical resumes.

NLP Entity Extraction: Programmatic identification of technical skills, frameworks, and role histories using natural language processing.

Keyword & Semantic Matching: Compares resume profiles against target job descriptions to compute a matching score and highlight critical missing keywords.

 **DSA Tracker (Completed)**
Problem Logging: Track algorithmic challenges across LeetCode, Codeforces, and alternative platforms.

Status Management: Categorize complex data structures and algorithms by difficulty levels and topics.

Revision Pipeline: Programmatic tracking to highlight algorithms requiring active recall.

* Aptitude Coach (Architecture Initialized)**
Modular Layout: Dedicated dashboard views for quantitative, logical, and verbal reasoning tracks.

Scalable Routing: Flexible API architecture ready to process adaptive mock quizzes.

Getting Started
Prerequisites
Node.js (v16.x or higher)
Python (v3.9 or higher)
Database - Postgresql

Git

Installation and setup -
1. Clone the repository
   git clone [https://github.com/PiyushGautam1207/InstantPrep.git](https://github.com/PiyushGautam1207/InstantPrep.git)
   cd InstantPrep

2. Install Dependencies and Initialize the Backen
   CD backend
   npm install
   CD frontend
   npm install
  
3. Initialize the  backend
   node server.js

4. Initialize the front end
   npm run dev 
