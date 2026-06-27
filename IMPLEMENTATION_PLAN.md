# 🍅 英语番茄钟 — 终极实施方案 (IMPLEMENTATION_PLAN.md)

> **用途**：将此文件完整复制到新会话的 Build 模式中，AI 可闭眼逐步执行。
> **前置条件**：Node.js ≥ 18、npm ≥ 9、Git 已安装。macOS / Linux / Windows(WSL) 均可。
> **预计总耗时**：约 15–20 分钟（含依赖安装）。
> **重要更新**：Step 12 已采用 Web Audio API 原生提示音，零外部依赖，无跨域问题。

---

## 📁 最终项目目录树（执行完毕后）

```
/Users/hurryapple/toefl.promodo/english-pomodoro/
├── AGENTS.md                          # 项目宪法（Step 0 创建）
├── CHANGELOG.md                       # 变更日志（Step 0 创建，每阶段追加）
├── IMPLEMENTATION_PLAN.md             # 本文件
├── package.json                       # 根 package.json（Step 17 创建）
│
├── server/
│   ├── package.json                   # Step 1
│   ├── db.js                          # Step 2
│   ├── routes.js                      # Step 3
│   └── server.js                      # Step 4
│
└── client/
    ├── index.html                     # Step 10
    ├── package.json                   # Step 6（Vite 自动生成）
    ├── vite.config.js                 # Step 11
    ├── tailwind.config.js             # Step 8
    ├── postcss.config.js              # Step 8
    └── src/
        ├── index.css                  # Step 9
        ├── main.jsx                   # Step 16
        ├── App.jsx                    # Step 15
        ├── components/
        │   ├── Timer.jsx              # Step 12（含 Web Audio API 原生提示音）
        │   └── Stats.jsx              # Step 13
        └── pages/
            └── Home.jsx               # Step 14
```

---

## 🔗 步骤依赖关系图

```
Step 0  (基础设施)
  │
  ├─► Step 1 (后端 package.json)
  │     └─► Step 2 (db.js)
  │           └─► Step 3 (routes.js)
  │                 └─► Step 4 (server.js)
  │                       └─► Step 5 (后端验证)
  │
  └─► Step 6 (前端脚手架)
        └─► Step 7 (前端依赖)
              └─► Step 8 (Tailwind 配置)
                    └─► Step 9 (index.css)
                          ├─► Step 10 (index.html)
                          ├─► Step 11 (vite.config.js)
                          └─► Step 12 → 13 → 14 → 15 → 16 (React 组件链)
                                └─► Step 17 (根 package.json)
                                      └─► Step 18 (端到端联调)
```

**并行机会**：Step 2-4 可与 Step 6-9 在不同终端并行执行。

---

---

## 📌 Milestone 0：项目基础设施（宪法 + 记忆）

### Step 0.1 — 创建项目根目录并初始化 Git

**文件路径**：无（纯终端操作）

```bash
mkdir -p /Users/hurryapple/toefl.promodo/english-pomodoro
cd /Users/hurryapple/toefl.promodo/english-pomodoro
git init
```

**验证**：`ls -la` 确认存在 `.git` 目录。

---

### Step 0.2 — 创建 AGENTS.md（项目宪法）

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/AGENTS.md`

内容详见本仓库中的 `AGENTS.md` 文件，已提前创建完毕。
核心要点：技术栈锁定（React 18 + Vite + Tailwind 3 + Express + SQLite）、端口不可变（3001 / 5173）、禁止修改宪法。

---

### Step 0.3 — 创建 CHANGELOG.md（初始版本）

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/CHANGELOG.md`

内容详见本仓库中的 `CHANGELOG.md` 文件，已提前创建完毕。

---

---

## 📌 Milestone 1：后端服务（数据库 + API）

### Step 1 — 创建 server/package.json 并安装依赖

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/server/package.json`

```json
{
  "name": "english-pomodoro-server",
  "version": "1.0.0",
  "description": "英语番茄钟后端服务",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "better-sqlite3": "^11.0.0",
    "cors": "^2.8.5",
    "express": "^4.21.0"
  }
}
```

执行安装：
```bash
cd /Users/hurryapple/toefl.promodo/english-pomodoro/server && npm install
```

**防呆**：`better-sqlite3` 需要原生编译。macOS 如报错执行 `xcode-select --install`。

**验证**：
```bash
node -e "require('better-sqlite3'); console.log('OK')"
node -e "require('express'); console.log('OK')"
node -e "require('cors'); console.log('OK')"
```

---

### Step 2 — 创建 server/db.js（数据库初始化）

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/server/db.js`

```javascript
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'pomodoro.db'));

// 开启 WAL 模式提升并发性能
db.pragma('journal_mode = WAL');

// 初始化三张表
db.exec(`
  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE NOT NULL,
    target_words INTEGER DEFAULT 30,
    target_pomodoros INTEGER DEFAULT 8
  );

  CREATE TABLE IF NOT EXISTS pomodoros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    task_type TEXT NOT NULL,
    duration INTEGER NOT NULL,
    completed INTEGER DEFAULT 1,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS daily_records (
    date TEXT PRIMARY KEY,
    words_learned INTEGER DEFAULT 0,
    total_focus_minutes INTEGER DEFAULT 0,
    completed_pomodoros INTEGER DEFAULT 0
  );
`);

module.exports = db;
```

**验证**：
```bash
cd /Users/hurryapple/toefl.promodo/english-pomodoro/server
node -e "const db = require('./db'); console.log('TABLES OK')"
```
确认 `server/pomodoro.db` 文件已自动生成。

---

### Step 3 — 创建 server/routes.js（API 路由）

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/server/routes.js`

```javascript
const express = require('express');
const router = express.Router();
const db = require('./db');

// ─── GET /api/goals/today ─── 获取或创建今日目标
router.get('/goals/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  let goal = db.prepare('SELECT * FROM goals WHERE date = ?').get(today);

  if (!goal) {
    db.prepare('INSERT INTO goals (date) VALUES (?)').run(today);
    goal = db.prepare('SELECT * FROM goals WHERE date = ?').get(today);
  }

  res.json(goal);
});

// ─── PUT /api/goals/today ─── 更新今日目标
router.put('/goals/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const { target_words, target_pomodoros } = req.body;

  db.prepare(`
    UPDATE goals SET target_words = ?, target_pomodoros = ? WHERE date = ?
  `).run(target_words, target_pomodoros, today);

  res.json({ success: true });
});

// ─── POST /api/pomodoros ─── 记录完成的番茄钟
router.post('/pomodoros', (req, res) => {
  const { task_type, duration, note } = req.body;
  const today = new Date().toISOString().split('T')[0];

  const stmt = db.prepare(`
    INSERT INTO pomodoros (date, task_type, duration, note)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(today, task_type, duration, note || '');

  // 更新每日统计（使用 UPSERT）
  db.prepare(`
    INSERT INTO daily_records (date, total_focus_minutes, completed_pomodoros)
    VALUES (?, ?, 1)
    ON CONFLICT(date) DO UPDATE SET
      total_focus_minutes = total_focus_minutes + excluded.total_focus_minutes,
      completed_pomodoros = completed_pomodoros + 1
  `).run(today, duration);

  res.json({ id: result.lastInsertRowid, success: true });
});

// ─── GET /api/pomodoros/today ─── 获取今日番茄钟记录
router.get('/pomodoros/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const records = db.prepare(
    'SELECT * FROM pomodoros WHERE date = ? ORDER BY created_at DESC'
  ).all(today);
  const summary = db.prepare(
    'SELECT * FROM daily_records WHERE date = ?'
  ).get(today);
  res.json({
    records,
    summary: summary || { completed_pomodoros: 0, total_focus_minutes: 0 }
  });
});

// ─── GET /api/stats/week ─── 获取近7天统计
router.get('/stats/week', (req, res) => {
  const rows = db.prepare(`
    SELECT date, completed_pomodoros, total_focus_minutes
    FROM daily_records
    WHERE date >= date('now', '-7 days')
    ORDER BY date ASC
  `).all();
  res.json(rows);
});

module.exports = router;
```

**验证**：
```bash
cd /Users/hurryapple/toefl.promodo/english-pomodoro/server
node -e "require('./routes'); console.log('ROUTES OK')"
```

---

### Step 4 — 创建 server/server.js（Express 入口）

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/server/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`✅ 后端服务运行在 http://localhost:${PORT}`);
});
```

**验证**：
```bash
cd /Users/hurryapple/toefl.promodo/english-pomodoro/server
node -e "require('./server'); console.log('SERVER OK')"
```
⚠️ 会启动服务并挂起，按 `Ctrl+C` 停止。

---

### Step 5 — 后端 API 冒烟测试

1. 启动后端：`cd server && node server.js`
2. 另一终端测试：

```bash
# 测试 1：获取/创建今日目标
curl -s http://localhost:3001/api/goals/today
# 预期：{"id":1,"date":"2026-06-27","target_words":30,"target_pomodoros":8}

# 测试 2：记录完成的番茄钟
curl -s -X POST http://localhost:3001/api/pomodoros \
  -H "Content-Type: application/json" \
  -d '{"task_type":"vocabulary","duration":25}'
# 预期：{"id":1,"success":true}

# 测试 3：获取今日记录
curl -s http://localhost:3001/api/pomodoros/today

# 测试 4：近7天统计
curl -s http://localhost:3001/api/stats/week
```

全部返回 200 后停止后端。

---

---

## 📌 Milestone 2：前端脚手架

### Step 6 — 使用 Vite 初始化 React 项目

```bash
cd /Users/hurryapple/toefl.promodo/english-pomodoro
npm create vite@latest client -- --template react
```

**防呆**：如 `client` 目录已存在，先 `rm -rf client`（仅此一次，因尚未写入自定义代码）。选择 `react` 模板，不选 `react-ts`。

**验证**：`ls client/src/` 应看到 `App.jsx`、`main.jsx` 等文件。

---

### Step 7 — 安装前端依赖

```bash
cd /Users/hurryapple/toefl.promodo/english-pomodoro/client
npm install
npm install tailwindcss@3 postcss autoprefixer chart.js react-chartjs-2
```

**关键**：`tailwindcss@3` 锁定 v3，v4 配置完全不同。

**验证**：
```bash
node -e "require('tailwindcss'); console.log('TAILWIND OK')"
node -e "require('chart.js'); console.log('CHART OK')"
node -e "require('react-chartjs-2'); console.log('REACT-CHARTJS OK')"
```

---

### Step 8 — 配置 Tailwind CSS + PostCSS

**文件路径 8a**：`/Users/hurryapple/toefl.promodo/english-pomodoro/client/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        focus: '#ef4444',
        break: '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**文件路径 8b**：`/Users/hurryapple/toefl.promodo/english-pomodoro/client/postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**验证**：`npx tailwindcss --help` 输出 CLI 帮助。

---

### Step 9 — 覆盖 client/src/index.css

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/client/src/index.css`

覆盖 Vite 生成的内容：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #f8fafc;
  margin: 0;
}
```

---

### Step 10 — 确认 client/index.html

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/client/index.html`

确认 `<html lang="zh-CN">`，`<title>🍅 英语番茄钟</title>`，`<script type="module" src="/src/main.jsx"></script>` 存在。

---

### Step 11 — 配置 client/vite.config.js

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/client/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
})
```

确认 `port: 5173`，`open: false`。

---

---

## 📌 Milestone 3：React 组件实现

### Step 12 — 创建 client/src/components/Timer.jsx（番茄钟核心）

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/client/src/components/Timer.jsx`

**🆕 关键更新**：提示音采用 **Web Audio API 原生方案**，零外部依赖，无跨域问题，瞬时播放。已移除原外链 `new Audio('https://...').play()` 方案。

完整代码见本仓库 `client/src/components/Timer.jsx`。核心要点：
- `playBeep` 用 `useCallback` 包裹，Web Audio API 生成 880Hz 正弦波，0.5 秒淡出
- `handleTimerEnd` 用 `useCallback` 避免 `useEffect` 无限循环
- `tabular-nums` 保持倒计时等宽不抖动
- 🆕 已移除 `audioRef`（原方案遗留），新方案无需持有 Audio 引用

详见本仓库 `client/src/components/Timer.jsx` 完整源码。

---

### Step 13 — 创建 client/src/components/Stats.jsx（统计面板）

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/client/src/components/Stats.jsx`

详见本仓库 `client/src/components/Stats.jsx` 完整源码。核心要点：
- `ChartJS.register(...)` 在模块顶层执行
- `Promise.all` 并行请求 week + today 两个 API
- `loading` 骨架屏状态处理
- `maintainAspectRatio: false` + `h-48` 固定图表高度

---

### Step 14 — 创建 client/src/pages/Home.jsx（首页容器）

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/client/src/pages/Home.jsx`

详见本仓库 `client/src/pages/Home.jsx` 完整源码。核心要点：
- `statsKey` 传入 `<Stats key={statsKey}>`，番茄钟完成后 +1 触发刷新
- `handlePomodoroComplete` 用 `useCallback` + `async/await`
- 5 步法卡片用 `.map()` 渲染

---

### Step 15 — 覆盖 client/src/App.jsx（路由壳）

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/client/src/App.jsx`

覆盖 Vite 生成的默认内容：

```jsx
import Home from './pages/Home';

function App() {
  return <Home />;
}

export default App;
```

---

### Step 16 — 确认 client/src/main.jsx（React 入口）

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/client/src/main.jsx`

确认内容：
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

确认 `import './index.css'` 存在，`</React.StrictMode>` 闭合。

---

---

## 📌 Milestone 4：项目整合与端到端验证

### Step 17 — 创建根 package.json

**文件路径**：`/Users/hurryapple/toefl.promodo/english-pomodoro/package.json`

```json
{
  "name": "english-pomodoro",
  "version": "1.0.0",
  "private": true,
  "description": "英语番茄钟 — React + Node.js + SQLite 全栈应用",
  "scripts": {
    "dev": "node -e \"const{spawn}=require('child_process');const s=spawn('node',['server.js'],{cwd:'server',stdio:'inherit'});const c=spawn('npx',['vite','--host'],{cwd:'client',stdio:'inherit'});process.on('SIGINT',()=>{s.kill();c.kill();process.exit()});\"",
    "server": "cd server && npm start",
    "client": "cd client && npm run dev"
  },
  "keywords": ["pomodoro", "english-learning", "react", "sqlite"],
  "license": "MIT"
}
```

- `npm run dev`：同时启动前后端
- `npm run server` / `npm run client`：单独启动

---

### Step 18 — 端到端联调验证

#### 18.1 启动后端
```bash
cd /Users/hurryapple/toefl.promodo/english-pomodoro && npm run server
```
确认：`✅ 后端服务运行在 http://localhost:3001`

#### 18.2 启动前端（新终端）
```bash
cd /Users/hurryapple/toefl.promodo/english-pomodoro && npm run client
```
确认：`Local: http://localhost:5173/`

#### 18.3 浏览器验证清单

| # | 操作 | 预期结果 |
|---|------|----------|
| 1 | 打开 `http://localhost:5173` | 完整页面：标题🍅、倒计时 25:00、统计面板、5步法卡片 |
| 2 | 点击「▶ 开始」 | 倒计时递减，进度条移动，轮次指示器第一个圆点脉动 |
| 3 | 点击「⏸ 暂停」 | 倒计时停止 |
| 4 | 继续后等待到 00:00 | 听到 880Hz Web Audio API 原生提示音，自动切换到短休息 05:00 |
| 5 | 休息倒计时结束 | 自动切回专注模式，轮次→第2轮 |
| 6 | 检查统计卡片 | 今日番茄数 + 专注分钟数更新 |
| 7 | 检查图表 | 当日柱状图有数据 |

#### 18.4 API 数据校验
```bash
cd /Users/hurryapple/toefl.promodo/english-pomodoro/server
node -e "const db=require('./db'); console.log('番茄钟:', db.prepare('SELECT COUNT(*) as cnt FROM pomodoros').get().cnt); console.log('每日记录:', JSON.stringify(db.prepare('SELECT * FROM daily_records').all()));"
```

---

---

## 🔧 常见故障排查表

| 症状 | 可能原因 | 解决方法 |
|------|---------|----------|
| `better-sqlite3` 安装失败 | 缺少 C++ 编译工具 | macOS: `xcode-select --install` |
| `@tailwind base` 未识别 | Tailwind CSS 未正确配置 | 确认 Step 8 两个配置文件存在 |
| 图表不显示 | ChartJS 未注册 | 检查 `Stats.jsx` 中 `ChartJS.register(...)` 在组件外 |
| 番茄钟后统计不更新 | API 地址不对或后端未启动 | 确认后端 3001 运行；检查浏览器 Network 面板 |
| `useEffect` 执行两次 | `React.StrictMode` 开发模式 | 正常行为，生产构建不会重复 |
| 倒计时数字抖动 | 非等宽字体 | 确认 `tabular-nums` 类存在 |
| 页面空白 | import 路径错误 | 检查 `App → Home → Timer/Stats` 路径链 |
| 提示音不播放 | 浏览器 AudioContext 限制 | 需用户先点击（与页面交互），正常安全策略 |

---

## ✅ 执行完毕确认清单

- [ ] `server/pomodoro.db` 文件存在
- [ ] `curl http://localhost:3001/api/goals/today` 返回 JSON
- [ ] `curl -X POST http://localhost:3001/api/pomodoros -H "Content-Type: application/json" -d '{"task_type":"vocabulary","duration":25}'` 返回 `{"success":true}`
- [ ] 浏览器 `http://localhost:5173` 可正常打开
- [ ] 番茄钟倒计时功能正常
- [ ] 统计图表正确渲染
- [ ] 番茄钟完成后数据写入数据库
- [ ] 倒计时归零时播放 Web Audio API 原生提示音

---

**END OF IMPLEMENTATION_PLAN.md**
