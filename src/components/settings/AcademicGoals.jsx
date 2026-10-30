import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Percent,
  GraduationCap,
  Award,
  Calendar,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { getDaysRemaining } from '../../utils/dateUtils';

const DEFAULT_INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'Achieve Semester 5 Target CGPA',
    category: 'CGPA',
    current: 8.2,
    target: 8.5,
    unit: 'CGPA',
    deadline: '2026-12-15',
    priority: 'High',
  },
  {
    id: 'goal-2',
    title: 'Maintain Above 75% Attendance Across All 6 Courses',
    category: 'Attendance',
    current: 78,
    target: 80,
    unit: '%',
    deadline: '2026-11-30',
    priority: 'High',
  },
  {
    id: 'goal-3',
    title: 'Weekly Focus Study Target',
    category: 'Study Hours',
    current: 10,
    target: 14,
    unit: 'hrs',
    deadline: '2026-11-05',
    priority: 'Medium',
  },
  {
    id: 'goal-4',
    title: 'Complete All Midterm Problem Sets in CN & ML',
    category: 'Tasks',
    current: 3,
    target: 5,
    unit: 'sets',
    deadline: '2026-11-10',
    priority: 'Medium',
  },
];

const CATEGORIES = ['All', 'CGPA', 'Attendance', 'Study Hours', 'Tasks', 'Exams'];

const AcademicGoals = ({ goals = [], onUpdateGoals }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'CGPA',
    current: 0,
    target: 10,
    unit: 'CGPA',
    deadline: '',
    priority: 'Medium',
  });

  const goalList = goals && goals.length > 0 ? goals : DEFAULT_INITIAL_GOALS;

  const filteredGoals = goalList.filter((g) => {
    if (activeCategory === 'All') return true;
    return g.category === activeCategory;
  });

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    const created = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      current: Number(newGoal.current) || 0,
      target: Number(newGoal.target) || 1,
    };

    const next = [...goalList, created];
    onUpdateGoals(next);
    setNewGoal({
      title: '',
      category: 'CGPA',
      current: 0,
      target: 10,
      unit: 'CGPA',
      deadline: '',
      priority: 'Medium',
    });
    setShowAddModal(false);
  };

  const handleDeleteGoal = (id) => {
    const next = goalList.filter((g) => g.id !== id);
    onUpdateGoals(next);
  };

  const handleIncrement = (id, step = 1) => {
    const next = goalList.map((g) => {
      if (g.id === id) {
        const nextVal = Math.min(g.target, Number((g.current + step).toFixed(1)));
        return { ...g, current: nextVal };
      }
      return g;
    });
    onUpdateGoals(next);
  };

  const handleMarkComplete = (id) => {
    const next = goalList.map((g) => {
      if (g.id === id) {
        return { ...g, current: g.target };
      }
      return g;
    });
    onUpdateGoals(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Category Pills & Action Header */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
              Academic Milestones & Objective Tracking
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Set measurable targets for CGPA, attendance thresholds, and weekly study blocks.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(!showAddModal)}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.86rem',
              padding: '0.5rem 1rem',
            }}
          >
            <Plus size={16} /> {showAddModal ? 'Cancel' : 'Add New Goal'}
          </button>
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: isActive ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: isActive ? 'var(--primary-text)' : 'var(--text-muted)',
                  border: `1px solid ${isActive ? 'var(--border-focus)' : 'var(--border-subtle)'}`,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add New Goal Form Drawer */}
      {showAddModal && (
        <form
          onSubmit={handleCreateGoal}
          className="card"
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'var(--bg-secondary)',
            borderColor: 'var(--primary)',
          }}
        >
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Create Academic Target</h4>
          <div className="grid-2" style={{ gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Goal Title *
              </label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="e.g. Score 9.0 in Midterm CN"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Category
              </label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
              >
                <option value="CGPA">CGPA / Grade</option>
                <option value="Attendance">Attendance %</option>
                <option value="Study Hours">Study Hours</option>
                <option value="Tasks">Tasks / Assignments</option>
                <option value="Exams">Exams Preparation</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Current Value
                </label>
                <input
                  type="number"
                  step="any"
                  value={newGoal.current}
                  onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Target Value *
                </label>
                <input
                  type="number"
                  step="any"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  required
                />
              </div>
              <div style={{ width: 80 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Unit
                </label>
                <input
                  type="text"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  placeholder="%"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <div style={{ width: 120 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Priority
                </label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goal Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredGoals.map((g) => {
          const percent = Math.min(100, Math.max(0, Math.round((g.current / g.target) * 100)));
          const isCompleted = percent >= 100;
          const daysLeft = g.deadline ? getDaysRemaining(g.deadline) : null;

          return (
            <div
              key={g.id}
              className="card"
              style={{
                padding: '1.15rem 1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius-md)',
                      background: isCompleted ? 'var(--success-bg)' : 'var(--primary-light)',
                      color: isCompleted ? 'var(--success)' : 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={17} /> : <Target size={17} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                      {g.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.2rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      <span>Category: {g.category}</span>
                      <span>•</span>
                      <span>Priority: {g.priority}</span>
                      {daysLeft !== null && (
                        <>
                          <span>•</span>
                          <span style={{ color: daysLeft < 3 ? 'var(--danger)' : 'var(--text-muted)' }}>
                            {daysLeft >= 0 ? `${daysLeft} days remaining` : 'Past deadline'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Indicators & Quick Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: isCompleted ? 'var(--success)' : 'var(--text-primary)',
                    }}
                  >
                    {g.current} / {g.target} {g.unit}
                  </span>

                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      background: isCompleted ? 'var(--success-bg)' : 'var(--primary-light)',
                      color: isCompleted ? 'var(--success)' : 'var(--primary)',
                      border: `1px solid ${isCompleted ? 'var(--success-border)' : 'var(--border-subtle)'}`,
                    }}
                  >
                    {percent}%
                  </span>

                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleIncrement(g.id, g.unit === 'CGPA' ? 0.1 : 1)}
                      title="Increment progress"
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.76rem', fontWeight: 700 }}
                    >
                      +{g.unit === 'CGPA' ? '0.1' : '1'}
                    </button>
                  )}

                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleMarkComplete(g.id)}
                      title="Mark as Completed"
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.76rem' }}
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(g.id)}
                    title="Delete Goal"
                    style={{
                      color: 'var(--text-muted)',
                      padding: '0.25rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  height: 6,
                  background: 'var(--bg-secondary)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percent}%`,
                    background: isCompleted ? 'var(--success)' : 'var(--primary)',
                    borderRadius: 3,
                    transition: 'width var(--transition-normal)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AcademicGoals;
