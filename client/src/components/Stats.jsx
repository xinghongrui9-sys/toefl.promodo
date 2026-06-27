import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';

// ⚠️ 必须在组件外注册，且只注册一次
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const API_BASE = 'http://localhost:3001/api';

export default function Stats() {
  const [weekData, setWeekData] = useState([]);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weekRes, todayRes] = await Promise.all([
          fetch(`${API_BASE}/stats/week`),
          fetch(`${API_BASE}/pomodoros/today`),
        ]);
        const week = await weekRes.json();
        const todayData = await todayRes.json();
        setWeekData(week);
        setToday(todayData);
      } catch (err) {
        console.error('统计数据加载失败:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: weekData.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: '专注分钟数',
        data: weekData.map((d) => d.total_focus_minutes),
        backgroundColor: '#3b82f6',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 25 },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-48 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">📊 学习统计</h3>

      {today && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {today.summary?.completed_pomodoros ?? 0}
            </div>
            <div className="text-sm text-gray-500">今日番茄数</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {today.summary?.total_focus_minutes ?? 0}
            </div>
            <div className="text-sm text-gray-500">专注分钟</div>
          </div>
        </div>
      )}

      <div className="h-48">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-medium mb-2">💡 每日复盘建议</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>· 回顾今日完成的番茄钟，标记高效/低效时段</li>
          <li>· 整理今日生词与难点，录入单词本</li>
          <li>· 设定明日目标，优先安排薄弱项训练</li>
        </ul>
      </div>
    </div>
  );
}
