import { useState, useEffect } from 'react';

const STORAGE_EXAM_DATE = 'toefl_exam_date';
const STORAGE_FIRST_USE = 'toefl_first_use';
const DEFAULT_EXAM_DATE = '2026-07-18';

export default function ExamCountdown() {
  const [examDate, setExamDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ed = localStorage.getItem(STORAGE_EXAM_DATE);
    if (!ed) { ed = DEFAULT_EXAM_DATE; localStorage.setItem(STORAGE_EXAM_DATE, ed); }
    setExamDate(ed);

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    let firstUse = localStorage.getItem(STORAGE_FIRST_USE);
    if (!firstUse) { firstUse = todayStr; localStorage.setItem(STORAGE_FIRST_USE, firstUse); }

    const exam = new Date(ed + 'T00:00:00');
    const first = new Date(firstUse + 'T00:00:00');
    const diffDays = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    const totalDays = Math.ceil((exam - first) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today - first) / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);
    setProgress(totalDays > 0 ? Math.min(100, Math.round((elapsedDays / totalDays) * 100)) : 100);
  }, []);

  const handleChangeDate = () => {
    const newDate = prompt('TOEFL exam date (YYYY-MM-DD):', examDate);
    if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      localStorage.setItem(STORAGE_EXAM_DATE, newDate);
      setExamDate(newDate);
      const today = new Date();
      const exam = new Date(newDate + 'T00:00:00');
      setDaysLeft(Math.ceil((exam - today) / 86400000));
      const fu = localStorage.getItem(STORAGE_FIRST_USE) || today.toISOString().split('T')[0];
      const first = new Date(fu + 'T00:00:00');
      const td = Math.ceil((exam - first) / 86400000);
      const ed2 = Math.ceil((today - first) / 86400000);
      setProgress(td > 0 ? Math.min(100, Math.round((ed2 / td) * 100)) : 100);
    }
  };

  if (!examDate) return null;
  const isClose = daysLeft >= 0 && daysLeft <= 7;
  const isOver = daysLeft < 0;
  const isToday = daysLeft === 0;
  const getMotivation = () => {
    if (isOver) return 'DONE';
    if (isToday) return 'GO! 💪';
    if (daysLeft <= 7) return '冲刺! 🔥';
    if (daysLeft <= 15) return '保持! ⚡';
    if (daysLeft <= 30) return '进步! 🎯';
    return '积累! 🌱';
  };
  const cc = isOver ? 'from-gray-400 to-gray-500' : isToday ? 'from-yellow-500 to-orange-500' : isClose ? 'from-red-500 to-pink-500' : 'from-red-500 to-orange-500';

  return (
    <div className="w-full max-w-md mx-auto" onClick={handleChangeDate} title="Click to change exam date" style={{cursor:'pointer'}}>
      <div className={'bg-gradient-to-r ' + cc + ' text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📅 TOEFL</span>
            <span className="opacity-60">|</span>
            {isToday ? <span className="font-bold">TODAY!</span> : isOver ? <span>DONE</span> : <span><strong className="text-base">{daysLeft}</strong> days left</span>}
          </div>
          <span className="text-xs opacity-70">{examDate}</span>
        </div>
        {!isOver && (
          <div className="mt-2">
            <div className="flex justify-between text-xs opacity-80 mb-0.5">
              <span>Prep {progress}%</span>
              <span>{getMotivation()}</span>
            </div>
            <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{width:progress+'%'}} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
