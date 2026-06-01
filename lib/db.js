import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Railway 挂载卷路径, 本地 fallback 到项目根目录
const volumePath = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const dataDir = path.join(volumePath, 'data');
const dbPath = path.join(dataDir, 'local.db');

// 确保数据目录存在
fs.mkdirSync(dataDir, { recursive: true });

console.log(`[db] 数据库路径: ${dbPath}`);

const db = createClient({ url: `file:${dbPath}` });

// 建表
await db.execute(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL DEFAULT '匿名来访者',
    tag TEXT DEFAULT '',
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.execute(`
  CREATE INDEX IF NOT EXISTS idx_comments_created_at
  ON comments(created_at DESC)
`);

console.log('[db] 数据库就绪');

export default db;
