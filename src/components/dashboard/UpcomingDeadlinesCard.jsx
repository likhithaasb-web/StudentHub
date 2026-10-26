import React from 'react';
import { Calendar, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCountdownLabel, formatDate } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';

const UpcomingDeadlinesCard = ({ tasks = [] }) => {
  const { toggleTaskStatus } = useApp();

  const pendingTasks = tasks
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    .slice(0, 5);

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon">
            <Calendar size={18} />
          </div>
          <div>
            <span>Upcoming Deadlines</span>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              Next {pendingTasks.length} pending assignments
            </div>
          </div>
        </div>
        <Link
          to="/tasks"
          style={{
            fontSize: '0.8rem',
            color: 'var(--primary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          All Tasks <ArrowRight size={13} />
        </Link>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {pendingTasks.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            <p>🎉 All caught up! No pending deadlines.</p>
            <Link to="/tasks" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
              Add An Assignment
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {pendingTasks.map((task) => {
              const countdown = getCountdownLabel(task.dueDate);
              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Mark as completed"
                    >
                      <Circle size={18} />
                    </button>
                    <div style={{ overflow: 'hidden', minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        {task.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {task.subject} • Due {formatDate(task.dueDate)}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      countdown.isOverdue
                        ? 'badge-danger'
                        : countdown.isUrgent
                        ? 'badge-warning'
                        : 'badge-info'
                    }`}
                    style={{ flexShrink: 0, fontSize: '0.7rem' }}
                  >
                    {countdown.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingDeadlinesCard;
