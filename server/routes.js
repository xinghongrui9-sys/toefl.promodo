const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/goals/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  let goal = db.prepare('SELECT * FROM goals WHERE date = ?').get(today);
  if (!goal) { db.prepare('INSERT INTO goals (date) VALUES (?)').run(today); goal = db.prepare('SELECT * FROM goals WHERE date = ?').get(today); }
  res.json(goal);
});

router.put('/goals/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  db.prepare('UPDATE goals SET target_words=?,target_pomodoros=? WHERE date=?').run(req.body.target_words,req.body.target_pomodoros,today);
  res.json({success:true});
});

router.post('/pomodoros', (req, res) => {
  const {task_type,duration,note}=req.body;
  const today=new Date().toISOString().split('T')[0];
  const r=db.prepare('INSERT INTO pomodoros(date,task_type,duration,note)VALUES(?,?,?,?)').run(today,task_type,duration,note||'');
  db.prepare('INSERT INTO daily_records(date,total_focus_minutes,completed_pomodoros)VALUES(?,?,1) ON CONFLICT(date) DO UPDATE SET total_focus_minutes=total_focus_minutes+excluded.total_focus_minutes,completed_pomodoros=completed_pomodoros+1').run(today,duration);
  res.json({id:r.lastInsertRowid,success:true});
});

router.get('/pomodoros/today', (req, res) => {
  const t=new Date().toISOString().split('T')[0];
  const rec=db.prepare('SELECT * FROM pomodoros WHERE date=? ORDER BY created_at DESC').all(t);
  const sum=db.prepare('SELECT * FROM daily_records WHERE date=?').get(t)||{completed_pomodoros:0,total_focus_minutes:0};
  res.json({records:rec,summary:sum});
});

router.get('/stats/week', (req, res) => {
  res.json(db.prepare("SELECT date,completed_pomodoros,total_focus_minutes FROM daily_records WHERE date>=date('now','-7 days') ORDER BY date ASC").all());
});

router.get('/todos/today', (req, res) => {
  res.json(db.prepare('SELECT * FROM todos WHERE date=? ORDER BY created_at DESC').all(new Date().toISOString().split('T')[0]));
});

router.post('/todos', (req, res) => {
  if(!req.body.content?.trim())return res.status(400).json({error:'empty'});
  const r=db.prepare('INSERT INTO todos(date,content)VALUES(?,?)').run(new Date().toISOString().split('T')[0],req.body.content.trim());
  res.json({id:r.lastInsertRowid,success:true});
});

router.put('/todos/:id/toggle', (req, res) => {
  const t=db.prepare('SELECT * FROM todos WHERE id=?').get(req.params.id);
  if(!t)return res.status(404).json({error:'nf'});
  db.prepare('UPDATE todos SET completed=? WHERE id=?').run(t.completed?0:1,req.params.id);
  res.json({success:true});
});

router.delete('/todos/:id', (req, res) => {
  db.prepare('DELETE FROM todos WHERE id=?').run(req.params.id);
  res.json({success:true});
});

router.get('/settings', (req, res) => {
  const rows=db.prepare('SELECT key,value FROM settings').all();
  const s={}; rows.forEach(r=>s[r.key]=r.value);
  res.json(s);
});

router.put('/settings/:key', (req, res) => {
  db.prepare('INSERT INTO settings(key,value)VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(req.params.key,req.body.value);
  res.json({success:true});
});

module.exports = router;
