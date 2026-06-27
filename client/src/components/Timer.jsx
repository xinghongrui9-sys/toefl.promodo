import { useState, useEffect, useRef, useCallback } from 'react';

const MODES = {
  FOCUS: { duration: 25 * 60, label: '专注学习', color: 'text-focus' },
  SHORT_BREAK: { duration: 5 * 60, label: '短休息', color: 'text-break' },
  LONG_BREAK: { duration: 20 * 60, label: '长休息', color: 'text-break' },
};

const TASK_TYPES = [
  { value: 'vocabulary', label: '📚 托福单词背诵' },
  { value: 'listening', label: '🎧 听力精听 / Lecture' },
  { value: 'reading', label: '📖 阅读刷题 / 长难句' },
  { value: 'speaking', label: '🗣️ 口语 TPO / 综合题' },
  { value: 'writing', label: '✍️ 独立写作 / 综合写作' },
  { value: 'review', label: '🔍 错题复盘 / 整理' },
];

export default function Timer({ onComplete, externalTaskType }) {
  const [mode, setMode] = useState('FOCUS');
  const [timeLeft, setTimeLeft] = useState(MODES.FOCUS.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(1);
  const [taskType, setTaskType] = useState('vocabulary');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const intervalRef = useRef(null);
  const currentMode = MODES[mode];

  useEffect(() => {
    if (externalTaskType && TASK_TYPES.some(t => t.value === externalTaskType)) {
      setTaskType(externalTaskType);
    }
  }, [externalTaskType]);

  const playBeep = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}
  }, []);

  const handleTimerEnd = useCallback(() => {
    setIsRunning(false);
    if (mode === 'FOCUS') {
      onComplete?.({ taskType, duration: 25 });
      if (round % 4 === 0) {
        setMode('LONG_BREAK');
        setTimeLeft(MODES.LONG_BREAK.duration);
      } else {
        setMode('SHORT_BREAK');
        setTimeLeft(MODES.SHORT_BREAK.duration);
      }
    } else {
      setMode('FOCUS');
      setTimeLeft(MODES.FOCUS.duration);
      if (mode === 'LONG_BREAK') setRound(1);
      else setRound((r) => r + 1);
    }
    playBeep();
  }, [mode, round, taskType, onComplete, playBeep]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) handleTimerEnd();
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, handleTimerEnd]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsRunning(v => !v);
      }
      if (e.code === 'Escape' && isFocusMode) setIsFocusMode(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFocusMode]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return m + ':' + sec;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('FOCUS');
    setTimeLeft(MODES.FOCUS.duration);
    setRound(1);
  };

  const progress = ((currentMode.duration - timeLeft) / currentMode.duration) * 100;
  const currentTaskLabel = TASK_TYPES.find(t => t.value === taskType)?.label || '';

  if (isFocusMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center px-8">
        <div className="text-slate-400 text-lg mb-2">
          {currentMode.label} - 第 {round} 轮
        </div>
        <div className="text-white text-9xl font-light tracking-tight tabular-nums mb-8">
          {formatTime(timeLeft)}
        </div>
        {mode === 'FOCUS' && (
          <div className="text-slate-300 text-xl mb-12">{currentTaskLabel}</div>
        )}
        <div className="w-96 h-1.5 bg-slate-700 rounded-full mb-12 overflow-hidden">
          <div className={'h-full transition-all duration-1000 ' + (mode === 'FOCUS' ? 'bg-red-500' : 'bg-emerald-500')}
            style={{ width: progress + '%' }} />
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setIsRunning(!isRunning)}
            className={'px-10 py-4 rounded-xl font-medium text-white text-lg transition-all cursor-pointer ' + (mode === 'FOCUS' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600')}>
            {isRunning ? '⏸ 暂停' : '▶ 开始'}
          </button>
          <button onClick={resetTimer} className="px-8 py-4 rounded-xl font-medium bg-slate-700 hover:bg-slate-600 text-white transition-all cursor-pointer">重置</button>
          <button onClick={() => setIsFocusMode(false)} className="px-8 py-4 rounded-xl font-medium text-slate-400 hover:text-white transition-all cursor-pointer">退出 (Esc)</button>
        </div>
        <div className="flex justify-center gap-3 mt-16">
          {[1, 2, 3, 4].map(i => (<div key={i} className={'w-3 h-3 rounded-full transition-all ' + (i < round ? 'bg-blue-500' : i === round && isRunning ? 'bg-blue-500 animate-pulse' : 'bg-slate-700')} />))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md mx-auto relative">
      <button onClick={() => setIsFocusMode(true)} className="absolute top-6 right-6 text-gray-400 hover:text-primary text-sm transition-colors cursor-pointer" title="进入全屏专注模式">专注模式</button>

      <div className="text-center mb-6">
        <span className={'text-lg font-medium ' + currentMode.color}>{currentMode.label} · 第 {round} 轮</span>
        <div className="text-7xl font-light mt-4 tracking-tight tabular-nums">{formatTime(timeLeft)}</div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div className={'h-full transition-all duration-1000 ' + (mode === 'FOCUS' ? 'bg-focus' : 'bg-break')} style={{ width: progress + '%' }} />
      </div>
      {mode === 'FOCUS' && (
        <div className="mb-6">
          <label className="text-sm text-gray-500 mb-2 block">当前学习任务</label>
          <select value={taskType} onChange={(e) => setTaskType(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer" disabled={isRunning}>
            {TASK_TYPES.map(t => (<option key={t.value} value={t.value}>{t.label}</option>))}
          </select>
        </div>
      )}
      <div className="flex gap-3 justify-center">
        <button onClick={() => setIsRunning(!isRunning)}
          className={'px-8 py-3 rounded-xl font-medium text-white transition-all cursor-pointer ' + (mode === 'FOCUS' ? 'bg-focus hover:bg-red-600' : 'bg-break hover:bg-emerald-600')}>
          {isRunning ? '⏸ 暂停' : '▶ 开始'}
        </button>
        <button onClick={resetTimer} className="px-6 py-3 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer">重置</button>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {[1, 2, 3, 4].map(i => (<div key={i} className={'w-3 h-3 rounded-full transition-all ' + (i < round ? 'bg-primary' : i === round && isRunning ? 'bg-primary animate-pulse' : 'bg-gray-200')} />))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">每 4 轮后进入长休息</p>
      <p className="text-center text-xs text-gray-300 mt-1">快捷键：空格暂停/继续</p>
    </div>
  );
}
