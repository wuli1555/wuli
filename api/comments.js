import { Router } from 'express';
import db from '../lib/db.js';

const router = Router();

// GET /api/comments — 获取最近 50 条留言
router.get('/', async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT id, author, tag, text, created_at FROM comments ORDER BY created_at DESC LIMIT 50',
      args: []
    });
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('[api] 获取留言失败:', err.message);
    res.status(500).json({ success: false, error: '获取留言失败' });
  }
});

// POST /api/comments — 提交留言
router.post('/', async (req, res) => {
  try {
    const { author, tag, text } = req.body;

    // 基本校验
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ success: false, error: '留言内容不能为空' });
    }

    const clean = {
      author: (typeof author === 'string' ? author.trim() : '').slice(0, 50) || '匿名来访者',
      tag: (typeof tag === 'string' ? tag.trim() : '').slice(0, 20),
      text: text.trim().slice(0, 2000)
    };

    const result = await db.execute({
      sql: 'INSERT INTO comments (author, tag, text) VALUES (?, ?, ?)',
      args: [clean.author, clean.tag, clean.text]
    });

    const inserted = await db.execute({
      sql: 'SELECT id, author, tag, text, created_at FROM comments WHERE id = ?',
      args: [result.lastInsertRowid]
    });

    res.status(201).json({ success: true, data: inserted.rows[0] });
  } catch (err) {
    console.error('[api] 提交留言失败:', err.message);
    res.status(500).json({ success: false, error: '提交留言失败' });
  }
});

export default router;
