import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import TaskItem from '../components/tasks/TaskItem';
import TaskFormModal from '../components/tasks/TaskFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { getDaysRemaining } from '../utils/dateUtils';

const PRIORITY_ORDER = { High: 3, Medium: 2, Low: 1 };

const Tasks = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useApp();

  // Search, filter and sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'priority'

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Extract distinct subjects for filter dropdown
  const uniqueSubjects = useMemo(() => {
    const subs = new Set(tasks.map((t) => t.subject).filter(Boolean));
    return Array.from(subs);
  }, [tasks]);

  // Filtered & sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = subjectFilter === 'ALL' || task.subject === subjectFilter;
        const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
        return matchesSearch && matchesSubject && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0);
        }
        // default sortBy dueDate
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      });
  }, [tasks, searchTerm, subjectFilter, priorityFilter, statusFilter, sortBy]);

  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
  const overdueTasks = tasks.filter((t) => t.status !== 'Completed' && getDaysRemaining(t.dueDate) < 0).length;

  const handleSaveTask = (formData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">My Tasks & Assignments</h1>
          <p className="page-header-subtitle">
            Organize coursework, track deadlines, and crush your academic goals.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsFormOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} /> New Assignment
        </button>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
        }}
      >
        <div className="card" style={{ padding: '0.85rem 1.15rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Tasks</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalTasks}</div>
        </div>
        <div className="card" style={{ padding: '0.85rem 1.15rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pending</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>{pendingTasks}</div>
        </div>
        <div className="card" style={{ padding: '0.85rem 1.15rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Completed</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>{completedTasks}</div>
        </div>
        <div className="card" style={{ padding: '0.85rem 1.15rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Overdue</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: overdueTasks > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
            {overdueTasks}
          </div>
        </div>
      </div>

      {/* Overdue Alert Banner */}
      {overdueTasks > 0 && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--danger)',
            fontSize: '0.9rem',
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <span>
            You have <strong>{overdueTasks} overdue {overdueTasks === 1 ? 'assignment' : 'assignments'}</strong>! Review and submit them promptly.
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search tasks by title or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Subject Filter */}
          <div style={{ minWidth: 140 }}>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="ALL">All Subjects</option>
              {uniqueSubjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div style={{ minWidth: 130 }}>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: 140 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ minWidth: 150 }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List or Empty State */}
      {totalTasks > 0 && pendingTasks === 0 && (
        <div
          className="card"
          style={{
            padding: '1.25rem',
            textAlign: 'center',
            backgroundColor: 'var(--success-bg)',
            borderColor: 'var(--success-border)',
            color: 'var(--success)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>
            <CheckCircle2 size={22} /> Fantastic work! All tasks are completed.
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
            Take a breather or schedule your next assignment whenever you're ready.
          </p>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={totalTasks === 0 ? 'No tasks yet' : 'No matching tasks'}
          description={
            totalTasks === 0
              ? 'Stay ahead of your coursework by adding your assignments and study tasks.'
              : 'Try clearing your search query or adjusting your filters.'
          }
          actionLabel={totalTasks === 0 ? 'Add Your First Task' : undefined}
          onAction={
            totalTasks === 0
              ? () => {
                  setEditingTask(null);
                  setIsFormOpen(true);
                }
              : undefined
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={toggleTaskStatus}
              onEdit={(t) => {
                setEditingTask(t);
                setIsFormOpen(true);
              }}
              onDelete={(t) => setTaskToDelete(t)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Task Modal */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
        existingSubjects={uniqueSubjects}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete Task"
      />
    </div>
  );
};

export default Tasks;
