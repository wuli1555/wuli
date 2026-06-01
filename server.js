import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import commentsRouter from './api/comments.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// 解析 JSON 请求体
app.use(express.json());

// API 路由
app.use('/api/comments', commentsRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 静态文件（确保 JS / CSS / 图片能被浏览器加载）
app.use(express.static(__dirname));

// SPA 回退 — 所有非 API 路由返回 index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] 雾璃个人站已启动 — http://0.0.0.0:${PORT}`);
});
