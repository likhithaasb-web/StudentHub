import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CheckSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  Completed: '#38b289',
  'In Progress': '#B76E79',
  Pending: '#8D4F4F',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem 0.75rem',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.825rem',
        }}
      >
        <span style={{ color: data.payload.fill, fontWeight: 700 }}>{data.name}: </span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{data.value} tasks</span>
      </div>
    );
  }
  return null;
};

const TaskStatusChart = ({ tasks = [] }) => {
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const total = tasks.length;

  const chartData = [
    { name: 'Completed', value: completedCount, color: STATUS_COLORS.Completed },
    { name: 'In Progress', value: inProgressCount, color: STATUS_COLORS['In Progress'] },
    { name: 'Pending', value: pendingCount, color: STATUS_COLORS.Pending },
  ].filter((item) => item.value > 0);

  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon">
            <CheckSquare size={18} />
          </div>
          <div>
            <span>Task Completion</span>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              {completionRate}% completed ({completedCount}/{total})
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
          Tasks <ArrowRight size={13} />
        </Link>
      </div>

      <div style={{ flex: 1, minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {total === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              padding: '1rem',
            }}
          >
            <p>No tasks added yet.</p>
            <Link to="/tasks" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
              Add First Task
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}>
            <div style={{ width: 140, height: 160, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--bg-card)" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {completionRate}%
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Done
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', backgroundColor: STATUS_COLORS.Completed }} />
                <span style={{ color: 'var(--text-secondary)' }}>Completed:</span>
                <strong style={{ color: 'var(--text-primary)', marginLeft: 'auto' }}>{completedCount}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', backgroundColor: STATUS_COLORS['In Progress'] }} />
                <span style={{ color: 'var(--text-secondary)' }}>In Progress:</span>
                <strong style={{ color: 'var(--text-primary)', marginLeft: 'auto' }}>{inProgressCount}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', backgroundColor: STATUS_COLORS.Pending }} />
                <span style={{ color: 'var(--text-secondary)' }}>Pending:</span>
                <strong style={{ color: 'var(--text-primary)', marginLeft: 'auto' }}>{pendingCount}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskStatusChart;
