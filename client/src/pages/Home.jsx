import { useState, useEffect, useCallback } from 'react';
import Timer from '../components/Timer';
import Stats from '../components/Stats';
import ExamCountdown from '../components/ExamCountdown';
import TodoList from '../components/TodoList';

const API_BASE = 'http://localhost:3001/api';

function mapContentToTaskType(content) {
  const c = content.toLowerCase();
  if (/单词|词汇|背词/.test(c)) return 'vocabulary';
  if (/听力|精听|泛听/.test(c)) return 'listening';
  if (/阅读|外刊|精读/.test(c)) return 'reading';
  if (/口语|跟读|复述|朗读/.test(c)) return 'speaking';
  if (/写作|作文|翻译/.test(c)) return 'writing';
  return null;
}

export default function Home() {
  const [goal, setGoal] = useState({ target_words: 30, target_pomodoros: 8 });
  const [statsKey, setStatsKey] = useState(0);
  const [activeTaskType, setActiveTaskType] = useState(null);

  useEffect(() => {
    fetch(API_BASE + '/goals/today').then(r => r.json()).then(setGoal).catch(console.error);
  }, []);

  const handlePomodoroComplete = useCallback(async ({ taskType, duration }) => {
    await fetch(API_BASE + '/pomodoros', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_type: taskType, duration }),
    });
    setStatsKey(k => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">🍅 托福番茄钟</h1>
          <p className="text-gray-500 mt-2">25分钟专注 · TOEFL备考专用</p>
          <div className="mt-4"><ExamCountdown /></div>
          <div className="mt-4 inline-flex items-center gap-6 bg-white px-6 py-3 rounded-full shadow-sm">
            <div><span className="text-sm text-gray-400">今日目标</span><span className="ml-2 font-semibold text-primary">{goal.target_words} 单词</span></div>
            <div className="w-px h-4 bg-gray-200" />
            <div><span className="text-sm text-gray-400">番茄目标</span><span className="ml-2 font-semibold text-primary">{goal.target_pomodoros} 个</span></div>
          </div>
        </header>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-8">
            <Timer onComplete={handlePomodoroComplete} externalTaskType={activeTaskType} />

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">📝 番茄英语 5 步法</h3>
              <div className="space-y-3 text-sm text-gray-600">
                {['明确目标','专注25分钟','休息5分钟','每4轮长休','每日复盘'].map((t,i)=>(<div key={i} className="flex gap-3"><span className="w-6 h-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span><span>{t}</span></div>))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Stats key={statsKey} />
            <TodoList refreshKey={statsKey} onStartTask={(c)=>{const t=mapContentToTaskType(c);if(t)setActiveTaskType(t)}} />

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">🎯 托福备考方案</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-red-50 rounded-lg"><div className="font-medium text-red-700">听力突破日</div><div className="text-gray-500 text-xs mt-1">3轮精听 + 1轮错题整理</div></div>
                <div className="p-3 bg-blue-50 rounded-lg"><div className="font-medium text-blue-700">口语输出日</div><div className="text-gray-500 text-xs mt-1">2轮独立题 + 2轮综合题</div></div>
                <div className="p-3 bg-purple-50 rounded-lg"><div className="font-medium text-purple-700">全科模考日</div><div className="text-gray-500 text-xs mt-1">听说读写各1轮</div></div>
                <div className="p-3 bg-emerald-50 rounded-lg"><div className="font-medium text-emerald-700">单词+复盘日</div><div className="text-gray-500 text-xs mt-1">3轮单词 + 1轮错题回顾</div></div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center text-gray-400 text-sm mt-12">🍅 坚持是最好的语言天赋 · Stay consistent</footer>
      </div>
    </div>
  );
}
