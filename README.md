# 🍅 托福番茄钟 — TOEFL Pomodoro Timer

> 专为托福备考设计的全栈番茄钟应用，融合 5 步番茄工作法与听说读写单词五大英语训练体系。

React 18 · Vite 8 · Tailwind CSS 3 · Express 4 · SQLite

---

## ✨ 功能总览

| 模块 | 功能 |
|------|------|
| 🍅 番茄钟核心 | 25分专注 / 5分短休 / 20分长休，每4轮自动切换 |
| 🎯 全屏专注模式 | 深色沉浸界面，Esc退出 + 空格暂停 |
| 📚 托福6类题型 | 单词/Lecture精听/长难句/口语TPO/写作/错题复盘 |
| 📋 学习待办清单 | CRUD + 日期隔离 + 一键切换任务类型 |
| 📊 统计复盘 | Chart.js 近7天柱状图 |
| 📅 TOEFL倒计时 | 默认2026-07-18，备考进度条 + 激励语 |
| 🎧 原生提示音 | Web Audio API 880Hz正弦波 |
| 💾 数据持久化 | SQLite 5表 + 11个RESTful API |

---

## 🚀 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/xinghongrui9-sys/toefl.promodo.git
cd toefl.promodo

# 2. 安装依赖
cd server && npm install && cd ..
cd client && npm install && cd ..

# 3. 一键启动
npm run dev
```

访问 `http://localhost:5173` 即可使用。

## 📖 模块详解

### 🍅 番茄钟核心 (Timer.jsx)

25分专注→5分短休→每4轮20分长休，自动轮换。Web Audio API 880Hz 原生提示音。

🔮 优化方向：自定义时长设置 / 白噪音背景音 / 番茄钟历史回顾

### 🎯 全屏专注模式

深色沉浸界面，仅保留倒计时+任务。空格暂停/继续，Esc退出。

🔮 优化方向：屏蔽系统通知 / 退出时弹出快速小结 / 全屏隐藏菜单栏

### 📚 托福任务类型

单词背诵 / Lecture精听 / 长难句阅读 / 口语TPO / 独立写作 / 错题复盘

🔮 优化方向：题型预设推荐轮数 / 分类统计各题型投入时间 / 口语联动录音

### 📋 学习待办清单 (TodoList.jsx)

CRUD + 按日期隔离存储 + ▶ 一键切换Timer任务类型（智能关键词映射：单词→vocabulary，听力→listening 等）。

🔮 优化方向：预设托福每日模板一键导入 / 批量清空已完成 / 拖拽排序

### 📊 统计复盘 (Stats.jsx)

Chart.js 柱状图展示近7天每日专注分钟数。骨架屏加载状态。

🔮 优化方向：周/月维度切换 / 各题型时长占比饼图 / 连续打卡天数 / CSV导出

### 📅 TOEFL 倒计时 (ExamCountdown.jsx)

默认考试日期 2026-07-18，点击徽章可修改。备考进度条 = (首次使用日→考试日) 百分比。
分阶段激励语：冲刺🔥(≤7天) / 保持⚡(≤15天) / 进步🎯(≤30天) / 积累🌱(>30天)

🔮 优化方向：考前7天自动切换冲刺模式配色 / 日均学习时长与目标对比 / 多考试日期支持

### 🎯 托福备考方案卡片

4种推荐搭配：听力突破日 / 口语输出日 / 全科模考日 / 单词+复盘日

🔮 优化方向：根据倒计时自动推荐当日方案 / 自定义方案模板 / 方案完成度追踪

---

## 📡 API 文档

Base URL: `http://localhost:3001/api`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/goals/today` | 获取/创建今日目标 |
| PUT | `/goals/today` | 更新今日目标 |
| POST | `/pomodoros` | 记录完成的番茄钟 |
| GET | `/pomodoros/today` | 获取今日番茄钟记录 |
| GET | `/stats/week` | 近7天统计数据 |
| GET | `/todos/today` | 获取今日待办 |
| POST | `/todos` | 新增待办 |
| PUT | `/todos/:id/toggle` | 切换待办完成状态 |
| DELETE | `/todos/:id` | 删除待办 |
| GET | `/settings` | 获取全局配置 |
| PUT | `/settings/:key` | 更新全局配置 |

---

## 🗄 数据库设计

5 张表，SQLite + WAL 模式：

| 表名 | 用途 | 关键字段 |
|------|------|---------|
| `goals` | 每日学习目标 | date, target_words, target_pomodoros |
| `pomodoros` | 番茄钟记录 | date, task_type, duration |
| `daily_records` | 每日汇总 | date, total_
---

## 📡 API 文档

Base URL: `http://localhos办事项 | date, conte
#, c
Base URL: `http:tin
| 方法 | 路径 | 说明 |
|-----? e|------|------|---18） |

---

## 📡 API 文档

Base: `http://localhost:3001/api`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/goals/today` | 获取今日目标 |
| PUT | `/goals/today` | 更新今日目标 |
| POST | `/pomodoros` | 记录番茄钟 |
| GET | `/pomodoros/today` | 今日番茄记录 |
| GET | `/stats/week` | 近7天统计 |
| GET | `/todos/today` | 今日待办 |
| POST | `/todos` | 新增待办 |
| PUT | `/todos/:id/toggle` | 切换完成 |
| DELETE | `/todos/:id` | 删除待办 |
| GET | `/settings` | 全局配置 |
| PUT | `/settings/:key` | 更新配置 |

---

## 🗄 数据库

SQLite + WAL，5表：goals / pomodoros / daily_records / todos / settings

---

## 🏗 架构

```
浏览器(React) ←→ Express API(:3001) ←→ SQLite
```


---

## 📝 开发规范

详见 `AGENTS.md`。核心约束：React 18 / Tailwind 3 / Express 4 / SQLite，端口 3001+5173 固定。

---

## 📄 许可证

MIT License
