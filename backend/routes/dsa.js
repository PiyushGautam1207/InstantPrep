

const express = require('express');
const router = express.Router();

// 1. Make sure NO authentication middleware (like verifyToken) is passed here!
router.get('/roadmap', async (req, res) => {
  const db = req.app.locals.db;
  
  try {
    const topicsResult = await db.query('SELECT * FROM dsa_topics ORDER BY id ASC');
    const problemsResult = await db.query('SELECT * FROM dsa_problems ORDER BY id ASC');

    const roadmap = topicsResult.rows.map(topic => {
      const topicProblems = problemsResult.rows.filter(p => p.topic_id === topic.id);
      const solvedCount = topicProblems.filter(p => p.status === 'Solved').length;

      return {
        id: topic.id,
        name: topic.name,
        solved_count: solvedCount,
        total_count: topicProblems.length,
        problems: topicProblems.map(p => ({
          id: p.id,
          title: p.title,
          difficulty: p.difficulty,
          leetcode_url: p.leetcode_url,
          status: p.status
        }))
      };
    });

    res.json({ success: true, roadmap });
  } catch (error) {
    console.error('Database query execution failure:', error);
    res.status(500).json({ success: false, error: 'Database pipeline compilation error' });
  }
});

// Leave toggle open for now too so your checkboxes don't throw 401s later
router.post('/toggle', async (req, res) => {
  const db = req.app.locals.db;
  const { problem_id, current_status } = req.body;
  const newStatus = current_status === 'Solved' ? 'Unsolved' : 'Solved';

  try {
    await db.query(
      'UPDATE dsa_problems SET status = $1 WHERE id = $2',
      [newStatus, problem_id]
    );
    res.json({ success: true, new_status: newStatus });
  } catch (error) {
    console.error('Toggle sync failed:', error);
    res.status(500).json({ success: false, error: 'Failed to write data updates' });
  }
});

module.exports = router;