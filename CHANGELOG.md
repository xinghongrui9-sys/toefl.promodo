# CHANGELOG

## [1.3.0] — TOEFL 考试集成
### Added
- 托福考试倒计时 (ExamCountdown)：默认2026-07-18，点击修改，localStorage+后端settings双持久化
- 备考进度条：首次使用日→考试日百分比+分阶段激励语（冲刺/保持/积累）
- 托福专属任务类型：单词背诵/精听Lecture/阅读长难句/口语TPO/写作/错题复盘
- 托福备考方案卡片：听力日/口语日/模考日/复盘日
- 后端 settings 表+API：key-value全局配置，支持考试日期持久化
- 构建验证：25模块编译通过，0 errors

## [1.2.0] — 待办↔番茄任务联动
### Added
- 待办项一键开始：点击待办旁的▶按钮自动切换Timer任务类型
- 智能关键词映射：单词/听力/阅读/口语/写作自动识别
- 零后端改动，纯前端状态桥接实现

## [1.1.0] — 全屏专注模式 + 待办清单
### Added
- 全屏专注模式：深色沉浸界面，Esc退出 + 空格暂停/继续快捷键
- 学习待办清单 (TodoList)：新增/勾选/删除，按日期隔离
- 后端 todos 表 + 4个API (GET/POST/PUT/DELETE)
- 前端构建验证：24模块编译通过，0 errors

## [1.0.0] — 完整实现
### Added
- 项目目录结构创建
- AGENTS.md 项目宪法
- CHANGELOG.md 记忆锚点
- IMPLEMENTATION_PLAN.md 完整实施方案（含 Web Audio API 提示音更新）
- 后端服务：Express + better-sqlite3，5 个 API 全部通过测试
- 前端应用：React 18 + Vite + Tailwind CSS 3 + Chart.js
- 番茄钟核心组件 (Timer.jsx)：Web Audio API 原生提示音，零外部依赖
- 统计面板组件 (Stats.jsx)：Chart.js 柱状图 + 骨架屏加载
- 首页容器 (Home.jsx)：双栏布局 + 5步法卡片 + 任务推荐
- 路由壳 (App.jsx)：为多页面扩展预留
- 根 package.json：npm run dev 一键启动前后端
- 前端构建验证：23 模块编译通过，0 errors
