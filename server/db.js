const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'pomodoro.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT UNIQUE NOT NULL, target_words INTEGER DEFAULT 30, target_pomodoros INTEGER DEFAULT 8);
  CREATE TABLE IF NOT EXISTS pomodoros (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, task_type TEXT NOT NULL, duration INTEGER NOT NULL, completed INTEGER DEFAULT 1, note TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS daily_records (date TEXT PRIMARY KEY, words_learned INTEGER DEFAULT 0, total_focus_minutes INTEGER DEFAULT 0, completed_pomodoros INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, content TEXT NOT NULL, completed INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
`);

const init = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
init.run('exam_date', '2026-07-18');

module.exports = db;
