# AGENTS.md — 英语番茄钟 项目宪法

## 技术栈（不可变更）
- 前端：React 18 + Vite + Tailwind CSS 3 + Chart.js 4 + react-chartjs-2
- 后端：Node.js + Express 4 + better-sqlite3
- 数据库：SQLite（文件型，零配置）
- 包管理器：npm（禁用 yarn / pnpm）
- 开发端口：后端 3001，前端 5173（不可更改）

## 目录架构约束
- 所有后端代码位于 `server/`，入口为 `server/server.js`
- 所有前端代码位于 `client/`，入口为 `client/src/main.jsx`
- 前端页面组件位于 `client/src/pages/`，通用组件位于 `client/src/components/`
- 数据库文件 `pomodoro.db` 自动生成于 `server/` 目录，不可手动创建或删除
- 禁止在根目录新增任何 `.js` / `.jsx` 源码文件

## 绝对禁止事项
1. 禁止修改 `AGENTS.md` 本身
2. 禁止修改后端端口 3001 和前端端口 5173
3. 禁止引入任何未在技术栈中列出的第三方依赖
4. 禁止删除数据库文件 `pomodoro.db`
5. 禁止执行 `rm -rf`、`git push --force`、`npm publish` 等破坏性命令
6. 禁止在未经验证的情况下批量修改超过 3 个文件
7. 禁止使用 `here-document (<<'XXX')` 语法，所有代码先写入独立文件再执行

## 编码规范
- React 组件使用函数式组件 + Hooks，禁用 Class 组件
- 所有 API 调用使用 `fetch`，基础 URL 为 `http://localhost:3001/api`
- 样式仅使用 Tailwind CSS 类名，禁止内联 style 或独立 CSS 文件
- 每个文件变更后必须立即进行语法验证

## 验证标准
- 后端：`node server/server.js` 启动无报错，`curl` 测试全部 API 返回 200
- 前端：`cd client && npm run dev` 启动无报错，浏览器可访问
- 端到端：番茄钟计数正常写入数据库，图表数据正确渲染
