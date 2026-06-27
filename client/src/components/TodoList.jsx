import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001/api";

export default function TodoList({ refreshKey, onStartTask }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_BASE + "/todos/today");
      setTodos(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTodos(); }, [refreshKey]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await fetch(API_BASE + "/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
    });
    setInput("");
    fetchTodos();
  };

  const handleToggle = async (id) => {
    await fetch(API_BASE + "/todos/" + id + "/toggle", { method: "PUT" });
    fetchTodos();
  };

  const handleDelete = async (id) => {
    await fetch(API_BASE + "/todos/" + id, { method: "DELETE" });
    fetchTodos();
  };

  const completedCount = todos.filter(t => t.completed).length;

  if (loading) return (<div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse"><div className="h-6 bg-gray-200 rounded w-1/3 mb-4"/><div className="space-y-2">{[1,2,3].map(i=><div key={i} className="h-10 bg-gray-100 rounded"/>)}</div></div>);

  return (<div className="bg-white rounded-2xl shadow-sm p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">📋 今日待办</h3><span className="text-sm text-gray-500">{completedCount} / {todos.length}</span></div><form onSubmit={handleAdd} className="mb-4 flex gap-2"><input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="添加学习任务..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/><button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all cursor-pointer">添加</button></form><div className="space-y-2 max-h-64 overflow-y-auto">{todos.length===0?<p className="text-center text-gray-400 text-sm py-4">暂无待办，添加今日学习目标吧</p>:todos.map(todo=>(<div key={todo.id} className="flex items-center gap-3 p-3 rounded-lg group hover:bg-gray-50 transition-colors"><button onClick={()=>handleToggle(todo.id)} className={"w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all cursor-pointer "+(todo.completed?"bg-primary border-primary text-white":"border-gray-300 hover:border-primary")}>{todo.completed?"✓":""}</button><span className={"flex-1 text-sm "+(todo.completed?"text-gray-400 line-through":"text-gray-700")}>{todo.content}</span><button onClick={() => onStartTask?.(todo.content)} className="opacity-0 group-hover:opacity-100 text-primary hover:text-blue-700 text-sm transition-all cursor-pointer mr-1" title="开始此任务">▶</button><button onClick={()=>handleDelete(todo.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-sm transition-all cursor-pointer">删除</button></div>))}</div></div>);
}
